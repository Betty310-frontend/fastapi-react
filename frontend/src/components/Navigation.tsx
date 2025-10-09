import { Link } from "react-router-dom";
import { useState } from "react";

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";

const Navigation = () => {
  const [expanded, setExpanded] = useState(false);

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
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
