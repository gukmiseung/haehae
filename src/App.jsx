import { useEffect, useRef, useState } from 'react'
import Home from './pages/Home'
import AiAnalysis from './pages/AiAnalysis'
import AiResult from './pages/AiResult'
import SafetyGuide from './pages/SafetyGuide'
import LatestScamGuide from './pages/LatestScamGuide'
import Login from './pages/Login'
import Signup from './pages/Signup'
import PasswordReset from './pages/PasswordReset'
import RiskLookup from './pages/RiskLookup'
import LookupOutcome from './pages/LookupOutcome'
import MyPage from './pages/MyPage'
import Header from './components/Header'
import Footer from './components/Footer'
import ScamPopup from './components/ScamPopup'
import LoginRequiredDialog from './components/LoginRequiredDialog'
import { saveInspectionRecord } from './lib/inspectionHistory'
import { supabase } from './lib/supabase'

const pagePaths = {
  login: '/login',
  signup: '/signup',
  resetPassword: '/reset-password',
  mypage: '/mypage',
}

function getPageFromPath() {
  const path = window.location.pathname.replace(/\/$/, '')
  return Object.keys(pagePaths).find((page) => pagePaths[page] === path) || 'home'
}

function App() {
  const [page, setPage] = useState(() => getPageFromPath() === 'mypage' ? 'home' : getPageFromPath())
  const [isMyPage, setIsMyPage] = useState(() => getPageFromPath() === 'mypage')
  const [session, setSession] = useState(supabase ? undefined : null)
  const [signingOut, setSigningOut] = useState(false)
  const [signOutError, setSignOutError] = useState('')
  const [resetEmail, setResetEmail] = useState('')
  const [riskType, setRiskType] = useState('url')
  const [latestScamId, setLatestScamId] = useState(null)
  const [activeRecord, setActiveRecord] = useState(null)
  const [viewingHistory, setViewingHistory] = useState(false)
  const [historySaveErrorUserId, setHistorySaveErrorUserId] = useState(null)
  const gateOrigin = useRef(null)
  const userId = session?.user?.id ?? null
  const currentRecord = activeRecord?.userId === userId ? activeRecord : null

  useEffect(() => {
    const onPopState = (event) => {
      if (event.state?.scamGuide) {
        setIsMyPage(false)
        setPage('latestScams')
        return
      }

      const pathPage = getPageFromPath()
      setIsMyPage(pathPage === 'mypage')
      if (pathPage === 'mypage') return

      const origin = gateOrigin.current
      setPage(origin && event.state?.myPageOrigin === origin.id ? origin.page : pathPage)
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    if (!supabase) return
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
    })
    return () => subscription.unsubscribe()
  }, [])

  const navigate = (nextPage, options = {}) => {
    if (nextPage === 'mypage') {
      if (isMyPage) return
      const id = crypto.randomUUID()
      gateOrigin.current = { id, page }
      window.history.replaceState({ ...window.history.state, myPageOrigin: id }, '')
      window.history.pushState({ myPageGate: id }, '', pagePaths.mypage)
      setIsMyPage(true)
      window.scrollTo(0, 0)
      return
    }

    if (nextPage === 'risk') {
      const nextType = options.type || 'url'

      setRiskType(
        ['url', 'account', 'phone'].includes(nextType)
          ? nextType
          : 'url'
      )
    }

    if (nextPage === 'latestScams') {
      setLatestScamId(options.scamId || null)
    }

    if (nextPage === 'resetPassword') {
      setResetEmail(options.email || '')
    }

    const currentPathPage = getPageFromPath()
    const nextPath = pagePaths[nextPage]

    if (isMyPage && !session) {
      window.history.replaceState(null, '', nextPath || '/')
    } else if (nextPath && nextPage !== currentPathPage) {
      window.history.pushState(null, '', nextPath)
    } else if (!nextPath && currentPathPage !== 'home') {
      window.history.pushState(null, '', '/')
    }

    setIsMyPage(false)
    setPage(nextPage)
    window.scrollTo(0, 0)
  }

  async function signOut() {
    setSigningOut(true)
    setSignOutError('')
    try {
      const { error } = await supabase.auth.signOut({ scope: 'local' })
      if (error) throw error
      setSession(null)
      try {
        localStorage.removeItem('safeGuardScamPopupHiddenDate')
        localStorage.removeItem('safeGuardScamPopupHiddenUntil')
      } catch {
        // 로그아웃을 계속 진행합니다.
      }
      setActiveRecord(null)
      setViewingHistory(false)
      navigate('home')
    } catch {
      setSignOutError('로그아웃하지 못했습니다. 잠시 후 다시 시도해 주세요.')
    } finally {
      setSigningOut(false)
    }
  }

  function dismissMyPageGate() {
    if (gateOrigin.current && window.history.state?.myPageGate === gateOrigin.current.id) {
      window.history.back()
    } else {
      navigate('home')
    }
  }

  function addRecord(data) {
    const now = new Date()
    const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60_000)
    const record = {
      risk: 'pending',
      ...data,
      userId,
      id: crypto.randomUUID(),
      date: localDate.toISOString().slice(0, 16),
      createdAt: now.getTime(),
    }
    if (userId) {
      saveInspectionRecord(record).catch(() => setHistorySaveErrorUserId(userId))
    }
    return record
  }

  function openRecord(record) {
    setActiveRecord(record)
    setViewingHistory(true)
    navigate(record.type === 'conversation' ? 'result' : 'riskResult')
  }

  let content

  if (page === 'home') {
    content = <Home onNavigate={navigate} />
  } else if (page === 'login' && !session) {
    content = <Login onNavigate={navigate} />
  } else if (page === 'signup' && !session) {
    content = <Signup onNavigate={navigate} />
  } else if (page === 'resetPassword') {
    content = <PasswordReset initialEmail={resetEmail} onBack={() => navigate('login')} />
  } else if (page === 'risk') {
    content = (
      <RiskLookup
        onNavigate={navigate}
        initialType={riskType}
        onRecord={addRecord}
        onLookupResult={(data) => {
          setActiveRecord(addRecord(data))
          navigate('lookupResult')
        }}
      />
    )
  } else if (currentRecord && (page === 'lookupResult' || (page === 'riskResult' && currentRecord.lookupResult?.suspicious !== undefined))) {
    content = <LookupOutcome type={currentRecord.type} result={currentRecord.lookupResult} onNavigate={navigate} />
  } else if (page === 'riskResult' && currentRecord) {
    content = <RiskLookup savedRecord={currentRecord} onNavigate={navigate} />
  } else if (page === 'analysis') {
    content = (
      <AiAnalysis
        onNext={(data) => {
          const firstLine = data.message.split('\n')[0]
          const title = firstLine || data.imageName || '대화 캡처'
          const record = addRecord({
            type: 'conversation',
            title: title.length > 45 ? `${title.slice(0, 45)}…` : title,
            risk: data.result.riskLevel,
            analysisData: data,
          })
          setActiveRecord(record)
          setViewingHistory(false)
          navigate('result')
        }}
      />
    )
  } else if (page === 'result' && currentRecord) {
    content = (
      <AiResult
        record={currentRecord}
        onBack={() => navigate('analysis')}
        onNext={() => navigate('guide')}
        onBackToHistory={viewingHistory ? () => navigate('mypage') : undefined}
      />
    )
  } else if (page === 'guide' && currentRecord) {
    content = (
      <SafetyGuide
        record={currentRecord}
        onBack={() => navigate('result')}
      />
    )
  } else if (page === 'latestScams') {
    content = (
      <LatestScamGuide
        key={latestScamId}
        onNavigate={navigate}
        initialScamId={latestScamId}
      />
    )
  } else {
    content = <Home onNavigate={navigate} />
  }

  const isLookupResult = content.type === LookupOutcome
  const pageVariant = isMyPage ? 'mypage' : isLookupResult ? 'urlResult' : page === 'resetPassword' ? page : 'default'

  return (
    <>
      <Header
        activePage={isMyPage ? 'mypage' : page}
        session={session}
        onSignOut={signOut}
        signingOut={signingOut}
        signOutError={signOutError}
        onNavigate={navigate}
      />

      <div hidden={isMyPage}>
        {content}
        {page === 'home' && <ScamPopup onNavigate={navigate} />}
      </div>

      {isMyPage && session === undefined && (
        <main className="sg-my-page"><p role="status">로그인 상태를 확인하는 중입니다.</p></main>
      )}

      {isMyPage && session !== undefined && (
        <>
          <MyPage
            key={userId ?? 'guest'}
            userId={userId}
            hasSaveError={userId !== null && userId === historySaveErrorUserId}
            onOpenRecord={openRecord}
          />
          {!session && <LoginRequiredDialog onLogin={() => navigate('login')} onDismiss={dismissMyPageGate} />}
        </>
      )}

      <Footer variant={pageVariant} />
    </>
  )
}

export default App
