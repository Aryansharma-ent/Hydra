import axios from "axios"
import Sidebar from "../components/Dashboard/SideBar"
import DebuggerHeader from "@/components/visual_debugger/DebuggerHeader"
import DebuggerSubBar from "@/components/visual_debugger/DebuggerSubBar"
import VisualComparer from "@/components/visual_debugger/VisualComparer"
import ChatSidebar from "@/components/visual_debugger/ChatSidebar"
import { type TestRun } from "@/types"
import { useParams, Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Camera, Cpu, Brain, Layers, AlertCircle, ArrowLeft } from "lucide-react"

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

/* ─── Loading Step Config ─── */
const LOADING_STEPS = [
  { icon: Camera,  label: "Capturing staging screenshot",     color: "text-sky-400" },
  { icon: Layers,  label: "Capturing production screenshot",  color: "text-violet-400" },
  { icon: Cpu,     label: "Computing pixel-level diff",       color: "text-amber-400" },
  { icon: Brain,   label: "AI regression analysis",           color: "text-emerald-400" },
]

export default function TestReport() {
  /* ═══ EXISTING STATE — PRESERVED EXACTLY ═══ */
  const [runData, setRundata] = useState<TestRun | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [chatMessages, setChatMessages] = useState<Message[]>([])
  const { runId } = useParams<{ runId: string }>()
  const [isRerunning, setIsRerunning] = useState<boolean>(false)

  /* ═══ NEW: Local UI state (presentation only) ═══ */
  const [selectedBugIndex, setSelectedBugIndex] = useState<number | null>(null)
  const [loadingStep, setLoadingStep] = useState(0)

  /* ═══ EXISTING FUNCTION — PRESERVED EXACTLY ═══ */
  const LoadTestData = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/tests/run/${runId}`)

      if (res.data.success) {
        const data = res.data.data
        setRundata(data)

        // Seed initial Hydra Copilot message summarizing regressions
        if (data.visualBugs && data.visualBugs.length > 0) {
          const bugList = data.visualBugs.map((b: any, index: number) =>
            `${index + 1}. \`${b.element}\`: ${b.description}`
          ).join("\n")

          setChatMessages([
            {
              sender: 'ai',
              text: `Hello! I have analyzed the visual mismatch report for run **run_${data._id.substring(0, 8)}**.\n\nHere are the regressions I identified:\n\n${bugList}\n\nAsk me details about any regression, or ask for the CSS patch code!`
            }
          ])
        } else {
          setChatMessages([
            {
              sender: 'ai',
              text: `Hello! No visual regressions were detected in this run. Everything looks perfect!`
            }
          ])
        }
      }
    } catch (error) {
      console.log("error fetching the test run data")
    } finally {
      setLoading(false)
    }
  }

  /* ═══ EXISTING FUNCTION — PRESERVED EXACTLY ═══ */
  const handleRerun = async () => {
    if (!runId || isRerunning) return
    setIsRerunning(true)
    try {
      const token = localStorage.getItem("hydra_token");
      const res = await axios.post(
        `http://localhost:8000/api/tests/run/${runId}/rerun`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (res.data.success) {
        // Updating state to RUNNING so it immediately triggers the loading screen and polling
        setRundata(res.data.data);
      }
    } catch (error) {
      console.log("error rerunning")
    } finally {
      setIsRerunning(false)
    }
  }

  /* ═══ EXISTING EFFECTS — PRESERVED EXACTLY ═══ */
  useEffect(() => {
    if (runId) {
      LoadTestData()
    }
  }, [runId])

  useEffect(() => {
    let intervalId: any = null

    if (runId && runData?.status === 'RUNNING') {
      intervalId = setInterval(async () => {
        try {
          const res = await axios.get(`http://localhost:8000/api/tests/run/${runId}`);
          if (res.data.success) {
            setRundata(res.data.data);
          }
        } catch (error) {
          console.error("Error polling run details:", error);
        }
      }, 3000)
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [runId, runData])

  /* ═══ NEW: Loading step cosmetic animation ═══ */
  useEffect(() => {
    if (loading || runData?.status === 'RUNNING') {
      setLoadingStep(0)
      const interval = setInterval(() => {
        setLoadingStep(prev => (prev < 3 ? prev + 1 : prev))
      }, 2800)
      return () => clearInterval(interval)
    }
  }, [loading, runData?.status])

  return (
    <div className="flex h-screen w-screen bg-[#09090b] text-[#c9d1d9] overflow-hidden font-sans select-none antialiased">
      {/* 1. Left Sidebar Navigation */}
      <Sidebar />

      {/* Main Panel Area */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* 2. Top Header Controls */}
        <DebuggerHeader />

        {/* 3. Content Area */}
        {loading || runData?.status === 'RUNNING' ? (
          /* ═══ CINEMATIC LOADING STATE ═══ */
          <div className="flex-1 flex items-center justify-center bg-[#09090b] relative overflow-hidden">
            {/* Ambient background glow */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-500/[0.03] blur-[120px]" />
            </div>

            <div className="relative z-10 flex flex-col items-center gap-8 max-w-sm w-full px-6">
              {/* Animated Hydra icon */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="w-12 h-12 rounded-xl bg-[#121215] border border-[#27272a] flex items-center justify-center p-2 shadow-lg shadow-violet-500/5"
              >
                <img src="/src/assets/hydralogo.png" className="w-full h-full object-contain animate-pulse" alt="Hydra Logo" />
              </motion.div>

              {/* Title */}
              <div className="text-center">
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-sm font-medium text-[#e4e4e7] mb-1"
                >
                  Hydra is scanning
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-[11px] text-[#52525b]"
                >
                  Capturing screenshots & analyzing differences
                </motion.p>
              </div>

              {/* Steps */}
              <div className="w-full flex flex-col gap-2">
                <AnimatePresence>
                  {LOADING_STEPS.map((step, i) => {
                    const StepIcon = step.icon
                    const isActive = i === loadingStep
                    const isDone = i < loadingStep

                    return (
                      <motion.div
                        key={step.label}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border transition-all duration-500 ${
                          isActive
                            ? 'bg-[#111113] border-[#2e2e32]'
                            : isDone
                              ? 'bg-[#0d0d0f] border-[#1a1a1d]'
                              : 'bg-transparent border-transparent'
                        }`}
                      >
                        <div className={`shrink-0 transition-all duration-500 ${
                          isDone ? 'text-emerald-400' : isActive ? step.color : 'text-[#2e2e32]'
                        }`}>
                          {isDone ? (
                            <svg className="size-4" viewBox="0 0 16 16" fill="none">
                              <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          ) : isActive ? (
                            <StepIcon className="size-4 animate-pulse" />
                          ) : (
                            <StepIcon className="size-4" />
                          )}
                        </div>
                        <span className={`text-[11px] font-medium transition-colors duration-500 ${
                          isDone ? 'text-[#52525b]' : isActive ? 'text-[#c9d1d9]' : 'text-[#2e2e32]'
                        }`}>
                          {step.label}
                        </span>
                        {isActive && (
                          <span className="ml-auto">
                            <span className="flex gap-0.5">
                              <span className="size-1 rounded-full bg-[#52525b] animate-[pulse_1.4s_ease-in-out_infinite]" />
                              <span className="size-1 rounded-full bg-[#52525b] animate-[pulse_1.4s_ease-in-out_0.2s_infinite]" />
                              <span className="size-1 rounded-full bg-[#52525b] animate-[pulse_1.4s_ease-in-out_0.4s_infinite]" />
                            </span>
                          </span>
                        )}
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>

              {/* Progress bar */}
              <div className="w-full h-0.5 bg-[#1a1a1d] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${((loadingStep + 1) / 4) * 100}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
        ) : !runData ? (
          /* ═══ PREMIUM ERROR STATE ═══ */
          <div className="flex-1 flex items-center justify-center bg-[#09090b]">
            <div className="flex flex-col items-center gap-4 max-w-xs text-center">
              <div className="w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/15 flex items-center justify-center">
                <AlertCircle className="size-5 text-red-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#e4e4e7] mb-1">Test run not found</p>
                <p className="text-[11px] text-[#52525b] leading-relaxed">
                  This run may have expired or the ID is invalid.
                  Test runs are automatically deleted after 30 days.
                </p>
              </div>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 text-[11px] font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                <ArrowLeft className="size-3" />
                Back to dashboard
              </Link>
            </div>
          </div>
        ) : (
          <>
            <DebuggerSubBar
              runData={runData}
              onRerun={handleRerun}
              isRerunning={isRerunning}
            />

            {/* 4. Main Visual Debugger Workspace */}
            <div className="flex-1 flex min-h-0">

              {/* Left Area: Screenshot comparison viewport */}
              <VisualComparer
                runData={runData}
                selectedBugIndex={selectedBugIndex}
                onSelectBug={setSelectedBugIndex}
              />

              {/* Right Area: Hydra Inspector Panel */}
              <ChatSidebar
                runData={runData}
                chatMessages={chatMessages}
                setChatMessages={setChatMessages}
                selectedBugIndex={selectedBugIndex}
                onSelectBug={setSelectedBugIndex}
              />

            </div>
          </>
        )}
      </div>
    </div>
  )
}
