import { useState } from "react";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import { testDbConnection } from "../lib/api";
import { Link } from "react-router";

const Home = () => {
  const [dbStatus, setDbStatus] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleDbTest = async () => {
    setIsLoading(true);
    try {
      const result = await testDbConnection();
      setDbStatus(`✅ ${result.message}`);
    } catch (error) {
      setDbStatus(`❌ ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>파이보 홈</h1>
      <Link
        to="/question/list"
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          textDecoration: "none",
          borderRadius: "5px",
        }}
      >
        질문 목록 보기
      </Link>

      <Card className="mt-4">
        <Card.Body>
          <Card.Title>시스템 상태 확인</Card.Title>

          <div className="mb-3">
            <Button variant="info" onClick={handleDbTest} disabled={isLoading}>
              {isLoading ? "Loading..." : "DB 연결 확인"}
            </Button>
            {dbStatus && <span>{dbStatus}</span>}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Home;
