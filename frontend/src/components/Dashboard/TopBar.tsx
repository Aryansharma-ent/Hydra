import { ChevronRight, LayoutGrid } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import UserMenu from "@/components/UserMenu";

export default function TopBar() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const projectId = searchParams.get("projectId");

  return (
    <header className="h-11 border-b border-[#1f1f23] flex items-center justify-between px-5 bg-[#0a0a0b] shrink-0 select-none">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-[11px] text-[#525252]">
        <Link
          to="/dashboard"
          className="flex items-center gap-1.5 hover:text-[#a1a1aa] transition-colors duration-150"
        >
          <LayoutGrid className="size-3 text-violet-400" />
          <span className="font-semibold text-white">Workspace</span>
        </Link>
        <ChevronRight className="size-3 text-[#2e2e32]" />
        <span className="text-[#a1a1aa] font-medium">
          {projectId ? "Project Console" : "Project Registry"}
        </span>
      </div>

      {/* Right: User Menu */}
      <div className="flex items-center gap-3">
        <UserMenu />
      </div>
    </header>
  );
}