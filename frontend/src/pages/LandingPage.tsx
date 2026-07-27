import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView, useAnimation, AnimatePresence } from 'framer-motion';
import { ChevronRight, Plus, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

// ─── Import local assets ──────────────────────────────────────────────────────
import step2Photo from '../assets/step2_photo.png';
import ctaPhoto from '../assets/cta_photo.png';
import appDashboard from '../assets/app_dashboard.png';
import appCiPipeline from '../assets/app_ci_pipeline.png';
import appConsole from '../assets/app_console.png';

// ─── Reusable scroll reveal wrapper ──────────────────────────────────────────
function Reveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'left' | 'right' | 'none';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const controls = useAnimation();

  const variants = {
    up:    { hidden: { opacity: 0, y: 32 },   visible: { opacity: 1, y: 0 } },
    left:  { hidden: { opacity: 0, x: -40 },  visible: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: 40 },   visible: { opacity: 1, x: 0 } },
    none:  { hidden: { opacity: 0 },           visible: { opacity: 1 } },
  };




  useEffect(() => {
    if (inView) controls.start('visible');
  }, [inView, controls]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: variants[direction].hidden,
        visible: {
          ...variants[direction].visible,
          transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1], delay },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (window.location.search) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#080808]/95 backdrop-blur-md border-b border-white/5' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 select-none">
          <img
            src="/src/assets/hydralogo.png"
            className="h-8 w-8 object-contain"
            alt="Hydra"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <span
            className="text-2xl font-bold text-white tracking-wider"
            style={{ fontFamily: "'Oswald', sans-serif" }}
          >
            Hydra
          </span>
        </Link>

        {/* Center links */}
        <div className="hidden md:flex items-center gap-8 text-sm text-white/55 font-medium">
          {[
            { label: 'How it works', href: '#how-it-works' },
            { label: 'Features',     href: '#features' },
            { label: 'Pricing',      href: '#pricing' },
            { label: 'Resources',    href: '#resources' },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="hover:text-white transition-colors duration-200"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Right CTAs */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="px-5 py-2 text-sm font-medium text-white border border-white/20 rounded-lg hover:bg-white/5 transition-colors"
          >
            Login
          </Link>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
            <Link
              to="/signup"
              className="px-5 py-2 text-sm font-bold text-black bg-[#00e5ff] rounded-lg hover:bg-[#00ccee] transition-colors shadow-lg shadow-[#00e5ff]/25"
            >
              Start
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
}

// ─── FLOATING APP SCREENSHOTS GRID ───────────────────────────────────────────
function FloatingScreenshots() {
  // Layout: 3 real app screenshots scattered around the hero text
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Top-left: Dashboard */}
      <motion.div
        initial={{ opacity: 0, scale: 0.82, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 0, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-[7%] left-[1%] w-[280px] rounded-xl overflow-hidden border border-white/10 shadow-2xl shadow-black/60"
      >
        <img src={appDashboard} alt="Hydra Dashboard" className="w-full h-auto block" />
      </motion.div>

      {/* Top-right: Console */}
      <motion.div
        initial={{ opacity: 0, scale: 0.82, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-[5%] right-[1%] w-[280px] rounded-xl overflow-hidden border border-white/10 shadow-2xl shadow-black/60"
      >
        <img src={appConsole} alt="Hydra Console" className="w-full h-auto block" />
      </motion.div>

      {/* Bottom-left: CI Pipeline */}
      <motion.div
        initial={{ opacity: 0, scale: 0.82, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-[14%] left-[1%] w-[230px] rounded-xl overflow-hidden border border-white/10 shadow-2xl shadow-black/60"
      >
        <img src={appCiPipeline} alt="CI Pipeline" className="w-full h-auto block" />
      </motion.div>

      {/* Bottom-right: Dashboard again (slightly different crop feel) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.82, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-[14%] right-[1%] w-[230px] rounded-xl overflow-hidden border border-white/10 shadow-2xl shadow-black/60"
      >
        <img src={appConsole} alt="Hydra Console" className="w-full h-auto block" />
      </motion.div>
    </div>
  );
}

// ─── HERO SECTION ─────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="relative min-h-screen bg-[#0a0a0a] flex items-center justify-center pt-16 overflow-hidden">
      <FloatingScreenshots />

      {/* Subtle radial spotlight */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_55%_55%_at_50%_48%,rgba(0,229,255,0.035),transparent)]" />

      <div className="relative z-10 text-center max-w-2xl mx-auto px-6 py-24">
        <motion.h1
          initial={{ opacity: 0, y: 55 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="text-5xl md:text-[4.5rem] font-black pb-4 text-white uppercase leading-[1.03] tracking-wider mb-6"
          style={{ fontFamily: "'Oswald', sans-serif" }}
        >
          Identify & Debug Visual Bugs<br />
          <span className='text-2xl absolute '>with Hydra</span><br />
          
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
          className="text-sm text-[#00e5ff] max-w-sm mx-auto mb-10 leading-relaxed"
        >
          The cold eye of the machine finds what your tired eyes miss. Start your free trial
          and ship a perfect build tonight.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.65 }}
          className="flex items-center justify-center gap-3"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
            <Link
              to="/dashboard"
              className="inline-flex items-center px-7 py-3 text-sm font-bold text-black bg-[#00e5ff] rounded-lg shadow-lg shadow-[#00e5ff]/20 hover:bg-[#00ccee] transition-colors"
            >
              Start
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
            <a
              href="#how-it-works"
              className="inline-flex items-center px-7 py-3 text-sm font-medium text-white bg-[#1a1a1a] border border-white/15 rounded-lg hover:bg-[#222] transition-colors"
            >
              Demo
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Amber trust strip */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#c8891a] py-5 overflow-hidden">
        <p className="text-center text-[9px] font-bold text-black/55 tracking-[0.28em] uppercase mb-4">
          Trusted by the World's Most Demanding Engineering Teams
        </p>
        <div className="flex overflow-hidden">
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="flex items-center gap-14 whitespace-nowrap shrink-0"
          >
            {[...Array(2)].flatMap((_, rep) =>
              ['Webflow', 'Relume', 'Webflow', 'Relume', 'Webflow', 'Relume'].map((brand, j) => (
                <span key={`${rep}-${j}`} className="flex items-center gap-2 text-sm font-bold text-black/75">
                  <span className="w-5 h-5 bg-black/20 rounded-[3px] flex items-center justify-center text-[8px] font-black text-black">
                    {brand === 'Webflow' ? 'W' : 'R'}
                  </span>
                  {brand}
                </span>
              ))
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── PRECISION SECTION ────────────────────────────────────────────────────────
function PrecisionSection() {
  const featureCols = [
    {
      icon: (
        <svg className="h-8 w-8 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      ),
      title: 'Catch the Bugs That Break the User Experience',
      desc: 'A one-pixel shift can destroy a conversion funnel. We find the invisible cracks.',
      highlight: false,
    },
    {
      icon: (
        <svg className="h-8 w-8 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
        </svg>
      ),
      title: 'Ship with the Confidence of a Perfect Build',
      desc: 'Know with absolute certainty that production looks exactly like staging. Every time.',
      highlight: false,
    },
    {
      tag: 'CSS',
      title: 'Let AI Write the Fix While You Drink Coffee',
      desc: 'Gemini AI reads the diff and suggests the exact CSS. You just approve the change.',
      highlight: true,
    },
  ];

  return (
    <section id="features" className="bg-[#0a0a0a] py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <p className="text-[10px] font-bold text-[#00e5ff] uppercase tracking-[0.3em] mb-3">
            Precision
          </p>
        </Reveal>
        <Reveal delay={0.07}>
          <h2
            className="text-3xl md:text-5xl font-black text-white uppercase leading-tight mb-5"
            style={{ fontFamily: "'Oswald', sans-serif" }}
          >
            Stop Wasting Your Best Minds<br />
            on Manual QA
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="text-sm text-white/45 leading-relaxed max-w-sm mb-14">
            Manual testing is{' '}
            <span className="text-[#00e5ff] underline decoration-dotted">slow</span> and it{' '}
            <span className="text-[#00e5ff] underline decoration-dotted">misses things</span>. Hydra gives you back the hours you
            lost squinting at screens.
          </p>
        </Reveal>

        {/* Icon row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-14">
          {featureCols.map((f, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="flex flex-col gap-4">
                {f.tag ? (
                  <span className="text-[10px] font-bold text-[#00e5ff] tracking-widest uppercase">{f.tag}</span>
                ) : (
                  <div>{f.icon}</div>
                )}
                <h3
                  className="text-base font-black text-white uppercase leading-snug"
                  style={{ fontFamily: "'Oswald', sans-serif" }}
                >
                  {f.title}
                </h3>
                <p className={`text-xs leading-relaxed ${f.highlight ? 'text-[#00e5ff]' : 'text-white/40'}`}>
                  {f.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3}>
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="px-5 py-2.5 text-xs font-bold text-black bg-[#00e5ff] rounded hover:bg-[#00ccee] transition-colors"
            >
              Learn
            </Link>
            <Link
              to="/docs"
              className="flex items-center gap-1 text-xs font-semibold text-white hover:text-[#00e5ff] transition-colors"
            >
              Docs <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── THREE STEPS SECTION ──────────────────────────────────────────────────────
function StepsSection() {
  return (
    <section id="how-it-works" className="bg-[#0a0a0a] py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <p className="text-center text-[9px] font-bold text-white/35 uppercase tracking-[0.3em] mb-4">
            Simple
          </p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2
            className="text-center text-3xl md:text-5xl font-black text-white uppercase mb-4"
            style={{ fontFamily: "'Oswald', sans-serif" }}
          >
            Three Steps to Perfection
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-center text-sm text-white/40 max-w-md mx-auto mb-12">
            Debugging visual regressions is a brutal task. We made it simple.
          </p>
        </Reveal>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1 — App Dashboard screenshot */}
          <Reveal delay={0}>
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ duration: 0.25 }}
              className="rounded-2xl border border-white/6 bg-[#101010] overflow-hidden flex flex-col min-h-[320px]"
            >
              {/* Real app screenshot */}
              <div className="flex-1 overflow-hidden">
                <img src={appDashboard} alt="Hydra Dashboard" className="w-full h-full object-cover object-top" />
              </div>
              <div className="p-5 border-t border-white/5">
                <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-2">Step 1</p>
                <h3
                  className="text-sm font-black text-white uppercase leading-tight mb-1"
                  style={{ fontFamily: "'Oswald', sans-serif" }}
                >
                  Input Your Staging and Production URLs
                </h3>
                <p className="text-[11px] text-white/40 mb-3">
                  Tell Hydra which pages to watch. It takes ten seconds.
                </p>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-1 text-xs font-bold text-white hover:text-[#00e5ff] transition-colors"
                >
                  Start <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.div>
          </Reveal>

          {/* Card 2 — photo */}
          <Reveal delay={0.12}>
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ duration: 0.25 }}
              className="rounded-2xl border border-white/6 bg-[#101010] overflow-hidden flex flex-col min-h-[320px]"
            >
              {/* Photo fills top */}
              <div className="flex-1 overflow-hidden">
                <img src={step2Photo} alt="Two people working" className="w-full h-full object-cover" />
              </div>
              {/* Text at bottom */}
              <div className="p-5 border-t border-white/5">
                <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-2">Step 2</p>
                <h3
                  className="text-sm font-black text-white uppercase leading-tight mb-1"
                  style={{ fontFamily: "'Oswald', sans-serif" }}
                >
                  Pixel by Pixel
                </h3>
                <p className="text-[11px] text-white/40 mb-3">
                  Hydra renders both pages and compares every single pixel.
                </p>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-1 text-xs font-bold text-white hover:text-[#00e5ff] transition-colors"
                >
                  Learn <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.div>
          </Reveal>

          {/* Card 3 — App Console screenshot */}
          <Reveal delay={0.24}>
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ duration: 0.25 }}
              className="rounded-2xl border border-white/6 bg-[#101010] overflow-hidden flex flex-col min-h-[320px]"
            >
              <div className="flex-1 overflow-hidden">
                <img src={appConsole} alt="Hydra Console" className="w-full h-full object-cover object-top" />
              </div>
              <div className="p-5 border-t border-white/5">
                <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-2">Step 3</p>
                <h3
                  className="text-sm font-black text-white uppercase leading-tight mb-1"
                  style={{ fontFamily: "'Oswald', sans-serif" }}
                >
                  Instant CSS Fix
                </h3>
                <p className="text-[11px] text-white/40 mb-3">
                  Gemini AI highlights the bug and writes the code to fix it.
                </p>
                <Link
                  to="/docs"
                  className="flex items-center gap-1 text-xs font-bold text-white hover:text-[#00e5ff] transition-colors"
                >
                  Docs <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─── INTELLIGENCE SECTION ─────────────────────────────────────────────────────
function IntelligenceSection() {
  return (
    <section className="bg-[#0a0a0a] py-24 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Top centered header */}
        <Reveal>
          <p className="text-center text-[9px] font-bold text-white/35 uppercase tracking-[0.3em] mb-4">
            Intelligence
          </p>
        </Reveal>
        <Reveal delay={0.07}>
          <h2
            className="text-center text-3xl md:text-5xl font-black text-white uppercase leading-tight mb-6"
            style={{ fontFamily: "'Oswald', sans-serif" }}
          >
            The Fix Appears Before You<br />
            Finish Your Coffee
          </h2>
        </Reveal>
        <Reveal delay={0.13}>
          <p className="text-center text-sm leading-relaxed max-w-md mx-auto mb-6">
            <span className="text-white/45">Hydra does not just </span>
            <span className="text-[#f59e0b]">point at the wound</span>
            <span className="text-white/45">. The Gemini AI sidebar reads the </span>
            <span className="text-[#f59e0b]">visual diff</span>
            <span className="text-white/45"> and writes the exact CSS to </span>
            <span className="text-[#f59e0b]">heal it</span>
            <span className="text-white/45">.</span>
          </p>
        </Reveal>
        <Reveal delay={0.18}>
          <div className="flex items-center justify-center gap-4 mb-16">
            <Link
              to="/dashboard"
              className="px-5 py-2.5 text-xs font-bold text-black bg-[#00e5ff] rounded hover:bg-[#00ccee] transition-colors"
            >
              Learn
            </Link>
            <Link
              to="/docs"
              className="flex items-center gap-1 text-xs font-semibold text-white hover:text-[#00e5ff] transition-colors"
            >
              Docs <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Reveal>

        {/* Two-column: features left, photo right */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <Reveal direction="left">
            <div className="flex flex-col gap-10">
              {[
                {
                  title: 'Instant Diagnosis',
                  desc: 'The sidebar does not just show you the wound. It tells you how to close it.',
                  color: '#00e5ff',
                },
                {
                  title: 'Ready Code',
                  desc: 'Gemini AI reads the broken pixels and writes the CSS you need. You stay in flow.',
                  color: '',
                },
                {
                  title: 'Code, Not Just Criticism',
                  desc: 'A red highlight marks the failure. The sidebar delivers the fix in clean, copyable CSS.',
                  color: '',
                },
              ].map((item, i) => (
                <div key={i}>
                  <h3
                    className="text-sm font-black text-white uppercase mb-2"
                    style={{ fontFamily: "'Oswald', sans-serif" }}
                  >
                    {item.title}
                  </h3>
                  <p className={`text-xs leading-relaxed ${item.color ? `text-[${item.color}]` : 'text-white/40'}`}
                    style={item.color ? { color: item.color } : {}}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal direction="right">
            <div className="rounded-2xl overflow-hidden border border-white/6">
              <img src={appConsole} alt="Hydra AI Console" className="w-full h-full object-cover" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─── INTEGRATION SECTION ──────────────────────────────────────────────────────
function IntegrationSection() {
  return (
    <section className="bg-[#0a0a0a] py-0 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* CI Pipeline screenshot — perfect for the Integration section */}
          <Reveal direction="left" className="overflow-hidden rounded-xl border border-white/8 shadow-2xl shadow-black/80">
            <img
              src={appCiPipeline}
              alt="GitHub Actions CI Pipeline"
              className="w-full h-full object-cover object-top"
            />
          </Reveal>

          {/* Dark panel right */}
          <Reveal direction="right">
            <div className="bg-[#0f0f0f] p-12 flex flex-col justify-center h-full border-l border-white/5">
              <p className="text-[9px] font-bold text-[#00e5ff] uppercase tracking-[0.3em] mb-4">
                Integration
              </p>
              <h2
                className="text-2xl md:text-3xl font-black text-white uppercase leading-tight mb-5"
                style={{ fontFamily: "'Oswald', sans-serif" }}
              >
                It Fits into the Way<br />
                You Already Work
              </h2>
              <p className="text-sm leading-relaxed mb-8 max-w-xs">
                <span className="text-white/40">Hydra slides into your </span>
                <span className="text-[#f59e0b]">pipeline</span>
                <span className="text-white/40"> without a fight. It checks every pull request so broken layouts never reach production.</span>
              </p>

              {/* Bullets */}
              <div className="grid grid-cols-2 gap-6 mb-10">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="h-3.5 w-3.5 text-[#00e5ff] shrink-0" />
                    <span className="text-[10px] font-black text-white uppercase tracking-wide">
                      CI/CD Native
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    <span className="text-[#f59e0b]">Run visual checks automatically with GitHub Actions</span>
                    <span className="text-white/40">. No manual triggers needed.</span>
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="h-3.5 w-3.5 text-white/50 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <span className="text-[10px] font-black text-white uppercase tracking-wide">
                      Clean Merge
                    </span>
                  </div>
                  <p className="text-[11px] text-white/40 leading-relaxed">
                    Block the merge until the pixels match. Ship clean code.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Link
                  to="/dashboard"
                  className="px-5 py-2.5 text-xs font-bold text-black bg-[#00e5ff] rounded hover:bg-[#00ccee] transition-colors"
                >
                  Learn
                </Link>
                <Link
                  to="/docs"
                  className="flex items-center gap-1 text-xs font-semibold text-white hover:text-[#00e5ff] transition-colors"
                >
                  Docs <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
const testimonials = [
  {
    stars: 5,
    quote: '"Hydra caught a layout shift in our checkout flow that three QA passes missed. It paid for itself in one sprint."',
    name: 'David Chen',
    role: 'Lead Engineer, Stellar',
    initials: 'DC',
    color: '#4f46e5',
  },
  {
    stars: 5,
    quote: '"We removed the manual visual review step from our deployment checklist. The machine is faster and it is never wrong."',
    name: 'Sarah Jenkins',
    role: 'QA Lead, Monolith',
    initials: 'SJ',
    color: '#0891b2',
  },
  {
    stars: 5,
    quote: '"The AI sidebar is not a gimmick. It wrote the flexbox fix for a Safari bug while I was reading the diff."',
    name: 'Marco Ruiz',
    role: 'Frontend Dev, Arcade',
    initials: 'MR',
    color: '#059669',
  },
];

function TestimonialsSection() {
  return (
    <section className="bg-[#dbeafe]/30 backdrop-blur-sm py-24 px-6" style={{ backgroundColor: '#e8f4fb' }}>
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <h2
            className="text-center text-3xl md:text-4xl font-black text-black uppercase mb-3"
            style={{ fontFamily: "'Oswald', sans-serif" }}
          >
            Testimonials
          </h2>
        </Reveal>
        <Reveal delay={0.07}>
          <p className="text-center text-sm text-black/50 mb-12">
            Engineers who stopped shipping broken pages
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-black/5 flex flex-col gap-4"
              >
                {/* Stars */}
                <div className="flex items-center gap-0.5">
                  {[...Array(t.stars)].map((_, s) => (
                    <span key={s} className="text-black text-sm">★</span>
                  ))}
                </div>
                {/* Quote */}
                <p className="text-sm text-black/75 leading-relaxed flex-1">{t.quote}</p>
                {/* Author */}
                <div className="flex items-center gap-3 pt-2 border-t border-black/5">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: t.color }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-black">{t.name}</p>
                    <p className="text-[10px] text-black/45">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ SECTION ──────────────────────────────────────────────────────────────
const faqs = [
  {
    q: 'Which browsers are supported?',
    a: 'Hydra renders on Chromium, Firefox, and WebKit. We cover Chrome, Safari, Firefox, and Edge. If your users are on it, we test it.',
    aHighlight: 'Hydra renders on Chromium, Firefox, and WebKit.',
  },
  {
    q: 'How does the AI fix work?',
    a: 'Gemini AI analyzes the visual diff and the underlying DOM. It identifies the offending element and generates a CSS snippet to correct the layout. You review and approve the change.',
    aHighlight: 'Gemini AI analyzes the visual diff',
  },
  {
    q: 'Can it check mobile viewports?',
    a: 'Yes. You define the viewport sizes. Hydra scans them all. A broken hamburger menu on a 320px width will not escape.',
    aHighlight: 'You define the viewport sizes. Hydra scans them all.',
  },
  {
    q: 'Does it integrate with GitHub Actions?',
    a: 'It was built for it. Add the Hydra action to your workflow file. It runs on every pull request and blocks the merge if a visual regression is detected.',
    aHighlight: 'Add the Hydra action to your workflow file.',
  },
  {
    q: 'Is my production data safe?',
    a: 'We only render the public URLs you provide. We do not access your databases or internal servers. The screenshots are encrypted and you control the retention policy.',
    aHighlight: 'We only render the public URLs you provide.',
  },
];

function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="resources" className="bg-[#0a0a0a] py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <Reveal>
          <div className="inline-block border border-white px-3 py-1 mb-4">
            <h2
              className="text-3xl md:text-4xl font-black text-white uppercase"
              style={{ fontFamily: "'Oswald', sans-serif" }}
            >
              FAQs
            </h2>
          </div>
        </Reveal>
        <Reveal delay={0.07}>
          <p className="text-sm text-white/45 mb-12">
            Straight answers for engineers who want to{' '}
            <span className="text-[#00e5ff]">ship clean code</span>.
          </p>
        </Reveal>

        <div className="flex flex-col gap-2">
          {faqs.map((faq, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <div
                className="bg-[#111] border border-white/6 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <span className="text-sm font-semibold text-white">{faq.q}</span>
                  <motion.div
                    animate={{ rotate: open === i ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="shrink-0"
                  >
                    <Plus className="h-4 w-4 text-white/50" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-4 text-sm leading-relaxed text-[#f59e0b]">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Still have questions */}
        <Reveal delay={0.3}>
          <div className="mt-14">
            <h3
              className="text-xl font-black text-white uppercase mb-2"
              style={{ fontFamily: "'Oswald', sans-serif" }}
            >
              Still Have Questions?
            </h3>
            <p className="text-sm text-white/45 mb-5">
              Talk to an engineer who <span className="italic text-white/70">actually</span> built the product.
            </p>
            <button className="px-6 py-2.5 text-xs font-bold text-white border border-white/25 rounded hover:bg-white/5 transition-colors">
              Contact
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── FINAL CTA SECTION ────────────────────────────────────────────────────────
function FinalCTASection() {
  return (
    <section id="pricing" className="bg-white py-20 px-6">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <Reveal>
          <h2
            className="text-4xl md:text-5xl font-black text-black uppercase leading-tight mb-5"
            style={{ fontFamily: "'Oswald', sans-serif" }}
          >
            Stop Shipping Visual Bugs Today
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="text-sm text-[#f59e0b] mb-8">
            Start your free trial. No credit card. No demo call. Just clean code.
          </p>
        </Reveal>
        <Reveal delay={0.14}>
          <div className="flex items-center justify-center gap-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
              <Link
                to="/dashboard"
                className="inline-flex items-center px-7 py-3 text-sm font-bold text-black bg-[#00e5ff] rounded-lg shadow-lg shadow-[#00e5ff]/20 hover:bg-[#00ccee] transition-colors"
              >
                Start
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
              <a
                href="#how-it-works"
                className="inline-flex items-center px-7 py-3 text-sm font-medium text-black bg-white border border-black/15 rounded-lg hover:bg-black/5 transition-colors"
              >
                Demo
              </a>
            </motion.div>
          </div>
        </Reveal>
      </div>

      {/* Full-width photo */}
      <div className="max-w-6xl mx-auto rounded-none overflow-hidden">
        <img src={ctaPhoto} alt="Developer working" className="w-full h-72 md:h-96 object-cover" />
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-white border-t border-black/8">
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Left: Logo + Address + Social */}
          <div className="flex flex-col gap-5">
            <span className="text-2xl text-black" style={{ fontFamily: 'cursive' }}>Logo</span>
            <div>
              <p className="text-[10px] font-bold text-black uppercase mb-1">Address</p>
              <p className="text-xs text-black/55 leading-relaxed">Level 1, 12 Sample St, Sydney NSW 2000</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-black uppercase mb-1">Contact</p>
              <p className="text-xs text-black/55">1800 123 4567</p>
              <p className="text-xs text-black/55">hello@hydra.dev</p>
            </div>
            {/* Social icons */}
            <div className="flex items-center gap-3">
              {[
                { d: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
                { d: 'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z' },
                { d: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
                { d: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z' },
                { d: 'M23.495 0H.505C.226 0 0 .226 0 .505v22.99C0 23.775.226 24 .505 24h12.386v-10.01H9.692v-3.9h3.199V7.72c0-3.168 1.934-4.893 4.762-4.893 1.355 0 2.519.1 2.858.145v3.314h-1.961c-1.537 0-1.834.73-1.834 1.799v2.362h3.668l-.477 3.9h-3.191V24h6.257c.279 0 .504-.225.504-.505V.505C24 .226 23.775 0 23.495 0z' },
              ].map((icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-7 h-7 rounded-full bg-black/8 hover:bg-black/15 transition-colors flex items-center justify-center"
                >
                  <svg className="h-3.5 w-3.5 text-black/60 fill-current" viewBox="0 0 24 24">
                    <path d={icon.d} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Middle column */}
          <div>
            <div className="flex flex-col gap-3">
              {['Home', 'How it works', 'Features', 'Pricing', 'Documentation'].map((link) => (
                <a key={link} href="#" className="text-sm font-medium text-black/65 hover:text-black transition-colors">
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div>
            <div className="flex flex-col gap-3">
              {['API status', 'Changelog', 'Blog', 'Careers', 'Contact us'].map((link) => (
                <a key={link} href="#" className="text-sm font-medium text-black/65 hover:text-black transition-colors">
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-black/8">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <p className="text-[11px] text-black/35">© 2025 Hydra. All rights reserved.</p>
          <div className="flex items-center gap-6">
            {['Privacy policy', 'Terms of service', 'Cookie settings'].map((label) => (
              <a key={label} href="#" className="text-[11px] text-black/35 hover:text-black/60 transition-colors">
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {

     const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("hydra_token");
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <PrecisionSection />
      <StepsSection />
      <IntelligenceSection />
      <IntegrationSection />
      <TestimonialsSection />
      <FAQSection />
      <FinalCTASection />
      <Footer />
    </div>
  );
}
