'use client'

import { motion } from 'framer-motion'
import { Server, Database, Image, Shield, Cpu, Terminal } from 'lucide-react'

const specs = [
  {
    icon: Cpu,
    title: 'Pixelmatch Engine',
    desc: 'Custom 0.05 threshold sub-pixel comparison with anti-aliasing (AA) exclusion filters to ignore GPU font rendering variances.',
  },
  {
    icon: Terminal,
    title: 'Puppeteer-Core Offloading',
    desc: 'Local browser capture (<1MB install size) offloads rendering to developer machines, keeping server RAM usage at 0%.',
  },
  {
    icon: Image,
    title: 'ImageKit CDN Streaming',
    desc: 'Binary image buffers stream directly to ImageKit global CDN edge nodes without writing temporary files to server disk.',
  },
  {
    icon: Server,
    title: 'Docker Microservices',
    desc: 'Full-stack containerization with Linux Chromium C++ dependencies pre-loaded for 100% reproducible environments.',
  },
  {
    icon: Shield,
    title: 'Gemini 2.5 AI Agent',
    desc: 'Multimodal generative model analyzes DOM tree heatmaps, identifies broken CSS rules, and formulates candidate fix branches.',
  },
  {
    icon: Database,
    title: 'MongoDB & In-Memory Caching',
    desc: 'High-throughput test run persistence backed by node-cache in-memory key validation for sub-10ms API responses.',
  },
]

export default function ArchitectureDeepDive() {
  return (
    <section id="architecture" className="relative bg-[#030304] py-32 px-6 overflow-hidden border-t border-white/[0.06]">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[11px] font-mono text-cyan-400/70 tracking-[0.25em] uppercase mb-4"
          >
            Technical Specifications
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            style={{ fontFamily: "'Syne', sans-serif" }}
            className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-5"
          >
            Architecture & Deep Dive
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            style={{ fontFamily: "'Plus_Jakarta_Sans', sans-serif" }}
            className="text-white/40 text-sm max-w-xl mx-auto"
          >
            Engineered for high-density CI/CD pipelines. Every architectural decision prioritizes speed, security, and developer ergonomics.
          </motion.p>
        </div>

        {/* Technical Specs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {specs.map((spec, i) => (
            <motion.div
              key={spec.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="p-6 rounded-2xl bg-[#07070a] border border-white/[0.06] hover:border-white/20 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-white/70 mb-5">
                  <spec.icon className="w-4 h-4" />
                </div>
                <h4 className="font-['Syne'] text-base font-bold text-white mb-2">
                  {spec.title}
                </h4>
                <p className="text-white/40 text-xs leading-relaxed font-['Plus_Jakarta_Sans'] font-light">
                  {spec.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
