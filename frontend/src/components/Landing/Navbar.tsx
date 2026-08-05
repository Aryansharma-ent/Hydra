'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import hydraLogo from '../../assets/hydralogo.png'

const NAV_LINKS = [
  { label: 'Platform', href: '#platform' },
  { label: 'Solutions', href: '#solutions' },
  { label: 'Enterprise', href: '#enterprise' },
  { label: 'Docs', href: '/docs' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'GitHub', href: 'https://github.com' },
]

function GithubIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -15, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2.5rem)] max-w-5xl"
    >
      <div
        className={`relative flex items-center justify-between h-12 px-5 rounded-full transition-all duration-300 border ${
          scrolled
            ? 'bg-[#08080a]/90 backdrop-blur-2xl border-white/10 shadow-[0_12px_32px_rgba(0,0,0,0.7)]'
            : 'bg-[#09090c]/40 backdrop-blur-md border-white/[0.06]'
        }`}
      >
        {/* Official Hydra Logo */}
        <Link to="/" className="flex items-center gap-2.5 select-none group">
          <img
            src={hydraLogo}
            alt="Hydra"
            className="w-6 h-6 object-contain transition-transform duration-200 group-hover:scale-105"
          />
          <span className="font-['Syne'] text-sm font-bold text-white tracking-wide">
            Hydra
          </span>
        </Link>

        {/* Center Links (Linear / Vercel Navigation Structure) */}
        <div className="hidden md:flex items-center gap-1 font-['Plus_Jakarta_Sans']">
          {NAV_LINKS.map((link) => {
            const isExternal = link.href.startsWith('http')
            const isRoute = link.href.startsWith('/')

            if (isRoute) {
              return (
                <Link
                  key={link.label}
                  to={link.href}
                  className="px-3.5 py-1 text-xs text-white/60 hover:text-white transition-colors duration-150 rounded-full hover:bg-white/[0.04]"
                >
                  {link.label}
                </Link>
              )
            }

            return (
              <a
                key={link.label}
                href={link.href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className="px-3.5 py-1 text-xs text-white/60 hover:text-white transition-colors duration-150 rounded-full hover:bg-white/[0.04]"
              >
                {link.label}
              </a>
            )
          })}
        </div>

        {/* Right Action Controls: GitHub Star + Get Started */}
        <div className="flex items-center gap-2.5">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-white/70 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-full transition-all duration-150"
          >
            <GithubIcon className="w-3.5 h-3.5 text-white/80" />
            <span>Star</span>
            <span className="px-1.5 py-0.2 rounded-full bg-white/10 text-[10px] font-mono text-white/80">
              1.4k
            </span>
          </a>

          <Link
            to="/signup"
            className="inline-flex items-center gap-1.5 px-4 py-1 text-xs font-semibold text-black bg-white hover:bg-white/90 rounded-full transition-all duration-150 shadow-sm"
          >
            Get Started
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-1.5 rounded-full hover:bg-white/[0.08] transition-colors text-white/70"
            aria-label="Toggle menu"
          >
            <div className="w-4 h-4 flex flex-col justify-center gap-[3px]">
              <span className={`block w-full h-[1.5px] bg-white transition-transform duration-200 ${mobileOpen ? 'rotate-45 translate-y-[4.5px]' : ''}`} />
              <span className={`block w-full h-[1.5px] bg-white transition-opacity duration-200 ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-full h-[1.5px] bg-white transition-transform duration-200 ${mobileOpen ? '-rotate-45 -translate-y-[4.5px]' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="md:hidden mt-2 rounded-2xl bg-[#09090c]/95 backdrop-blur-2xl border border-white/10 p-3 shadow-2xl"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2 text-xs text-white/70 hover:text-white hover:bg-white/[0.05] rounded-xl transition-colors font-medium"
              >
                {link.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
