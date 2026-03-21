import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import LoginSignin from "./components/LoginSignin";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./components/ForgotPassword";
import StudentPortfolioCenter from "./pages/StudentPortfolio";

// Placeholder pages
const Messages = () => <div className="p-4">📩 Messages Section</div>;
const Notifications = () => <div className="p-4">🔔 Notifications Section</div>;
const Schedule = () => <div className="p-4">📅 Schedule Section</div>;
const Course = () => <div className="p-4">📚 Course Section</div>;
const Help = () => <div className="p-4">❓ Help Section</div>;
const Settings = () => <div className="p-4">⚙️ Settings Section</div>;

export default function App() {
  const [dark, setDark] = useState(true);
  const toggleTheme = () => setDark(!dark);

  return (
    <div className={dark ? "dark bg-[#020617]" : "bg-gray-100"}>
      <Router>
        <Routes>
<Route
  path="/"
  element={
    <ProtectedRoute>
      <Dashboard dark={dark} toggleTheme={toggleTheme} />
    </ProtectedRoute>
  }
>
  <Route path="dashboard" element={<div>🏠 Welcome to Dashboard</div>} />
  <Route path="messages" element={<Messages />} />
  <Route path="notifications" element={<Notifications />} />
  <Route path="schedule" element={<Schedule />} />
  <Route path="course" element={<Course />} />
  <Route path="help" element={<Help />} />
  <Route path="settings" element={<Settings dark={dark} />} />

  {/* Student Portfolio nested route */}
  <Route path="student-portfolio" element={<StudentPortfolioCenter dark={dark} />} />
</Route>
</Routes>
      </Router>
    </div>
  );
}