import type { Question } from "../types/question";

// Question 객체가 올바른 형태인지 검증하는 함수
export function isValidQuestion(obj: any): obj is Question {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.id === "number" &&
    typeof obj.subject === "string" &&
    typeof obj.content === "string" &&
    typeof obj.create_date === "string"
  );
}

// Question 배열이 올바른 형태인지 검증하는 함수
export function isValidQuestionList(obj: any): obj is Question[] {
  return Array.isArray(obj) && obj.every(isValidQuestion);
}

// API 응답을 Question 배열로 변환하는 함수
export function parseQuestionListResponse(data: any): Question[] {
  // 직접 배열인 경우
  if (isValidQuestionList(data)) {
    return data;
  }

  // FastAPI ListRes 형태: { total: number, items: Question[] }
  if (
    typeof data === "object" &&
    data !== null &&
    isValidQuestionList(data.items)
  ) {
    return data.items;
  }

  // 다른 형태: { questions: [...] }
  if (
    typeof data === "object" &&
    data !== null &&
    isValidQuestionList(data.questions)
  ) {
    return data.questions;
  }

  console.error("Invalid question list response:", data);
  throw new Error("Invalid question list response format");
}
