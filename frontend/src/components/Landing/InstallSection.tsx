import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Copy, Check } from "lucide-react";

const FRAMEWORKS = ["React", "Next.js", "Vite", "Astro", "Remix"];

// Animation lines with timing
const LINES: { delay: number; text: string; prompt?: boolean }[] = [
  { delay: 0.0, text: "npm install @hydra/cli", prompt: true },
  { delay: 1.1, text: "✔  Project connected to Hydra dashboard",  prompt: false },
  { delay: 2.0, text: "",                         prompt: false },
  { delay: 2.3, text: "npx hydra scan",           prompt: true },
  { delay: 3.4, text: "Uploading snapshots to dashboard...",    prompt: false },
  { delay: 4.2, text: "✔  Report ready · hydra.app/runs/a3f192",  prompt: false },
];

const ease = [0.22, 1, 0.36, 1] as const;

export function InstallSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText("npm install @hydra/cli");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };


  return (
    <section ref={ref} className="relative py-32 px-6">
      {/* Single faint blue glow — same intensity as hero word glow */}
      <div className="pointer-events-none absolute inset-0 flex justify-center items-start pt-24">
        <div className="h-72 w-72 rounded-full bg-blue-500/[0.07] blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-2xl text-center">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease }}
          className="mb-5 text-xs font-medium tracking-[0.12em]  uppercase text-white/30"
        >
          EASY TO USE
        </motion.p>

        {/* Heading — same scale as hero h2 */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.08, duration: 0.55, ease }}
          className="mb-4 text-4xl sm:text-5xl font-semibold tracking-[-0.02em] leading-[1.3] text-white font-boldonse"
        >
          Connect your project in seconds.
        </motion.h2>

        {/* Sub — same color as hero h3 */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.55, ease }}
          className="mb-12 text-base text-zinc-400 font-normal leading-7"
        >
          The npm package is a lightweight connector. Scans run from the CLI
          or directly from your Hydra dashboard — no installs required.
        </motion.p>

        {/* Terminal — glass card, same style as nav border */}
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.98 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ delay: 0.22, duration: 0.6, ease }}
          className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] text-left shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
        >
          {/* Title bar */}
          <div className="flex h-10 items-center justify-between border-b border-white/[0.05] px-4">
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
              <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
              <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
            </div>
            <span className="text-[11px] font-serif text-white/20">terminal</span>
            <button
              onClick={copy}
              className="flex items-center gap-1.5 text-[11px] font-serif text-white/30 transition hover:text-white/60"
            >
              {copied
                ? <><Check size={11} className="text-white/60" /> copied</>
                : <><Copy size={11} /> copy</>
              }
            </button>
          </div>

          {/* Lines */}
          <div className="space-y-1 p-5 min-h-[160px]">
            {inView && LINES.map((l, i) =>
              l.text === "" ? (
                <div key={i} className="h-3" />
              ) : (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: l.delay, duration: 0.3 }}
                  className="flex items-center gap-3 font-serif text-[13px] leading-6"
                >
                  {l.prompt && (
                    <span className="shrink-0 text-white/20 select-none">$</span>
                  )}
                  <span
                    className={
                      l.prompt
                        ? "text-white/80"
                        : l.text.startsWith("✔")
                        ? "text-white/35"
                        : "text-white/35"
                    }
                  >
                    {l.text}
                  </span>
                </motion.div>
              )
            )}
          </div>
        </motion.div>

        {/* Framework badges — minimal, same border style as hero secondary button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.55, ease }}
          className="mt-7 flex flex-wrap items-center justify-center gap-2"
        >
          <span className="mr-1 text-[11px] text-white/20 font-serif tracking-wide">connector available for</span>
          {FRAMEWORKS.map((name) => (
            <span
              key={name}
              className="rounded-full border border-white/[0.08] px-3 py-1 text-[11px] text-white/40 font-serif transition hover:border-white/[0.14] hover:text-white/60"
            >
              {name}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
