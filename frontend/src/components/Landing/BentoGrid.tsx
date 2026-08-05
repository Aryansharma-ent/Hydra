'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, Sparkles, Terminal, Zap, GitPullRequest, CheckCircle2 } from 'lucide-react'

export default function BentoGrid() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, cardIndex: -1 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      cardIndex: index,
    })
  }

  return (
    <section id="platform" className="relative bg-[#030304] py-32 px-6 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-violet-600/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        
        {/* Section Header (Outcome Copy) */}
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[11px] font-mono text-violet-400/70 tracking-[0.25em] uppercase mb-4"
          >
            Intelligent Quality Platform
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            style={{ fontFamily: "'Syne', sans-serif" }}
            className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-5"
          >
            Ship Frontend Changes with Confidence
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            style={{ fontFamily: "'Plus_Jakarta_Sans', sans-serif" }}
            className="text-white/50 text-base max-w-xl mx-auto"
          >
            Hydra replaces manual screenshot reviews with an intelligent automated pipeline that detects, explains, and fixes visual regressions.
          </motion.p>
        </div>

        {/* Custom Interactive Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card 1: Sub-pixel Detection (Large 2 Column) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onMouseMove={(e) => handleMouseMove(e, 0)}
            onMouseLeave={() => setMousePos({ x: 0, y: 0, cardIndex: -1 })}
            className="group relative md:col-span-2 rounded-3xl bg-[#08080c] border border-white/[0.08] p-8 overflow-hidden transition-all duration-500 hover:border-violet-500/40 shadow-2xl"
          >
            {/* Spotlight Lighting Effect */}
            {mousePos.cardIndex === 0 && (
              <div
                className="pointer-events-none absolute -inset-px rounded-3xl opacity-100 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(139, 92, 246, 0.15), transparent 40%)`,
                }}
              />
            )}

            <div className="relative z-10 flex flex-col justify-between h-full">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mb-6">
                  <Eye className="w-5 h-5" />
                </div>
                <h3 className="font-['Syne'] text-2xl font-bold text-white mb-2">
                  Catch Regressions Invisible to the Human Eye
                </h3>
                <p className="text-white/50 text-sm leading-relaxed max-w-lg mb-6 font-['Plus_Jakarta_Sans']">
                  Sub-pixel variance analysis isolates 1-pixel shifts, layout boundary collapses, and font anti-aliasing variations before they reach production.
                </p>
              </div>

              {/* Interactive Visual Overlay Preview (Heatmap / Threshold Visualizer) */}
              <div className="rounded-2xl bg-[#0d0d12] border border-white/[0.08] p-4 flex flex-col gap-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 text-white/40">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    Heatmap Isolation Engine
                  </span>
                  <span className="text-cyan-400 text-[10px] bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                    Threshold: 0.05 (AA Excluded)
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex flex-col gap-1">
                    <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider">Detected Shift</span>
                    <span className="text-white font-semibold text-xs">.hero-title &#8594; y: +3.5px</span>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col gap-1">
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Status</span>
                    <span className="text-white font-semibold text-xs">Isolated (42 Diff Pixels)</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 2: AI Auto-Fix (1 Column) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onMouseMove={(e) => handleMouseMove(e, 1)}
            onMouseLeave={() => setMousePos({ x: 0, y: 0, cardIndex: -1 })}
            className="group relative rounded-3xl bg-[#08080c] border border-white/[0.08] p-8 overflow-hidden transition-all duration-500 hover:border-violet-500/40 shadow-2xl flex flex-col justify-between"
          >
            {mousePos.cardIndex === 1 && (
              <div
                className="pointer-events-none absolute -inset-px rounded-3xl opacity-100 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(139, 92, 246, 0.15), transparent 40%)`,
                }}
              />
            )}

            <div>
              <div className="w-10 h-10 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mb-6">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-['Syne'] text-xl font-bold text-white mb-2">
                AI That Understands Your UI
              </h3>
              <p className="text-white/50 text-xs leading-relaxed mb-6 font-['Plus_Jakarta_Sans']">
                Analyzes layout shifts and automatically generates copy-pasteable CSS code patches to fix regressions.
              </p>
            </div>

            {/* Code Diff Visual Snippet */}
            <div className="rounded-xl bg-[#0d0d12] border border-white/[0.08] p-3 font-mono text-[11px]">
              <div className="text-red-400 bg-red-500/10 px-2 py-1 rounded mb-1 border border-red-500/20">
                - flex-wrap: wrap; margin-top: 12px;
              </div>
              <div className="text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                + flex-wrap: nowrap; margin-top: 0px;
              </div>
            </div>
          </motion.div>

          {/* Card 3: Developer-First Execution (1 Column) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onMouseMove={(e) => handleMouseMove(e, 2)}
            onMouseLeave={() => setMousePos({ x: 0, y: 0, cardIndex: -1 })}
            className="group relative rounded-3xl bg-[#08080c] border border-white/[0.08] p-8 overflow-hidden transition-all duration-500 hover:border-violet-500/40 shadow-2xl flex flex-col justify-between"
          >
            {mousePos.cardIndex === 2 && (
              <div
                className="pointer-events-none absolute -inset-px rounded-3xl opacity-100 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(139, 92, 246, 0.15), transparent 40%)`,
                }}
              />
            )}

            <div>
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-6">
                <Terminal className="w-5 h-5" />
              </div>
              <h3 className="font-['Syne'] text-xl font-bold text-white mb-2">
                Local Execution. Cloud Insights.
              </h3>
              <p className="text-white/50 text-xs leading-relaxed mb-6 font-['Plus_Jakarta_Sans']">
                Scans run on your local machine in under a second. Zero server memory overhead.
              </p>
            </div>

            <div className="rounded-xl bg-[#0d0d12] border border-white/[0.08] p-3 font-mono text-[11px] text-white/50 leading-relaxed">
              <span className="text-cyan-400">$</span> npx @itzaks/hydra-visual-cli<br />
              <span className="text-emerald-400">&#10003; Capturing viewports (0.42s)</span>
            </div>
          </motion.div>

          {/* Card 4: Instant Diffs (1 Column) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onMouseMove={(e) => handleMouseMove(e, 3)}
            onMouseLeave={() => setMousePos({ x: 0, y: 0, cardIndex: -1 })}
            className="group relative rounded-3xl bg-[#08080c] border border-white/[0.08] p-8 overflow-hidden transition-all duration-500 hover:border-violet-500/40 shadow-2xl flex flex-col justify-between"
          >
            {mousePos.cardIndex === 3 && (
              <div
                className="pointer-events-none absolute -inset-px rounded-3xl opacity-100 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(139, 92, 246, 0.15), transparent 40%)`,
                }}
              />
            )}

            <div>
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-6">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-['Syne'] text-xl font-bold text-white mb-2">
                Lightning-Fast Visual Reports
              </h3>
              <p className="text-white/50 text-xs leading-relaxed mb-6 font-['Plus_Jakarta_Sans']">
                Instant side-by-side screenshot comparisons streamed directly to edge delivery networks.
              </p>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#0d0d12] border border-white/[0.08] text-xs font-mono">
              <span className="text-white/60">Report Generation</span>
              <span className="text-amber-400 font-bold">12ms Edge</span>
            </div>
          </motion.div>

          {/* Card 5: Pipeline Integration (1 Column) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onMouseMove={(e) => handleMouseMove(e, 4)}
            onMouseLeave={() => setMousePos({ x: 0, y: 0, cardIndex: -1 })}
            className="group relative rounded-3xl bg-[#08080c] border border-white/[0.08] p-8 overflow-hidden transition-all duration-500 hover:border-violet-500/40 shadow-2xl flex flex-col justify-between"
          >
            {mousePos.cardIndex === 4 && (
              <div
                className="pointer-events-none absolute -inset-px rounded-3xl opacity-100 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(139, 92, 246, 0.15), transparent 40%)`,
                }}
              />
            )}

            <div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6">
                <GitPullRequest className="w-5 h-5" />
              </div>
              <h3 className="font-['Syne'] text-xl font-bold text-white mb-2">
                Zero-Friction Pipeline Integration
              </h3>
              <p className="text-white/50 text-xs leading-relaxed mb-6 font-['Plus_Jakarta_Sans']">
                Integrates seamlessly into GitHub Actions to block broken UI changes before merging.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs font-mono text-emerald-300">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Hydra PR Check
              </span>
              <span className="font-bold uppercase tracking-wider text-[10px]">PASSED</span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
