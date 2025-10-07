import { useState, useEffect } from 'react'
import { config, createApiUrl, debugLog, isDevelopment } from './config/env'
import type { Question } from './types/question'
import { parseQuestionListResponse } from './utils/questionUtils'

function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [questionList, setQuestionList] = useState<Question[]>([])

  useEffect(() => {
    const fetchQuestionList = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const apiUrl = createApiUrl("/api/question/list")
        debugLog("Fetching question list from API:", apiUrl)

        const response = await fetch(apiUrl)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        
        // 타입 안전성을 위한 응답 검증
        try {
          const questions = parseQuestionListResponse(data)
          setQuestionList(questions)
          debugLog("Question list response:", questions)
        } catch (parseError) {
          throw new Error(`Invalid API response format: ${parseError}`)
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
        setError(errorMessage)
        debugLog("Question list API error:", errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuestionList()
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
        {!isLoading && !error && (
          <div>
            <h2>질문 목록</h2>
            {questionList.length === 0 ? (
              <p>등록된 질문이 없습니다.</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {questionList.map((question: Question) => (
                  <li key={question.id} style={{ 
                    marginBottom: '15px', 
                    padding: '15px', 
                    border: '1px solid #ddd', 
                    borderRadius: '5px',
                    backgroundColor: '#f9f9f9'
                  }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>
                      {question.subject}
                    </h3>
                    <p style={{ margin: '0 0 10px 0', color: '#666' }}>
                      {question.content}
                    </p>
                    <small style={{ color: '#999' }}>
                      작성일: {new Date(question.create_date).toLocaleString('ko-KR')}
                    </small>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </>
  )
}

export default App
