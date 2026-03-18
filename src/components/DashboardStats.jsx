import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip
} from "recharts";

export default function DashboardStats({ dark }) {

  const attendanceData = [
    { name: "Present", value: 85 },
    { name: "Absent", value: 15 }
  ];

  const assignmentData = [
    { name: "Mon", tasks: 3 },
    { name: "Tue", tasks: 5 },
    { name: "Wed", tasks: 2 },
    { name: "Thu", tasks: 6 },
    { name: "Fri", tasks: 4 }
  ];

  const COLORS = ["#6366f1", "#f43f5e"];

  return (
    <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-5">

      {/* Attendance */}
     {/* Attendance */}
<div
  className={`rounded-xl p-4 shadow-lg transition
  ${dark ? "bg-slate-800 text-white" : "bg-white text-gray-800"}
  `}
>

  <h3 className="font-semibold mb-3 text-sm">
    Attendance
  </h3>

  {/* Overlapping Circles */}
  <div className="flex items-center mt-4">

    <div className="relative flex items-center">

      {/* Present */}
      <div className="w-20 h-20 rounded-full bg-green-500/80 flex items-center justify-center text-white font-semibold shadow">
        89
      </div>

      {/* Absent */}
      <div className="w-18 h-18 rounded-full bg-red-500/70 flex items-center justify-center text-white font-semibold shadow -ml-6">
        23
      </div>

      {/* Holiday */}
      <div className="w-16 h-16 rounded-full bg-yellow-400/70 flex items-center justify-center text-white font-semibold shadow -ml-5">
        8
      </div>

    </div>

  </div>

  {/* Labels */}
  <div className="flex gap-5 mt-4 text-xs">

    <div className="flex items-center gap-1">
      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
      Present
    </div>

    <div className="flex items-center gap-1">
      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
      Absent
    </div>

    <div className="flex items-center gap-1">
      <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
      Holiday
    </div>

  </div>

</div>


      {/* Assignments */}
      <div
        className={`rounded-xl p-4 shadow-lg transition
        ${dark ? "bg-slate-800 text-white" : "bg-white text-gray-800"}
        `}
      >

        <h3 className="font-semibold mb-2 text-sm">
          Assignments
        </h3>

        <div className="h-28">

          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={assignmentData}>
              <XAxis
                dataKey="name"
                stroke={dark ? "#cbd5f5" : "#6366f1"}
                fontSize={10}
              />
              <Tooltip />
              <Bar
                dataKey="tasks"
                fill="#6366f1"
                radius={[5,5,0,0]}
              />
            </BarChart>
          </ResponsiveContainer>

        </div>

      </div>


      {/* Courses */}
      <div
        className={`rounded-xl p-4 shadow-lg transition
        ${dark ? "bg-slate-800 text-white" : "bg-white text-gray-800"}
        `}
      >

        <h3 className="font-semibold mb-3 text-sm">
          Courses
        </h3>

        <div className="space-y-3 text-xs">

          {/* UI Design */}
          <div>
            <div className="flex justify-between mb-1">
              <span>UI Design</span>
              <span>80%</span>
            </div>

            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
              <div className="bg-indigo-500 h-2 rounded-full w-[80%]"></div>
            </div>
          </div>


          {/* React */}
          <div>
            <div className="flex justify-between mb-1">
              <span>React</span>
              <span>65%</span>
            </div>

            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
              <div className="bg-purple-500 h-2 rounded-full w-[65%]"></div>
            </div>
          </div>


          {/* Database */}
          <div>
            <div className="flex justify-between mb-1">
              <span>Database</span>
              <span>40%</span>
            </div>

            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
              <div className="bg-pink-500 h-2 rounded-full w-[40%]"></div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}