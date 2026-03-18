import { useEffect, useState } from "react";

export default function WelcomeCard({ setActiveSection }) {

  const [studentName, setStudentName] = useState("Student");

  useEffect(() => {

    const student = JSON.parse(localStorage.getItem("student"));

    if (student && student.fullName) {
      setStudentName(student.fullName);
    }

  }, []);

  return (
    <div className="
      w-full
      bg-gradient-to-r from-indigo-500 to-purple-500
      rounded-2xl
      p-5 sm:p-6
      flex flex-col sm:flex-row
      sm:items-center
      sm:justify-between
      gap-4
      text-white
      shadow-lg
    ">

      {/* Left Content */}
      <div className="flex flex-col justify-center">

        <h2 className="text-lg sm:text-2xl font-semibold">
          Welcome back, {studentName} 👋
        </h2>

        <p className="text-xs sm:text-sm opacity-90 mt-1">
          You've completed 80% of your tasks today.
        </p>

        <button
          onClick={() => setActiveSection("Profile")}
          className="
          mt-3
          w-fit
          bg-white
          text-indigo-600
          text-xs sm:text-sm
          font-medium
          px-4 py-2
          rounded-lg
          hover:bg-indigo-50
          transition
        "
        >
          View Profile
        </button>

      </div>

      {/* Right Profile */}
      <div className="flex items-center gap-3 sm:gap-4">

        <div className="text-left sm:text-right">
          <p className="text-sm font-medium">{studentName}</p>
          <p className="text-xs opacity-80">Student</p>
        </div>

        <img
          src={`https://ui-avatars.com/api/?name=${studentName}`}
          alt="profile"
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-4 border-white"
        />

      </div>

    </div>
  );
}