import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const ease = [0.22, 1, 0.36, 1] as const;
type Tab = "before" | "after" | "diff";
const TABS: { key: Tab; label: string }[] = [
  { key: "before", label: "Before" },
  { key: "after",  label: "After"  },
  { key: "diff",   label: "Diff"   },
];

// ─── Minimal mock UI: just shapes/lines, monochrome ───
function MockNav() {
  return (
    <div className="flex h-9 items-center justify-between rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 mb-3">
      <div className="h-2 w-14 rounded-full bg-white/15" />
      <div className="flex gap-2">
        <div className="h-1.5 w-8 rounded-full bg-white/[0.08]" />
        <div className="h-1.5 w-8 rounded-full bg-white/[0.08]" />
        <div className="h-1.5 w-8 rounded-full bg-white/[0.08]" />
      </div>
    </div>
  );
}

function BeforeUI() {
  return (
    <div className="p-4 space-y-3">
      <MockNav />
      <div className="h-24 rounded-2xl border border-white/[0.05] bg-white/[0.025] flex flex-col justify-center gap-2 px-5">
        <div className="h-2.5 w-32 rounded-full bg-white/20" />
        <div className="h-1.5 w-20 rounded-full bg-white/10" />
        <div className="mt-1 h-6 w-16 rounded-full bg-white/12" />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[0,1,2].map(i => (
          <div key={i} className="h-16 rounded-xl border border-white/[0.05] bg-white/[0.02] flex flex-col gap-1.5 p-3">
            <div className="h-2 w-7 rounded-full bg-white/12" />
            <div className="h-1.5 w-full rounded-full bg-white/[0.07]" />
            <div className="h-1.5 w-3/4 rounded-full bg-white/[0.05]" />
          </div>
        ))}
      </div>
    </div>
  );
}

function AfterUI() {
  return (
    <div className="p-4 space-y-3">
      <MockNav />
      {/* hero block shifted — button moved right */}
      <div className="h-24 rounded-2xl border border-white/[0.05] bg-white/[0.025] flex flex-col justify-center gap-2 px-5">
        <div className="h-2.5 w-36 rounded-full bg-white/20" />  {/* slightly wider */}
        <div className="h-1.5 w-24 rounded-full bg-white/10" />
        <div className="mt-1 h-6 w-16 rounded-full bg-white/12 ml-4" />  {/* shifted */}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[0,1,2].map(i => (
          <div key={i} className={`h-16 rounded-xl border flex flex-col gap-1.5 p-3 ${
            i === 1
              ? "border-white/[0.12] bg-white/[0.05]"   // this card changed
              : "border-white/[0.05] bg-white/[0.02]"
          }`}>
            <div className={`h-2 w-7 rounded-full ${i===1 ? "bg-white/25" : "bg-white/12"}`} />
            <div className="h-1.5 w-full rounded-full bg-white/[0.07]" />
            <div className="h-1.5 w-3/4 rounded-full bg-white/[0.05]" />
          </div>
        ))}
      </div>
    </div>
  );
}

function DiffUI() {
  return (
    <div className="p-4 space-y-3">
      <MockNav />
      <div className="relative h-24 rounded-2xl border border-white/[0.05] bg-white/[0.025] flex flex-col justify-center gap-2 px-5 overflow-hidden">
        {/* Heatmap highlight — subtle white/low-opacity, NOT saturated red */}
        <div className="absolute inset-0 bg-white/[0.025] rounded-2xl" />
        <div className="relative h-2.5 w-36 rounded-full bg-white/20" />
        <div className="relative h-1.5 w-24 rounded-full bg-white/10" />
        <div className="relative mt-1 h-6 w-16 rounded-full bg-white/15 ml-4">
          {/* tiny shift marker */}
          <div className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-white/60 ring-2 ring-black" />
        </div>
        <div className="absolute top-2 right-3 rounded-full bg-white/10 border border-white/[0.12] px-2 py-0.5 text-[9px] font-mono text-white/50">
          3 changes
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[0,1,2].map(i => (
          <div key={i} className={`relative h-16 rounded-xl border flex flex-col gap-1.5 p-3 ${
            i === 1 ? "border-white/[0.15] bg-white/[0.04]" : "border-white/[0.05] bg-white/[0.02]"
          }`}>
            {i === 1 && (
              <div className="absolute -top-px left-0 right-0 h-px bg-white/25 rounded-t-xl" />
            )}
            <div className={`h-2 w-7 rounded-full ${i===1 ? "bg-white/30" : "bg-white/12"}`} />
            <div className="h-1.5 w-full rounded-full bg-white/[0.07]" />
            <div className="h-1.5 w-3/4 rounded-full bg-white/[0.05]" />
          </div>
        ))}
      </div>
      {/* Legend */}
      <div className="flex gap-5 pt-1 px-1">
        <span className="flex items-center gap-1.5 text-[10px] font-mono text-white/25">
          <span className="h-1.5 w-1.5 rounded-full bg-white/50" />changed
        </span>
        <span className="flex items-center gap-1.5 text-[10px] font-mono text-white/25">
          <span className="h-1.5 w-1.5 rounded-full bg-white/20" />unchanged
        </span>
      </div>
    </div>
  );
}

export function ComparisonSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [tab, setTab] = useState<Tab>("before");

  return (
    <section ref={ref} className="relative py-32 px-6">
      {/* Same faint center glow as hero */}
      <div className="pointer-events-none absolute inset-0 flex justify-center items-center">
        <div className="h-72 w-72 rounded-full bg-blue-500/[0.06] blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-3xl">
        {/* Heading */}
        <div className="mb-14 text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease }}
            className="mb-5 text-xs font-medium tracking-[0.12em] uppercase text-white/30"
          >
            Visual Comparison
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.08, duration: 0.5, ease }}
            className="mb-4 text-4xl sm:text-5xl font-semibold tracking-[-0.04em] leading-[1.3] text-white font-boldonse"
          >
            Spot the difference instantly.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.14, duration: 0.5, ease }}
            className="text-base text-zinc-400 leading-7"
          >
            Pixel-by-pixel diffs on every commit. No guessing, no eyeballing.
          </motion.p>
        </div>

        {/* Browser card */}
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ delay: 0.22, duration: 0.65, ease }}
          className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] shadow-[0_24px_64px_rgba(0,0,0,0.6)]"
        >
          {/* Browser chrome */}
          <div className="flex h-10 items-center justify-between border-b border-white/[0.05] bg-white/[0.015] px-4">
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-white/[0.08]" />
              <div className="h-2.5 w-2.5 rounded-full bg-white/[0.08]" />
              <div className="h-2.5 w-2.5 rounded-full bg-white/[0.08]" />
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-0.5 rounded-xl border border-white/[0.06] bg-black/50 p-0.5">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`px-4 py-1 text-[11px] font-medium rounded-lg transition-all duration-200 ${
                    tab === t.key
                      ? "bg-white/[0.07] text-white/80"
                      : "text-white/30 hover:text-white/50"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <span className="text-[10px] font-mono text-white/20">hydra-report</span>
          </div>

          {/* Content */}
          <div className="min-h-[240px]">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease }}
            >
              {tab === "before" && <BeforeUI />}
              {tab === "after"  && <AfterUI />}
              {tab === "diff"   && <DiffUI />}
            </motion.div>
          </div>

          {/* Status footer */}
          <div className="flex items-center justify-between border-t border-white/[0.04] px-5 py-2.5 text-[10px] font-mono text-white/20">
            <span>scan · hyd_a3f192</span>
            <span>{tab === "diff" ? "3 regressions detected" : "baseline captured"}</span>
            <span>2.3s</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
