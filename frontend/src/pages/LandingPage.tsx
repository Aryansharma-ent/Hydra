import { ChevronDown } from 'lucide-react'
import { FaGithub } from "react-icons/fa";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import bgImage from '../assets/background.png'
import Particles from '@/components/Particles';

import hydraLogo from '../assets/hydralogo.png'

import { InstallSection }    from '@/components/Landing/InstallSection'
import { FeaturesSection }   from '@/components/Landing/FeaturesSection'
import { HowItWorksSection } from '@/components/Landing/HowItWorksSection'
import { ComparisonSection } from '@/components/Landing/ComparisonSection'
import { FAQSection }        from '@/components/Landing/FAQSection'
import { CTASection }        from '@/components/Landing/CTASection'
import Footer from '@/components/Landing/Footer';

const words = ["Catch", "Every", "Visual", "Regression."];

const LandingPage = () => {
  return (
    <>
      {/* ─── HERO (bg image only here) ─── */}
      <div
        style={{ backgroundImage: `url(${bgImage})` }}
        className="relative bg-cover bg-center min-h-screen antialiased select-none text-white"
      >

    <div className="absolute inset-0 z-0 ">
        <Particles
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleColors={["#ffffff"]}
          moveParticlesOnHover
          particleHoverFactor={-1}
          alphaParticles={false}
          particleBaseSize={100}
          sizeRandomness={1}
          cameraDistance={20}
          disableRotation={false}
        />
         
      </div>


        {/* Gradient fade at bottom of hero into pure black */}
        <div className=" relative pointer-events-none absolute bottom-0 left-0 right-0  bg-gradient-to-b from-transparent to-black z-10" />

        {/* ── Navbar ── */}
        <nav className="fixed top-5 left-1/2 z-50 w-[92%] max-w-7xl -translate-x-1/2">
          <div className="flex h-16 items-center justify-between rounded-[22px] border border-white/5 bg-black/30 px-8 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
            <h1 className="text-lg font-semibold tracking-tight text-white flex items-center gap-2">
              <img src={hydraLogo} alt="Hydra" className="h-10 w-10 border rounded-3xl object-contain" />
              Hydra
            </h1>

            <div className="hidden md:flex items-center gap-10 text-sm text-white/70">
              <a href="#features" className="transition hover:text-white">Features</a>
              <a href="#how-it-works" className="transition hover:text-white">How It Works</a>
              <a href="#faq" className="transition hover:text-white">FAQ</a>
              <a href="#" className="transition hover:text-white">Docs</a>
              <button className="flex items-center gap-1 transition hover:text-white">
                ENG
                <ChevronDown size={14} />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="rounded-full bg-white/5 px-5 py-2 text-sm text-white transition hover:bg-white/10"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded-full bg-white px-5 py-2 text-sm font-medium text-black transition hover:bg-neutral-200"
              >
                Sign up
              </Link>
            </div>
          </div>
        </nav>

        {/* ── Hero content ── */}
        <div className="flex flex-col justify-center text-center gap-7 pt-30 pb-32 max-w-5xl mx-auto items-center px-6">
          <motion.h1
            className="text-4xl sm:text-7xl lg:text-7xl boldonse-regular tracking-[-0.06em] leading-[1.45] text-white max-w-3xl mx-auto text-center flex flex-wrap justify-center gap-x-4 gap-y-2"
          >
            {words.map((word, i) => (
              <motion.span
                key={word}
                className={word === "Regression." ? "text-blue-400 drop-shadow-[0_0_25px_rgba(59,130,246,0.45)]" : ""}
                initial={{ opacity: 0, y: 35 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 25, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.55, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl text-yellow-100/90 fira-sans-regular  "
          >
            Before Your Users Do.
          </motion.h2>

          <motion.h3
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-xl mx-auto text-base leading-8 text-zinc-400 font-normal tracking-wide"
          >
            Captures. Diff heatmaps. Code fixes.
            <br />
            The ultimate visual regression testing toolkit.
          </motion.h3>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-2 flex flex-wrap items-center justify-center gap-5"
          >
            <Link to="/signup">
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="rounded-full bg-white px-8 py-3.5 font-medium text-black transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,255,255,0.25)]"
              >
                Start Free →
              </motion.button>
            </Link>

            <motion.a
              href="https://github.com/Aryansharma-ent/Hydra"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl px-8 py-3.5 font-medium text-white/90 transition-all duration-300 hover:border-blue-500/30 hover:bg-white/10 hover:text-white"
            >
              <FaGithub className="h-5 w-5" />
              View on GitHub
            </motion.a>
          </motion.div>
        </div>
      </div>

      {/* ─── REST OF PAGE: pure black ─── */}
      <div className="bg-black text-white">
        {/* Subtle stars noise layer */}
        <div
          className="pointer-events-none fixed inset-0 z-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
          }}
        />

        <div id="install"><InstallSection /></div>

        {/* Divider line */}
        <div className="mx-auto max-w-5xl px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
        </div>

        <div id="features"><FeaturesSection /></div>

        <div className="mx-auto max-w-5xl px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
        </div>

        <div id="how-it-works"><HowItWorksSection /></div>

        <div className="mx-auto max-w-5xl px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
        </div>

        <ComparisonSection />

        <div className="mx-auto max-w-5xl px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
        </div>

        <div id="faq"><FAQSection /></div>

        <div className="mx-auto max-w-5xl px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
        </div>

        <CTASection />

        <footer className="border-t border-white/[0.05] py-10 text-center text-xs text-white/20 font-mono">
         <Footer/>
        </footer>
      </div>
    </>
  );
};

export default LandingPage;
