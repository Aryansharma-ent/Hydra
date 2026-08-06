import type { TestRun } from "@/types"

interface StatsRowProps {
  runs: TestRun[]
}

export default function StatsRow({ runs }: StatsRowProps) {
  // 1. total scans run
  const totalRuns = runs.length

  // 2. total visual layout bugs identified across all runs
  const totalBugs = runs.reduce((sum, r) => sum + (r.visualBugs?.length || 0), 0)

  // 3. average layout mismatch percentage (drift)
  const avgDiff = totalRuns > 0 
    ? (runs.reduce((sum, r) => sum + (r.mismatchPercentage || 0), 0) / totalRuns).toFixed(2)
    : "0.00"

  // 4. pass Success Rate (PASSED status runs vs total)
  const passedRuns = runs.filter(r => r.status === "PASSED").length
  const successRate = totalRuns > 0 
    ? Math.round((passedRuns / totalRuns) * 100)
    : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 select-none animate-fade-in">
      
      {/* 1. total runs widget */}
      <div className="bg-[#0c0c0e] border border-[#1f1f23] rounded-lg p-5 flex flex-col justify-between hover:border-[#1f1f23]/80 transition-all">
        <div>
          <span className="text-[9px] uppercase font-bold tracking-widest text-white-300 font-mono">
            Total runs
          </span>
          <div className="text-2xl font-semibold text-white mt-1.5 font-mono">
            {totalRuns}
          </div>
        </div>
        <span className="text-[11px] text-white-300 font-sans tracking-wider mt-2 block">
          Scan History
        </span>
      </div>

      {/* 2. Detected bugs widget */}
      <div className="bg-[#0c0c0e] border border-[#1f1f23] rounded-lg p-5 flex flex-col justify-between hover:border-[#1f1f23]/80 transition-all">
        <div>
          <span className="text-[9px] uppercase font-bold tracking-widest text-muted-foreground/75 font-mono">
            Bugs detected
          </span>
          <div className="text-2xl font-semibold text-white mt-1.5 font-mono">
            {totalBugs}
          </div>
        </div>
        <span className={`text-[11px] font-mono mt-2 block ${totalBugs > 0 ? "text-red-400" : "text-muted-foreground/40"}`}>
          {totalBugs > 0 ? "Requires code patches" : "All clean!"}
        </span>
      </div>

      {/* 3. Average drift widget */}
      <div className="bg-[#0c0c0e] border border-[#1f1f23] rounded-lg p-5 flex flex-col justify-between hover:border-[#1f1f23]/80 transition-all">
        <div>
          <span className="text-[9px] uppercase font-bold tracking-widest text-muted-foreground/75 font-mono">
            Avg diff score
          </span>
          <div className="text-2xl font-semibold text-white mt-1.5 font-mono">
            {avgDiff}%
          </div>
        </div>
        <span className="text-[11px] text-indigo-400 font-semibold font-mono mt-2 block">
          Layout deviation rate
        </span>
      </div>

      {/* 4. Pass Success widget */}
      <div className="bg-[#0c0c0e] border border-[#1f1f23] rounded-lg p-5 flex flex-col justify-between hover:border-[#1f1f23]/80 transition-all">
        <div>
          <span className="text-[9px] uppercase font-bold tracking-widest text-muted-foreground/75 font-mono">
            Pass Success Rate
          </span>
          <div className="text-2xl font-semibold text-white mt-1.5 font-mono">
            {successRate}%
          </div>
        </div>
        <span className="text-[11px] text-emerald-400 font-semibold font-mono mt-2 block">
          {passedRuns} of {totalRuns} passed
        </span>
      </div>

    </div>
  )
}