import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import { config, isDevelopment } from './config/env'

function App() {
  return (
    <Router>
      <div style={{ fontFamily: 'Arial, sans-serif' }}>
        {isDevelopment() && (
          <div style={{ 
            backgroundColor: '#f0f8ff', 
            padding: '10px', 
            borderRadius: '5px',
            margin: '10px'
          }}>
            <strong>🔧 Development Mode</strong>
            <p>API Base URL: {config.apiBaseUrl}</p>
            <p>Debug Mode: {config.debug ? '✅' : '❌'}</p>
          </div>
        )}
        
        <main style={{ padding: '0 20px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
