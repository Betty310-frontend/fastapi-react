import type { User } from "./user";

export interface Answer {
  id: number;
  content: string;
  create_date: string; // ISO 8601 형식의 날짜 문자열
  user?: User;
  modify_date?: string;
  voter?: User[];
}
