import { useState } from "react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Navbar";
import RightPanel from "../components/RightSidebar";

import WelcomeCard from "../components/WelcomeCard";
import DashboardStats from "../components/DashboardStats";
import PerformanceChart from "../components/PerformanceChart";

import Profile from "../components/Profile";
import Settings from "./Settings";
// import Settings from "../components/Settings";

const Messages = () => <div>📩 Messages</div>;
const Notifications = () => <div>🔔 Notifications</div>;
const Schedule = () => <div>📅 Schedule</div>;
const Course = () => <div>📚 Course</div>;
const Help = () => <div>❓ Help</div>;

export default function Dashboard({ dark, toggleTheme }) {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Dashboard");

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
        return <Course />;

      case "Help":
        return <Help />;

      case "Setting":
  return <Settings dark={dark} />;

      default:
        return <div>Not Found</div>;
    }

  };

  return (

    <div
      className={`flex min-h-screen
      ${dark ? "bg-slate-900" : "bg-white"}
      `}
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

      <div className="flex flex-1 flex-col">

        {/* Topbar */}

        <Topbar
          dark={dark}
          toggleTheme={toggleTheme}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Main Content */}

        <div className="pt-20 lg:pt-5 px-4 sm:px-6 lg:px-8 space-y-6 w-full">

          {renderContent()}

        </div>

      </div>

      {/* Right Panel */}

      <RightPanel dark={dark} />

    </div>

  );

}