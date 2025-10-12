import { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

import { getQuestionDetail, postAnswer } from "../lib/api";
import type { Question } from "../types/question";
import type { ApiError } from "../types/error";
import ErrorComponent from "../components/Error";
import { formatDate } from "../config/locale";
import { useIsAuthenticated } from "../stores/authStore";

const QuestionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  const isAuthenticated = useIsAuthenticated();

  // 이전 페이지 정보 추출
  const previousPage = location.state?.fromPage ?? 0;
  const previousSize = location.state?.fromSize ?? 10;
  const listUrl = `/question/list?page=${previousPage}&size=${previousSize}`;

  const [question, setQuestion] = useState<Question | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiError>(null);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const fetchQuestion = async () => {
      if (!id) {
        setError("질문 ID가 없습니다.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const questionData = await getQuestionDetail(parseInt(id));
        setQuestion(questionData);
      } catch (err) {
        // 다양한 에러 형태 처리
        if (typeof err === "object" && err !== null) {
          setError(err as ApiError);
        } else if (err instanceof Error) {
          setError(err.message);
        } else if (typeof err === "string") {
          setError(err);
        } else {
          setError("Unknown error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestion();
  }, [id]);

  async function onClickPostAnswer(
    event: React.FormEvent | React.MouseEvent
  ): Promise<void> {
    event.preventDefault();

    if (!id || !content.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError(null);

      // 답변 등록
      await postAnswer(parseInt(id), content);

      // 입력 필드 먼저 초기화 (사용자 경험 향상)
      setContent("");

      // 질문 데이터 다시 가져오기 (최신 답변 포함)
      const updatedQuestion = await getQuestionDetail(parseInt(id));
      setQuestion(updatedQuestion);
    } catch (err) {
      // 에러 발생 시 입력 내용 복원하지 않음 (보통 사용자가 다시 시도하길 원함)
      if (typeof err === "object" && err !== null) {
        setError(err as ApiError);
      } else if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === "string") {
        setError(err);
      } else {
        setError("Failed to post answer");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" role="status" className="text-primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">질문을 불러오는 중...</p>
      </Container>
    );
  }

  if (!question) {
    return (
      <Container className="my-3">
        <p>질문을 찾을 수 없습니다.</p>
        <Link to={listUrl} className="btn btn-secondary">
          질문 목록으로 돌아가기
        </Link>
      </Container>
    );
  }

  return (
    <Container className="my-4" style={{ maxWidth: "800px" }}>
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">
          <div className="d-flex align-items-center">
            <span className="me-2">❓</span>
            <h4 className="mb-0">{question.subject}</h4>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="mb-3">
            {question.content.split("\n").map((line, index) => (
              <p key={index} className="mb-2">
                {line}
              </p>
            ))}
          </div>
          <div className="border-top pt-3">
            <small className="text-muted">
              📅 작성일: {formatDate.dateTime(question.create_date)}
              <span className="ms-2 text-secondary">
                ({formatDate.fromNow(question.create_date)})
              </span>
            </small>
          </div>
        </Card.Body>
      </Card>

      <Card className="my-4">
        <Card.Header className="bg-light">
          <h6 className="mb-0">💬 답변 {question?.answers?.length ?? 0}개</h6>
        </Card.Header>
        <Card.Body className="p-0">
          {!question?.answers || question.answers.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <div className="mb-3" style={{ fontSize: "2rem" }}>
                💭
              </div>
              <h6>아직 답변이 없습니다</h6>
              <p className="mb-0">첫 번째 답변을 작성해보세요!</p>
            </div>
          ) : (
            <ListGroup variant="flush">
              {question.answers.map((answer, index) => (
                <ListGroup.Item key={answer.id}>
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <span className="badge bg-secondary me-2">
                        #{index + 1}
                      </span>
                      <div className="mt-2">
                        {answer.content.split("\n").map((line, i) => (
                          <div key={i}>{line}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <small className="text-muted">
                      📅 {formatDate.dateTime(answer.create_date)}
                    </small>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>

      {error && <ErrorComponent error={error} />}

      <Card className="mt-4">
        <Card.Header>
          <h5 className="mb-0">답변 작성</h5>
        </Card.Header>
        <Card.Body>
          <Form
            onSubmit={(e) => {
              onClickPostAnswer(e);
            }}
          >
            <Form.Group className="mb-3" controlId="answerContent">
              <Form.Label>답변 내용</Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="답변을 입력해주세요..."
                required
                disabled={isSubmitting || !isAuthenticated}
              />
            </Form.Group>
            <div className="d-flex justify-content-end gap-2">
              <Button
                variant="outline-secondary"
                type="button"
                onClick={() => setContent("")}
                disabled={!content.trim() || isSubmitting || !isAuthenticated}
              >
                초기화
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={!content.trim() || isSubmitting || !isAuthenticated}
              >
                {isSubmitting ? (
                  <>
                    <Spinner
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    />
                    등록 중...
                  </>
                ) : (
                  "답변 등록"
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      <div className="mt-3">
        <Link to={listUrl} className="btn btn-secondary">
          질문 목록으로 돌아가기
        </Link>
      </div>
    </Container>
  );
};

export default QuestionDetail;
