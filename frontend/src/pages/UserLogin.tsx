import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import ErrorComponent from "../components/Error";
import type { ApiError } from "../types/error";
import type { UserLogin } from "../types/user";
import { loginUser } from "../lib/api";
import { useAuthStore } from "../stores/authStore";

const UserLoginPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [error, setError] = useState<ApiError>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form 데이터를 위한 state
  const [formData, setFormData] = useState<UserLogin>({
    username: "",
    password: "",
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

    try {
      setIsSubmitting(true);
      setError(null);

      const { access_token, user } = await loginUser(
        formData.username,
        formData.password
      );

      // 로그인 성공 시 store에 저장
      login(user, access_token);

      // 성공 메시지와 함께 홈 페이지로 이동
      navigate("/", {
        state: { message: "로그인에 성공했습니다." },
      });
    } catch (err) {
      if (typeof err === "object" && err !== null) {
        setError(err as ApiError);
      } else if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === "string") {
        setError(err);
      } else {
        setError("로그인에 실패했습니다.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Container className="mt-4" style={{ maxWidth: "800px" }}>
      <h2 className="mb-4">로그인</h2>
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
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>비밀번호:</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="비밀번호를 입력해주세요."
            minLength={4}
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
            "로그인"
          )}
        </Button>
      </Form>
    </Container>
  );
};

export default UserLoginPage;
