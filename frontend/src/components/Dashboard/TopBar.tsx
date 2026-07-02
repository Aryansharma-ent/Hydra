import { ChevronRight, Folder } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

export default function TopBar() {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const projectId = searchParams.get("projectId")

  return (
    <header className="h-14 border-b border-[#1f1f23] flex items-center justify-between px-6 bg-[#09090b] shrink-0 select-none">
      
      {/* Dynamic Workspace Breadcrumbs */}
      <div className="flex items-center gap-2 font-mono text-[11px] font-medium tracking-wide">
        <Link to="/" className="text-muted-foreground hover:text-indigo-400 transition-colors flex items-center gap-1.5">
          <Folder className="size-3 text-indigo-400" />
          Workspace
        </Link>
        <ChevronRight className="size-3 text-muted-foreground/30" />
        <span className="text-white uppercase font-semibold">
          {projectId ? "Project Console" : "Project Registry"}
        </span>
      </div>

      {/* User Avatar only */}
      <div className="flex items-center gap-4">
        <div className="w-6 h-6 rounded-full bg-indigo-950 border border-indigo-500/30 flex items-center justify-center text-[10px] font-bold text-indigo-400 shrink-0">
          A
        </div>
      </div>

    </header>
  )
}