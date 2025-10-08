import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";

import type { Question } from "../types/question";
import type { ApiError } from "../types/error";
import { getQuestionList } from "../lib/api";
import ErrorComponent from "../components/Error";

const QuestionList = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiError>(null);
  const [questionList, setQuestionList] = useState<Question[]>([]);

  useEffect(() => {
    const fetchQuestionList = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const questions = await getQuestionList();
        setQuestionList(questions);
      } catch (err) {
        // 다양한 에러 형태 처리
        if (typeof err === "object" && err !== null) {
          // API 에러 객체 (FastAPI validation error 등)
          setError(err as ApiError);
        } else if (err instanceof Error) {
          // JavaScript Error 객체
          setError(err.message);
        } else if (typeof err === "string") {
          // 문자열 에러
          setError(err);
        } else {
          // 기타 알 수 없는 에러
          setError("Unknown error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestionList();
  }, []);

  if (isLoading) return <p>Loading...</p>;

  if (error) {
    return <ErrorComponent error={error} />;
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">질문 목록</h2>

      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th style={{ width: "80px" }}>번호</th>
            <th>질문 제목</th>
            <th style={{ width: "200px" }}>작성일</th>
          </tr>
        </thead>
        <tbody>
          {questionList.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-center py-5">
                <div className="text-muted">
                  <div className="mb-3" style={{ fontSize: "3rem" }}>
                    ❓
                  </div>
                  <h5>등록된 질문이 없습니다</h5>
                  <p className="mb-0">첫 번째 질문을 작성해보세요!</p>
                </div>
              </td>
            </tr>
          ) : (
            questionList.map((question, index) => (
              <tr key={question.id}>
                <td className="text-center">{index + 1}</td>
                <td>
                  <Link
                    to={`/question/${question.id}`}
                    className="text-decoration-none text-dark"
                  >
                    <div className="fw-semibold">{question.subject}</div>
                    {question.content && (
                      <small className="text-muted">
                        {question.content.length > 50
                          ? `${question.content.substring(0, 50)}...`
                          : question.content}
                      </small>
                    )}
                  </Link>
                </td>
                <td className="text-center">
                  <small className="text-muted">
                    {new Date(question.create_date).toLocaleString("ko-KR")}
                  </small>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      <div className="d-flex justify-content-between">
        <Link to="/" className="btn btn-secondary">
          홈으로 돌아가기
        </Link>
        <Link to="/question-create" className="btn btn-primary">
          질문 등록하기
        </Link>
      </div>
    </Container>
  );
};

export default QuestionList;
