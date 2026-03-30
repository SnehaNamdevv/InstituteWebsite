import { useState , useEffect } from "react";

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

      case "Profile":
        return (
          <Profile
            dark={dark}
            setActiveSection={setActiveSection}
          />
        );

      case "Messages":
        return <Messages />;

      case "Notification":
        return <Notifications />;

      case "Schedule":
        return <Schedule />;

      case "Course":
  return <Course dark={dark} instituteCourses={instituteCourses} />;

      case "Help":
        return <Help dark={dark} />;

      case "Setting":
        return (
          <Settings
            dark={dark}
            setActiveSection={setActiveSection}
          />
        );
       

      case "StudentPortfolio":
        return <StudentPortfolioCenter dark={dark} />;

      default:
        return <div>Not Found</div>;
    }
  };

  return (
    <div
      className={`flex h-screen overflow-hidden ${
        dark ? "bg-slate-900" : "bg-white"
      }`}
    >
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        dark={dark}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 lg:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Section */}
      <div className="flex flex-1 flex-col h-full overflow-hidden">
        
        {/* Topbar */}
        <Topbar
  dark={dark}
  toggleTheme={toggleTheme}
  sidebarOpen={sidebarOpen}
  setSidebarOpen={setSidebarOpen}
  setRightOpen={setRightOpen}   // ✅ ADD THIS
/>

        {/* Scrollable Content (Scrollbar Hidden) */}
        <div className="flex-1 overflow-y-auto scroll-smooth no-scrollbar pt-20 lg:pt-5 px-4 sm:px-6 lg:px-8 space-y-6">
          {renderContent()}
        </div>

      </div>

      {/* Right Panel */}
 {rightOpen && (
  <div
    className="fixed inset-0 bg-black/50 backdrop-blur-sm xl:hidden z-[60]"
    onClick={() => setRightOpen(false)}
  />
)}
<RightPanel 
  dark={dark} 
  rightOpen={rightOpen} 
  setRightOpen={setRightOpen}
  setInstituteCourses={setInstituteCourses}   // ✅ ADD THIS
  setActiveSection={setActiveSection}         // ✅ ADD THIS
/>
    </div>
  );
}