import { Link } from "react-router-dom";
import { useState } from "react";

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import NavDropdown from "react-bootstrap/NavDropdown";

import { useAuthStore } from "../stores/authStore";

const Navigation = () => {
  const [expanded, setExpanded] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    setExpanded(false);
  };

  return (
    <Navbar
      bg="light"
      expand="lg"
      className="border-bottom"
      expanded={expanded}
      onToggle={setExpanded}
    >
      <Container fluid>
        <Navbar.Brand
          as={Link}
          to="/"
          className="fw-bold bg-dark text-white px-2"
        >
          PYBO
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="navbarSupportedContent"
          aria-label="Toggle navigation"
        />

        <Navbar.Collapse id="navbarSupportedContent">
          <Nav className="me-auto mb-2 mb-lg-0">
            <Nav.Link
              as={Link}
              to="/question/list"
              onClick={() => setExpanded(false)}
            >
              질문 목록
            </Nav.Link>
          </Nav>
          <Nav>
            {isAuthenticated ? (
              // 로그인 상태
              <NavDropdown
                title={`안녕하세요, ${user?.username}님!`}
                id="user-dropdown"
              >
                <NavDropdown.Item onClick={handleLogout}>
                  로그아웃
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              // 비로그인 상태
              <>
                <Nav.Link
                  as={Link}
                  to="/user-create"
                  onClick={() => setExpanded(false)}
                >
                  회원가입
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/user-login"
                  onClick={() => setExpanded(false)}
                >
                  로그인
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
