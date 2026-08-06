import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { FaGithub } from "react-icons/fa";

const ease = [0.22, 1, 0.36, 1] as const;

export function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative py-40 px-6 overflow-hidden">
      {/* Same subtle blue glow as hero "Regression." word — nothing stronger */}
      <div className="pointer-events-none absolute inset-0 flex justify-center items-center">
        <div className="h-80 w-80 rounded-full bg-blue-500/[0.08] blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-2xl text-center">
        {/* Eyebrow — same style as every other section */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease }}
          className="mb-5 text-xs font-medium tracking-[0.12em] uppercase text-white/30"
        >
          Get started
        </motion.p>

        {/* Heading — same tracking/weight as hero h1 */}
        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.08, duration: 0.6, ease }}
          className="mb-5 text-5xl sm:text-6xl font-semibold tracking-[-0.05em] leading-[1.3] text-white font-boldonse"
        >
          Ready to catch every
          <br />
          {/* Same subtle blue-glow treatment as "Regression." in hero */}
          <span className="drop-shadow-[0_0_25px_rgba(59,130,246,0.45)]">
            visual regression?
          </span>
        </motion.h2>

        {/* Sub — same style as hero h3 */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.17, duration: 0.55, ease }}
          className="mb-10 text-base text-zinc-400 leading-7 max-w-md mx-auto font-normal"
        >
          Sign up and run your first scan in minutes.
          No npm install required. No credit card needed.
        </motion.p>

        {/* Buttons — exactly the same as hero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.26, duration: 0.55, ease }}
          className="flex flex-wrap items-center justify-center gap-5"
        >
          {/* Primary — identical to hero "Start Free →" */}
          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-full bg-white px-8 py-3.5 font-medium text-black transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,255,255,0.25)]"
          >
            Start Free →
          </motion.button>

          {/* Secondary — identical to hero "View on GitHub" */}
          <motion.a
            href="https://github.com/Aryansharma-ent/Hydra"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl px-8 py-3.5 font-medium text-white/90 transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:text-white"
          >
            <FaGithub className="h-5 w-5" />
            View on GitHub
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
