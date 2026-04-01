import React, { useState, useEffect, useRef } from 'react';
import { Plus, BookOpen, X, ChevronLeft, FileText, Video, Link as LinkIcon, Search, Clock, Users, GraduationCap, ChevronRight, Lock } from "lucide-react";

const COURSE_THEMES = [
  { bg: "from-violet-600 via-purple-600 to-indigo-700", accent: "#7c3aed", light: "#ede9fe", text: "#5b21b6", dot: "bg-violet-400" },
  { bg: "from-rose-500 via-pink-600 to-red-700",        accent: "#e11d48", light: "#ffe4e6", text: "#9f1239", dot: "bg-rose-400" },
  { bg: "from-amber-500 via-orange-500 to-red-500",     accent: "#f59e0b", light: "#fef3c7", text: "#92400e", dot: "bg-amber-400" },
  { bg: "from-emerald-500 via-teal-500 to-cyan-600",    accent: "#10b981", light: "#d1fae5", text: "#065f46", dot: "bg-emerald-400" },
  { bg: "from-blue-500 via-cyan-500 to-teal-600",       accent: "#3b82f6", light: "#dbeafe", text: "#1e3a8a", dot: "bg-blue-400" },
  { bg: "from-fuchsia-600 via-pink-600 to-rose-500",    accent: "#c026d3", light: "#fae8ff", text: "#701a75", dot: "bg-fuchsia-400" },
];

const STATUS_CONFIG = {
  active:   { label: "Active",   color: "bg-emerald-100 text-emerald-700 border border-emerald-200" },
  upcoming: { label: "Upcoming", color: "bg-blue-100 text-blue-700 border border-blue-200" },
  archived: { label: "Archived", color: "bg-gray-100 text-gray-600 border border-gray-200" },
  pending:  { label: "Pending",  color: "bg-yellow-100 text-yellow-700 border border-yellow-200" },
  approved: { label: "Approved", color: "bg-emerald-100 text-emerald-700 border border-emerald-200" },
};

// ✅ FIX 1: getInitials — safely handle non-string values
const getInitials = (val = "") => {
  // val could be a React element, object, undefined — convert safely
  const name = typeof val === "string" ? val : "";
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

const TOPIC_ICON_CONFIG = {
  Video:      { icon: Video,     bg: "bg-red-50",     color: "text-red-500",     label: "Video Lecture" },
  Assignment: { icon: FileText,  bg: "bg-emerald-50", color: "text-emerald-600", label: "Assignment" },
  Link:       { icon: LinkIcon,  bg: "bg-blue-50",    color: "text-blue-500",    label: "Resource" },
  Subject:    { icon: BookOpen,  bg: "bg-violet-50",  color: "text-violet-500",  label: "Subject" },
};

/* ─────────────────────────────────────────
   SUCCESS POPUP
───────────────────────────────────────── */
function SuccessPopup({ dark, onClose }) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[80] p-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(10px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl animate-popIn"
        style={{ background: dark ? "#1e293b" : "#fff" }}
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 px-7 pt-8 pb-12 relative overflow-hidden text-center">
          <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute bottom-0 left-1/4 w-20 h-20 rounded-full bg-white/10 blur-xl" />
          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📨</span>
            </div>
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
                Course will unlock automatically once your teacher approves ⏳
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-2xl font-bold text-sm shadow-lg hover:from-violet-700 hover:to-indigo-700 active:scale-95 transition-all duration-200"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   LOCKED OVERLAY
───────────────────────────────────────── */
function LockedOverlay({ dark }) {
  return (
    <div
      className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-2xl gap-2"
      style={{
        background: dark ? "rgba(15,23,42,0.82)" : "rgba(255,255,255,0.82)",
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
        Teacher hasn't approved yet
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────
   TOPIC ROW
───────────────────────────────────────── */
function TopicRow({ topic, index, dark }) {
  const cfg = TOPIC_ICON_CONFIG[topic.type] || TOPIC_ICON_CONFIG.Subject;
  const Icon = cfg.icon;
  return (
    <div
      className="group flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.01]"
      style={{
        background: dark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.9)",
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
        <p className={`font-semibold text-sm truncate transition-colors duration-200 group-hover:text-violet-500 ${dark ? "text-white" : "text-gray-800"}`}>
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

/* ─────────────────────────────────────────
   COURSE CARD
───────────────────────────────────────── */
function CourseCard({ course, index, dark, onClick }) {
  const theme = COURSE_THEMES[index % COURSE_THEMES.length];

  // ✅ FIX 2: classTeacher could be an object from backend populate()
  // safely extract string from it
  const teacherName =
    typeof course.classTeacher === "string"
      ? course.classTeacher
      : course.classTeacher?.fullName ||
        course.classTeacher?.name ||
        course.instructor ||
        "";

  const initials = getInitials(teacherName);
  const status   = course.status || "active";
  const statusCfg = STATUS_CONFIG[status] || STATUS_CONFIG.active;
  const isPending = status === "pending";

  return (
    <div
      onClick={isPending ? undefined : onClick}
      className={`group rounded-2xl overflow-hidden transition-all duration-400 relative ${
        isPending
          ? "cursor-not-allowed opacity-90"
          : "cursor-pointer hover:-translate-y-1 hover:shadow-2xl"
      }`}
      style={{
        background: dark ? "rgba(255,255,255,0.05)" : "#fff",
        border: dark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.07)",
        boxShadow: dark ? "0 4px 24px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.06)",
      }}
    >
      {isPending && <LockedOverlay dark={dark} />}

      {/* Banner */}
      <div className={`relative h-32 bg-gradient-to-br ${theme.bg} p-5 overflow-hidden`}>
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10 blur-xl" />
        <div className="absolute bottom-0 left-1/3 w-16 h-16 rounded-full bg-white/10 blur-lg" />
        <div className="relative z-10 pr-14">
          <p className="text-white/60 text-[10px] font-semibold uppercase tracking-widest mb-1">
            {course.courseId}
          </p>
          <h3 className="text-white font-bold text-base leading-tight line-clamp-2">
            {course.name}
          </h3>
        </div>
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

      {/* Body */}
      <div className="px-5 pt-8 pb-5">
        <p className={`font-semibold text-sm ${dark ? "text-slate-200" : "text-gray-800"}`}>
          {teacherName || <span className="opacity-40">Teacher</span>}
        </p>
        {course.department && (
          <p className="text-xs opacity-40 mt-0.5">{course.department}</p>
        )}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${theme.dot}`} />
            <span className={`text-xs font-medium opacity-60 ${dark ? "text-slate-300" : "text-gray-600"}`}>
              {course.subjects?.length || 0} topics
            </span>
          </div>
          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${statusCfg.color}`}>
            {statusCfg.label}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   DEDUPLICATE helper
───────────────────────────────────────── */
// ✅ FIX 3: Remove duplicate courseIds, keep last occurrence (latest data)
function deduplicateCourses(list) {
  const map = new Map();
  list.forEach(c => map.set(c.courseId, c));
  return Array.from(map.values());
}

/* ─────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────── */
export default function Courses({ dark = false, instituteCourses = [] }) {
  const [showJoinModal, setShowJoinModal]           = useState(false);
  const [classCode, setClassCode]                   = useState("");
  const [selectedCourse, setSelectedCourse]         = useState(null);
  const [courses, setCourses]                       = useState([]);
  const [search, setSearch]                         = useState("");
  const [loading, setLoading]                       = useState(false);
  const [showDuplicatePopup, setShowDuplicatePopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup]     = useState(false);

  // ✅ Ref so polling always reads latest courses (avoids stale closure)
  const coursesRef = useRef(courses);
  useEffect(() => { coursesRef.current = courses; }, [courses]);

  // ── Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("courses");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCourses(deduplicateCourses(parsed)); // ✅ deduplicate on load
      } catch { /* ignore */ }
    }
  }, []);

  // ── If parent passes instituteCourses, merge + deduplicate
  useEffect(() => {
    if (instituteCourses?.length) {
      setCourses(prev => deduplicateCourses([...prev, ...instituteCourses]));
    }
  }, [instituteCourses]);

  // ── Polling every 8s: check if pending course got approved
  useEffect(() => {
    const interval = setInterval(async () => {
      const current = coursesRef.current;
      const hasPending = current.some(c => c.status === "pending");
      if (!hasPending) return;

      try {
        const student = JSON.parse(localStorage.getItem("student"));
        const studentId = student?.studentID;
        if (!studentId) return;

        // ✅ Correct backend API
        const res = await fetch(
          `https://institute-backend-0ncp.onrender.com/student/myCourse/${studentId}`
        );
        const data = await res.json();
        console.log("Polling response:", data);

        if (data.success && data.course) {
          const approvedCourseId = data.course.courseId;

          const updatedCourses = current.map(c =>
            c.courseId === approvedCourseId && c.status === "pending"
              ? { ...c, ...data.course, status: "active" }
              : c
          );

          const changed = updatedCourses.some(updated => {
  const old = current.find(c => c.courseId === updated.courseId);
  return old && old.status !== updated.status;
});
console.log("Frontend IDs:", current.map(c => c.courseId));
console.log("Backend ID:", approvedCourseId);
          if (changed) {
            const deduped = deduplicateCourses(updatedCourses);
            setCourses(deduped);
            localStorage.setItem("courses", JSON.stringify(deduped));
          }
        }
      } catch (err) {
        console.log("Polling error:", err);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // ── Safe setter — always deduplicate before saving
  const saveCourses = (list) => {
    const deduped = deduplicateCourses(list);
    setCourses(deduped);
    localStorage.setItem("courses", JSON.stringify(deduped));
  };

  const filtered = courses.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.courseId?.toLowerCase().includes(search.toLowerCase()) ||
    c.instructor?.toLowerCase().includes(search.toLowerCase())
  );

  // ── Join Class Handler
  const handleJoinClass = async () => {
    if (classCode.length < 3) return;
    setLoading(true);

    try {
      const student     = JSON.parse(localStorage.getItem("student"));
      const studentId   = student?.studentID;
      const studentName = student?.fullName || "";

      if (!studentId) {
        alert("Please login again");
        setLoading(false);
        return;
      }

      const res = await fetch(
        "https://institute-backend-0ncp.onrender.com/student/apply-course",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            courseId:  classCode,
            studentId: studentId,
            name:      studentName,
          }),
        }
      );

      const data = await res.json();
      console.log("Apply response:", data);

      if (data.message === "Request sent to teacher") {
        setShowJoinModal(false);
        setClassCode("");
        setShowSuccessPopup(true);

        const existing = JSON.parse(localStorage.getItem("courses")) || [];
        const alreadyExists = existing.find(c => c.courseId === classCode);

        if (!alreadyExists) {
          saveCourses([...existing, {
            courseId: classCode,
            name:     classCode,
            status:   "pending",
            subjects: [],
          }]);
        }

      } else if (
        data.message?.toLowerCase().includes("already") ||
        data.message === "Already applied"
      ) {
        setShowJoinModal(false);
        setClassCode("");
        setShowDuplicatePopup(true);

      } else {
        alert(data.message || "Something went wrong");
        setShowJoinModal(false);
        setClassCode("");
      }

    } catch (err) {
      console.log(err);
      alert("Server error. Please try again.");
    }

    setLoading(false);
  };

  // ── Course Detail Click
  const handleCourseClick = async (course) => {
    if (course.status === "pending") return;
    try {
      const res = await fetch(
        `https://institute-backend-0ncp.onrender.com/api/courses/course/${encodeURIComponent(course.courseId)}`
      );
      const data = await res.json();
      if (data.success && data.course) {
        const topics = data.course.subjects?.map((subj, idx) => ({
          id: idx, title: subj, type: "Subject", date: "N/A",
        })) || [];
        setSelectedCourse({ ...data.course, topics });
      }
    } catch (err) {
      console.log("Error:", err);
    }
  };

  const theme = selectedCourse
    ? COURSE_THEMES[courses.findIndex(c => c.courseId === selectedCourse.courseId) % COURSE_THEMES.length]
    : null;

  // ══════════════════════════════════════
  // DETAIL VIEW
  // ══════════════════════════════════════
  if (selectedCourse) {
    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="rounded-3xl overflow-hidden shadow-xl relative"
          style={{ background: dark ? "#1e293b" : "#fff" }}>
          <div className={`bg-gradient-to-br ${theme.bg} px-6 pt-6 pb-16 relative overflow-hidden`}>
            <div className="absolute -bottom-8 -right-8 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
            <button
              onClick={() => setSelectedCourse(null)}
              className="relative z-10 flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium mb-5 transition-colors"
            >
              <ChevronLeft size={18} />
              Back to Courses
            </button>
            <div className="relative z-10">
              <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">
                {selectedCourse.courseId}
              </p>
              <h2 className="text-white text-2xl font-bold leading-tight mb-2">
                {selectedCourse.name}
              </h2>
              <p className="text-white/70 text-sm">{selectedCourse.instructor || "Instructor"}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 divide-x divide-gray-100 -mt-6 mx-6 rounded-2xl overflow-hidden shadow-lg z-10 relative"
            style={{ background: dark ? "#0f172a" : "#fff" }}>
            {[
              { icon: BookOpen, label: "Topics",   value: selectedCourse.topics?.length || 0 },
              { icon: Clock,    label: "Hours",    value: "—" },
              { icon: Users,    label: "Students", value: "—" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex flex-col items-center py-4 gap-1">
                <Icon size={16} className="text-violet-500 opacity-70" />
                <span className={`text-lg font-bold ${dark ? "text-white" : "text-gray-800"}`}>{value}</span>
                <span className={`text-[11px] uppercase tracking-wide opacity-40 ${dark ? "text-slate-300" : "text-gray-600"}`}>
                  {label}
                </span>
              </div>
            ))}
          </div>
          <div className="h-6" />
        </div>

        <div>
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className={`text-base font-bold ${dark ? "text-slate-200" : "text-gray-700"}`}>
              Course Content
            </h3>
            <span className={`text-xs font-semibold opacity-50 ${dark ? "text-slate-300" : "text-gray-500"}`}>
              {selectedCourse.topics?.length} items
            </span>
          </div>
          <div className="space-y-2">
            {selectedCourse.topics?.length > 0
              ? selectedCourse.topics.map((topic, i) => (
                  <TopicRow key={`topic-${i}`} topic={topic} index={i} dark={dark} />
                ))
              : (
                <div className="text-center py-16 opacity-40">
                  <BookOpen size={36} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No topics added yet</p>
                </div>
              )
            }
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════
  // MAIN GRID VIEW
  // ══════════════════════════════════════
  return (
    <div className="space-y-7">

      {/* Hero bar */}
      <div
        className="rounded-3xl p-6 relative overflow-hidden"
        style={{
          background: dark
            ? "linear-gradient(135deg, #312e81 0%, #1e1b4b 100%)"
            : "linear-gradient(135deg, #6d28d9 0%, #4f46e5 100%)",
        }}
      >
        <div className="absolute -top-4 -right-4 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute bottom-0 left-1/4 w-20 h-20 rounded-full bg-white/5 blur-xl" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <span className="text-violet-200 text-xs font-semibold uppercase tracking-widest">
              Learning Hub
            </span>
            <h2 className="text-white text-2xl font-bold mt-1">My Classrooms</h2>
            <p className="text-white/60 text-sm mt-1">
              {courses.length} course{courses.length !== 1 ? "s" : ""} enrolled
            </p>
          </div>
          <button
            onClick={() => setShowJoinModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-violet-700 rounded-xl font-bold text-sm shadow-lg hover:bg-violet-50 active:scale-95 transition-all duration-200"
          >
            <Plus size={17} />
            <span>Join Class</span>
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
          placeholder="Search by course name, code, or instructor…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-transparent outline-none text-sm placeholder-gray-400"
          style={{ color: dark ? "#e2e8f0" : "#111827" }}
        />
      </div>

      {/* Grid */}
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
              {search
                ? "Try a different search term"
                : "Join a class using a code from your instructor"}
            </p>
          </div>
        ) : (
          // ✅ FIX 4: key uses courseId + index combo — guaranteed unique
          filtered.map((course, i) => (
            <CourseCard
              key={`${course.courseId}-${i}`}
              course={course}
              index={i}
              dark={dark}
              onClick={() => handleCourseClick(course)}
            />
          ))
        )}
      </div>

      {/* ── Join Modal ─────────────────────── */}
      {showJoinModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-[70] p-4"
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}
          onClick={() => setShowJoinModal(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl animate-fadeIn"
            style={{ background: dark ? "#1e293b" : "#fff" }}
            onClick={e => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-7 pt-8 pb-10 relative overflow-hidden">
              <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/10 blur-xl" />
              <button
                onClick={() => setShowJoinModal(false)}
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
                  placeholder="e.g. ABC-123"
                  value={classCode}
                  onChange={e => setClassCode(e.target.value.toUpperCase())}
                  className="w-full px-5 py-4 bg-transparent text-center text-2xl font-mono font-bold tracking-[0.3em] outline-none placeholder-gray-300"
                  style={{ color: dark ? "#e2e8f0" : "#1e293b" }}
                  onKeyDown={e => e.key === "Enter" && handleJoinClass()}
                />
              </div>
              <button
                onClick={handleJoinClass}
                disabled={!classCode || loading}
                className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-2xl font-bold text-sm shadow-lg hover:from-violet-700 hover:to-indigo-700 active:scale-95 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? "Joining…" : "Join Classroom"}
              </button>
              <button
                onClick={() => setShowJoinModal(false)}
                className={`w-full py-3 mt-2 rounded-2xl text-sm font-medium transition-colors ${
                  dark ? "text-slate-400 hover:bg-white/5" : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Success Popup ──────────────────── */}
      {showSuccessPopup && (
        <SuccessPopup dark={dark} onClose={() => setShowSuccessPopup(false)} />
      )}

      {/* ── Duplicate Popup ────────────────── */}
      {showDuplicatePopup && (
        <div
          className="fixed inset-0 flex items-center justify-center z-[80] p-4"
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}
          onClick={() => setShowDuplicatePopup(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl animate-fadeIn"
            style={{ background: dark ? "#1e293b" : "#fff" }}
            onClick={e => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-7 pt-8 pb-10 relative overflow-hidden">
              <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/10 blur-xl" />
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-white text-xl font-bold">Already Joined</h3>
              <p className="text-white/70 text-sm mt-1">You're already enrolled in this course!</p>
            </div>
            <div className="px-7 py-6 -mt-4">
              <p className={`text-sm opacity-60 mb-5 ${dark ? "text-slate-300" : "text-gray-600"}`}>
                No need to join again — head back to your classrooms to access it.
              </p>
              <button
                onClick={() => setShowDuplicatePopup(false)}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-bold text-sm shadow-lg hover:from-amber-600 hover:to-orange-600 active:scale-95 transition-all duration-200"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
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
        .animate-popIn  { animation: popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
      `}</style>
    </div>
  );
}