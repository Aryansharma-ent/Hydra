import { ArrowLeft, RefreshCw, Clock } from "lucide-react"
import { Link } from "react-router-dom"
import { type TestRun } from "@/types"

interface DebuggerSubBarProps {
  runData: TestRun
  onRerun: () => void
  isRerunning: boolean
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch {
    return iso
  }
}

export default function DebuggerSubBar({ runData, onRerun, isRerunning }: DebuggerSubBarProps) {
  const isPassed  = runData.status === "PASSED"
  const isRunning = runData.status === "RUNNING"
  const isFailed  = runData.status === "FAILED"

  return (
    <div className="h-10 border-b border-[#1f1f23] backdrop-blur-md bg-[#09090b]/90 flex items-center justify-between px-5 shrink-0 select-none z-10">

      {/* Left: Back + Status + Timestamp */}
      <div className="flex items-center gap-3">
        <Link
          to={`/dashboard/?projectId=${runData.projectId}`}
          className="flex items-center gap-1.5 text-[#a1a1aa] hover:text-white transition-colors duration-150 text-[12px] p-1 rounded-md hover:bg-[#18181b]"
          title="Back to Dashboard"
        >
          <ArrowLeft className="size-3.5" />
        </Link>

        {/* Thin separator */}
        <div className="h-4 w-px bg-[#27272a]" />

        {/* Status pill */}
        {isRunning ? (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-md px-2.5 py-0.5 tracking-wide">
            <span className="relative flex size-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex rounded-full size-2 bg-indigo-500" />
            </span>
            RUNNING
          </span>
        ) : isPassed ? (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-md px-2.5 py-0.5 tracking-wide shadow-sm">
            <span className="size-2 rounded-full bg-emerald-400" />
            PASSED · {(runData.mismatchPercentage ?? 0).toFixed(2)}% diff
          </span>
        ) : isFailed ? (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-red-400 bg-red-500/10 border border-red-500/20 rounded-md px-2.5 py-0.5 tracking-wide shadow-sm">
            <span className="size-2 rounded-full bg-red-400" />
            FAILED · {(runData.mismatchPercentage ?? 0).toFixed(2)}% diff
          </span>
        ) : null}

        {/* Timestamp */}
        <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-[#a1a1aa] font-medium bg-[#121215] border border-[#27272a] px-2.5 py-0.5 rounded-md">
          <Clock className="size-3 text-violet-400" />
          <span>{formatDate(runData.createdAt)}</span>
        </div>
      </div>

      {/* Right: Rerun Action Button */}
      <button
        onClick={onRerun}
        disabled={isRerunning || isRunning}
        className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-medium rounded-lg border border-[#27272a] transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed
          bg-[#121215] text-[#e4e4e7] hover:border-[#3f3f46] hover:text-white hover:bg-[#18181b] shadow-sm"
      >
        <RefreshCw className={`size-3 text-violet-400 ${isRerunning ? "animate-spin" : ""}`} />
        {isRerunning ? "Rerunning…" : "Re-run scan"}
      </button>

    </div>
  )
}
