import { useState } from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal, Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function VisualDiffShowcase() {
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleMove = (clientX: number, rect: DOMRect) => {
    const x = clientX - rect.left;
    const percentage = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  return (
    <section className="relative bg-[#030304] py-32 px-6 overflow-hidden border-t border-white/[0.06]">
      {/* Background Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-r from-cyan-500/5 via-violet-500/5 to-transparent rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-4"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Interactive Visual Inspection Engine
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-['Syne'] text-4xl md:text-6xl font-bold text-white tracking-tight mb-4"
          >
            Drag to Inspect Visual Regressions
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/50 text-base max-w-xl mx-auto font-['Plus_Jakarta_Sans']"
          >
            Slide across to compare baseline Production against Staging. High-precision neon diff heatmaps isolate element boundary shifts.
          </motion.p>
        </div>

        {/* Interactive Split-Screen Diff Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#09090b] shadow-[0_25px_100px_rgba(0,0,0,0.9)] select-none"
        >
          
          {/* Card Chrome Bar */}
          <div className="px-6 py-4 bg-[#0d0d10] border-b border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/60 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/60 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/60 inline-block" />
              <span className="ml-3 text-xs font-mono text-white/40">hydra-inspector.internal</span>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" /> Baseline (Production)
              </span>
              <span className="text-red-400 flex items-center gap-1.5 bg-red-500/10 px-2.5 py-1 rounded-md border border-red-500/20">
                <AlertTriangle className="w-3.5 h-3.5" /> Staging Shift (1.42% Diff)
              </span>
            </div>
          </div>

          {/* Canvas Comparison Container */}
          <div
            className="relative h-[480px] md:h-[540px] w-full cursor-ew-resize overflow-hidden"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              handleMove(e.clientX, rect);
            }}
            onTouchMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              handleMove(e.touches[0].clientX, rect);
            }}
          >
            {/* Staging / Regression Layer (Underneath / Left Side) */}
            <div className="absolute inset-0 bg-[#09090d] flex items-center justify-center p-8">
              <div className="w-full max-w-3xl bg-[#111116] rounded-2xl border border-white/10 p-8 shadow-2xl relative">
                <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                  <div className="h-6 w-32 bg-white/20 rounded" />
                  <div className="flex gap-4">
                    <div className="h-4 w-16 bg-white/10 rounded" />
                    <div className="h-4 w-16 bg-white/10 rounded" />
                    <div className="h-4 w-20 bg-cyan-500/40 rounded" />
                  </div>
                </div>

                {/* Broken Shifted Layout Grid in Staging */}
                <div className="grid grid-cols-3 gap-6 mb-8">
                  <div className="h-28 bg-white/5 rounded-xl border border-white/10 p-4">
                    <div className="h-4 w-12 bg-white/20 rounded mb-2" />
                    <div className="h-3 w-20 bg-white/10 rounded" />
                  </div>
                  
                  {/* VISUAL BUG SHIFT ELEMENT (Highlighted in Neon Red Diff) */}
                  <div className="h-28 bg-red-500/10 rounded-xl border-2 border-red-500/60 p-4 relative shadow-[0_0_30px_rgba(239,68,68,0.3)] animate-pulse">
                    <span className="absolute -top-3 left-3 bg-red-600 text-white text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                      Layout Shift: flex-wrap gap: 24px
                    </span>
                    <div className="h-4 w-12 bg-red-400/40 rounded mb-2" />
                    <div className="h-3 w-20 bg-red-400/20 rounded" />
                  </div>

                  <div className="h-28 bg-white/5 rounded-xl border border-white/10 p-4">
                    <div className="h-4 w-12 bg-white/20 rounded mb-2" />
                    <div className="h-3 w-20 bg-white/10 rounded" />
                  </div>
                </div>

                <div className="h-10 bg-cyan-500/20 border border-cyan-500/30 rounded-xl w-full flex items-center justify-center font-mono text-xs text-cyan-300">
                  Deploy to Production
                </div>
              </div>
            </div>

            {/* Baseline Layer (Clipped Right Side) */}
            <div
              className="absolute inset-0 bg-[#060608] flex items-center justify-center p-8 overflow-hidden"
              style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
            >
              <div className="w-full max-w-3xl bg-[#0e0e12] rounded-2xl border border-white/10 p-8 shadow-2xl relative">
                <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                  <div className="h-6 w-32 bg-white/20 rounded" />
                  <div className="flex gap-4">
                    <div className="h-4 w-16 bg-white/10 rounded" />
                    <div className="h-4 w-16 bg-white/10 rounded" />
                    <div className="h-4 w-20 bg-indigo-500/40 rounded" />
                  </div>
                </div>

                {/* Clean Baseline Layout Grid */}
                <div className="grid grid-cols-3 gap-6 mb-8">
                  <div className="h-28 bg-white/5 rounded-xl border border-white/10 p-4">
                    <div className="h-4 w-12 bg-white/20 rounded mb-2" />
                    <div className="h-3 w-20 bg-white/10 rounded" />
                  </div>
                  <div className="h-28 bg-white/5 rounded-xl border border-white/10 p-4">
                    <div className="h-4 w-12 bg-white/20 rounded mb-2" />
                    <div className="h-3 w-20 bg-white/10 rounded" />
                  </div>
                  <div className="h-28 bg-white/5 rounded-xl border border-white/10 p-4">
                    <div className="h-4 w-12 bg-white/20 rounded mb-2" />
                    <div className="h-3 w-20 bg-white/10 rounded" />
                  </div>
                </div>

                <div className="h-10 bg-indigo-500/20 border border-indigo-500/30 rounded-xl w-full flex items-center justify-center font-mono text-xs text-indigo-300">
                  Deploy to Production
                </div>
              </div>
            </div>

            {/* Split Drag Line Bar */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 via-white to-violet-500 shadow-[0_0_20px_rgba(34,211,238,0.8)] z-20 pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 w-8 h-8 rounded-full bg-white text-black flex items-center justify-center shadow-2xl border-2 border-cyan-400">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* AI Remediation Recommendation Footer Bar */}
          <div className="px-6 py-4 bg-[#0a0a0d] border-t border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Gemini AI Auto-Healing Patch Suggested:</p>
                <code className="text-[11px] font-mono text-cyan-300">.pricing-card &#123; flex-wrap: nowrap !important; margin-top: 0px; &#125;</code>
              </div>
            </div>

            <button className="px-4 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-all shadow-lg shadow-violet-600/20">
              Apply Code Patch
            </button>
          </div>

        </motion.div>
      </div>
    </section>
  );
}
