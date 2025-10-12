import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

import { getQuestionDetail, putQuestion } from "../lib/api";
import type { ApiError } from "../types/error";
import ErrorComponent from "../components/Error";

const QuestionModify = () => {
  const { question_id } = useParams<{ question_id: string }>();
  const navigate = useNavigate();

  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<ApiError>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (question_id) {
      getQuestionDetail(parseInt(question_id))
        .then((data) => {
          setSubject(data.subject);
          setContent(data.content);
        })
        .catch((err) => {
          if (typeof err === "object" && err !== null) {
            setError(err as ApiError);
          } else if (err instanceof Error) {
            setError(err.message);
          } else if (typeof err === "string") {
            setError(err);
          } else {
            setError("질문 정보를 불러오는데 실패했습니다.");
          }
        });
    }
  }, [question_id]);

  async function onClickPostQuestion(
    event: React.FormEvent | React.MouseEvent
  ): Promise<void> {
    event.preventDefault();

    if (!subject.trim() || !content.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError(null);

      // 질문 등록하고 생성된 질문 데이터 받기
      await putQuestion(parseInt(question_id ?? "0"), subject, content);

      // 성공시 해당 질문 상세 페이지로 이동
      if (question_id) {
        navigate(`/question/${question_id}`);
      } else {
        // ID가 없으면 질문 목록으로 이동 (fallback)
        navigate("/question/list");
      }
    } catch (err) {
      if (typeof err === "object" && err !== null) {
        setError(err as ApiError);
      } else if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === "string") {
        setError(err);
      } else {
        setError("질문 수정에 실패했습니다.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Container className="mt-4" style={{ maxWidth: "800px" }}>
      <h2 className="mb-4">질문 수정</h2>
      <ErrorComponent error={error} />
      <Form onSubmit={(e) => onClickPostQuestion(e)}>
        <Form.Group controlId="formSubject">
          <Form.Label>제목:</Form.Label>
          <Form.Control
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="formContent">
          <Form.Label>내용:</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </Form.Group>
        <div className="d-flex justify-content-between gap-2 mt-3">
          <Link to="/question/list" className="btn btn-secondary">
            질문 목록으로 돌아가기
          </Link>
          <div className="d-flex gap-2">
            <Button
              variant="outline-secondary"
              type="button"
              onClick={() => {
                setSubject("");
                setContent("");
              }}
              disabled={!subject.trim() || !content.trim() || isSubmitting}
            >
              초기화
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={!subject.trim() || !content.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  />
                  수정 중...
                </>
              ) : (
                "수정"
              )}
            </Button>
          </div>
        </div>
      </Form>
    </Container>
  );
};

export default QuestionModify;
