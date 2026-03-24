import { BookOpen, PlayCircle } from "lucide-react";

export default function CourseSection() {
  const courses = [
    {
      id: 1,
      title: "React Basics",
      instructor: "John Doe",
      progress: 70,
    },
    {
      id: 2,
      title: "Java Programming",
      instructor: "Amit Sir",
      progress: 100,
    },
    {
      id: 3,
      title: "Data Structures",
      instructor: "Rahul Sir",
      progress: 40,
    },
  ];

  return (
    <div className="p-6 w-full flex flex-col items-center">
      
      {/* Heading */}
      <div className="w-full max-w-6xl flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Courses</h2>
        <button className="text-blue-500 font-medium hover:underline">
          View All
        </button>
      </div>

      {/* Courses Grid */}
      <div className="grid w-full max-w-6xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => {
          const isCompleted = course.progress === 100;

          return (
            <div
              key={course.id}
              className="bg-white rounded-2xl shadow-md p-5 hover:shadow-xl transition duration-300"
            >
              {/* Top Section */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="text-blue-500" />
                  <h3 className="font-semibold text-lg">
                    {course.title}
                  </h3>
                </div>

                {/* Status Badge */}
                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    isCompleted
                      ? "bg-green-100 text-green-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {isCompleted ? "Completed" : "Ongoing"}
                </span>
              </div>

              {/* Instructor */}
              <p className="text-sm text-gray-500 mb-4">
                Instructor: {course.instructor}
              </p>

              {/* Progress */}
              <div className="mb-2 flex justify-between text-sm">
                <span>Progress</span>
                <span>{course.progress}%</span>
              </div>

              <div className="w-full bg-gray-200 h-2 rounded-full mb-4">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>

              {/* Button */}
              <button className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
                <PlayCircle size={18} />
                {isCompleted ? "Review Course" : "Continue"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}