import { ChevronRight, LayoutGrid, Settings, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function TopBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const projectId = searchParams.get("projectId");

  // Retrieve user name saved during login/signup (or fallback to 'User')
  const user = JSON.parse(localStorage.getItem("hydra_user") || "{}");
  const userInitial = user.name ? user.name.charAt(0).toUpperCase() : "U";

  const handleLogout = () => {
    localStorage.removeItem("hydra_token");
    localStorage.removeItem("hydra_user");
    navigate("/login", { replace: true });
  };

  return (
    <header className="h-11 border-b border-[#1f1f23] flex items-center justify-between px-5 bg-[#0a0a0b] shrink-0 select-none">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-[11px] text-[#525252]">
        <Link
          to="/dashboard"
          className="flex items-center gap-1.5 hover:text-[#a1a1aa] transition-colors duration-150"
        >
          <LayoutGrid className="size-3" />
          <span>Workspace</span>
        </Link>
        <ChevronRight className="size-3 text-[#2e2e32]" />
        <span className="text-[#a1a1aa] font-medium">
          {projectId ? "Project Console" : "Project Registry"}
        </span>
      </div>

      {/* Right: Settings + User Avatar + Logout */}
      <div className="flex items-center gap-3">
        <Link
          to="/settings"
          className="p-1.5 text-[#525252] hover:text-[#a1a1aa] hover:bg-[#141416] rounded transition-all duration-150"
          title="Settings"
        >
          <Settings className="size-3.5" />
        </Link>

        {/* User Initial Avatar */}
        <div 
          className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center text-[9px] font-bold text-white tracking-wide shrink-0 ring-1 ring-white/10"
          title={user.email || "User"}
        >
          {userInitial}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="p-1.5 text-[#525252] hover:text-red-400 hover:bg-[#141416] rounded transition-all duration-150 cursor-pointer"
          title="Log Out"
        >
          <LogOut className="size-3.5" />
        </button>
      </div>
    </header>
  );
}