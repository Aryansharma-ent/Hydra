import { ChevronRight, LayoutGrid, GitBranch } from "lucide-react"
import { Link, useLocation, useParams } from "react-router-dom"
import UserMenu from "@/components/UserMenu"

export default function DebuggerHeader() {
  const location = useLocation()
  const { runId } = useParams<{ runId: string }>()

  const searchParams = new URLSearchParams(location.search)
  const projectId = searchParams.get("projectId")

  // Format run ID for display
  const shortRunId = runId ? runId.substring(0, 10) : "—"

  return (
    <header className="h-11 border-b border-[#1f1f23] flex items-center justify-between px-5 backdrop-blur-md bg-[#09090b]/90 shrink-0 select-none z-20">

      {/* Left: Vercel Breadcrumbs */}
      <div className="flex items-center gap-2 text-[12px] text-[#a1a1aa] font-medium">
        <Link
          to="/dashboard"
          className="flex items-center gap-1.5 hover:text-white transition-colors duration-150"
        >
          <LayoutGrid className="size-3.5 text-violet-400" />
          <span className="font-semibold text-white">Projects</span>
        </Link>

        <span className="text-[#3f3f46]">/</span>

        <Link
          to={projectId ? `/dashboard/?projectId=${projectId}` : "/dashboard"}
          className="hover:text-white transition-colors duration-150 flex items-center gap-1.5"
        >
          <GitBranch className="size-3.5 text-[#a1a1aa]" />
          <span>Active Workspace</span>
        </Link>

        <span className="text-[#3f3f46]">/</span>

        <span className="text-white font-medium">Visual Debugger</span>

        {runId && (
          <>
            <span className="text-[#3f3f46]">/</span>
            <span className="text-[#a1a1aa] font-mono text-[11px] bg-[#121215] border border-[#27272a] px-2 py-0.5 rounded-md">
              {shortRunId}
            </span>
          </>
        )}
      </div>

      {/* Right: User Menu */}
      <div className="flex items-center gap-3">
        <UserMenu />
      </div>

    </header>
  )
}