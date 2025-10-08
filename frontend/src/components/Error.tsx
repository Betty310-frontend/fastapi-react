import type { ApiError } from '../types/error'

interface ErrorProps {
  error?: ApiError
  className?: string
  style?: React.CSSProperties
}

const Error = ({ error, className = '', style = {} }: ErrorProps) => {
  // 에러가 없으면 렌더링하지 않음
  if (!error) return null

  // 기본 스타일
  const defaultStyle: React.CSSProperties = {
    color: '#721c24',
    backgroundColor: '#f8d7da',
    border: '1px solid #f5c6cb',
    borderRadius: '0.25rem',
    padding: '0.75rem 1.25rem',
    margin: '1rem 0',
    ...style
  }

  // 에러가 단순 문자열인 경우
  if (typeof error === 'string') {
    return (
      <div className={`error-message ${className}`} style={defaultStyle}>
        <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
          <li>{error}</li>
        </ul>
      </div>
    )
  }

  // 에러 객체인 경우
  if (typeof error === 'object') {
    // FastAPI validation error 형식
    if (error.detail) {
      if (typeof error.detail === 'string') {
        return (
          <div className={`error-message ${className}`} style={defaultStyle}>
            <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
              <li>{error.detail}</li>
            </ul>
          </div>
        )
      } else if (Array.isArray(error.detail) && error.detail.length > 0) {
        return (
          <div className={`error-message ${className}`} style={defaultStyle}>
            <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
              {error.detail.map((err, i) => (
                <li key={i}>
                  <strong>{err.loc[1] || err.loc[0]}</strong> : {err.msg}
                </li>
              ))}
            </ul>
          </div>
        )
      }
    }
    
    // 일반적인 에러 메시지
    if (error.message) {
      return (
        <div className={`error-message ${className}`} style={defaultStyle}>
          <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
            <li>{error.message}</li>
          </ul>
        </div>
      )
    }
  }
  
  return null
}

export default Error