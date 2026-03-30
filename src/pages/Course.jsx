import React, { useState, useEffect } from 'react';
import { Plus, BookOpen, ArrowRight, X, ChevronLeft, FileText, Video, Link as LinkIcon } from "lucide-react";

const HEADER_COLORS = [
  "from-blue-700 to-blue-900",
  "from-green-700 to-green-900",
  "from-orange-600 to-orange-800",
  "from-red-700 to-red-900",
  "from-purple-700 to-purple-900",
  "from-teal-600 to-teal-800",
];

const STATUS_STYLES = {
  active:   "bg-blue-50 text-blue-700",
  upcoming: "bg-green-50 text-green-700",
  archived: "bg-orange-50 text-orange-700",
};

const getInitials = (name = "") =>
  name.split(" ").map((w) => w[0]).slice(0, 2).join("");

export default function Courses({ dark, instituteCourses = [] }) {
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [classCode, setClassCode] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([]);
useEffect(() => {
  const saved = localStorage.getItem("courses");
  if (saved) {
    setCourses(JSON.parse(saved));
  }
}, []);
  useEffect(() => {
    setCourses(instituteCourses || []);
  }, [instituteCourses]);

const handleJoinClass = async () => {
  if (classCode.length < 5) return;

  try {
    const res = await fetch(
      `https://institute-backend-0ncp.onrender.com/api/courses/course/${encodeURIComponent(classCode)}`
    );
    const data = await res.json();
    const newCourses = data.course ? [data.course] : data.courses || [];

    // Merge with existing courses in localStorage
    const existing = JSON.parse(localStorage.getItem("courses")) || [];
    const mergedCourses = [...existing, ...newCourses];

    setCourses(mergedCourses);
    localStorage.setItem("courses", JSON.stringify(mergedCourses));

    setShowJoinModal(false);
    setClassCode("");
  } catch (err) {
    console.log("Error:", err);
  }
};

  const getTopicIcon = (type) => {
    switch (type) {
      case "Video":      return <Video    size={18} className="text-red-500" />;
      case "Assignment": return <FileText size={18} className="text-emerald-500" />;
      case "Link":       return <LinkIcon size={18} className="text-blue-500" />;
      default:           return <BookOpen size={18} className="text-indigo-500" />;
    }
  };

  // ── Course Detail View ──────────────────────────────────────────────
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
            <p className="text-sm opacity-60">
              {selectedCourse.instructor} • {selectedCourse.code}
            </p>
          </div>
        </div>

        {/* Topics List */}
        <div className="space-y-3">
          <h3 className={`text-lg font-semibold px-2 ${dark ? "text-slate-300" : "text-gray-600"}`}>
            Course Content
          </h3>
          {selectedCourse.topics?.map((topic) => (
            <div
              key={topic.id}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer group
                ${dark
                  ? "bg-slate-800 border-slate-700 hover:bg-slate-750 text-white"
                  : "bg-white border-gray-100 hover:border-indigo-200 text-gray-800 shadow-sm"}`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-full ${dark ? "bg-slate-900" : "bg-gray-50"}`}>
                  {getTopicIcon(topic.type)}
                </div>
                <div>
                  <h4 className="font-medium group-hover:text-indigo-500 transition-colors">
                    {topic.title}
                  </h4>
                  <p className="text-xs opacity-50">{topic.type} • Posted {topic.date}</p>
                </div>
              </div>
              <ArrowRight
                size={16}
                className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-indigo-500"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Main View ───────────────────────────────────────────────────────
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
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {courses.length === 0 ? (
          <p className="text-center opacity-60 col-span-full py-12">No courses found</p>
        ) : (
          courses.map((course, i) => {
            const color    = HEADER_COLORS[i % HEADER_COLORS.length];
            const initials = getInitials(course.instructor);
            const status   = course.status || "active";

            return (
              <div
                key={i}
                onClick={() => setSelectedCourse(course)}
                className={`rounded-lg overflow-hidden border cursor-pointer transition-shadow hover:shadow-lg
                  ${dark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"}`}
              >
                {/* Colored Banner */}
                <div className={`relative h-24 bg-gradient-to-br ${color} p-4 flex flex-col justify-between`}>
                  <div>
                    <h3 className="text-white font-medium text-sm leading-snug pr-12 line-clamp-2">
                      {course.name}
                    </h3>
                    <p className="text-white/75 text-xs mt-0.5">
                      {course.code}{course.department ? ` · ${course.department}` : ""}
                    </p>
                  </div>
                  {/* Instructor Avatar */}
                  <div className={`absolute bottom-[-18px] right-4 w-10 h-10 rounded-full border-[3px] flex items-center justify-center text-sm font-semibold select-none
                    ${dark
                      ? "bg-slate-800 border-slate-800 text-slate-200"
                      : "bg-white border-white text-gray-600"}`}>
                    {initials || ""}
                  </div>
                </div>

                {/* Body */}
                <div className="px-4 pt-7 pb-2">
                  <p className={`text-sm font-medium ${dark ? "text-slate-200" : "text-gray-700"}`}>
                    {course.instructor || "Instructor"}
                  </p>
                  <p className={`text-xs mt-0.5 ${dark ? "text-slate-500" : "text-gray-400"}`}>
                    {course.topics?.length || 0} topics
                  </p>
                  <span className={`inline-block mt-2 text-xs font-medium px-2.5 py-0.5 rounded-full
                    ${STATUS_STYLES[status] || STATUS_STYLES.active}`}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                </div>

                {/* Footer */}
                <div className={`flex justify-end gap-1 px-2 py-1 mt-2 border-t
                  ${dark ? "border-slate-700" : "border-gray-100"}`}>
                  <button
                    onClick={(e) => { e.stopPropagation(); }}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors
                      ${dark ? "text-slate-400 hover:bg-slate-700" : "text-gray-400 hover:bg-gray-100"}`}
                    title="Course files"
                  >
                    <BookOpen size={16} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); }}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors
                      ${dark ? "text-slate-400 hover:bg-slate-700" : "text-gray-400 hover:bg-gray-100"}`}
                    title="More options"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="5" cy="12" r="1.8"/>
                      <circle cx="12" cy="12" r="1.8"/>
                      <circle cx="19" cy="12" r="1.8"/>
                    </svg>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Join Class Modal */}
      {showJoinModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[70] p-4"
          onClick={() => setShowJoinModal(false)}
        >
          <div
            className={`w-full max-w-sm p-8 rounded-2xl shadow-2xl
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

            <p className="text-sm opacity-70 mb-6">
              Enter the class code provided by your instructor.
            </p>

            <input
              type="text"
              placeholder="e.g. ABC-123"
              value={classCode}
              onChange={(e) => setClassCode(e.target.value.toUpperCase())}
              className={`w-full p-4 mb-6 border rounded-xl text-center text-xl font-mono tracking-widest outline-none focus:ring-2
                ${dark
                  ? "bg-slate-900 border-slate-600 focus:ring-indigo-500 text-white"
                  : "bg-gray-50 border-gray-200 focus:ring-indigo-500 text-gray-800"}`}
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