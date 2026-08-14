import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { Camera, Cpu, Brain, Layers } from "lucide-react"

interface LoadingStep {
  icon: any;
  label: string;
  color: string;
}

const DEFAULT_STEPS: LoadingStep[] = [
  { icon: Camera, label: "Syncing workspace registry", color: "text-sky-400" },
  { icon: Layers, label: "Loading active projects", color: "text-violet-400" },
  { icon: Cpu, label: "Fetching recent test runs", color: "text-amber-400" },
  { icon: Brain, label: "Preparing visual engine", color: "text-emerald-400" },
]

interface CinematicLoadingProps {
  title?: string;
  subtitle?: string;
  steps?: LoadingStep[];
}

export default function CinematicLoading({
  title = "Hydra is loading",
  subtitle = "Connecting to workspace & fetching resources",
  steps = DEFAULT_STEPS,
}: CinematicLoadingProps) {
  const [loadingStep, setLoadingStep] = useState(0)

  useEffect(() => {
    setLoadingStep(0)
    const interval = setInterval(() => {
      setLoadingStep(prev => (prev < steps.length - 1 ? prev + 1 : prev))
    }, 2000)
    return () => clearInterval(interval)
  }, [steps])

  return (
    <div className="flex-1 flex items-center justify-center bg-[#09090b] relative overflow-hidden min-h-[400px]">
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
          <img src="/hydralogo.png" className="w-full h-full object-contain animate-pulse" alt="Hydra Logo" />
        </motion.div>

        {/* Title */}
        <div className="text-center">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm font-medium text-[#e4e4e7] mb-1"
          >
            {title}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-[11px] text-[#52525b]"
          >
            {subtitle}
          </motion.p>
        </div>

        {/* Steps */}
        <div className="w-full flex flex-col gap-2">
          <AnimatePresence>
            {steps.map((step, i) => {
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
      </div>
    </div>
  )
}
