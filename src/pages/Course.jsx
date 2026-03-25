

const courses = [
  {
    id: 1,
    title: "Full Stack Development",
    instructor: "John Doe",
    classes: 12,
    image: "https://source.unsplash.com/400x250/?coding",
  },
  {
    id: 2,
    title: "Data Structures",
    instructor: "Jane Smith",
    classes: 8,
    image: "https://source.unsplash.com/400x250/?programming",
  },
  {
    id: 3,
    title: "Machine Learning",
    instructor: "Alex Johnson",
    classes: 10,
    image: "https://source.unsplash.com/400x250/?ai",
  },
  {
    id: 4,
    title: "UI/UX Design",
    instructor: "Emily Clark",
    classes: 6,
    image: "https://source.unsplash.com/400x250/?design",
  },
];

export default function CourseGrid() {
  return (
    <div className="p-6">
      
      {/* Heading */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Explore Courses 
        </h2>
        <button className="text-sm text-indigo-600 hover:underline">
          View All
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        
        {courses.map((course) => (
          <div
            key={course.id}
            className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition duration-300 hover:-translate-y-2"
          >
            
           

            {/* Content */}
            <div className="p-4">
              
              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600 transition">
                {course.title}
              </h3>

              {/* Instructor */}
              <p className="text-sm text-gray-500 mt-1">
                {course.instructor}
              </p>

              {/* Classes Count */}
              <p className="text-xs text-gray-400 mt-2">
                {course.classes} Classes
              </p>

              {/* Button */}
              <button className="mt-4 w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition">
                Start Learning →
              </button>

            </div>
             {/* Content */}
            <div className="p-4">
              
              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600 transition">
                {course.title}
              </h3>

              {/* Instructor */}
              <p className="text-sm text-gray-500 mt-1">
                {course.instructor}
              </p>

              {/* Classes Count */}
              <p className="text-xs text-gray-400 mt-2">
                {course.classes} Classes
              </p>

              {/* Button */}
              <button className="mt-4 w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition">
                Start Learning →
              </button>

            </div>

 {/* Content */}
            <div className="p-4">
              
              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600 transition">
                {course.title}
              </h3>

              {/* Instructor */}
              <p className="text-sm text-gray-500 mt-1">
                {course.instructor}
              </p>

              {/* Classes Count */}
              <p className="text-xs text-gray-400 mt-2">
                {course.classes} Classes
              </p>

              {/* Button */}
              <button className="mt-4 w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition">
                Start Learning →
              </button>

            </div>

 {/* Content */}
            <div className="p-4">
              
              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600 transition">
                {course.title}
              </h3>

              {/* Instructor */}
              <p className="text-sm text-gray-500 mt-1">
                {course.instructor}
              </p>

              {/* Classes Count */}
              <p className="text-xs text-gray-400 mt-2">
                {course.classes} Classes
              </p>

              {/* Button */}
              <button className="mt-4 w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition">
                Start Learning →
              </button>

            </div>


          </div>
        ))}

      </div>
    </div>
  );
}