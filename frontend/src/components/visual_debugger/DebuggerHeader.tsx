import { ChevronRight, LayoutGrid, Settings, GitBranch } from "lucide-react"
import { Link, useLocation, useParams } from "react-router-dom"

export default function DebuggerHeader() {
  const location = useLocation()
  const { runId } = useParams<{ runId: string }>()

  const searchParams = new URLSearchParams(location.search)
  const projectId = searchParams.get("projectId")

  // Format run ID for display
  const shortRunId = runId ? runId.substring(0, 12) + "…" : "—"

  return (
    <header className="h-11 border-b border-[#1f1f23]/60 flex items-center justify-between px-5 backdrop-blur-sm bg-[#0a0a0b]/80 shrink-0 select-none">

      {/* Left: Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-[11px] text-[#525252]">
        <Link
          to="/dashboard"
          className="flex items-center gap-1.5 hover:text-[#a1a1aa] transition-colors duration-150"
        >
          <LayoutGrid className="size-3" />
          <span>Projects</span>
        </Link>

        <ChevronRight className="size-3 text-[#2e2e32]" />

        <Link
          to={projectId ? `/dashboard/?projectId=${projectId}` : "/dashboard"}
          className="hover:text-[#a1a1aa] transition-colors duration-150 flex items-center gap-1.5"
        >
          <GitBranch className="size-3" />
          <span>Active Workspace</span>
        </Link>

        <ChevronRight className="size-3 text-[#2e2e32]" />

        <span className="text-[#c9d1d9] font-semibold">Visual Debugger</span>

        {runId && (
          <>
            <ChevronRight className="size-3 text-[#2e2e32]" />
            <span className="text-[#6b6b76] font-mono">{shortRunId}</span>
          </>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        <Link
          to={projectId ? `/projects/${projectId}/settings` : "/dashboard"}
          className="p-1.5 text-[#525252] hover:text-[#a1a1aa] hover:bg-[#141416] rounded transition-all duration-150"
        >
          <Settings className="size-3.5" />
        </Link>

        {/* Avatar */}
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center text-[9px] font-bold text-white tracking-wide shrink-0 ring-1 ring-white/10 shadow-lg shadow-violet-500/10">
          A
        </div>
      </div>

    </header>
  )
}