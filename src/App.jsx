import { useEffect, useRef, useState } from 'react'
import Home from './pages/Home'
import AiAnalysis from './pages/AiAnalysis'
import AiResult from './pages/AiResult'
import SafetyGuide from './pages/SafetyGuide'
import LatestScamGuide from './pages/LatestScamGuide'
import Login from './pages/Login'
import Signup from './pages/Signup'
import RiskLookup from './pages/RiskLookup'
import MyPage from './pages/MyPage'
import Header from './components/Header'
import Footer from './components/Footer'
import ScamPopup from './components/ScamPopup'

function getPageFromPath() {
  return window.location.pathname.replace(/\/$/, '') === '/mypage' ? 'mypage' : 'home'
}

function App() {
  const [page, setPage] = useState(getPageFromPath)
  const [riskType, setRiskType] = useState('url')
  const [latestScamId, setLatestScamId] = useState(null)
  const [records, setRecords] = useState([])
  const [activeRecord, setActiveRecord] = useState(null)
  const [viewingHistory, setViewingHistory] = useState(false)
  const nextRecordId = useRef(0)

  useEffect(() => {
    const onPopState = () => setPage(getPageFromPath())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const navigate = (nextPage, options = {}) => {
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

    const hasMyPagePath = getPageFromPath() === 'mypage'
    if (nextPage === 'mypage' && !hasMyPagePath) {
      window.history.pushState(null, '', '/mypage')
    } else if (hasMyPagePath && !['mypage', 'result', 'riskResult', 'guide'].includes(nextPage)) {
      window.history.pushState(null, '', '/')
    }

    setPage(nextPage)
    window.scrollTo(0, 0)
  }

  function addRecord(data) {
    const now = new Date()
    const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60_000)
    const record = {
      ...data,
      id: `session-${++nextRecordId.current}`,
      date: localDate.toISOString().slice(0, 16),
      risk: 'pending',
    }
    setRecords((previous) => [record, ...previous])
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
  } else if (page === 'login') {
    content = <Login onNavigate={navigate} />
  } else if (page === 'signup') {
    content = <Signup onNavigate={navigate} />
  } else if (page === 'mypage') {
    content = (
      <MyPage
        records={records}
        onOpenRecord={openRecord}
        onDeleteRecord={(id) => setRecords((previous) => previous.filter((record) => record.id !== id))}
      />
    )
  } else if (page === 'risk') {
    content = (
      <RiskLookup
        onNavigate={navigate}
        initialType={riskType}
        onRecord={addRecord}
      />
    )
  } else if (page === 'riskResult') {
    content = <RiskLookup savedRecord={activeRecord} onNavigate={navigate} />
  } else if (page === 'analysis') {
    content = (
      <AiAnalysis
        onNext={(data) => {
          const firstLine = data.message.split('\n')[0]
          const title = firstLine || data.imageName || '대화 캡처'
          const record = addRecord({
            type: 'conversation',
            title: title.length > 45 ? `${title.slice(0, 45)}…` : title,
            analysisData: data,
          })
          setActiveRecord(record)
          setViewingHistory(false)
          navigate('result')
        }}
      />
    )
  } else if (page === 'result') {
    content = (
      <AiResult
        record={activeRecord}
        onBack={() => navigate('analysis')}
        onNext={() => navigate('guide')}
        onBackToHistory={viewingHistory ? () => navigate('mypage') : undefined}
      />
    )
  } else if (page === 'guide') {
    content = (
      <SafetyGuide
        onBack={() => navigate('result')}
      />
    )
  } else if (page === 'latestScams') {
    content = (
      <LatestScamGuide
        onNavigate={navigate}
        initialScamId={latestScamId}
      />
    )
  } else {
    content = <Home onNavigate={navigate} />
  }

  const isAuthPage = page === 'login' || page === 'signup'
  const isMyPage = page === 'mypage'

  return (
    <>
      <Header
        variant={isMyPage ? 'mypage' : isAuthPage ? 'auth' : 'default'}
        activePage={page}
        onNavigate={navigate}
      />

      {content}

      {page === 'home' && (
        <ScamPopup onNavigate={navigate} />
      )}

      <Footer variant={isMyPage ? 'mypage' : 'default'} />
    </>
  )
}

export default App
