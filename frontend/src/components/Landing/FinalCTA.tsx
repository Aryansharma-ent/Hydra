'use client'

import { motion } from 'framer-motion'
import Terminal from './Terminal'
import { Link } from 'react-router-dom'

export default function FinalCTA() {
  return (
    <section className="relative bg-[#050505] py-32 px-6 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-violet-500/[0.02] rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-extralight text-white tracking-tight mb-4"
        >
          Stop shipping visual bugs.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-base text-white/25 mb-12 font-light"
        >
          Get started in 30 seconds. No credit card required.
        </motion.p>

        {/* Terminal */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-10"
        >
          <Terminal />
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center justify-center gap-3"
        >
          <Link
            to="/signup"
            className="px-6 py-2.5 text-sm font-medium text-white bg-violet-600 hover:bg-violet-500 rounded-xl shadow-lg shadow-violet-600/20 hover:shadow-violet-500/30 transition-all duration-300"
          >
            Start free
          </Link>
          <Link
            to="/docs"
            className="px-6 py-2.5 text-sm font-medium text-white/40 hover:text-white/70 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-white/[0.12] rounded-xl transition-all duration-300"
          >
            Read docs
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
