import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function PerformanceChart({ dark }) {

  const studyData = [
    { day: "Mon", hours: 2 },
    { day: "Tue", hours: 3 },
    { day: "Wed", hours: 1.5 },
    { day: "Thu", hours: 4 },
    { day: "Fri", hours: 3.5 },
    { day: "Sat", hours: 5 }
  ];

  const achievements = [
    { title: "Top Performer", icon: "🏆" },
    { title: "7 Day Streak", icon: "🔥" },
    { title: "Fast Learner", icon: "⚡" },
    { title: "Quiz Master", icon: "🎯" },
    { title: "Consistency", icon: "📈" },
    { title: "Problem Solver", icon: "🧠" }
  ];

  return (

    <div className="flex flex-col lg:flex-row gap-4">

      {/* Performance Card */}
      <div className={`w-full lg:w-3/4 rounded-xl p-4 shadow
      ${dark ? "bg-slate-800 text-white" : "bg-white"}
      `}>

        <h3 className="font-semibold mb-3 text-sm">
          Performance
        </h3>

        <div className="h-40">

          <ResponsiveContainer width="100%" height="100%">

            <AreaChart data={studyData}>

              <XAxis
                dataKey="day"
                fontSize={10}
                axisLine={false}
                tickLine={false}
              />

              <YAxis hide domain={[0, 6]} />

              <Tooltip
                cursor={false}
                contentStyle={{
                  fontSize: "12px",
                  borderRadius: "6px"
                }}
              />

              <Area
                type="monotone"
                dataKey="hours"
                stroke="#22c55e"
                fill="#22c55e33"
                strokeWidth={2}
              />

            </AreaChart>

          </ResponsiveContainer>

        </div>

        <p className="text-xs opacity-70 mt-2">
          Weekly study progress
        </p>

      </div>


      {/* Achievements Card */}
      <div className={`w-full lg:w-2/5 rounded-xl p-4 shadow
      ${dark ? "bg-slate-800 text-white" : "bg-white"}
      `}>

        <h3 className="text-sm font-semibold mb-4">
          Achievements
        </h3>

        <div className="grid grid-cols-2 gap-3">

          {achievements.map((a, i) => (

            <div
              key={i}
              className={`flex items-center gap-2 p-2 rounded-lg text-xs
              ${dark ? "bg-slate-700" : "bg-gray-100"}
              `}
            >

              <span className="text-lg">
                {a.icon}
              </span>

              <span>
                {a.title}
              </span>

            </div>

          ))}

        </div>

      </div>

    </div>

  );
}