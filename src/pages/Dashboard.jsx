import { useState, useEffect } from "react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Navbar";
import RightPanel from "../components/RightSidebar";

import WelcomeCard from "../components/WelcomeCard";
import DashboardStats from "../components/DashboardStats";
import PerformanceChart from "../components/PerformanceChart";
import Help from "./Help";
import Profile from "../components/Profile";
import Settings from "./Settings";
import StudentPortfolioCenter from "./StudentPortfolio";
import Course from "./Course";

const Messages = () => <div>📩 Messages</div>;
const Notifications = () => <div>🔔 Notifications</div>;
const Schedule = () => <div>📅 Schedule</div>;

export default function Dashboard({ dark, toggleTheme }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [rightOpen, setRightOpen] = useState(false);

  const [instituteCourses, setInstituteCourses] = useState([]);

  // ✅ LOAD COURSES ON RELOAD
  useEffect(() => {
    const savedCourses = localStorage.getItem("courses");
    if (savedCourses) {
      setInstituteCourses(JSON.parse(savedCourses));
    }
  }, []);

  const renderContent = () => {
    switch (activeSection) {
      case "Dashboard":
        return (
          <>
            <WelcomeCard setActiveSection={setActiveSection} />
            <DashboardStats dark={dark} />
            <PerformanceChart dark={dark} />
          </>
        );

      case "Course":
        return <Course dark={dark} instituteCourses={instituteCourses} />;

      case "Profile":
        return <Profile dark={dark} />;

      case "Messages":
        return <Messages />;

      case "Notification":
        return <Notifications />;

      case "Schedule":
        return <Schedule />;

      case "Help":
        return <Help dark={dark} />;

      case "Setting":
        return <Settings dark={dark} />;

      case "StudentPortfolio":
        return <StudentPortfolioCenter dark={dark} />;

      default:
        return <div>Not Found</div>;
    }
  };

  return (
    <div className={`h-screen flex overflow-hidden ${dark ? "bg-slate-900" : "bg-gray-50"}`}>

      {/* LEFT SIDEBAR */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        dark={dark}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* MAIN SECTION */}
      <div className="flex flex-col flex-1">

        {/* TOPBAR */}
        <Topbar
          dark={dark}
          toggleTheme={toggleTheme}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          setRightOpen={setRightOpen}
        />

        {/* CONTENT AREA */}
        <div className="flex flex-1 overflow-hidden">

          {/* CENTER CONTENT */}
         <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6 scroll-smooth mt-16 xl:mt-0">
  {renderContent()}
</div>

          {/* RIGHT PANEL (DESKTOP FIXED WIDTH) */}
          <div className="hidden xl:block w-80 border-l">
            <RightPanel
              dark={dark}
              rightOpen={true}   // always visible on desktop
              setRightOpen={setRightOpen}
              setInstituteCourses={setInstituteCourses}
              setActiveSection={setActiveSection}
            />
          </div>

        </div>
      </div>

      {/* MOBILE RIGHT PANEL OVERLAY */}
      {rightOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40 xl:hidden"
            onClick={() => setRightOpen(false)}
          />

          <div className="fixed right-0 top-0 h-full w-80 z-50 xl:hidden">
            <RightPanel
              dark={dark}
              rightOpen={rightOpen}
              setRightOpen={setRightOpen}
              setInstituteCourses={setInstituteCourses}
              setActiveSection={setActiveSection}
            />
          </div>
        </>
      )}
    </div>
  );
}