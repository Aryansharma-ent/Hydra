'use client'

import { motion } from 'framer-motion'
import { Camera, Layers, Sparkles } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: Camera,
    title: 'Automated High-DPI Capture',
    description: 'Scans staging and production viewports simultaneously with animation clock freezing for 100% deterministic baselines.',
  },
  {
    number: '02',
    icon: Layers,
    title: 'Sub-Pixel Isolation Engine',
    description: 'Isolates 1-pixel shift boundaries and layout collapses directly back to the target DOM component node.',
  },
  {
    number: '03',
    icon: Sparkles,
    title: 'Instant Code Remediation',
    description: 'Generates copy-pasteable CSS/Tailwind code patches and candidate branches directly into your workspace.',
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

export default function HowItWorks() {
  return (
    <section id="solutions" className="relative bg-[#030304] py-32 px-6 overflow-hidden border-t border-white/[0.06]">
      {/* Section Header */}
      <div className="max-w-4xl mx-auto text-center mb-20">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-[11px] font-mono text-violet-400/70 tracking-[0.25em] uppercase mb-4"
        >
          Automated Workflow
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ fontFamily: "'Syne', sans-serif" }}
          className="text-3xl md:text-5xl font-bold text-white tracking-tight"
        >
          From Visual Bug to Pull Request in Minutes
        </motion.h2>
      </div>

      {/* Steps */}
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 relative">
          
          {/* Connecting line */}
          <div className="hidden md:block absolute top-16 left-[16.66%] right-[16.66%] h-px">
            <motion.div
              className="h-full bg-gradient-to-r from-transparent via-white/[0.12] to-transparent"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
            />
          </div>

          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="relative rounded-2xl bg-[#08080c] border border-white/[0.08] group-hover:border-violet-500/40 p-8 transition-all duration-500 shadow-2xl h-full flex flex-col justify-between">
                <div>
                  <span className="text-[54px] font-['Syne'] font-extrabold text-white/[0.04] absolute top-4 right-6 leading-none select-none pointer-events-none">
                    {step.number}
                  </span>

                  <div className="w-10 h-10 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-6 group-hover:bg-violet-500/20 transition-all duration-500">
                    <step.icon className="w-4.5 h-4.5 text-violet-400" />
                  </div>

                  <h3 className="font-['Syne'] text-lg font-bold text-white mb-3 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="font-['Plus_Jakarta_Sans'] text-xs text-white/50 leading-relaxed font-light">
                    {step.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
