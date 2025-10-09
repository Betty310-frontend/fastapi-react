import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { config, isDevelopment } from "./config/env";
import "./config/locale";
import Home from "./pages/Home";
import QuestionList from "./pages/QuestionList";
import QuestionDetail from "./pages/QuestionDetail";
import QuestionCreate from "./pages/QuestionCreate";
import Navigation from "./components/Navigation";

function App() {
  return (
    <Router>
      <div style={{ fontFamily: "Arial, sans-serif" }}>
        <Navigation />
        {isDevelopment() && (
          <div
            style={{
              backgroundColor: "#f0f8ff",
              padding: "10px",
              borderRadius: "5px",
              margin: "10px",
            }}
          >
            <strong>🔧 Development Mode</strong>
            <p>API Base URL: {config.apiBaseUrl}</p>
            <p>Debug Mode: {config.debug ? "✅" : "❌"}</p>
          </div>
        )}

        <main style={{ padding: "0 20px" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/question/list" element={<QuestionList />} />
            <Route path="/question/:id" element={<QuestionDetail />} />
            <Route path="/question-create" element={<QuestionCreate />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
