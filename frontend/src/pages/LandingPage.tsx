import { useEffect, useRef, useState, useLayoutEffect, useCallback } from 'react';
import { ChevronRight, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Import local assets ──────────────────────────────────────────────────────
import appDashboard from '../assets/app_dashboard.png';

// ─── Constants ────────────────────────────────────────────────────────────────
const FRAME_COUNT = 300;
const FRAME_PATH = '/scrollanimation/ezgif-frame-';

// ═══════════════════════════════════════════════════════════════════════════════
// NAVBAR
// ═══════════════════════════════════════════════════════════════════════════════
function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav
      id="hydra-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled ? 'bg-[#080808]/95 backdrop-blur-md border-b border-white/5' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
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

        <div className="hidden md:flex items-center gap-8 text-sm text-white/55 font-medium">
          {[
            { label: 'How it works', href: '#how-it-works' },
            { label: 'Features',     href: '#features-section' },
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

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="px-5 py-2 text-sm font-medium text-white border border-white/20 rounded-lg hover:bg-white/5 transition-colors"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="px-5 py-2 text-sm font-bold text-black bg-[#00e5ff] rounded-lg hover:bg-[#00ccee] transition-colors shadow-lg shadow-[#00e5ff]/25"
          >
            Start
          </Link>
        </div>
      </div>
    </nav>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// HERO SECTION (Apple / Linear Product Launch Style)
// ═══════════════════════════════════════════════════════════════════════════════
function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  // Micro-interaction: 3D mouse parallax on background logo
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!heroRef.current || !logoRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

    gsap.to(logoRef.current, {
      x: x * 10,
      y: y * 10,
      rotateX: -y * 5,
      rotateY: x * 5,
      duration: 0.8,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    if (logoRef.current) {
      gsap.to(logoRef.current, {
        x: 0,
        y: 0,
        rotateX: 0,
        rotateY: 0,
        duration: 1.2,
        ease: 'power2.out',
      });
    }
  };

  return (
    <section
      id="hero-section"
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative h-screen bg-black flex items-center justify-center pt-16 overflow-hidden select-none z-10"
    >
      {/* 1. Engineering Grid Background (3-5% opacity) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* 2. Soft Ambient Cyan/Indigo Radial Glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[750px] h-[750px] rounded-full bg-[radial-gradient(circle,rgba(0,229,255,0.08)_0%,rgba(99,102,241,0.03)_45%,transparent_70%)] blur-[90px]" />
      </div>

      {/* 3. Subtle Film Grain */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px',
        }}
      />

      {/* 4. Large Hydra Brand Emblem */}
      <div
        ref={logoRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] pointer-events-none flex items-center justify-center opacity-10"
        style={{ perspective: '1000px' }}
      >
        <div className="w-full h-full flex items-center justify-center filter drop-shadow-[0_0_60px_rgba(0,229,255,0.25)] blur-[1px] animate-pulse">
          <img
            src="/src/assets/hydralogo.png"
            alt=""
            className="w-[580px] h-[580px] object-contain"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        </div>
      </div>

      {/* 5. Hero Content (Always 100% Visible on Page Load) */}
      <div className="relative z-10 text-center max-w-3xl mx-auto px-6">
        <h1
          className="text-5xl md:text-[4.75rem] font-black pb-2 text-white uppercase leading-[1.02] tracking-wider mb-2"
          style={{ fontFamily: "'Oswald', sans-serif" }}
        >
          Identify & Debug
        </h1>

        <h2
          className="text-5xl md:text-[4.75rem] font-black pb-4 text-white uppercase leading-[1.02] tracking-wider mb-6"
          style={{ fontFamily: "'Oswald', sans-serif" }}
        >
          <span className="bg-gradient-to-r from-white via-[#00e5ff] to-[#a5f3fc] bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(0,229,255,0.2)]">
            Visual Bugs
          </span>
          <span className="text-xl md:text-2xl text-white/50 tracking-widest font-sans font-medium block mt-1">
            with Hydra Engine
          </span>
        </h2>

        <p className="text-sm text-[#00e5ff]/90 max-w-md mx-auto mb-10 leading-relaxed font-medium tracking-wide">
          The cold eye of the machine finds what your tired eyes miss. Compare staging vs production, pinpoint pixel shifts, and generate CSS fixes instantly.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link
            to="/dashboard"
            className="inline-flex items-center px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-black bg-[#00e5ff] rounded-lg shadow-[0_0_20px_rgba(0,229,255,0.25)] hover:shadow-[0_0_35px_rgba(0,229,255,0.45)] hover:-translate-y-0.5 transition-all duration-300"
          >
            Start Free Scan
          </Link>
          <a
            href="#how-it-works"
            className="inline-flex items-center px-8 py-3.5 text-xs font-semibold uppercase tracking-wider text-white/80 bg-[#111113] border border-white/15 rounded-lg hover:border-white/30 hover:text-white hover:-translate-y-0.5 transition-all duration-300"
          >
            Watch Keynote
          </a>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CINEMATIC EXPERIENCE (GSAP ScrollTrigger Pinned Frame-by-Frame Scanner)
// ═══════════════════════════════════════════════════════════════════════════════
function CinematicExperience() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinnedRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const blackOverlayRef = useRef<HTMLDivElement>(null);
  const overlaysRef = useRef<HTMLDivElement>(null);
  const featureRevealRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameObjRef = useRef({ frame: 0 });
  const lastRenderedFrameRef = useRef(-1);

  // Render canvas frame
  const renderFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[index];
    if (!canvas || !img) return;
    if (!img.complete || img.naturalWidth === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    if (index === lastRenderedFrameRef.current && canvas.width > 0) return;

    const dpr = window.devicePixelRatio || 1;
    if (canvas.width !== Math.floor(rect.width * dpr) || canvas.height !== Math.floor(rect.height * dpr)) {
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cW = rect.width;
    const cH = rect.height;
    const imgR = img.naturalWidth / img.naturalHeight;
    const canR = cW / cH;

    let dW: number, dH: number, dX: number, dY: number;
    if (canR > imgR) {
      dW = cW; dH = cW / imgR; dX = 0; dY = (cH - dH) / 2;
    } else {
      dH = cH; dW = cH * imgR; dX = (cW - dW) / 2; dY = 0;
    }

    ctx.clearRect(0, 0, cW, cH);
    ctx.drawImage(img, dX, dY, dW, dH);
    lastRenderedFrameRef.current = index;
  }, []);

  // Preload frame images
  useEffect(() => {
    const images: HTMLImageElement[] = [];
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = `${FRAME_PATH}${String(i).padStart(3, '0')}.jpg`;
      images.push(img);
    }
    imagesRef.current = images;

    images[0].onload = () => {
      lastRenderedFrameRef.current = -1;
      renderFrame(0);
    };
  }, [renderFrame]);

  // GSAP Master ScrollTrigger Timeline
  useLayoutEffect(() => {
    const frameObj = frameObjRef.current;
    frameObj.frame = 0;

    const onResize = () => {
      lastRenderedFrameRef.current = -1;
      renderFrame(Math.round(frameObj.frame));
    };
    window.addEventListener('resize', onResize);

    const ctx = gsap.context(() => {
      // 1. Navbar Fade Out when leaving Hero Section
      gsap.to('#hydra-navbar', {
        opacity: 0,
        y: -20,
        filter: 'blur(6px)',
        pointerEvents: 'none',
        ease: 'power1.out',
        scrollTrigger: {
          trigger: '#hero-section',
          start: '70% top',
          end: 'bottom top',
          scrub: 0.5,
        },
      });

      // 2. Master Pinned Scanner Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          pin: pinnedRef.current,
          scrub: 0.5,
          anticipatePin: 1,
        },
      });

      // A. Canvas fades in from pitch blackness (Zero pre-visible frame under Hero)
      tl.fromTo(
        canvasRef.current,
        { opacity: 0 },
        { opacity: 1, ease: 'power1.inOut', duration: 8 },
        0
      );

      // B. Frame sequence scrubbing (0 → 299 driven by scroll progress)
      tl.to(
        frameObj,
        {
          frame: FRAME_COUNT - 1,
          ease: 'none',
          snap: { frame: 1 },
          duration: 62,
          onUpdate: () => renderFrame(Math.round(frameObj.frame)),
        },
        0
      );

      // C. Black darkness overlay fade in
      tl.fromTo(
        blackOverlayRef.current,
        { opacity: 0 },
        { opacity: 1, ease: 'power2.inOut', duration: 18 },
        48
      );

      // D. Compositing overlays dissolve
      tl.to(
        overlaysRef.current,
        { opacity: 0, ease: 'power1.in', duration: 15 },
        50
      );

      // E. Feature 1 reveal (Baseline vs Regression materializes cleanly)
      tl.fromTo(
        featureRevealRef.current,
        { opacity: 0, y: 40, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, ease: 'power2.out', duration: 25 },
        60
      );

      // F. Navbar Fade back in as Feature 1 is revealed
      tl.fromTo(
        '#hydra-navbar',
        { opacity: 0, y: -20, filter: 'blur(6px)', pointerEvents: 'none' },
        { opacity: 1, y: 0, filter: 'blur(0px)', pointerEvents: 'auto', ease: 'power2.out', duration: 15 },
        75
      );
    });

    setTimeout(() => {
      lastRenderedFrameRef.current = -1;
      renderFrame(0);
      ScrollTrigger.refresh();
    }, 150);

    return () => {
      ctx.revert();
      window.removeEventListener('resize', onResize);
    };
  }, [renderFrame]);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative bg-black overflow-hidden"
      style={{ height: '2200px' }}
    >
      <div ref={pinnedRef} className="w-full h-screen relative overflow-hidden bg-black z-0">

        {/* Canvas (100% pitch black until scroll enters sequence) */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block z-0"
          style={{ opacity: 0 }}
        />

        {/* Compositing Overlays */}
        <div ref={overlaysRef} className="absolute inset-0 pointer-events-none z-1">
          <div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse 70% 70% at 50% 50%, transparent 50%, rgba(0,0,0,0.55) 100%)' }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-[25%]"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 40%, transparent 100%)' }}
          />
          <div
            className="absolute top-0 left-0 right-0 h-[8%]"
            style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 100%)' }}
          />
        </div>

        {/* Black Darkness Overlay */}
        <div
          ref={blackOverlayRef}
          className="absolute inset-0 bg-black pointer-events-none z-2"
          style={{ opacity: 0 }}
        />

        {/* Feature 1 Reveal */}
        <div
          ref={featureRevealRef}
          className="absolute inset-0 flex items-center justify-center bg-black z-10 pointer-events-none"
          style={{ opacity: 0 }}
        >
          <div className="max-w-5xl w-full mx-auto px-6">
            <div className="text-center mb-8">
              <p className="text-[10px] font-bold text-[#00e5ff] uppercase tracking-[0.4em] mb-3">
                Comparison Engine
              </p>
              <h3
                className="text-3xl md:text-5xl font-black text-white uppercase leading-tight mb-4"
                style={{ fontFamily: "'Oswald', sans-serif" }}
              >
                Baseline vs Regression
              </h3>
              <p className="text-sm text-white/40 leading-relaxed max-w-lg mx-auto">
                Hydra captures pixel-perfect screenshots of your staging and production websites simultaneously.
                The split-view comparison reveals every difference at a glance.
              </p>
            </div>
            <div className="rounded-xl overflow-hidden border border-white/[0.08] shadow-2xl shadow-black/90 bg-[#0a0a0a]">
              <img
                src="/afteranimation/basewebsite.png"
                alt="Baseline vs Regression comparison"
                className="w-full h-auto block"
                loading="eager"
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// FEATURE SHOWCASE (REMAINING FEATURES)
// ═══════════════════════════════════════════════════════════════════════════════
const REMAINING_FEATURES = [
  {
    tag: 'Detection Engine',
    title: 'Visual Difference Map',
    description:
      'An intelligent pixel-level difference engine highlights exactly where regressions occur. Changed pixels glow in the heatmap, mapping every deviation back to its DOM element with surgical precision.',
    image: '/afteranimation/regressionscreenshot.png',
    direction: 'right' as const,
  },
  {
    tag: 'AI Intelligence',
    title: 'AI Root Cause Analysis',
    description:
      'Gemini AI reads the visual diff, identifies the broken CSS property, and generates a copy-pasteable fix. It does not just show the wound — it writes the prescription.',
    image: '/afteranimation/Aiassitant.png',
    direction: 'left' as const,
  },
  {
    tag: 'Automation',
    title: 'CI/CD Integration',
    description:
      'Add Hydra to your GitHub Actions workflow. Every pull request triggers an automatic visual regression scan. Broken layouts never reach production.',
    image: '/afteranimation/yamlfile.png',
    direction: 'right' as const,
  },
];

function FeatureShowcase() {
  return (
    <section id="features-section" className="bg-black pt-16 relative z-20">
      <div className="max-w-6xl mx-auto px-6">
        {REMAINING_FEATURES.map((feature, i) => (
          <div
            key={i}
            className={`flex flex-col ${
              feature.direction === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'
            } items-center gap-12 md:gap-16 py-24 ${
              i < REMAINING_FEATURES.length - 1 ? 'border-b border-white/[0.04]' : ''
            }`}
          >
            <div className="flex-1 max-w-md">
              <p className="text-[10px] font-bold text-[#00e5ff] uppercase tracking-[0.3em] mb-4">
                {feature.tag}
              </p>
              <h3
                className="text-2xl md:text-3xl font-black text-white uppercase leading-tight mb-5"
                style={{ fontFamily: "'Oswald', sans-serif" }}
              >
                {feature.title}
              </h3>
              <p className="text-sm text-white/40 leading-relaxed mb-8">
                {feature.description}
              </p>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#00e5ff] hover:text-white transition-colors"
              >
                Try it now <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="flex-1 w-full">
              <div className="rounded-xl overflow-hidden border border-white/[0.06] shadow-2xl shadow-black/60 bg-[#0a0a0a]">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-auto block"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD SECTION
// ═══════════════════════════════════════════════════════════════════════════════
function DashboardSection() {
  return (
    <section className="bg-black py-24 px-6 border-t border-white/[0.04]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[10px] font-bold text-white/25 uppercase tracking-[0.3em] mb-4">
            Command Center
          </p>
          <h2
            className="text-3xl md:text-5xl font-black text-white uppercase leading-tight mb-5"
            style={{ fontFamily: "'Oswald', sans-serif" }}
          >
            Your Regression Dashboard
          </h2>
          <p className="text-sm text-white/40 max-w-lg mx-auto leading-relaxed">
            Track every scan, manage projects, view regression history, and monitor your
            visual health score — all from one clean interface.
          </p>
        </div>

        <div className="rounded-xl overflow-hidden border border-white/[0.06] shadow-2xl shadow-black/60 bg-[#0a0a0a]">
          <img
            src={appDashboard}
            alt="Hydra Dashboard"
            className="w-full h-auto block"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TESTIMONIALS
// ═══════════════════════════════════════════════════════════════════════════════
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
    <section className="bg-[#050505] py-24 px-6 border-t border-white/[0.04]">
      <div className="max-w-5xl mx-auto">
        <h2
          className="text-center text-3xl md:text-4xl font-black text-white uppercase mb-3"
          style={{ fontFamily: "'Oswald', sans-serif" }}
        >
          Testimonials
        </h2>
        <p className="text-center text-sm text-white/35 mb-12">
          Engineers who stopped shipping broken pages
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-[#0e0e0e] rounded-2xl p-6 border border-white/[0.06] flex flex-col gap-4"
            >
              <div className="flex items-center gap-0.5">
                {[...Array(t.stars)].map((_, s) => (
                  <span key={s} className="text-[#00e5ff] text-sm">★</span>
                ))}
              </div>
              <p className="text-sm text-white/60 leading-relaxed flex-1">{t.quote}</p>
              <div className="flex items-center gap-3 pt-2 border-t border-white/[0.06]">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: t.color }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-xs font-bold text-white">{t.name}</p>
                  <p className="text-[10px] text-white/35">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// FAQ
// ═══════════════════════════════════════════════════════════════════════════════
const faqs = [
  {
    q: 'Which browsers are supported?',
    a: 'Hydra renders on Chromium, Firefox, and WebKit. We cover Chrome, Safari, Firefox, and Edge. If your users are on it, we test it.',
  },
  {
    q: 'How does the AI fix work?',
    a: 'Gemini AI analyzes the visual diff and the underlying DOM. It identifies the offending element and generates a CSS snippet to correct the layout. You review and approve the change.',
  },
  {
    q: 'Can it check mobile viewports?',
    a: 'Yes. You define the viewport sizes. Hydra scans them all. A broken hamburger menu on a 320px width will not escape.',
  },
  {
    q: 'Does it integrate with GitHub Actions?',
    a: 'It was built for it. Add the Hydra action to your workflow file. It runs on every pull request and blocks the merge if a visual regression is detected.',
  },
  {
    q: 'Is my production data safe?',
    a: 'We only render the public URLs you provide. We do not access your databases or internal servers. The screenshots are encrypted and you control the retention policy.',
  },
];

function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="resources" className="bg-[#050505] py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <h2
          className="text-3xl md:text-4xl font-black text-white uppercase mb-3"
          style={{ fontFamily: "'Oswald', sans-serif" }}
        >
          FAQs
        </h2>
        <p className="text-sm text-white/35 mb-12">
          Straight answers for engineers who want to{' '}
          <span className="text-[#00e5ff]">ship clean code</span>.
        </p>

        <div className="flex flex-col gap-2">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-[#0e0e0e] border border-white/[0.06] rounded-lg overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
              >
                <span className="text-sm font-semibold text-white">{faq.q}</span>
                <Plus className={`h-4 w-4 text-[#00e5ff] transition-transform duration-200 ${open === i ? 'rotate-45' : ''}`} />
              </button>

              {open === i && (
                <p className="px-5 pb-4 text-sm leading-relaxed text-white/45 border-t border-white/[0.04] pt-3">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// FINAL CTA
// ═══════════════════════════════════════════════════════════════════════════════
function FinalCTASection() {
  return (
    <section id="pricing" className="bg-black py-32 px-6 border-t border-white/[0.04]">
      <div className="max-w-2xl mx-auto text-center">
        <h2
          className="text-4xl md:text-5xl font-black text-white uppercase leading-tight mb-5"
          style={{ fontFamily: "'Oswald', sans-serif" }}
        >
          Stop Shipping<br />Visual Bugs Today
        </h2>
        <p className="text-sm text-white/35 mb-10">
          Start your free trial. No credit card. No demo call. Just clean code.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            to="/dashboard"
            className="inline-flex items-center px-7 py-3 text-sm font-bold text-black bg-[#00e5ff] rounded-lg shadow-lg shadow-[#00e5ff]/20 hover:bg-[#00ccee] transition-colors"
          >
            Start Free Trial
          </Link>
          <a
            href="#how-it-works"
            className="inline-flex items-center px-7 py-3 text-sm font-medium text-white bg-[#111] border border-white/15 rounded-lg hover:bg-[#1a1a1a] transition-colors"
          >
            Watch Demo
          </a>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// FOOTER
// ═══════════════════════════════════════════════════════════════════════════════
function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-white/[0.04]">
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="flex flex-col gap-4 md:col-span-1">
            <span
              className="text-xl font-bold text-white tracking-wider"
              style={{ fontFamily: "'Oswald', sans-serif" }}
            >
              Hydra
            </span>
            <p className="text-xs text-white/30 leading-relaxed">
              AI-powered visual regression debugger.<br />
              Compare. Detect. Auto-fix.
            </p>
          </div>

          {[
            { title: 'Product', links: ['Features', 'Pricing', 'Documentation', 'Changelog'] },
            { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
            { title: 'Legal',   links: ['Privacy', 'Terms', 'Security'] },
          ].map((col) => (
            <div key={col.title}>
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4">{col.title}</p>
              <div className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <a key={link} href="#" className="text-sm text-white/30 hover:text-white transition-colors">
                    {link}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-6 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-white/20">© {new Date().getFullYear()} Hydra. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {['GitHub', 'Twitter', 'Discord'].map((social) => (
              <a key={social} href="#" className="text-[11px] text-white/20 hover:text-white/50 transition-colors">
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN LANDING PAGE
// ═══════════════════════════════════════════════════════════════════════════════
export default function LandingPage() {
  return (
    <div className="bg-black text-white overflow-x-hidden min-h-screen">
      <Navbar />

      {/* 1. Hero */}
      <HeroSection />

      {/* 2. GSAP Pinned Scroll-Driven Scanner Experience */}
      <CinematicExperience />

      {/* 3. Remaining Feature Showcase */}
      <FeatureShowcase />

      {/* 4. Dashboard */}
      <DashboardSection />

      {/* 5. Testimonials */}
      <TestimonialsSection />

      {/* 6. FAQ */}
      <FAQSection />

      {/* 7. Final CTA */}
      <FinalCTASection />

      {/* 8. Footer */}
      <Footer />
    </div>
  );
}