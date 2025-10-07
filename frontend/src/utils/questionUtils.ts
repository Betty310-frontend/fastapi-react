import type { Question } from '../types/question'

// Question 객체가 올바른 형태인지 검증하는 함수
export function isValidQuestion(obj: any): obj is Question {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'number' &&
    typeof obj.subject === 'string' &&
    typeof obj.content === 'string' &&
    typeof obj.create_date === 'string'
  )
}

// Question 배열이 올바른 형태인지 검증하는 함수
export function isValidQuestionList(obj: any): obj is Question[] {
  return Array.isArray(obj) && obj.every(isValidQuestion)
}

// API 응답을 Question 배열로 변환하는 함수
export function parseQuestionListResponse(data: any): Question[] {
  if (isValidQuestionList(data)) {
    return data
  }
  
  // 만약 API가 { questions: [...] } 형태로 응답한다면
  if (typeof data === 'object' && data !== null && isValidQuestionList(data.questions)) {
    return data.questions
  }
  
  throw new Error('Invalid question list response format')
}
