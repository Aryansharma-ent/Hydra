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
    <div className="h-10 border-b border-[#1f1f23]/60 backdrop-blur-sm bg-[#0a0a0b]/80 flex items-center justify-between px-5 shrink-0 select-none">

      {/* Left: Back + breadcrumb */}
      <div className="flex items-center gap-3">
        <Link
          to={`/dashboard/?projectId=${runData.projectId}`}
          className="flex items-center gap-1.5 text-[#525252] hover:text-[#a1a1aa] transition-colors duration-150 text-[11px]"
        >
          <ArrowLeft className="size-3.5" />
        </Link>

        {/* Thin separator */}
        <div className="h-3.5 w-px bg-[#1f1f23]" />

        {/* Status pill */}
        {isRunning ? (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-indigo-400 bg-indigo-500/8 border border-indigo-500/15 rounded px-2 py-0.5 tracking-wide">
            <span className="relative flex size-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-60" />
              <span className="relative inline-flex rounded-full size-1.5 bg-indigo-500" />
            </span>
            RUNNING
          </span>
        ) : isPassed ? (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400 bg-emerald-500/8 border border-emerald-500/15 rounded px-2 py-0.5 tracking-wide shadow-sm shadow-emerald-500/10">
            <span className="size-1.5 rounded-full bg-emerald-400" />
            PASSED · {(runData.mismatchPercentage ?? 0).toFixed(2)}% diff
          </span>
        ) : isFailed ? (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-red-400 bg-red-500/8 border border-red-500/15 rounded px-2 py-0.5 tracking-wide shadow-sm shadow-red-500/10">
            <span className="size-1.5 rounded-full bg-red-400" />
            FAILED · {(runData.mismatchPercentage ?? 0).toFixed(2)}% diff
          </span>
        ) : null}

        {/* Timestamp */}
        <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-[#52525b]">
          <Clock className="size-3" />
          <span>{formatDate(runData.createdAt)}</span>
        </div>
      </div>

      {/* Right: Rerun */}
      <button
        onClick={onRerun}
        disabled={isRerunning || isRunning}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-semibold rounded border transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:active:scale-100
          bg-transparent text-[#a1a1aa] border-[#2e2e32] hover:border-[#3f3f46] hover:text-white hover:bg-[#141416]"
      >
        <RefreshCw className={`size-3 ${isRerunning ? "animate-spin" : ""}`} />
        {isRerunning ? "Rerunning…" : "Re-run scan"}
      </button>

    </div>
  )
}
