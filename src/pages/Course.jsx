import React, { useState } from 'react';
import { Plus, BookOpen, User, ArrowRight, X, ChevronLeft, FileText, Video, Link as LinkIcon } from "lucide-react";
import { FaBookReader } from "react-icons/fa";

export default function Courses({ dark }) {
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [classCode, setClassCode] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);

  
  const [courses, setCourses] = useState([
    { 
      id: 1, 
      name: "10 Class", 
      code: "ABC12", 
      instructor: "Mr. XXX",
      topics: [
        { id: 101, title: "Notes", type: "Reading", date: "27 march" },
        { id: 102, title: "Recorded Lecture", type: "Video", date: "" },
        { id: 103, title: "Assignment", type: "Assignment", date: "Due April 3" },
        { id: 104, title: "Test", type: "Assignment", date: "Due April 3" },
        { id: 105, title: "Timetable", type: "Assignment", date: "Due April 3" }
       
      ]
    },
    // { 
    //   id: 2, 
    //   name: "Full-Stack Development", 
    //   code: "123FS", 
    //   instructor: "Prof XYZ",
    //   topics: [
    //     { id: 201, title: "Introduction Node.js & Express", type: "Reading", date: "April 01" },
    //     { id: 202, title: "MongoDB Schema Design", type: "Link", date: "April 05" }
    //   ]
    // }
  ]);

  const handleJoinClass = () => {
    if (classCode.length < 5) return;
    console.log("Joining course with code:", classCode);
    setShowJoinModal(false);
    setClassCode("");
  };

  
  const getTopicIcon = (type) => {
    switch(type) {
      case 'Video': return <Video size={18} className="text-red-500" />;
      case 'Assignment': return <FileText size={18} className="text-emerald-500" />;
      case 'Link': return <LinkIcon size={18} className="text-blue-500" />;
      default: return <BookOpen size={18} className="text-indigo-500" />;
    }
  };

 
  if (selectedCourse) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
        {/* Back Header */}
        <div className={`rounded-xl p-4 shadow flex items-center gap-4 transition-colors
          ${dark ? "bg-slate-800 text-white" : "bg-white text-gray-800"}`}>
          <button 
            onClick={() => setSelectedCourse(null)}
            className={`p-2 rounded-full transition-colors ${dark ? "hover:bg-slate-700" : "hover:bg-gray-100"}`}
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h2 className="text-xl font-bold">{selectedCourse.name}</h2>
            <p className="text-sm opacity-60">{selectedCourse.instructor} • {selectedCourse.code}</p>
          </div>
        </div>

        {/* Topics List */}
        <div className="space-y-3">
          <h3 className={`text-lg font-semibold px-2 ${dark ? "text-slate-300" : "text-gray-600"}`}>Course Content</h3>
          {selectedCourse.topics.map((topic) => (
            <div 
              key={topic.id}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer group
                ${dark ? "bg-slate-800 border-slate-700 hover:bg-slate-750 text-white" : "bg-white border-gray-100 hover:border-indigo-200 text-gray-800 shadow-sm"}`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-full ${dark ? "bg-slate-900" : "bg-gray-50"}`}>
                  {getTopicIcon(topic.type)}
                </div>
                <div>
                  <h4 className="font-medium group-hover:text-indigo-500 transition-colors">{topic.title}</h4>
                  <p className="text-xs opacity-50">{topic.type} • Posted {topic.date}</p>
                </div>
              </div>
              <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-indigo-500" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className={`rounded-xl p-6 shadow flex items-center justify-between transition-colors duration-300
        ${dark ? "bg-slate-800 text-white" : "bg-white text-gray-800"}`}>
        <div>
          <h2 className="text-xl font-semibold">📚 My Classrooms</h2>
          <p className="text-sm opacity-70">Access your enrolled courses</p>
        </div>
        <button 
          onClick={() => setShowJoinModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all active:scale-95"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Join Class</span>
        </button>
      </div>

      {/* Course Grid */}
      <div  className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course) => (
          <div 
          onClick={()=> setSelectedCourse(course)}
            key={course.id}
            className={`group p-5 rounded-2xl shadow border transition-all hover:shadow-lg
              ${dark ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-gray-100 text-gray-800"}`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-xl ${dark ? "bg-indigo-600/20 text-indigo-400" : "bg-indigo-50 text-indigo-600"}`}>
               {/* <FaBookReader /> */}
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wider ${dark ? "bg-slate-800 text-slate-400" : "bg-gray-100 text-gray-500"}`}>
                {course.code}
                
              </span>
            </div>

            <h3 className="text-lg font-bold group-hover:text-indigo-500 transition-colors">{course.name}</h3>
            
            <div className="flex items-center gap-2 mt-2 opacity-70 text-sm">
              <User size={14} />
              <span>{course.instructor}</span>
            </div>

            <div className={`mt-6 pt-4 border-t flex items-center justify-between ${dark ? "border-slate-600" : "border-gray-50"}`}>
              <span 
                 // Sets the selected course
                className="text-xs font-medium opacity-50 underline cursor-pointer hover:opacity-100"
              >
                View Materials
              </span>
              <ArrowRight size={18} className="translate-x-0 group-hover:translate-x-2 transition-transform text-indigo-500" />
            </div>
          </div>
        ))}
      </div>

      {/* JOIN CLASS MODAL */}
      {showJoinModal && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowJoinModal(false)}
        >
          <div 
            className={`w-full max-w-sm p-8 rounded-2xl shadow-2xl transition-all scale-100
              ${dark ? "bg-slate-800 text-white" : "bg-white text-gray-800"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-bold">Join a Class</h3>
               <X 
                className="cursor-pointer opacity-50 hover:opacity-100" 
                onClick={() => setShowJoinModal(false)} 
               />
            </div>

            <p className="text-sm opacity-70 mb-6">Enter the class code provided by your instructor.</p>

            <input
              type="text"
              placeholder="e.g. ABC-123"
              value={classCode}
              onChange={(e) => setClassCode(e.target.value.toUpperCase())}
              className={`w-full p-4 mb-6 border rounded-xl text-center text-xl font-mono tracking-widest outline-none focus:ring-2
                ${dark 
                  ? "bg-slate-900 border-slate-600 focus:ring-indigo-500 text-white" 
                  : "bg-gray-50 border-gray-200 focus:ring-indigo-500 text-gray-800"
                }`}
            />

            <div className="flex flex-col gap-3">
              <button
                onClick={handleJoinClass}
                disabled={!classCode}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50"
              >
                Join Classroom
              </button>
              <button
                onClick={() => setShowJoinModal(false)}
                className={`w-full py-3 rounded-xl text-sm font-medium
                  ${dark ? "hover:bg-slate-700" : "hover:bg-gray-100"}`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}