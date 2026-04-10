import { useState, useEffect } from "react";
import { Building2, Loader2, CheckCircle, XCircle, Clock } from "lucide-react";

export default function RightPanel({
  dark,
  rightOpen,
  setRightOpen,
  setActiveSection
}) {
  const meetings = [
    { title: "Team Meeting", time: "10:30 AM", color: "bg-pink-500" },
    { title: "Project Review", time: "1:00 PM", color: "bg-yellow-500" },
  ];

  const assignments = [
    { name: "React Dashboard UI", due: "Tomorrow" },
    { name: "Database ER Diagram", due: "2 Days" },
  ];

  const [institutes, setInstitutes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [instituteCode, setInstituteCode] = useState("");
  const [joinStatus, setJoinStatus] = useState("idle");
  const [joinMessage, setJoinMessage] = useState("");

  const student = JSON.parse(localStorage.getItem("student"));

  // 🔥 FETCH INSTITUTES
  const fetchInstitutes = async () => {
    try {
      const res = await fetch(
        `https://institute-backend-0ncp.onrender.com/student/student-institutes/${student?.studentID}`
      );
      const data = await res.json();

      console.log("Institutes:", data); // DEBUG

      if (data.success) {
        setInstitutes(data.institutes || []);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (student?.studentID) {
      fetchInstitutes();
    } else {
      setLoading(false);
    }
  }, []);

  // 🔥 APPLY INSTITUTE
  const handleJoinInstitute = async () => {
    if (!student?.studentID) {
      setJoinStatus("error");
      setJoinMessage("Student not found.");
      return;
    }

    if (!instituteCode.trim()) {
      setJoinStatus("error");
      setJoinMessage("Please enter an institute code.");
      return;
    }

    setJoinStatus("loading");

    try {
      const res = await fetch(
        "https://institute-backend-0ncp.onrender.com/student/apply-institute",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            instituteCode,
            studentID: student.studentID,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setJoinStatus("success");
        setJoinMessage("Request sent! Waiting for approval.");
        setInstituteCode("");
        fetchInstitutes();
      } else {
        setJoinStatus("error");
        setJoinMessage(data.message || "Something went wrong.");
      }
    } catch {
      setJoinStatus("error");
      setJoinMessage("Network error. Please try again.");
    }
  };

  
  const approved = institutes.filter(
    (i) => i.status?.toUpperCase() === "APPROVED"
  );

  const pending = institutes.filter(
    (i) => i.status?.toUpperCase() === "PENDING"
  );

  const rejected = institutes.filter(
    (i) => i.status?.toUpperCase() === "REJECTED"
  );

  const bg = dark ? "bg-slate-800" : "bg-white";
  const panelBg = dark
    ? "bg-slate-900 border-slate-800 text-white"
    : "bg-white border-gray-200";

  return (
    <div
      className={`
      fixed xl:static top-16 right-0 z-50
      h-[calc(106vh-4rem)] w-80
      transform transition-transform duration-300 ease-in-out
      ${rightOpen ? "translate-x-0" : "translate-x-full"}
      xl:translate-x-0
      flex flex-col border-l shadow-2xl
      ${panelBg}
    `}
    >
      {/* Close button */}
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

          {/* LOADING */}
          {loading && (
            <div className="flex justify-center">
              <Loader2 className="animate-spin" />
            </div>
          )}

          {/* APPROVED LIST */}
          {!loading && (
            <div className="space-y-2 mb-3">
              {approved.map((inst, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 rounded-lg bg-green-100 dark:bg-green-900/20"
                >
                  <div>
                    <p className="text-sm font-medium">{inst.name}</p>
                    <p className="text-xs opacity-60">{inst.city}</p>
                  </div>
                  <CheckCircle size={16} className="text-green-500" />
                </div>
              ))}

              {approved.length === 0 && (
                <p className="text-xs opacity-60">
                  No approved institute
                </p>
              )}
            </div>
          )}

          {/* PENDING */}
          {pending.map((inst, i) => (
            <div key={i} className="mb-2 flex items-center justify-between p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/20">
              <span className="text-sm">{inst.name}</span>
              <Clock size={16} className="text-yellow-500" />
            </div>
          ))}

          {/* REJECTED */}
          {rejected.map((inst, i) => (
            <div key={i} className="mb-2 flex items-center justify-between p-2 rounded-lg bg-red-100 dark:bg-red-900/20">
              <span className="text-sm">{inst.name}</span>
              <XCircle size={16} className="text-red-500" />
            </div>
          ))}

          {/* APPLY */}
          <div className="mt-4 border-t pt-3">
            <p className="text-xs opacity-60 mb-2">
              Enter institute code to join
            </p>

            <input
              type="text"
              value={instituteCode}
              onChange={(e) => {
                setInstituteCode(e.target.value);
                setJoinStatus("idle");
                setJoinMessage("");
              }}
              className="w-full px-3 py-2 border rounded"
              placeholder="Enter code..."
            />

            <button
              onClick={handleJoinInstitute}
              disabled={joinStatus === "loading"}
              className="w-full mt-2 py-2 bg-indigo-600 text-white rounded"
            >
              {joinStatus === "loading" ? "Sending..." : "Join Institute"}
            </button>

            {joinMessage && (
              <div className="text-xs mt-2">{joinMessage}</div>
            )}
          </div>
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