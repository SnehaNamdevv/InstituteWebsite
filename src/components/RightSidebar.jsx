export default function RightPanel({ dark, rightOpen }) {
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

  const leaderboard = [
    { name: "Aman", score: 95 },
    { name: "Riya", score: 92 },
    { name: "Rahul", score: 90 },
    { name: "Priya", score: 87 }
  ];

  const assignments = [
    { name: "React Dashboard UI", due: "Tomorrow" },
    { name: "Database ER Diagram", due: "2 Days" }
  ];

  return (

    <div
      className={`
      hidden xl:flex flex-col w-80
      sticky top-0
      h-[calc(100vh-2rem)]
      border-l p-6 space-y-6 overflow-y-auto
      ${dark ? "bg-slate-850 border-slate-800 text-white"
             : "bg-gray-50 border-gray-200"}
      `}
    >

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
      <div className={`rounded-xl p-4 shadow
      ${dark ? "bg-slate-800" : "bg-white"}
      `}>

        <h3 className="font-semibold mb-4">
          Leaderboard
        </h3>

        <div className="space-y-4">

          {leaderboard.map((user, i) => (

            <div key={i} className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <img
                  src={`https:`}
                  className="w-8 h-8 rounded-full"
                />

                <span className="text-sm">
                  {user.name}
                </span>

              </div>

              <span className="text-sm font-medium">
                {user.score}
              </span>

            </div>

          ))}

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

  );
}