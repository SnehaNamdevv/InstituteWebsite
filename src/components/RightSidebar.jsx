import { useEffect, useState } from "react";
export default function RightPanel({ dark, rightOpen, setRightOpen }){
  const meetings = [
    {
      title: "Team Meeting",
      time: "10:30 AM",
      color: "bg-pink-500"
    },
    {
      title: "Project Review",
      time: "1:00 PM",
      color: "bg-yellow-500"
    }
  ];

 
  const [institutes, setInstitutes] = useState([]);

  useEffect(() => {
    fetch("https://institute-backend-0ncp.onrender.com/institute/allInstitute")
      .then(res => res.json())
      .then(data => setInstitutes(data.institutes))
      .catch(err => console.log(err));
  }, []);

  const activeInstitutes = institutes.filter(
    inst => inst.status === "active"
  );

  const assignments = [
    { name: "React Dashboard UI", due: "Tomorrow" },
    { name: "Database ER Diagram", due: "2 Days" }
  ];

  return (

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
  <div className="flex justify-between items-center xl:hidden mb-4">
  {/* <h2 className="font-semibold ms-8">Right Panel</h2> */}
  <button onClick={() => setRightOpen(false)} className="ms-70">❌</button>
</div>
<div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">

      {/* Upcoming Schedule */}
      <div className={`rounded-xl p-4 shadow
      ${dark ? "bg-slate-800" : "bg-white"}
      `}>

        <h3 className="font-semibold mb-3">
          Upcoming Schedule
        </h3>

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

      {/* Leaderboard */}
    {/* Institutes */}
<div className={`rounded-xl p-4 shadow
  ${dark ? "bg-slate-800" : "bg-white"}
`}>

  <h3 className="font-semibold mb-4">
    Institutes
  </h3>

  <div className="space-y-4">

    {activeInstitutes.length === 0 ? (

      <p className="text-sm opacity-60">
        No active institutes
      </p>

    ) : (

      activeInstitutes.map((inst, i) => (

        <div key={i} className="flex items-center justify-between">

          <div className="flex items-center gap-3">

            {/* Logo ya Initial */}
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

            {/* Name + City */}
            <div className="text-sm">
              <p className="font-medium">{inst.name}</p>
              <p className="text-xs opacity-70">{inst.city}</p>
            </div>

          </div>

          {/* Status */}
          <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-600">
            active
          </span>

        </div>

      ))

    )}

  </div>

</div>

      {/* Assignments Due */}
      <div className={`rounded-xl p-4 shadow
      ${dark ? "bg-slate-800" : "bg-white"}
      `}>

        <h3 className="font-semibold mb-3">
          Assignments Due
        </h3>

        <div className="space-y-3 text-sm">

          {assignments.map((task, i) => (

            <div key={i} className="flex justify-between">

              <span>{task.name}</span>

              <span className="text-red-500 text-xs">
                {task.due}
              </span>

            </div>

          ))}

        </div>

      </div>

      {/* Recent Activity */}
      <div className={`rounded-xl p-4 shadow
      ${dark ? "bg-slate-800" : "bg-white"}
      `}>

        <h3 className="font-semibold mb-3">
          Recent Activity
        </h3>

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