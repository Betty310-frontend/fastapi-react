import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import ErrorComponent from "../components/Error";
import type { ApiError } from "../types/error";
import { postUser } from "../lib/api";

const UserCreate = () => {
  const navigate = useNavigate();

  const [error, setError] = useState<ApiError>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form 데이터를 위한 state
  const [formData, setFormData] = useState({
    username: "",
    password1: "",
    password2: "",
    email: "",
  });

  // input 값 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (isSubmitting) return;

    // 비밀번호 확인 검증
    if (formData.password1 !== formData.password2) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 비밀번호 최소 길이 검증
    if (formData.password1.length < 4) {
      setError("비밀번호는 최소 4자리 이상이어야 합니다.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      await postUser(formData);

      // 성공 메시지와 함께 로그인 페이지로 이동
      navigate("/user-login", {
        state: { message: "회원가입이 완료되었습니다. 로그인해주세요." },
      });
    } catch (err) {
      if (typeof err === "object" && err !== null) {
        setError(err as ApiError);
      } else if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === "string") {
        setError(err);
      } else {
        setError("회원 가입에 실패했습니다.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Container className="mt-4" style={{ maxWidth: "800px" }}>
      <h2 className="mb-4">회원 가입</h2>
      <ErrorComponent error={error} />
      <Form
        method="POST"
        onSubmit={onSubmit}
        className="d-flex flex-column gap-3"
      >
        <Form.Group controlId="username">
          <Form.Label>사용자 이름:</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="사용자 이름을 입력해주세요."
            minLength={3}
            maxLength={20}
            required
            disabled={isSubmitting}
          />
          <Form.Text className="text-muted">
            3-20자 사이의 사용자 이름을 입력해주세요.
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="password1">
          <Form.Label>비밀번호:</Form.Label>
          <Form.Control
            type="password"
            name="password1"
            value={formData.password1}
            onChange={handleInputChange}
            placeholder="비밀번호를 입력해주세요."
            minLength={4}
            required
            disabled={isSubmitting}
          />
          <Form.Text className="text-muted">
            최소 4자 이상의 비밀번호를 입력해주세요.
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="password2">
          <Form.Label>비밀번호 확인:</Form.Label>
          <Form.Control
            type="password"
            name="password2"
            value={formData.password2}
            onChange={handleInputChange}
            placeholder="비밀번호를 다시 입력해주세요."
            required
            disabled={isSubmitting}
            isInvalid={
              formData.password2.length > 0 &&
              formData.password1 !== formData.password2
            }
          />
          <Form.Control.Feedback type="invalid">
            비밀번호가 일치하지 않습니다.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="email">
          <Form.Label>이메일:</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="이메일을 입력해주세요."
            required
            disabled={isSubmitting}
          />
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
          disabled={isSubmitting}
          className="d-flex align-items-center justify-content-center"
        >
          {isSubmitting ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              처리중...
            </>
          ) : (
            "생성하기"
          )}
        </Button>
      </Form>
    </Container>
  );
};

export default UserCreate;
