import { Menu, Sun, Moon } from "lucide-react";
import { PanelRight } from "lucide-react";
export default function Topbar({ dark, toggleTheme, sidebarOpen, setSidebarOpen }) {

  return (

    <div
      className={`
      fixed top-0 left-0 w-full z-50 lg:relative
      h-16 flex items-center justify-between px-6 border-b
      ${dark
        ? "bg-slate-850 border-slate-800 text-white"
        : "bg-white border-gray-200 text-black"}
      `}
    >

      <button onClick={() => setSidebarOpen(!sidebarOpen)}>
        <Menu size={22}/>
      </button>
      
      <button onClick={toggleTheme}>
        {dark ? <Sun size={20}/> : <Moon size={20}/>}
      </button>

    </div>

  );
}