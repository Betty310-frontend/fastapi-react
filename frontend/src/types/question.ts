import type { Answer } from "./answer";
import type { User } from "./user";

// Question 모델 타입 정의
export interface Question {
  id: number;
  subject: string;
  content: string;
  create_date: string; // ISO 8601 형식의 날짜 문자열
  answers?: Answer[];
  user?: User;
}

// API 응답 타입 정의
export interface QuestionListResponse {
  questions: Question[];
}

// 에러 응답 타입
export interface ApiError {
  message: string;
  detail?: string;
}
