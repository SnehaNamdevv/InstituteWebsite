import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  try {
    // ✅ read the student from localStorage
    const student = JSON.parse(localStorage.getItem("student"));

    // If no student or missing ID, redirect to login
    if (!student || !student.studentID) {
      return <Navigate to="/login" replace />;
    }

    return children;
  } catch (err) {
    // If parsing fails, redirect to login
    return <Navigate to="/login" replace />;
  }
}