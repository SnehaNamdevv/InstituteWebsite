import React, { useState, useEffect, useRef } from "react";
import {
  Plus, BookOpen, ChevronLeft, FileText, Video,
  Link as LinkIcon, Search, Clock, Users, GraduationCap,
  ChevronRight, Lock, X, CalendarDays, LayoutGrid,
} from "lucide-react";



const API = "https://institute-backend-0ncp.onrender.com";

const COURSE_THEMES = [
  { bg: "from-violet-600 via-purple-600 to-indigo-700", accent: "#7c3aed", dot: "bg-violet-400" },
  { bg: "from-rose-500 via-pink-600 to-red-700",        accent: "#e11d48", dot: "bg-rose-400"   },
  { bg: "from-amber-500 via-orange-500 to-red-500",     accent: "#f59e0b", dot: "bg-amber-400"  },
  { bg: "from-emerald-500 via-teal-500 to-cyan-600",    accent: "#10b981", dot: "bg-emerald-400"},
  { bg: "from-blue-500 via-cyan-500 to-teal-600",       accent: "#3b82f6", dot: "bg-blue-400"   },
  { bg: "from-fuchsia-600 via-pink-600 to-rose-500",    accent: "#c026d3", dot: "bg-fuchsia-400"},
];

const TOPIC_ICON_CONFIG = {
  Video:      { icon: Video,    bg: "bg-red-50",     color: "text-red-500",     label: "Video Lecture" },
  Assignment: { icon: FileText, bg: "bg-emerald-50", color: "text-emerald-600", label: "Assignment"    },
  Link:       { icon: LinkIcon, bg: "bg-blue-50",    color: "text-blue-500",    label: "Resource"      },
  Subject:    { icon: BookOpen, bg: "bg-violet-50",  color: "text-violet-500",  label: "Subject"       },
};


const resolveTeacher = (val) => {
  if (!val) return null;
  if (Array.isArray(val)) return val.length ? val[0] : null;
  return val;
};


const buildTopics = (subjects = []) =>
  subjects.map((subj, idx) => ({ id: idx, title: subj, type: "Subject" }));

const getInitials = (name = "") =>
  name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

const getStudent = () => {
  try { return JSON.parse(localStorage.getItem("student")) || {}; }
  catch { return {}; }
};

const saveCourses = (list) => localStorage.setItem("courses", JSON.stringify(list));

const loadCourses = () => {
  try { return JSON.parse(localStorage.getItem("courses")) || []; }
  catch { return []; }
};

const formatDate = (iso) => {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};


function Modal({ dark, onClose, children }) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[70] p-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(10px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl animate-popIn"
        style={{ background: dark ? "#1e293b" : "#fff" }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}


function LockedOverlay({ dark }) {
  return (
    <div
      className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-2xl gap-2"
      style={{
        background: dark ? "rgba(15,23,42,0.85)" : "rgba(255,255,255,0.85)",
        backdropFilter: "blur(6px)",
      }}
    >
      <div className="w-12 h-12 rounded-2xl bg-yellow-100 flex items-center justify-center shadow-lg">
        <Lock size={22} className="text-yellow-600" />
      </div>
      <p className={`text-xs font-bold ${dark ? "text-yellow-400" : "text-yellow-700"}`}>
        Pending Approval
      </p>
      <p className={`text-[10px] text-center px-6 opacity-60 ${dark ? "text-slate-400" : "text-gray-500"}`}>
        Teacher has not approved yet
      </p>
    </div>
  );
}


function TopicRow({ topic, index, dark }) {
  const cfg = TOPIC_ICON_CONFIG[topic.type] || TOPIC_ICON_CONFIG.Subject;
  const Icon = cfg.icon;
  return (
    <div
      className="group flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.01]"
      style={{
        background: dark ? "rgba(255,255,255,0.04)" : "#fff",
        border: dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.06)",
        boxShadow: dark ? "0 2px 12px rgba(0,0,0,0.3)" : "0 2px 12px rgba(0,0,0,0.04)",
      }}
    >
      <span className="w-6 text-center text-xs font-bold opacity-25 shrink-0">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${cfg.bg}`}>
        <Icon size={18} className={cfg.color} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`font-semibold text-sm truncate group-hover:text-violet-500 transition-colors ${dark ? "text-white" : "text-gray-800"}`}>
          {topic.title}
        </p>
        <p className="text-xs opacity-50 mt-0.5">{cfg.label}</p>
      </div>
      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-violet-500/0 group-hover:bg-violet-500 transition-all duration-300 shrink-0">
        <ChevronRight size={14} className="text-violet-400 group-hover:text-white transition-colors duration-300" />
      </div>
    </div>
  );
}


function CourseCard({ course, index, dark, onClick }) {
  const theme = COURSE_THEMES[index % COURSE_THEMES.length];
  const teacher = resolveTeacher(course.classTeacher);
  const initials = getInitials(teacher || course.name || "");
  const isPending = course.status === "pending";

  return (
    <div
      onClick={isPending ? undefined : onClick}
      className={`group rounded-2xl overflow-hidden transition-all duration-300 relative ${
        isPending ? "cursor-not-allowed" : "cursor-pointer hover:-translate-y-1 hover:shadow-2xl"
      }`}
      style={{
        background: dark ? "rgba(255,255,255,0.05)" : "#fff",
        border: dark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.07)",
        boxShadow: dark ? "0 4px 24px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.06)",
      }}
    >
      {isPending && <LockedOverlay dark={dark} />}

      {/* Gradient banner — shows course NAME */}
      <div className={`relative h-36 bg-gradient-to-br ${theme.bg} p-5 overflow-hidden`}>
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10 blur-xl" />
        <div className="absolute bottom-0 left-1/3 w-16 h-16 rounded-full bg-white/10 blur-lg" />
        <div className="relative z-10 pr-14">
          
          <h3 className="text-white font-bold text-lg leading-tight line-clamp-2 mb-1">
            {course.name}
          </h3>
        
          <p className="text-white/50 text-[10px] font-semibold uppercase tracking-widest">
            {course.courseId}
          </p>
        </div>
        {/* Initials avatar */}
        <div
          className="absolute bottom-[-20px] right-5 w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold shadow-lg z-20 transition-transform duration-300 group-hover:scale-110 select-none"
          style={{
            background: dark ? "#1e293b" : "#fff",
            color: theme.accent,
            border: `3px solid ${dark ? "#1e293b" : "#fff"}`,
          }}
        >
          {initials || <GraduationCap size={18} />}
        </div>
      </div>

      {/* Card body */}
      <div className="px-5 pt-8 pb-5">
        {/* Teacher */}
        {teacher ? (
          <p className={`font-semibold text-sm ${dark ? "text-slate-200" : "text-gray-800"}`}>
            {teacher}
          </p>
        ) : (
          <p className="text-sm opacity-30 italic">No teacher assigned</p>
        )}

        {/* Description */}
        {course.description && (
          <p className={`text-xs mt-1 line-clamp-2 opacity-50 ${dark ? "text-slate-300" : "text-gray-600"}`}>
            {course.description}
          </p>
        )}

        {/* Meta row */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
          {course.duration && (
            <span className={`flex items-center gap-1 text-xs opacity-50 ${dark ? "text-slate-300" : "text-gray-600"}`}>
              <Clock size={11} /> {course.duration}
            </span>
          )}
          {course.subjects?.length > 0 && (
            <span className={`flex items-center gap-1 text-xs opacity-50 ${dark ? "text-slate-300" : "text-gray-600"}`}>
              <LayoutGrid size={11} /> {course.subjects.length} subjects
            </span>
          )}
          {course.maxSeats > 0 && (
            <span className={`flex items-center gap-1 text-xs opacity-50 ${dark ? "text-slate-300" : "text-gray-600"}`}>
              <Users size={11} /> {course.maxSeats} seats
            </span>
          )}
        </div>

        {/* Status badge */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${theme.dot}`} />
            <span className={`text-xs font-medium opacity-60 ${dark ? "text-slate-300" : "text-gray-600"}`}>
              {course.subjects?.length || 0} subjects
            </span>
          </div>
          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
            isPending
              ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
              : "bg-emerald-100 text-emerald-700 border border-emerald-200"
          }`}>
            {isPending ? "Pending" : "Approved"}
          </span>
        </div>
      </div>
    </div>
  );
}


export default function Courses({ dark = false, instituteCourses = [] }) {
 const [courses, setCourses] = useState(() => loadCourses());
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [search, setSearch]                 = useState("");
  const [showJoinModal, setShowJoinModal]   = useState(false);
  const [classCode, setClassCode]           = useState("");
  const [loading, setLoading]               = useState(false);
  const [popup, setPopup]                   = useState(null);

  useEffect(() => {
  const syncWithBackend = async () => {
    const studentId = getStudent()?.studentID;
    if (!studentId) return;

    try {
      const res = await fetch(`${API}/student/my-courses/${studentId}`);
      const data = await res.json();

      if (data.courses) {
        setCourses(data.courses); // ✅ fresh data
        saveCourses(data.courses); // ✅ update localStorage
      }
    } catch (err) {
      console.log("Sync error:", err);
    }
  };

  syncWithBackend();
}, []);

  

  const coursesRef = useRef(courses);
  coursesRef.current = courses;

  useEffect(() => {
    const hasPending = courses.some((c) => c.status === "pending");
    if (!hasPending) return;

    const interval = setInterval(async () => {
      const studentId = getStudent()?.studentID;
      if (!studentId) return;

      const current = [...coursesRef.current];
      let changed = false;

      for (let i = 0; i < current.length; i++) {
        if (current[i].status !== "pending") continue;

        try {
          const res = await fetch(
            `${API}/api/courses/course/${current[i].courseId}/access/${studentId}`
          );
          if (res.status === 403) continue;

          const data = await res.json();
          const myRecord = data.course?.enrolledStudents?.find(
            (s) => s.studentId === studentId
          );
          const isApproved =
            data.approvalStatus === "APPROVED" ||
            data.access === true ||
            myRecord?.status === "APPROVED";

          if (isApproved) {
            try {
              const fullRes = await fetch(
                `${API}/api/courses/course/${encodeURIComponent(current[i].courseId)}`
              );
              const fullData = await fullRes.json();
              current[i] = fullData.success && fullData.course
                ? { ...fullData.course, status: "approved" }
                : { ...current[i], status: "approved" };
            } catch {
              current[i] = { ...current[i], status: "approved" };
            }
            changed = true;
          }
        } catch { /* */ }
      }

      if (changed) {
        setCourses(current);
        saveCourses(current);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleJoinClass = async () => {
    const code = classCode.trim();
    if (code.length < 3) return;
    setLoading(true);

    try {
      const studentId = getStudent()?.studentID;
      if (!studentId) { alert("Please login again."); setLoading(false); return; }

      if (courses.some((c) => c.courseId.toLowerCase() === code.toLowerCase())) {
        setShowJoinModal(false); setClassCode(""); setPopup("duplicate"); setLoading(false); return;
      }

      const res = await fetch(`${API}/student/apply-course`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: code, studentId }),
      });
      const data = await res.json();

      if (data.message === "Request sent to teacher") {
        const newCourse = { courseId: code, name: code, status: "pending", subjects: [] };
        const updated = [...courses, newCourse];
        setCourses(updated);
        saveCourses(updated);
        setShowJoinModal(false); setClassCode(""); setPopup("success");
      } else if (data.message?.toLowerCase().includes("already")) {
        setShowJoinModal(false); setClassCode(""); setPopup("duplicate");
      } else {
        alert(data.message || "Something went wrong.");
        setShowJoinModal(false); setClassCode("");
      }
    } catch { alert("Server error. Please try again."); }
    setLoading(false);
  };

  const handleCourseClick = async (course) => {
    if (course.status === "pending") return;
    setSelectedCourse({ ...course, topics: buildTopics(course.subjects) });

    try {
      const res = await fetch(`${API}/api/courses/course/${encodeURIComponent(course.courseId)}`);
      const data = await res.json();
      if (data.success && data.course) {
        setSelectedCourse({ ...data.course, status: "approved", topics: buildTopics(data.course.subjects) });
      }
    } catch { /*  */ }
  };

  const filtered = courses.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.courseId?.toLowerCase().includes(search.toLowerCase()) ||
    (resolveTeacher(c.classTeacher) || "").toLowerCase().includes(search.toLowerCase()) ||
    c.description?.toLowerCase().includes(search.toLowerCase())
  );

  const themeFor = (courseId) =>
    COURSE_THEMES[courses.findIndex((c) => c.courseId === courseId) % COURSE_THEMES.length];


  if (selectedCourse) {
    const theme = themeFor(selectedCourse.courseId);
    const teacher = resolveTeacher(selectedCourse.classTeacher);
    const studentCount = selectedCourse.enrolledStudents?.length ?? selectedCourse.students ?? 0;
    const nextBatch = formatDate(selectedCourse.nextBatch);

    return (
      <div className="space-y-5 animate-fadeIn">
        {/* Hero card */}
        <div className="rounded-3xl overflow-hidden shadow-xl" style={{ background: dark ? "#1e293b" : "#fff" }}>
          <div className={`bg-gradient-to-br ${theme.bg} px-6 pt-6 pb-16 relative overflow-hidden`}>
            <div className="absolute -bottom-8 -right-8 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
            <button
              onClick={() => setSelectedCourse(null)}
              className="relative z-10 flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium mb-6 transition-colors"
            >
              <ChevronLeft size={18} /> Back to Courses
            </button>
            <div className="relative z-10">
              {/* Prominent course name */}
              <h2 className="text-white text-2xl font-bold leading-tight mb-1">
                {selectedCourse.name}
              </h2>
              {/* courseId as small label */}
              <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-2">
                {selectedCourse.courseId}
              </p>
              {/* Description */}
              {selectedCourse.description && (
                <p className="text-white/65 text-sm mt-2 leading-relaxed">
                  {selectedCourse.description}
                </p>
              )}
            </div>
          </div>

          {/* Stats bar */}
          <div
            className="grid grid-cols-3 divide-x -mt-6 mx-6 rounded-2xl overflow-hidden shadow-lg z-10 relative"
            style={{ background: dark ? "#0f172a" : "#fff" }}
          >
            {[
              { icon: BookOpen,    label: "Subjects",  value: selectedCourse.topics?.length || 0 },
              { icon: Clock,       label: "Duration",  value: selectedCourse.duration || "N/A"   },
              { icon: Users,       label: "Enrolled",  value: studentCount                        },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex flex-col items-center py-4 gap-1">
                <Icon size={16} className="text-violet-500 opacity-70" />
                <span className={`text-lg font-bold ${dark ? "text-white" : "text-gray-800"}`}>{value}</span>
                <span className={`text-[11px] uppercase tracking-wide opacity-40 ${dark ? "text-slate-300" : "text-gray-600"}`}>{label}</span>
              </div>
            ))}
          </div>
          <div className="h-5" />
        </div>

       
        <div
          className="rounded-2xl p-5"
          style={{
            background: dark ? "rgba(255,255,255,0.04)" : "#f9fafb",
            border: dark ? "1px solid rgba(255,255,255,0.07)" : "1px solid #e5e7eb",
          }}
        >
          <h4 className={`text-xs font-bold uppercase tracking-widest mb-4 opacity-40 ${dark ? "text-slate-300" : "text-gray-500"}`}>
            Course Info
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Teacher",    value: teacher || "Not assigned",            icon: GraduationCap },
              
              { label: "Next Batch", value: nextBatch || "N/A",                   icon: CalendarDays  },
             ,
            ].map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="flex items-start gap-3 p-3 rounded-xl"
                style={{ background: dark ? "rgba(255,255,255,0.04)" : "#fff", border: dark ? "1px solid rgba(255,255,255,0.06)" : "1px solid #e5e7eb" }}
              >
                <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
                  <Icon size={14} className="text-violet-600" />
                </div>
                <div className="min-w-0">
                  <p className={`text-[10px] uppercase tracking-wide opacity-40 ${dark ? "text-slate-400" : "text-gray-500"}`}>{label}</p>
                  <p className={`text-sm font-semibold truncate ${dark ? "text-slate-200" : "text-gray-800"}`}>{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subjects list */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className={`text-base font-bold ${dark ? "text-slate-200" : "text-gray-700"}`}>
              Subjects
            </h3>
            <span className={`text-xs font-semibold opacity-40 ${dark ? "text-slate-300" : "text-gray-500"}`}>
              {selectedCourse.topics?.length || 0} total
            </span>
          </div>
          <div className="space-y-2">
            {selectedCourse.topics?.length > 0 ? (
              selectedCourse.topics.map((topic, i) => (
                <TopicRow key={topic.id} topic={topic} index={i} dark={dark} />
              ))
            ) : (
              <div className="text-center py-16 opacity-40">
                <BookOpen size={36} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">No subjects added yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

 
  return (
    <div className="space-y-7">

      {/* Hero bar */}
      <div
        className="rounded-3xl p-6 relative overflow-hidden"
        style={{
          background: dark
            ? "linear-gradient(135deg,#312e81 0%,#1e1b4b 100%)"
            : "linear-gradient(135deg,#6d28d9 0%,#4f46e5 100%)",
        }}
      >
        <div className="absolute -top-4 -right-4 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute bottom-0 left-1/4 w-20 h-20 rounded-full bg-white/5 blur-xl" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <span className="text-violet-200 text-xs font-semibold uppercase tracking-widest">Learning Hub</span>
            <h2 className="text-white text-2xl font-bold mt-1">My Classrooms</h2>
            <p className="text-white/60 text-sm mt-1">
              {courses.length} course{courses.length !== 1 ? "s" : ""} enrolled
            </p>
          </div>
          <button
            onClick={() => setShowJoinModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-violet-700 rounded-xl font-bold text-sm shadow-lg hover:bg-violet-50 active:scale-95 transition-all duration-200"
          >
            <Plus size={17} /> Join Class
          </button>
        </div>
      </div>

      {/* Search */}
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-2xl"
        style={{
          background: dark ? "rgba(255,255,255,0.05)" : "#f9fafb",
          border: dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #e5e7eb",
        }}
      >
        <Search size={16} className="opacity-40 shrink-0" />
        <input
          type="text"
          placeholder="Search by name, code, teacher or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent outline-none text-sm placeholder-gray-400"
          style={{ color: dark ? "#e2e8f0" : "#111827" }}
        />
      </div>

      {/* Course grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center py-20">
            <div className="w-16 h-16 rounded-3xl bg-violet-50 flex items-center justify-center mx-auto mb-4">
              <GraduationCap size={28} className="text-violet-400" />
            </div>
            <p className={`text-base font-semibold ${dark ? "text-slate-300" : "text-gray-500"}`}>
              {search ? "No matching courses" : "No courses yet"}
            </p>
            <p className="text-sm opacity-40 mt-1">
              {search ? "Try a different search term" : "Join a class using a code from your instructor"}
            </p>
          </div>
        ) : (
          filtered.map((course) => (
            <CourseCard
              key={course.courseId}
              course={course}
              index={courses.findIndex((c) => c.courseId === course.courseId)}
              dark={dark}
              onClick={() => handleCourseClick(course)}
            />
          ))
        )}
      </div>

      {/* Join Modal */}
      {showJoinModal && (
        <Modal dark={dark} onClose={() => { setShowJoinModal(false); setClassCode(""); }}>
          <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-7 pt-8 pb-10 relative overflow-hidden">
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/10 blur-xl" />
            <button
              onClick={() => { setShowJoinModal(false); setClassCode(""); }}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X size={15} className="text-white" />
            </button>
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
              <GraduationCap size={24} className="text-white" />
            </div>
            <h3 className="text-white text-xl font-bold">Join a Classroom</h3>
            <p className="text-white/60 text-sm mt-1">Enter the code from your instructor</p>
          </div>
          <div className="px-7 py-6 -mt-4">
            <div
              className="rounded-2xl overflow-hidden mb-5"
              style={{
                background: dark ? "#0f172a" : "#f9fafb",
                border: dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #e5e7eb",
              }}
            >
              <input
                type="text"
                placeholder="e.g. COURSE-63071"
                value={classCode}
                onChange={(e) => setClassCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && handleJoinClass()}
                className="w-full px-5 py-4 bg-transparent text-center text-xl font-mono font-bold tracking-[0.2em] outline-none placeholder-gray-300"
                style={{ color: dark ? "#e2e8f0" : "#1e293b" }}
                autoFocus
              />
            </div>
            <button
              onClick={handleJoinClass}
              disabled={!classCode.trim() || loading}
              className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-2xl font-bold text-sm shadow-lg hover:from-violet-700 hover:to-indigo-700 active:scale-95 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? "Sending request..." : "Join Classroom"}
            </button>
            <button
              onClick={() => { setShowJoinModal(false); setClassCode(""); }}
              className={`w-full py-3 mt-2 rounded-2xl text-sm font-medium transition-colors ${dark ? "text-slate-400 hover:bg-white/5" : "text-gray-500 hover:bg-gray-50"}`}
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}

      {/* Success popup */}
      {popup === "success" && (
        <Modal dark={dark} onClose={() => setPopup(null)}>
          <div className="bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 px-7 pt-8 pb-12 relative overflow-hidden text-center">
            <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4 text-3xl">📨</div>
              <h3 className="text-white text-xl font-bold">Request Sent!</h3>
              <p className="text-white/70 text-sm mt-1">Waiting for teacher's approval</p>
            </div>
          </div>
          <div className="px-7 py-6 -mt-4">
            <div
              className="rounded-2xl p-4 mb-5 flex items-start gap-3"
              style={{
                background: dark ? "#0f172a" : "#f9fafb",
                border: dark ? "1px solid rgba(255,255,255,0.06)" : "1px solid #e5e7eb",
              }}
            >
              <div className="w-8 h-8 rounded-xl bg-yellow-100 flex items-center justify-center shrink-0 mt-0.5">
                <Lock size={14} className="text-yellow-600" />
              </div>
              <div>
                <p className={`text-sm font-semibold ${dark ? "text-slate-200" : "text-gray-800"}`}>
                  Course is temporarily locked
                </p>
                <p className={`text-xs mt-0.5 opacity-50 ${dark ? "text-slate-400" : "text-gray-500"}`}>
                  It will unlock automatically once your teacher approves
                </p>
              </div>
            </div>
            <button
              onClick={() => setPopup(null)}
              className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-2xl font-bold text-sm shadow-lg hover:from-violet-700 hover:to-indigo-700 active:scale-95 transition-all duration-200"
            >
              Got it!
            </button>
          </div>
        </Modal>
      )}

      {/* Duplicate popup */}
      {popup === "duplicate" && (
        <Modal dark={dark} onClose={() => setPopup(null)}>
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-7 pt-8 pb-10 relative overflow-hidden">
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/10 blur-xl" />
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-4 text-2xl">📚</div>
            <h3 className="text-white text-xl font-bold">Already Joined</h3>
            <p className="text-white/70 text-sm mt-1">You are already enrolled in this course!</p>
          </div>
          <div className="px-7 py-6 -mt-4">
            <p className={`text-sm opacity-60 mb-5 ${dark ? "text-slate-300" : "text-gray-600"}`}>
              No need to join again — head back to your classrooms to access it.
            </p>
            <button
              onClick={() => setPopup(null)}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-bold text-sm shadow-lg hover:from-amber-600 hover:to-orange-600 active:scale-95 transition-all duration-200"
            >
              Got it!
            </button>
          </div>
        </Modal>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.92) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.35s ease both; }
        .animate-popIn  { animation: popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both; }
      `}</style>
    </div>
  );
}


