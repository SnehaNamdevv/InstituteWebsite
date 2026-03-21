import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StudentPortfolioCenter({ dark }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [skills, setSkills] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!name || !email || !skills) {
      setMessage("All fields are required");
      return;
    }

    try {
      setMessage("Submitting portfolio...");

      const student = JSON.parse(localStorage.getItem("student"));
      const res = await fetch(
        `https://institute-backend-0ncp.onrender.com/student/portfolio/${student.studentID}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, skills }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Submission failed");
        return;
      }

      setMessage("Portfolio submitted successfully ✅");
      setTimeout(() => navigate("/settings"), 1500);
    } catch (err) {
      console.log(err);
      setMessage("Server error");
    }
  };

  return (
    <div className="flex justify-center items-center w-full min-h-[70vh] p-4">
      <div
        className={`w-full max-w-md p-6 rounded-2xl shadow-xl
          ${dark ? "bg-slate-800 text-white" : "bg-white text-gray-800"}`}
      >
        <h2 className="text-xl font-semibold mb-4 text-center">
          Student Portfolio
        </h2>

        {message && (
          <div
            className={`text-sm p-2 mb-4 text-center rounded
              ${dark ? "bg-slate-700" : "bg-gray-100"}`}
          >
            {message}
          </div>
        )}

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`w-full p-3 border rounded-lg mb-3 outline-none focus:ring-2
            ${
              dark
                ? "bg-slate-900 border-slate-600 focus:ring-indigo-500 text-white"
                : "bg-white border-gray-300 focus:ring-indigo-500 text-gray-800"
            }`}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full p-3 border rounded-lg mb-3 outline-none focus:ring-2
            ${
              dark
                ? "bg-slate-900 border-slate-600 focus:ring-indigo-500 text-white"
                : "bg-white border-gray-300 focus:ring-indigo-500 text-gray-800"
            }`}
        />

        <textarea
          placeholder="Skills / Projects"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          className={`w-full p-3 border rounded-lg mb-3 outline-none focus:ring-2
            ${
              dark
                ? "bg-slate-900 border-slate-600 focus:ring-indigo-500 text-white"
                : "bg-white border-gray-300 focus:ring-indigo-500 text-gray-800"
            }`}
        />

        <button
          onClick={handleSubmit}
          className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          Submit
        </button>
      </div>
    </div>
  );
}