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
const [status, setStatus] = useState("none");
const [myInstitute, setMyInstitute] = useState(null);

const fetchInstituteStatus = async () => {
  const student = JSON.parse(localStorage.getItem("student"));
  if (!student || !student._id) {
  console.log("Student ID missing");
  return;
}
const studentId = student?._id;

// ❌ STOP if no studentId
if (!studentId) {
  console.log("No studentId मिला → API call skip");
  return;
}

try {
  const res = await fetch(
    `https://institute-backend-0ncp.onrender.com/student/my-institute/${studentId}`
  );

  // ❌ अगर API fail हुई तो json मत पढ़ो
  if (!res.ok) {
    console.log("API error:", res.status);
    return;
  }

  const data = await res.json();

  if (data.request) {
    setStatus(data.request.status);
    setMyInstitute(data.institute || null);
  }

} catch (err) {
  console.log("Fetch error:", err);
}
};
useEffect(() => {
  fetchInstituteStatus();

  const interval = setInterval(fetchInstituteStatus, 5000);

  return () => clearInterval(interval);
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
        return (
          <Course dark={dark} instituteCourses={instituteCourses} />
        );

      case "Profile":
        return <Profile dark={dark} setActiveSection={setActiveSection} />;

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
    <div className={`flex h-screen ${dark ? "bg-slate-900" : "bg-white"}`}>
      
      <Sidebar
        sidebarOpen={sidebarOpen}
        dark={dark}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <div className="flex flex-1 flex-col">
        
        <Topbar
          dark={dark}
          toggleTheme={toggleTheme}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          setRightOpen={setRightOpen}
        />

       <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6 pt-16 sm:pt-6">
  {renderContent()}
</div>
      </div>

      {/* Right Panel */}
     <RightPanel
  dark={dark}
  rightOpen={rightOpen}
  setRightOpen={setRightOpen}
  setActiveSection={setActiveSection}
  status={status}
  myInstitute={myInstitute}
  fetchInstituteStatus={fetchInstituteStatus}
/>
    </div>
  );
}