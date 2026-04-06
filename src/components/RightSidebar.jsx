import { useState } from "react";
import { Building2, Loader2, CheckCircle, XCircle, Clock } from "lucide-react";

export default function RightPanel({
  dark,
  rightOpen,
  setRightOpen,
  setActiveSection,
  status,
  myInstitute,
}) {
  const meetings = [
    { title: "Team Meeting", time: "10:30 AM", color: "bg-pink-500" },
    { title: "Project Review", time: "1:00 PM", color: "bg-yellow-500" },
  ];

  const assignments = [
    { name: "React Dashboard UI", due: "Tomorrow" },
    { name: "Database ER Diagram", due: "2 Days" },
  ];

  const [instituteCode, setInstituteCode] = useState("");
  const [joinStatus, setJoinStatus] = useState("idle"); // idle | loading | success | error
  const [joinMessage, setJoinMessage] = useState("");

  const handleJoinInstitute = async () => {
    if (!instituteCode.trim()) {
      setJoinStatus("error");
      setJoinMessage("Please enter an institute code.");
      return;
    }

    setJoinStatus("loading");
    setJoinMessage("");

    try {
      const res = await fetch(
        "https://institute-backend-0ncp.onrender.com/student/apply-institute",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            instituteCode,
            studentId: localStorage.getItem("studentId"),
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setJoinStatus("success");
        setJoinMessage("Request sent! Waiting for approval.");
        setInstituteCode("");
      } else {
        setJoinStatus("error");
        setJoinMessage(data.message || "Something went wrong.");
      }
    } catch (err) {
      setJoinStatus("error");
      setJoinMessage("Network error. Please try again.");
    }
  };

  const bg = dark ? "bg-slate-800" : "bg-white";
  const panelBg = dark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-gray-200";

  return (
    <div className={`
      fixed xl:static top-16 right-0 z-50
      h-[calc(100vh-4rem)] w-80
      transform transition-transform duration-300 ease-in-out
      ${rightOpen ? "translate-x-0" : "translate-x-full"}
      xl:translate-x-0
      flex flex-col border-l shadow-2xl
      ${panelBg}
    `}>

      {/* Close button mobile */}
      <div className="flex justify-end xl:hidden p-4">
        <button onClick={() => setRightOpen(false)}>❌</button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">

        {/* ── INSTITUTE CARD ── */}
        <div className={`rounded-xl p-4 shadow ${bg}`}>
          <div className="flex items-center gap-2 mb-4">
            <Building2 size={16} className="opacity-60" />
            <h3 className="font-semibold">My Institute</h3>
          </div>

          {/* APPROVED */}
          {status === "approved" && myInstitute && (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                {myInstitute.logo ? (
                  <img
                    src={myInstitute.logo.startsWith("http")
                      ? myInstitute.logo
                      : `https://institute-backend-0ncp.onrender.com/uploads/${myInstitute.logo}`}
                    className="w-10 h-10 rounded-full object-cover"
                    alt={myInstitute.name}
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-semibold">
                    {myInstitute.name?.charAt(0)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{myInstitute.name}</p>
                  <p className="text-xs opacity-60 truncate">{myInstitute.city}</p>
                </div>
                <CheckCircle size={18} className="text-green-500 shrink-0" />
              </div>
              <p className="text-xs text-center opacity-50">You are enrolled in this institute</p>
            </div>
          )}

          {/* PENDING */}
          {status === "pending" && (
            <div className="space-y-3">
              {myInstitute && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                  {myInstitute.logo ? (
                    <img
                      src={myInstitute.logo.startsWith("http")
                        ? myInstitute.logo
                        : `https://institute-backend-0ncp.onrender.com/uploads/${myInstitute.logo}`}
                      className="w-10 h-10 rounded-full object-cover"
                      alt={myInstitute.name}
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-white text-sm font-semibold">
                      {myInstitute.name?.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{myInstitute.name}</p>
                    <p className="text-xs opacity-60 truncate">{myInstitute.city}</p>
                  </div>
                  <Clock size={18} className="text-yellow-500 shrink-0" />
                </div>
              )}
              <div className="flex items-center gap-2 justify-center text-xs text-yellow-600 dark:text-yellow-400">
                <Loader2 size={12} className="animate-spin" />
                Waiting for institute approval...
              </div>
            </div>
          )}

          {/* NOT JOINED — show code input */}
          {status === "none" && (
            <div className="space-y-3">
              <p className="text-xs opacity-60 mb-2">
                Enter the code shared by your institute owner to send a join request.
              </p>

              <input
                type="text"
                placeholder="e.g. INST-2024-XY"
                value={instituteCode}
                onChange={(e) => {
                  setInstituteCode(e.target.value);
                  setJoinStatus("idle");
                  setJoinMessage("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleJoinInstitute()}
                className={`w-full px-3 py-2.5 text-sm border rounded-lg outline-none transition
                  focus:ring-2 focus:ring-indigo-400
                  ${dark
                    ? "bg-slate-900 border-slate-600 text-white placeholder:text-slate-500"
                    : "bg-gray-50 border-gray-200 placeholder:text-gray-400"
                  }`}
              />

              {/* Feedback message */}
              {joinMessage && (
                <div className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg
                  ${joinStatus === "success"
                    ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                    : "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                  }`}>
                  {joinStatus === "success"
                    ? <CheckCircle size={12} />
                    : <XCircle size={12} />}
                  {joinMessage}
                </div>
              )}

              <button
                onClick={handleJoinInstitute}
                disabled={joinStatus === "loading" || joinStatus === "success"}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50
                  text-white text-sm font-medium rounded-lg transition flex items-center justify-center gap-2"
              >
                {joinStatus === "loading" && <Loader2 size={14} className="animate-spin" />}
                {joinStatus === "loading" ? "Sending..." : "Send Join Request"}
              </button>
            </div>
          )}
        </div>

        {/* ── SCHEDULE ── */}
        <div className={`rounded-xl p-4 shadow ${bg}`}>
          <h3 className="font-semibold mb-3">Upcoming Schedule</h3>
          <div className="space-y-3">
            {meetings.map((meet, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-2 h-8 rounded ${meet.color}`} />
                <div className="text-sm">
                  <p className="font-medium">{meet.title}</p>
                  <p className="opacity-70">{meet.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── ASSIGNMENTS ── */}
        <div className={`rounded-xl p-4 shadow ${bg}`}>
          <h3 className="font-semibold mb-3">Assignments Due</h3>
          <div className="space-y-3 text-sm">
            {assignments.map((task, i) => (
              <div key={i} className="flex justify-between">
                <span>{task.name}</span>
                <span className="text-red-500 text-xs">{task.due}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── ACTIVITY ── */}
        <div className={`rounded-xl p-4 shadow ${bg}`}>
          <h3 className="font-semibold mb-3">Recent Activity</h3>
          <div className="space-y-3 text-sm opacity-80">
            <p>📘 New course material uploaded</p>
            <p>📝 Assignment graded</p>
            <p>📅 Schedule updated</p>
          </div>
        </div>

      </div>
    </div>
  );
}