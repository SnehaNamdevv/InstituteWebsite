import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  MessageCircle,
  Bell,
  CalendarCheck,
  BookOpen,
  HelpCircle,
  Settings,
  LogOut
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function Sidebar({ sidebarOpen, dark, activeSection, setActiveSection, instituteName = "Your Institute" }) {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("student");
    navigate("/login");
  };
  const [institute, setInstitute] = useState(null);
const [status, setStatus] = useState("none"); // none | pending | approved

useEffect(() => {
  const fetchInstituteStatus = async () => {
    try {
      const res = await fetch(
        `https://institute-backend-0ncp.onrender.com/student/my-institute/${localStorage.getItem("studentId")}`
      );

      const data = await res.json();

      if (data.request) {
        setStatus(data.request.status); // pending / approved
        setInstitute(data.institute || null);
      }

    } catch (err) {
      console.log(err);
    }
  };

  fetchInstituteStatus();

  // 🔥 AUTO REFRESH EVERY 5 SEC (REAL-TIME FEEL)
  const interval = setInterval(fetchInstituteStatus, 5000);

  return () => clearInterval(interval);

}, []);

  const menu = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Messages", icon: MessageCircle },
    { name: "Notification", icon: Bell },
    { name: "Schedule", icon: CalendarCheck },
    { name: "Course", icon: BookOpen },
    { name: "Help", icon: HelpCircle },
    { name: "Setting", icon: Settings }
  ];

  return (
    <div
      className={`
        fixed lg:relative top-16 lg:top-0 z-40
        h-[calc(100vh-4rem)] lg:h-screen
        transition-all duration-300
        ${sidebarOpen ? "w-64" : "w-0 lg:w-0"}
        border-r overflow-hidden
        ${dark
          ? "bg-[#0f172a] text-gray-300 border-slate-800"
          : "bg-white text-gray-700 border-gray-200"}
        flex flex-col justify-between
      `}
    >
      <div>
        <div className="px-6 py-6 text-lg font-semibold">
          Classroom
        </div>

        <nav className="space-y-2 px-3">
          {menu.map((item, i) => {
            const Icon = item.icon;
            const active = activeSection === item.name;

            return (
              <div
                key={i}
                onClick={() => setActiveSection(item.name)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer
                  ${dark ? "hover:bg-slate-800" : "hover:bg-gray-100"}
                  ${active ? (dark ? "bg-slate-700" : "bg-gray-200") : ""}
                `}
              >
                <Icon size={20} />
                <span className="text-sm font-medium">{item.name}</span>
              </div>
            );
          })}
        </nav>
      </div>

      <div className="p-4 space-y-3">

       <div className="bg-gradient-to-r from-pink-500 to-yellow-400 text-white rounded-xl p-4 text-center">
  <div className="text-xs font-medium opacity-80 mb-1">🎓 Institute</div>

  <div className="text-sm font-bold leading-snug">
    {status === "approved"
      ? institute?.name
      : status === "pending"
      ? "Approval Pending ⏳"
      : "Not Joined"}
  </div>
</div>

        <div
          onClick={handleLogout}
          className={`
            flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer
            ${dark ? "hover:bg-red-900" : "hover:bg-red-100"}
          `}
        >
          <LogOut size={20} />
          <span className="text-sm font-medium">Logout</span>
        </div>

      </div>
    </div>
  );
}