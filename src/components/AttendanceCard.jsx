export default function AttendanceCard() {

  const data = [
    { label: "Present", value: 89, color: "bg-green-500" },
    { label: "Absent", value: 23, color: "bg-red-500" },
    { label: "Holiday", value: 8, color: "bg-yellow-400" }
  ];

  return (

    <div className="bg-[#171A25] p-6 rounded-xl">

      <p className="text-gray-400 text-sm">
        Attendance
      </p>

      <div className="flex justify-between mt-5">

        {data.map((item, index) => (

          <div key={index} className="flex flex-col items-center">

            {/* Circle */}
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-semibold text-lg ${item.color}`}>
              {item.value}
            </div>

            {/* Label */}
            <p className="text-gray-400 text-xs mt-2">
              {item.label}
            </p>

          </div>

        ))}

      </div>

    </div>

  );
}