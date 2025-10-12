import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

import { getAnswerDetail, putAnswer } from "../lib/api";
import type { ApiError } from "../types/error";
import ErrorComponent from "../components/Error";

const AnswerModify = () => {
  const { answer_id, question_id } = useParams<{
    answer_id: string;
    question_id: string;
  }>();
  const navigate = useNavigate();

  const [content, setContent] = useState("");
  const [error, setError] = useState<ApiError>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (answer_id) {
      getAnswerDetail(parseInt(answer_id))
        .then((data) => {
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
            setError("답변 정보를 불러오는데 실패했습니다.");
          }
        });
    }
  }, [answer_id]);

  async function onClickPostAnswer(
    event: React.FormEvent | React.MouseEvent
  ): Promise<void> {
    event.preventDefault();

    if (!content.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError(null);

      // 답변 데이터 받기
      await putAnswer(parseInt(answer_id ?? "0"), content);

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
        setError("답변 수정에 실패했습니다.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Container className="mt-4" style={{ maxWidth: "800px" }}>
      <h2 className="mb-4">답변 수정</h2>
      <ErrorComponent error={error} />
      <Form onSubmit={(e) => onClickPostAnswer(e)}>
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
                setContent("");
              }}
              disabled={!content.trim() || isSubmitting}
            >
              초기화
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={!content.trim() || isSubmitting}
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

export default AnswerModify;
