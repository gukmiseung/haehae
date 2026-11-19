
import { useState } from 'react'
import AiAnalysis from './pages/AiAnalysis'
import AiResult from './pages/AiResult'
import SafetyGuide from './pages/SafetyGuide'

function App() {
  const [page, setPage] = useState('analysis')

  if (page === 'result') {
    return (
      <AiResult
        onBack={() => setPage('analysis')}
        onNext={() => setPage('guide')}
      />
    )
  }

  if (page === 'guide') {
    return <SafetyGuide onBack={() => setPage('result')} />
  }

  return <AiAnalysis onNext={() => setPage('result')} />
}

export default App
