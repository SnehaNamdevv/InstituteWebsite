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

export default function Sidebar({ sidebarOpen, dark, activeSection, setActiveSection }) {

  const examDate = new Date();
  examDate.setDate(examDate.getDate() + 4);

  const [timeLeft, setTimeLeft] = useState("");
const navigate = useNavigate();
const handleLogout = () => {

  localStorage.removeItem("auth");
  localStorage.removeItem("student");

  navigate("/login"); // redirect to login page

};
  useEffect(() => {

    const timer = setInterval(() => {

      const now = new Date();
      const diff = examDate - now;

      if (diff <= 0) {
        setTimeLeft("Exam Started");
        clearInterval(timer);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);

    }, 1000);

    return () => clearInterval(timer);

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

                <span className="text-sm font-medium">
                  {item.name}
                </span>
                  
              </div>

            );

          })}

        </nav>

      </div>

      <div className="p-4 space-y-3">

  <div className="bg-gradient-to-r from-pink-500 to-yellow-400 text-white text-sm rounded-xl p-4 text-center font-medium">
    ⏳ Next Exam in <br/>
    {timeLeft}
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