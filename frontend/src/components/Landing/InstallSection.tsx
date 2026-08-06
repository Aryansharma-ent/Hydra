import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Copy, Check } from "lucide-react";

const FRAMEWORKS = [
  { name: "React", color: "#61DAFB" },
  { name: "Next.js", color: "#FFFFFF" },
  { name: "Vite", color: "#BD34FE" },
  { name: "Astro", color: "#FF5D01" },
  { name: "Remix", color: "#3992FF" },
];

const LINES = [
  { delay: 0,    text: "$ npm install @hydra/cli",       dim: false },
  { delay: 1.2,  text: "✔ Installed 1 package in 0.8s",  dim: true  },
  { delay: 2.0,  text: "",                                dim: false },
  { delay: 2.4,  text: "$ npx hydra scan",               dim: false },
  { delay: 3.6,  text: "🔍 Scanning 24 components...",   dim: true  },
  { delay: 4.4,  text: "✔ 0 regressions found. All clear!", dim: true },
];

function AnimatedLine({ text, dim, delay }: { text: string; dim: boolean; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`font-mono text-sm leading-7 ${dim ? "text-white/40" : "text-white/90"}`}
    >
      {text || <span className="invisible">_</span>}
    </motion.div>
  );
}

export function InstallSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText("npm install @hydra/cli");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section ref={ref} className="relative py-32 px-6">
      {/* Faint blue radial glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[500px] w-[600px] rounded-full bg-blue-600/[0.06] blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/[0.07] px-4 py-1.5 text-xs font-medium text-blue-400 tracking-wide"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
          One command. Done.
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl"
        >
          Install Hydra in Under{" "}
          <span className="text-blue-400 drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]">
            30 Seconds
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 text-base text-white/50"
        >
          One command to install. One command to scan. Zero configuration required.
        </motion.p>

        {/* Terminal card */}
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.98 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] text-left"
        >
          {/* Title bar */}
          <div className="flex h-11 items-center justify-between border-b border-white/[0.05] bg-white/[0.02] px-5">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500/70" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
              <div className="h-3 w-3 rounded-full bg-green-500/70" />
            </div>
            <span className="text-xs font-mono text-white/30">hydra terminal</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.04] px-2.5 py-1 text-xs text-white/50 transition hover:bg-white/[0.08] hover:text-white/80"
            >
              {copied ? (
                <><Check size={11} className="text-emerald-400" /><span className="text-emerald-400">Copied</span></>
              ) : (
                <><Copy size={11} /><span>Copy</span></>
              )}
            </button>
          </div>

          {/* Lines */}
          <div className="p-6 space-y-0.5 min-h-[180px]">
            {inView && LINES.map((l, i) => (
              <AnimatedLine key={i} text={l.text} dim={l.dim} delay={l.delay} />
            ))}
          </div>
        </motion.div>

        {/* Framework badges */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <span className="text-xs text-white/30 font-mono">Works with</span>
          {FRAMEWORKS.map((f) => (
            <span
              key={f.name}
              className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-1 text-xs font-medium text-white/60 transition hover:border-white/20 hover:text-white/90"
              style={{ borderColor: `${f.color}20` }}
            >
              {f.name}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
