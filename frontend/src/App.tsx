import { useState, useEffect } from 'react'
import { config, createApiUrl, debugLog, isDevelopment } from './config/env'

function App() {
  const [message, setMessage] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // 환경 설정을 사용하여 API URL 생성
        const apiUrl = createApiUrl("hello")
        debugLog("Fetching from API:", apiUrl)
        
        const response = await fetch(apiUrl)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        setMessage(data.message)
        debugLog("API response:", data)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
        setError(errorMessage)
        debugLog("API error:", errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMessage()
  }, [])

  return (
    <>
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        {isDevelopment() && (
          <div style={{ 
            backgroundColor: '#f0f8ff', 
            padding: '10px', 
            borderRadius: '5px',
            marginBottom: '20px'
          }}>
            <strong>🔧 Development Mode</strong>
            <p>API Base URL: {config.apiBaseUrl}</p>
            <p>Debug Mode: {config.debug ? '✅' : '❌'}</p>
          </div>
        )}
        
        {isLoading && <p>Loading...</p>}
        {error && (
          <div style={{ color: 'red', padding: '10px', backgroundColor: '#ffe6e6' }}>
            <strong>Error:</strong> {error}
          </div>
        )}
        {!isLoading && !error && <h2>{message}</h2>}
      </div>
    </>
  )
}

export default App
