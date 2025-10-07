import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import type { Question } from '../types/question'
import { getQuestionDetail } from '../lib/api'

const QuestionDetail = () => {
  const { id } = useParams<{ id: string }>()
  
  const [question, setQuestion] = useState<Question | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchQuestion = async () => {
      if (!id) {
        setError('질문 ID가 없습니다.')
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        
        const questionData = await getQuestionDetail(parseInt(id))
        setQuestion(questionData)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuestion()
  }, [id])

  if (isLoading) return <p>Loading...</p>
  
  if (error) {
    return (
      <div>
        <div style={{ color: 'red', padding: '10px', backgroundColor: '#ffe6e6' }}>
          <strong>Error:</strong> {error}
        </div>
        <Link to="/question/list">질문 목록으로 돌아가기</Link>
      </div>
    )
  }

  if (!question) {
    return (
      <div>
        <p>질문을 찾을 수 없습니다.</p>
        <Link to="/question/list">질문 목록으로 돌아가기</Link>
      </div>
    )
  }

  return (
    <div>
      <div style={{
        border: '1px solid #ddd',
        borderRadius: '5px',
        padding: '20px',
        backgroundColor: '#f9f9f9'
      }}>
        <h2 style={{ marginTop: 0, color: '#333' }}>
          {question.subject}
        </h2>
        <div style={{
          whiteSpace: 'pre-wrap',
          lineHeight: '1.6',
          margin: '15px 0',
          color: '#666'
        }}>
          {question.content}
        </div>
        <small style={{ color: '#999' }}>
          작성일: {new Date(question.create_date).toLocaleString('ko-KR')}
        </small>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <Link 
          to="/question/list"
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px'
          }}
        >
          질문 목록으로 돌아가기
        </Link>
      </div>
    </div>
  )
}

export default QuestionDetail
