'use client'

import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Terminal from './Terminal'
import { ArrowRight, BookOpen } from 'lucide-react'
import hydraLogo from '../../assets/hydralogo.png'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] as const },
  }),
}

export default function Hero() {
  return (
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center overflow-hidden bg-[#060608] pt-32 pb-20 select-none">
      {/* Clean Static Subtle Lighting Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />

      {/* Hero Content Container (Restrained, Apple/Vercel Aesthetic) */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 flex flex-col items-center text-center">
        
        {/* Subtle Hydra Brand Logo Icon Header */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mb-6 flex items-center justify-center"
        >
          <div className="w-10 h-10 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl flex items-center justify-center p-2 shadow-2xl">
            <img src={hydraLogo} alt="Hydra" className="w-full h-full object-contain" />
          </div>
        </motion.div>

        {/* Restrained Headline (Fits comfortably inside viewport, No Shouting) */}
        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          style={{ fontFamily: "'Syne', sans-serif" }}
          className="font-bold text-4xl sm:text-5xl md:text-6xl text-white tracking-tight leading-[1.08] mb-5 max-w-3xl"
        >
          Catch visual regressions before your users do.
        </motion.h1>

        {/* Concise Single-Sentence Subtitle */}
        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          className="text-sm md:text-base text-white/50 max-w-xl leading-relaxed mb-8 font-normal"
        >
          Hydra compares staging against production viewports, isolates pixel shifts down to the DOM element, and generates code fixes automatically.
        </motion.p>

        {/* Primary Terminal Installation Command */}
        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="w-full flex justify-center mb-8"
        >
          <Terminal />
        </motion.div>

        {/* Dual Primary & Secondary Action CTAs */}
        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex items-center gap-4 text-xs font-semibold"
        >
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-black hover:bg-white/90 transition-all duration-200 shadow-md hover:scale-[1.02]"
          >
            Get Started
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/docs"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-white/70 hover:text-white bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] transition-all duration-200"
          >
            <BookOpen className="w-3.5 h-3.5 text-white/60" />
            Documentation
          </Link>
        </motion.div>

      </div>
    </section>
  )
}
