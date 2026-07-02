import { Settings, HelpCircle, ChevronRight, LayoutGrid } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

export default function DebuggerHeader() {
  const location = useLocation()

  // Grab the project context from query params if available
  const searchParams = new URLSearchParams(location.search)
  const projectId = searchParams.get("projectId")

  return (
    <header className="h-14 border-b border-[#1f1f23] flex items-center justify-between px-6 bg-[#09090b] shrink-0 select-none">
      
      {/* Premium Breadcrumb trail */}
      <div className="flex items-center gap-2 font-mono text-[11px] font-medium tracking-wide">
        <Link to="/" className="text-muted-foreground hover:text-indigo-400 transition-colors flex items-center gap-1.5">
          <LayoutGrid className="size-3 text-indigo-400" />
          Projects
        </Link>
        <ChevronRight className="size-3 text-muted-foreground/30" />
        <Link to={projectId ? `/?projectId=${projectId}` : "/"} className="text-muted-foreground hover:text-indigo-400 transition-colors uppercase">
          Active Workspace
        </Link>
        <ChevronRight className="size-3 text-muted-foreground/30" />
        <span className="text-white font-semibold">
          Visual Debugger
        </span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        <Link to={projectId ? `/projects/${projectId}/settings` : "/settings"} className="text-muted-foreground hover:text-white transition-colors">
          <Settings className="size-4" />
        </Link>
        <div className="w-6 h-6 rounded-full bg-indigo-950 border border-indigo-500/30 flex items-center justify-center text-[10px] font-bold text-indigo-400 shrink-0">
          A
        </div>
      </div>

    </header>
  )
}