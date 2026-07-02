import { Link, useLocation, useParams } from "react-router-dom"
import { LayoutGrid, Play, Clock, Key, BookOpen, Radio } from "lucide-react"

export default function Sidebar() {
  const location = useLocation()
  const params = useParams()

  // 1. Extract active project context from URL params or search query params
  const searchParams = new URLSearchParams(location.search)
  const projectId = params.projectId || searchParams.get("projectId")
  const runId = params.runId

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/"
    }
    return location.pathname.startsWith(path)
  }

  return (
    <aside className="w-64 border-r border-[#1f1f23] bg-[#0c0c0e] flex flex-col justify-between shrink-0 select-none">
      <div className="flex flex-col p-5 gap-7">
        
        {/* Logo Branding */}
        <div>
          <Link to="/" className="text-base font-extrabold tracking-wider text-indigo-400 font-mono flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-indigo-500 rounded-sm"></span>
            Spectre AI
          </Link>
          <p className="text-[10px] text-muted-foreground/60 font-mono mt-0.5">
            PixelMatch Engine <span className="ml-1.5 px-1 py-0.2 rounded bg-indigo-950/40 text-indigo-400 border border-indigo-900/30">v1.0.0</span>
          </p>
        </div>

        {/* SaaS Navigation Links */}
        <nav className="flex flex-col gap-1.5">
          <Link 
            to={projectId ? `/?projectId=${projectId}` : "/"} 
            className={`flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded transition-colors ${
              isActive("/") && !location.pathname.includes("/runs")
                ? "text-white bg-indigo-950/30 border border-indigo-500/20 shadow-sm" 
                : "text-muted-foreground hover:text-white"
            }`}
          >
            <LayoutGrid className="size-4 shrink-0 text-indigo-400" />
            Dashboard
          </Link>

          {/* Render Visual Debugger tab only if inside a run inspection report */}
          {projectId && runId && (
            <Link 
              to={`/runs/${runId}?projectId=${projectId}`} 
              className={`flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded transition-colors ${
                isActive("/runs") 
                  ? "text-white bg-indigo-950/30 border border-indigo-500/20 shadow-sm" 
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              <Play className="size-4 shrink-0 text-indigo-400" />
              Visual Debugger
            </Link>
          )}

          {/* Render Stability Analytics only if a project is selected */}
      
          {/* Render Developer Settings only if a project is selected */}
          
            <Link 
              to={`/projects/${projectId}/settings`} 
              className={`flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded transition-colors ${
                isActive(`/projects/${projectId}/settings`) 
                  ? "text-white bg-indigo-950/30 border border-indigo-500/20 shadow-sm" 
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              <Key className="size-4 shrink-0 text-indigo-400" />
              Developer Settings
            </Link>
        
        </nav>
      </div>

      {/* Footer Sidebar Info */}
      <div className="p-4 border-t border-[#1f1f23]/60 flex flex-col gap-2.5">
        <Link to="/docs" className="flex items-center gap-3 px-1 py-0.5 text-xs font-semibold text-muted-foreground hover:text-white transition-colors">
          <BookOpen className="size-4 shrink-0" />
          Docs
        </Link>
      </div>
    </aside>
  )
}