import { useState } from 'react'
import { testDbConnection } from '../lib/api'
import QuestionList from './QuestionList'

const Home = () => {
  const [dbStatus, setDbStatus] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleDbTest = async () => {
    setIsLoading(true)
    try {
      const result = await testDbConnection()
      setDbStatus(`✅ ${result.message}`)
    } catch (error) {
      setDbStatus(`❌ ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <h1>파이보 홈</h1>
      <p>질문 답변 사이트입니다.</p>
      
      <QuestionList />

      <div style={{ 
        marginTop: '30px', 
        padding: '20px', 
        border: '1px solid #ddd', 
        borderRadius: '5px',
        backgroundColor: '#f8f9fa'
      }}>
        <h3>시스템 상태 확인</h3>
        
        <div style={{ marginBottom: '10px' }}>
          <button 
            onClick={handleDbTest}
            disabled={isLoading}
            style={{
              padding: '8px 16px',
              marginRight: '10px',
              backgroundColor: '#17a2b8',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            DB 연결 확인
          </button>
          {dbStatus && <span>{dbStatus}</span>}
        </div>
      </div>
    </div>
  )
}

export default Home
