import { useEffect, useState } from "react";

export default function RightPanel({ 
  dark, 
  rightOpen, 
  setRightOpen,
  setInstituteCourses,   
  setActiveSection       
}) {

  // ✅ Meetings
  const meetings = [
    { title: "Team Meeting", time: "10:30 AM", color: "bg-pink-500" },
    { title: "Project Review", time: "1:00 PM", color: "bg-yellow-500" }
  ];

  // ✅ States
  const [institutes, setInstitutes] = useState([]);
  const [showJoinInstituteModal, setShowJoinInstituteModal] = useState(false);
  const [selectedInstitute, setSelectedInstitute] = useState(null);
  const [instituteCode, setInstituteCode] = useState("");

  // ✅ Fetch Institutes
  useEffect(() => {
    fetch("https://institute-backend-0ncp.onrender.com/institute/allInstitute")
      .then(res => res.json())
      .then(data => setInstitutes(data.institutes))
      .catch(err => console.log(err));
  }, []);

  // ✅ Restore Courses after reload
  useEffect(() => {
    const savedCourses = JSON.parse(localStorage.getItem("courses"));
    if (savedCourses && savedCourses.length > 0) {
      setInstituteCourses(savedCourses);
    }
  }, []);

  const activeInstitutes = institutes.filter(
    inst => inst.status === "active"
  );

  // ✅ Assignments
  const assignments = [
    { name: "React Dashboard UI", due: "Tomorrow" },
    { name: "Database ER Diagram", due: "2 Days" }
  ];
const [institute, setInstitute] = useState(null);
const [status, setStatus] = useState("none"); // none | pending | approved

useEffect(() => {
  const fetchInstituteStatus = async () => {
    try {
      const res = await fetch(
        `https://institute-backend-0ncp.onrender.com/student/my-institute/${localStorage.getItem("studentId")}`
      );

      const data = await res.json();

      if (data.request) {
        setStatus(data.request.status); // pending / approved
        setInstitute(data.institute || null);
      }

    } catch (err) {
      console.log(err);
    }
  };

  fetchInstituteStatus();

  // 🔥 AUTO REFRESH EVERY 5 SEC (REAL-TIME FEEL)
  const interval = setInterval(fetchInstituteStatus, 5000);

  return () => clearInterval(interval);

}, []);
  return (
    <>
      {/* RIGHT PANEL */}
      <div
        className={`
          fixed xl:static top-16 right-0 z-50
          h-[calc(100vh-4rem)] w-80
          transform transition-transform duration-300 ease-in-out

          ${rightOpen ? "translate-x-0" : "translate-x-full"}
          xl:translate-x-0

          flex flex-col
          border-l shadow-2xl

          ${dark ? "bg-slate-900 border-slate-800 text-white"
                 : "bg-white border-gray-200"}
        `}
      >

        {/* Close Button */}
        <div className="flex justify-end xl:hidden p-4">
          <button onClick={() => setRightOpen(false)}>❌</button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">

          {/* Upcoming Schedule */}
          <div className={`rounded-xl p-4 shadow ${dark ? "bg-slate-800" : "bg-white"}`}>
            <h3 className="font-semibold mb-3">Upcoming Schedule</h3>

            <div className="space-y-3">
              {meetings.map((meet, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-2 h-8 rounded ${meet.color}`}></div>
                  <div className="text-sm">
                    <p className="font-medium">{meet.title}</p>
                    <p className="opacity-70">{meet.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Institutes */}
          <div className={`rounded-xl p-4 shadow ${dark ? "bg-slate-800" : "bg-white"}`}>
            <h3 className="font-semibold mb-4">Institutes</h3>

            <div className="space-y-4">
              {activeInstitutes.length === 0 ? (
                <p className="text-sm opacity-60">No active institutes</p>
              ) : (
                activeInstitutes.map((inst, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setSelectedInstitute(inst);
                      setShowJoinInstituteModal(true);
                    }}
                    className="flex items-center justify-between cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 p-2 rounded-lg transition"
                  >

                    <div className="flex items-center gap-3">
                      {/* Logo */}
                      {inst.logo ? (
                        <img
                          src={
                            inst.logo.startsWith("http")
                              ? inst.logo
                              : `https://institute-backend-0ncp.onrender.com/uploads/${inst.logo}`
                          }
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs">
                          {inst.name?.charAt(0)}
                        </div>
                      )}

                      <div className="text-sm">
                        <p className="font-medium">{inst.name}</p>
                        <p className="text-xs opacity-70">{inst.city}</p>
                      </div>
                    </div>

                    <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-600">
                      active
                    </span>

                  </div>
                ))
              )}
            </div>
          </div>

          {/* Assignments */}
          <div className={`rounded-xl p-4 shadow ${dark ? "bg-slate-800" : "bg-white"}`}>
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

          {/* Activity */}
          <div className={`rounded-xl p-4 shadow ${dark ? "bg-slate-800" : "bg-white"}`}>
            <h3 className="font-semibold mb-3">Recent Activity</h3>

            <div className="space-y-3 text-sm opacity-80">
              <p>📘 New course material uploaded</p>
              <p>📝 Assignment graded</p>
              <p>📅 Schedule updated</p>
            </div>
          </div>

        </div>
      </div>

      {/* JOIN INSTITUTE MODAL */}
      {showJoinInstituteModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowJoinInstituteModal(false)}
        >
          <div
            className={`w-full max-w-sm p-6 rounded-xl shadow-2xl
              ${dark ? "bg-slate-800 text-white" : "bg-white text-gray-800"}`}
            onClick={(e) => e.stopPropagation()}
          >

            <h3 className="text-lg font-semibold mb-4">
              Join {selectedInstitute?.name}
            </h3>

            <input
              type="text"
              placeholder="Enter Institute Code"
              value={instituteCode}
              onChange={(e) => setInstituteCode(e.target.value)}
              className={`w-full p-3 mb-4 border rounded-lg outline-none
                ${dark 
                  ? "bg-slate-900 border-slate-600" 
                  : "bg-gray-50 border-gray-200"
                }`}
            />

            <div className="flex gap-2">
             <button
  onClick={async () => {
    try {
      const res = await fetch(
        "https://institute-backend-0ncp.onrender.com/student/apply-institute",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            instituteCode: instituteCode,
            studentId: localStorage.getItem("studentId"), // or from auth
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Request sent for approval ✅");
        setShowJoinInstituteModal(false);
        setInstituteCode("");
      } else {
        alert(data.message || "Something went wrong ❌");
      }

    } catch (err) {
      console.log(err);
    }
  }}
  className="flex-1 py-2 bg-indigo-600 text-white rounded-lg"
>
  Apply
</button>

              <button
                onClick={() => setShowJoinInstituteModal(false)}
                className="flex-1 py-2 bg-gray-300 rounded-lg"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}