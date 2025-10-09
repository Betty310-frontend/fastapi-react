import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Pagination from "react-bootstrap/Pagination";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import type { Question } from "../types/question";
import type { ApiError } from "../types/error";
import { getQuestionList } from "../lib/api";
import ErrorComponent from "../components/Error";

const QuestionList = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiError>(null);
  const [questionList, setQuestionList] = useState<Question[]>([]);
  const [size, setSize] = useState<number>(10);
  const [page, setPage] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  const totalPages = Math.ceil(total / size);
  const pageSizeOptions = [10, 30, 50, 100];

  useEffect(() => {
    const fetchQuestionList = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await getQuestionList({ page, size });
        setQuestionList(response.items);
        setTotal(response.total);
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
  }, [page, size]);

  const handleSizeChange = (newSize: number) => {
    setSize(newSize);
    setPage(0);
  };

  if (isLoading) return <p>Loading...</p>;

  if (error) {
    return <ErrorComponent error={error} />;
  }

  return (
    <Container className="mt-4">
      <Row className="mb-4 align-items-center">
        <Col>
          <h2 className="mb-0">질문 목록</h2>
        </Col>
        <Col xs="auto">
          <div className="d-flex align-items-center gap-2">
            <span className="text-muted">페이지당</span>
            <Form.Select
              size="sm"
              value={size}
              onChange={(e) => handleSizeChange(parseInt(e.target.value))}
              style={{ width: "80px" }}
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Form.Select>
            <span className="text-muted">개씩</span>
          </div>
        </Col>
      </Row>

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
                <td className="text-center">{page * size + 1 + index}</td>
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

      {totalPages > 1 && (
        <Pagination className="justify-content-center">
          <Pagination.First disabled={page === 0} onClick={() => setPage(0)} />
          <Pagination.Prev
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
          />

          {/* 페이지 번호들 */}
          {(() => {
            const items = [];
            const maxVisiblePages = 5;
            let startPage = Math.max(0, page - Math.floor(maxVisiblePages / 2));
            const endPage = Math.min(
              totalPages - 1,
              startPage + maxVisiblePages - 1
            );

            // 끝 페이지 조정
            if (endPage - startPage + 1 < maxVisiblePages) {
              startPage = Math.max(0, endPage - maxVisiblePages + 1);
            }

            // 첫 페이지와 ellipsis
            if (startPage > 0) {
              items.push(
                <Pagination.Item key={0} onClick={() => setPage(0)}>
                  1
                </Pagination.Item>
              );
              if (startPage > 1) {
                items.push(<Pagination.Ellipsis key="ellipsis-start" />);
              }
            }

            // 중간 페이지들
            for (let i = startPage; i <= endPage; i++) {
              items.push(
                <Pagination.Item
                  key={i}
                  active={i === page}
                  onClick={() => setPage(i)}
                >
                  {i + 1}
                </Pagination.Item>
              );
            }

            // 마지막 페이지와 ellipsis
            if (endPage < totalPages - 1) {
              if (endPage < totalPages - 2) {
                items.push(<Pagination.Ellipsis key="ellipsis-end" />);
              }
              items.push(
                <Pagination.Item
                  key={totalPages - 1}
                  onClick={() => setPage(totalPages - 1)}
                >
                  {totalPages}
                </Pagination.Item>
              );
            }

            return items;
          })()}

          <Pagination.Next
            disabled={page === totalPages - 1}
            onClick={() => setPage(page + 1)}
          />
          <Pagination.Last
            disabled={page === totalPages - 1}
            onClick={() => setPage(totalPages - 1)}
          />
        </Pagination>
      )}

      <Row className="mb-3 align-items-center">
        <Col>
          <small className="text-muted">
            전체 {total}개 중 {page * size + 1}-
            {Math.min((page + 1) * size, total)}번째 (페이지 {page + 1}/
            {totalPages})
          </small>
        </Col>
        <Col xs="auto">
          <small className="text-muted">페이지당 {size}개씩 표시</small>
        </Col>
      </Row>

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
