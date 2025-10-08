// API 에러 관련 타입 정의
export interface ValidationError {
  loc: string[]
  msg: string
  type: string
}

export interface ApiErrorResponse {
  detail?: string | ValidationError[]
  message?: string
}

// ErrorComponent와 호환되는 통합 에러 타입
export type ApiError = ApiErrorResponse | string | null
