
import { useState } from 'react'
import Home from './pages/Home'
import AiAnalysis from './pages/AiAnalysis'
import AiResult from './pages/AiResult'
import SafetyGuide from './pages/SafetyGuide'
import Login from './pages/Login'
import Signup from './pages/Signup'
import RiskLookup from './pages/RiskLookup'
import Header from './components/Header'
import Footer from './components/Footer'

function App() {
  const [page, setPage] = useState('home')

  const navigate = (nextPage) => {
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
    content = <RiskLookup onNavigate={navigate} />
  } else if (page === 'analysis') {
    content = <AiAnalysis onNext={() => navigate('result')} />
  } else if (page === 'result') {
    content = (
      <AiResult
        onBack={() => navigate('analysis')}
        onNext={() => navigate('guide')}
      />
    )
  } else if (page === 'guide') {
    content = <SafetyGuide onBack={() => navigate('result')} />
  } else {
    content = <Home onNavigate={navigate} />
  }

  const isAuthPage = page === 'login' || page === 'signup'

  return (
    <>
      <Header
        variant={isAuthPage ? 'auth' : 'default'}
        onNavigate={navigate}
      />
      {content}
      <Footer />
    </>
  )
}

export default App
