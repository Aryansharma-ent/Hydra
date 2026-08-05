'use client'

import { motion } from 'framer-motion'
import appDashboard from '../../assets/app_dashboard.png'

export default function DashboardPreview() {
  return (
    <section className="relative bg-[#050505] py-32 px-6 overflow-hidden">
      {/* Section Header */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-[11px] font-mono text-violet-400/50 tracking-[0.25em] uppercase mb-4"
        >
          Command center
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl md:text-5xl font-extralight text-white tracking-tight mb-4"
        >
          Your regression dashboard
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base text-white/20 max-w-lg mx-auto font-light"
        >
          Track scans, manage projects, inspect visual diffs, and chat with Hydra AI — all from one interface.
        </motion.p>
      </div>

      {/* Browser Frame */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="max-w-6xl mx-auto"
      >
        <div
          className="relative rounded-2xl overflow-hidden border border-white/[0.06] shadow-[0_20px_80px_-20px_rgba(139,92,246,0.08)]"
          style={{ perspective: '2000px' }}
        >
          {/* Browser Chrome */}
          <div className="bg-[#0c0c0e] border-b border-white/[0.04] px-4 py-3 flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-white/[0.06]" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/[0.06]" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/[0.06]" />
            </div>
            <div className="flex-1 max-w-sm mx-auto">
              <div className="bg-white/[0.03] border border-white/[0.04] rounded-lg px-3 py-1 flex items-center">
                <span className="text-[10px] font-mono text-white/15 truncate">app.hydra.dev/dashboard</span>
              </div>
            </div>
            <div className="w-14" />
          </div>

          {/* Screenshot */}
          <div className="relative">
            <img
              src={appDashboard}
              alt="Hydra Dashboard — Visual Regression Testing Command Center"
              className="w-full h-auto block"
              loading="lazy"
            />
            {/* Bottom gradient fade */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none" />
          </div>
        </div>
      </motion.div>
    </section>
  )
}
