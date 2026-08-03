import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, AlertTriangle, CheckCircle, RefreshCw, MoreVertical, Trash2 } from "lucide-react"
import type { TestRun } from "@/types"
import axios from "axios"
import ConfirmDeleteModal from "./ConfirmDeleteModal"

interface RecentRunSubProps {
  RunData: TestRun[]
  stagingUrl: string
  productionUrl: string
  onRunDeleted?: () => void
}

export default function RecentRuns({ RunData, stagingUrl, productionUrl, onRunDeleted }: RecentRunSubProps) {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null)
  const [runToDelete, setRunToDelete] = useState<TestRun | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenuId(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
    if (seconds < 60) return "Just now"
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`

    return date.toLocaleDateString()
  }

  const handleDeleteRun = async () => {
    if (!runToDelete) return
    const token = localStorage.getItem("hydra_token")
    await axios.delete(`http://localhost:8000/api/tests/run/${runToDelete._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    setRunToDelete(null)
    if (onRunDeleted) onRunDeleted()
  }

  return (
    <div className="flex flex-col gap-3 select-none">
      <div className="flex justify-between items-center px-1">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">
          Recent runs
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {RunData.map((Run) => {
          const isRunning = Run.status === "RUNNING"
          const isMenuOpen = activeMenuId === Run._id

          return (
            <div key={Run._id} className="relative group">
              <div
                className={`bg-[#0c0c0e] border rounded-lg p-5 flex flex-col gap-3 relative overflow-hidden transition-all ${
                  isRunning
                    ? "border-indigo-500/25 shadow-[0_0_12px_rgba(99,102,241,0.04)]"
                    : Run.status === "FAILED"
                    ? "border-red-500/15 hover:border-red-500/35 hover:bg-red-500/5 hover:translate-x-0.5"
                    : "border-[#1f1f23] hover:border-emerald-500/35 hover:bg-emerald-500/5 hover:translate-x-0.5"
                }`}
              >
                <div className="flex justify-between items-start z-10">
                  <Link
                    to={isRunning ? "#" : `/runs/${Run._id}?projectId=${Run.projectId}`}
                    className={`flex flex-col gap-1 flex-1 ${isRunning ? "cursor-default" : "cursor-pointer"}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white font-mono truncate max-w-[180px] lg:max-w-[340px]">
                        {Run.stagingUrl || stagingUrl}
                      </span>
                      <ArrowRight className="size-3 text-muted-foreground/60 shrink-0" />
                      <span className="text-xs text-muted-foreground font-mono truncate max-w-[180px] lg:max-w-[340px]">
                        {Run.productionUrl || productionUrl}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground/80 mt-1 font-mono">
                      {isRunning ? (
                        <>
                          <span className="flex items-center gap-1 text-indigo-400">Running now</span>
                          <span>•</span>
                          <span className="text-muted-foreground/60">Capturing screenshots...</span>
                        </>
                      ) : (
                        <>
                          <span className="text-muted-foreground/60">{timeAgo(Run.createdAt)}</span>
                          <span>•</span>
                          <span>{Run.mismatchPixelsCount} pixels differed</span>
                        </>
                      )}
                    </div>
                  </Link>

                  {/* Right side controls: Status Badge & 3-Dots Action Menu */}
                  <div className="flex items-center gap-3 shrink-0">
                    {isRunning ? (
                      <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 border border-indigo-500/20 rounded flex items-center gap-1.5">
                        <RefreshCw className="size-2.5 animate-spin" />
                        Running
                      </span>
                    ) : Run.status === "FAILED" ? (
                      <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-red-500 bg-red-500/10 px-2.5 py-0.5 border border-red-500/20 rounded flex items-center gap-1.5">
                        <AlertTriangle className="size-2.5" />
                        FAILED ({(Run.mismatchPercentage ?? 0).toFixed(2)}%)
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 border border-emerald-500/20 rounded flex items-center gap-1.5">
                        <CheckCircle className="size-2.5" />
                        PASSED
                      </span>
                    )}

                    {/* 3-Dots Menu Trigger */}
                    <div className="relative" ref={isMenuOpen ? menuRef : null}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setActiveMenuId(isMenuOpen ? null : Run._id)
                        }}
                        className="p-1.5 rounded-md text-muted-foreground/60 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <MoreVertical className="size-4" />
                      </button>

                      {/* Dropdown Menu */}
                      {isMenuOpen && (
                        <div className="absolute right-0 top-7 z-30 w-44 bg-[#121215] border border-[#27272a] rounded-lg shadow-xl py-1 animate-in fade-in duration-150">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              setActiveMenuId(null)
                              setRunToDelete(Run)
                            }}
                            className="w-full text-left px-3 py-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/40 flex items-center gap-2 transition-colors font-medium"
                          >
                            <Trash2 className="size-3.5" />
                            Delete Test Run
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Pulsing indicator line for running tests */}
                {isRunning && (
                  <div className="absolute bottom-0 left-0 h-[2px] bg-indigo-500 w-full animate-[pulse_1.5s_infinite]"></div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Confirm Delete Modal */}
      {runToDelete && (
        <ConfirmDeleteModal
          isOpen={Boolean(runToDelete)}
          onClose={() => setRunToDelete(null)}
          onConfirm={handleDeleteRun}
          title="Delete Test Run"
          itemName={`Run #${runToDelete._id.substring(0, 8)}`}
          itemType="Test Run"
        />
      )}
    </div>
  )
}
