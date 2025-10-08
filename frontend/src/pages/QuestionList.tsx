import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import type { Question } from '../types/question'
import type { ApiError } from '../types/error'
import { getQuestionList } from '../lib/api'
import ErrorComponent from '../components/Error'

const QuestionList = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<ApiError>(null)
  const [questionList, setQuestionList] = useState<Question[]>([])

  useEffect(() => {
    const fetchQuestionList = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const questions = await getQuestionList()
        setQuestionList(questions)
      } catch (err) {
        // 다양한 에러 형태 처리
        if (typeof err === 'object' && err !== null) {
          // API 에러 객체 (FastAPI validation error 등)
          setError(err as ApiError)
        } else if (err instanceof Error) {
          // JavaScript Error 객체
          setError(err.message)
        } else if (typeof err === 'string') {
          // 문자열 에러
          setError(err)
        } else {
          // 기타 알 수 없는 에러
          setError('Unknown error occurred')
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuestionList()
  }, [])

  if (isLoading) return <p>Loading...</p>
  
  if (error) {
    return <ErrorComponent error={error} />
  }

  return (
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
                <Link to={`/question/${question.id}`} style={{ textDecoration: 'none', color: '#333' }}>
                  {question.subject}
                </Link>
              </h3>
              <p style={{ margin: '0 0 10px 0', color: '#666' }}>
                {question.content.length > 100 
                  ? `${question.content.substring(0, 100)}...` 
                  : question.content
                }
              </p>
              <small style={{ color: '#999' }}>
                작성일: {new Date(question.create_date).toLocaleString('ko-KR')}
              </small>
            </li>
          ))}
        </ul>
      )}

      <div style={{ marginTop: '20px' }}>
        <Link 
          to="/"
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px'
          }}
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  )
}

export default QuestionList
