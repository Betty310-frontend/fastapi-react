import { Alert } from "react-bootstrap";
import type { ApiError } from "../types/error";

interface ErrorProps {
  error?: ApiError;
  className?: string;
  variant?: "danger" | "warning" | "info" | "success";
}

const Error = ({ error, className = "", variant = "danger" }: ErrorProps) => {
  // 에러가 없으면 렌더링하지 않음
  if (!error) return null;

  // 에러가 단순 문자열인 경우
  if (typeof error === "string") {
    return (
      <Alert variant={variant} className={className}>
        {error}
      </Alert>
    );
  }

  // 에러 객체인 경우
  if (typeof error === "object") {
    // FastAPI validation error 형식
    if (error.detail) {
      if (typeof error.detail === "string") {
        return (
          <Alert variant={variant} className={className}>
            {error.detail}
          </Alert>
        );
      } else if (Array.isArray(error.detail) && error.detail.length > 0) {
        return (
          <>
            {error.detail.map((error, i) => (
              <Alert key={i} variant={variant} className={className}>
                <strong>{error.loc[1] || error.loc[0]}</strong> : {error.msg}
              </Alert>
            ))}
          </>
        );
      }
    }
  }

  // 일반적인 에러 메시지
  if (error.message) {
    return (
      <Alert variant={variant} className={className}>
        {error.message}
      </Alert>
    );
  }
  return null;
};

export default Error;
