'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { Link } from 'react-router-dom'

const tiers = [
  {
    name: 'Open Source',
    price: 'Free',
    period: '',
    description: 'Core visual regression engine for individual developers and small teams.',
    features: [
      'Sub-pixel diff detection',
      'CLI runner (npx)',
      'Dashboard inspector',
      'Docker deployment',
      'Unlimited local scans',
      'Community support',
    ],
    cta: 'Get started',
    ctaLink: '/signup',
    highlighted: false,
  },
  {
    name: 'Hydra Pro',
    price: '₹499',
    period: '/mo',
    description: 'AI-powered auto-healing and automated remediation for production teams.',
    features: [
      'Everything in Free',
      'AI auto-healing agent',
      'Automated CSS patches',
      'Cloud browser offloading',
      'Priority support',
      'Candidate fix branches',
    ],
    cta: 'Upgrade to Pro',
    ctaLink: '/signup',
    highlighted: true,
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="relative bg-[#050505] py-32 px-6 overflow-hidden">
      {/* Section Header */}
      <div className="max-w-4xl mx-auto text-center mb-20">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-[11px] font-mono text-violet-400/50 tracking-[0.25em] uppercase mb-4"
        >
          Pricing
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl md:text-5xl font-extralight text-white tracking-tight"
        >
          Start free. Scale when ready.
        </motion.h2>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
        {tiers.map((tier, i) => (
          <motion.div
            key={tier.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative group"
          >
            {/* Gradient border for Pro card */}
            {tier.highlighted && (
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-violet-500/20 via-violet-500/5 to-transparent pointer-events-none" />
            )}

            <div className={`relative h-full rounded-2xl p-8 flex flex-col ${
              tier.highlighted
                ? 'bg-[#0c0c0e] border border-violet-500/10'
                : 'bg-[#0a0a0b] border border-white/[0.04]'
            }`}>
              {/* Badge */}
              {tier.highlighted && (
                <span className="absolute top-4 right-4 text-[9px] font-mono text-violet-400/60 bg-violet-500/[0.06] border border-violet-500/[0.10] px-2 py-0.5 rounded-full tracking-wider">
                  popular
                </span>
              )}

              {/* Tier Name */}
              <p className="text-sm text-white/40 font-medium mb-4">{tier.name}</p>

              {/* Price */}
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-light text-white tracking-tight">{tier.price}</span>
                {tier.period && <span className="text-sm text-white/20">{tier.period}</span>}
              </div>

              {/* Description */}
              <p className="text-[13px] text-white/20 leading-relaxed mb-8 font-light">
                {tier.description}
              </p>

              {/* Features */}
              <div className="flex flex-col gap-3 mb-8 flex-1">
                {tier.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2.5">
                    <Check className="w-3.5 h-3.5 text-violet-400/40 shrink-0" />
                    <span className="text-[13px] text-white/35 font-light">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Link
                to={tier.ctaLink}
                className={`block text-center py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  tier.highlighted
                    ? 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/20 hover:shadow-violet-500/30'
                    : 'bg-white/[0.04] hover:bg-white/[0.08] text-white/60 hover:text-white border border-white/[0.06] hover:border-white/[0.12]'
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
