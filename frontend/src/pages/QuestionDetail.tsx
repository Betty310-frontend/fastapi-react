import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getQuestionDetail, postAnswer } from '../lib/api'
import type { Question } from '../types/question'
import type { ApiError } from '../types/error'
import ErrorComponent from '../components/Error'

const QuestionDetail = () => {
  const { id } = useParams<{ id: string }>()

  const [question, setQuestion] = useState<Question | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<ApiError>(null)
  const [content, setContent] = useState('')

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
        // 다양한 에러 형태 처리
        if (typeof err === 'object' && err !== null) {
          setError(err as ApiError)
        } else if (err instanceof Error) {
          setError(err.message)
        } else if (typeof err === 'string') {
          setError(err)
        } else {
          setError('Unknown error occurred')
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuestion()
  }, [id])

  function onClickPostAnswer(event: React.MouseEvent<HTMLInputElement>): void {
    event.preventDefault()

    if (id) {
      postAnswer(parseInt(id), content)
        .then(() => {
          setContent('')
          setError(null)
        })
        .catch(err => {
          // 다양한 에러 형태 처리
          if (typeof err === 'object' && err !== null) {
            setError(err as ApiError)
          } else if (err instanceof Error) {
            setError(err.message)
          } else if (typeof err === 'string') {
            setError(err)
          } else {
            setError('Failed to post answer')
          }
        })
    }
  }

  if (isLoading) return <p>Loading...</p>

  if (!question) {
    return (
      <div>
        <p>질문을 찾을 수 없습니다.</p>
        <Link to='/question/list'>질문 목록으로 돌아가기</Link>
      </div>
    )
  }

  return (
    <div>
      <div
        style={{
          border: '1px solid #ddd',
          borderRadius: '5px',
          padding: '20px',
          backgroundColor: '#f9f9f9',
        }}
      >
        <h2 style={{ marginTop: 0, color: '#333' }}>{question.subject}</h2>
        <div
          style={{
            whiteSpace: 'pre-wrap',
            lineHeight: '1.6',
            margin: '15px 0',
            color: '#666',
          }}
        >
          {question.content}
        </div>
        <small style={{ color: '#999' }}>
          작성일: {new Date(question.create_date).toLocaleString('ko-KR')}
        </small>
      </div>

      <ul>
        {question?.answers?.map(answer => (
          <li key={answer.id}>
            <div>
              <p>{answer.content}</p>
              <small>작성일: {new Date(answer.create_date).toLocaleString('ko-KR')}</small>
            </div>
          </li>
        ))}
      </ul>

      {error && <ErrorComponent error={error} />}

      <form method='post'>
          <textarea
            rows={15}
            value={content}
            onChange={e => setContent(e.target.value)}
          />
          <input type='submit' value='답변 등록' onClick={onClickPostAnswer} />
        </form>

      <div style={{ marginTop: '20px' }}>
        <Link
          to='/question/list'
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px',
          }}
        >
          질문 목록으로 돌아가기
        </Link>
      </div>
    </div>
  )
}

export default QuestionDetail
