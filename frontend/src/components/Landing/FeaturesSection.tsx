import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Camera,
  Cpu,
  BarChart3,
  GitPullRequest,
  Zap,
  Layers,
} from "lucide-react";

const FEATURES = [
  {
    icon: Camera,
    title: "Pixel-Perfect Comparison",
    description:
      "Capture screenshots at sub-pixel accuracy across every viewport. Nothing slips through.",
    color: "#3b82f6",
  },
  {
    icon: Cpu,
    title: "AI-Assisted Bug Detection",
    description:
      "Our AI engine understands intent, not just pixels. It flags what actually matters.",
    color: "#8b5cf6",
  },
  {
    icon: BarChart3,
    title: "Visual Diff Heatmaps",
    description:
      "Instantly see exactly what changed with surgical heatmap overlays on every diff.",
    color: "#06b6d4",
  },
  {
    icon: GitPullRequest,
    title: "GitHub PR Integration",
    description:
      "Inline diff reports right inside your pull requests. Review visually, not just in code.",
    color: "#10b981",
  },
  {
    icon: Zap,
    title: "CI/CD Pipeline Support",
    description:
      "Plugs into GitHub Actions, GitLab CI, and CircleCI. Works in any pipeline.",
    color: "#f59e0b",
  },
  {
    icon: Layers,
    title: "Lightning-Fast Scans",
    description:
      "Parallel scanning completes in seconds. Never block a deploy waiting for tests.",
    color: "#ef4444",
  },
];

function FeatureCard({
  icon: Icon,
  title,
  description,
  color,
  index,
}: (typeof FEATURES)[number] & { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        delay: index * 0.07,
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/[0.14] hover:bg-white/[0.05]"
      style={{
        boxShadow: "0 0 0 0px " + color + "00",
      }}
    >
      {/* Hover glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 rounded-2xl"
        style={{
          background: `radial-gradient(200px circle at 50% -20%, ${color}18 0%, transparent 70%)`,
        }}
      />

      {/* Icon */}
      <div
        className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04]"
        style={{ boxShadow: `0 0 16px ${color}25` }}
      >
        <Icon size={18} style={{ color }} />
      </div>

      <h3 className="mb-2 text-base font-semibold text-white tracking-tight">
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-white/45">{description}</p>
    </motion.div>
  );
}

export function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative py-32 px-6">
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[600px] w-[800px] rounded-full bg-violet-600/[0.04] blur-[150px]" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* Heading */}
        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/[0.07] px-4 py-1.5 text-xs font-medium text-violet-400 tracking-wide"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
            Everything you need
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl"
          >
            Built for the modern{" "}
            <span className="text-violet-400 drop-shadow-[0_0_20px_rgba(139,92,246,0.5)]">
              frontend team
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.18, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-xl text-base text-white/45"
          >
            Every tool you need to catch UI regressions before they reach production.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <FeatureCard key={f.title} {...f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
