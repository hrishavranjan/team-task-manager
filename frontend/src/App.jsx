import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Projects from "./pages/Projects";

function App() {
  return (
    <BrowserRouter>

      {/* 🔥 GLOBAL TOAST (IMPORTANT) */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        theme="dark"
      />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/projects" element={<Projects />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;