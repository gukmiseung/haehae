
import { useState } from 'react'
import Home from './pages/Home'
import AiAnalysis from './pages/AiAnalysis'
import AiResult from './pages/AiResult'
import SafetyGuide from './pages/SafetyGuide'
import LatestScamGuide from './pages/LatestScamGuide'
import Login from './pages/Login'
import Signup from './pages/Signup'
import RiskLookup from './pages/RiskLookup'
import Header from './components/Header'
import Footer from './components/Footer'

function App() {
  const [page, setPage] = useState('home')
  const [riskType, setRiskType] = useState('url')
  const [analysisData, setAnalysisData] = useState({
    message: '',
    imagePreview: '',
    imageName: '',
  })

  const navigate = (nextPage, options = {}) => {
    if (nextPage === 'risk') {
      const nextType = options.type || 'url'

      setRiskType(
        ['url', 'account', 'phone'].includes(nextType)
          ? nextType
          : 'url'
      )
    }

    setPage(nextPage)
    window.scrollTo(0, 0)
  }

  let content

  if (page === 'home') {
    content = <Home onNavigate={navigate} />
  } else if (page === 'login') {
    content = <Login onNavigate={navigate} />
  } else if (page === 'signup') {
    content = <Signup onNavigate={navigate} />
  } else if (page === 'risk') {
    content = (
      <RiskLookup
        onNavigate={navigate}
        initialType={riskType}
      />
    )
  } else if (page === 'analysis') {
    content = (
      <AiAnalysis
        onNext={(data) => {
          setAnalysisData(data)
          navigate('result')
        }}
      />
    )
  } else if (page === 'result') {
    content = (
      <AiResult
        analysisData={analysisData}
        onBack={() => navigate('analysis')}
        onNext={() => navigate('guide')}
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
      />
    )
  } else {
    content = <Home onNavigate={navigate} />
  }

  const isAuthPage = page === 'login' || page === 'signup'

  return (
    <>
      <Header
        variant={isAuthPage ? 'auth' : 'default'}
        activePage={page}
        onNavigate={navigate}
      />
      {content}
      <Footer />
    </>
  )
}

export default App
