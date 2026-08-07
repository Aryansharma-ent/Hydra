import { motion } from "framer-motion";
import {
  ScanLine,
  Flame,
  GitPullRequest,
  Zap,
  Layers,
  GitBranch,
} from "lucide-react";
import React from "react";

const ease = [0.22, 1, 0.36, 1] as const;

// ─── Shared card wrapper ──────────────────────────────────────────────────────
function Card({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay, duration: 0.5, ease }}
      whileHover={{
        y: -3,
        transition: { duration: 0.22, ease },
      }}
      className={`group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] transition-all duration-300 hover:border-amber-300/25 hover:bg-white/[0.035] hover:shadow-[0_12px_40px_rgba(0,0,0,0.5),0_0_30px_rgba(251,191,36,0.05)] ${className}`}
    >
      {children}
    </motion.div>
  );
}

// ─── Shared typographic atoms ─────────────────────────────────────────────────
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/30">
      {children}
    </p>
  );
}

function Title({ children, large }: { children: React.ReactNode; large?: boolean }) {
  return (
    <h3
      className={`font-semibold leading-snug tracking-tight text-white/90 ${
        large ? "text-[17px]" : "text-[14px]"
      }`}
    >
      {children}
    </h3>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[13px] leading-relaxed text-zinc-400 font-normal">{children}</p>
  );
}

// Icon container — white-yellow glow by default, intensifies on hover
function Icon({
  icon: Ic,
  size = 16,
  large,
}: {
  icon: React.ElementType;
  size?: number;
  large?: boolean;
}) {
  const dim = large ? "h-12 w-12 rounded-xl" : "h-10 w-10 rounded-xl";
  return (
    <div
      className={`inline-flex shrink-0 items-center justify-center border border-amber-300/25 bg-amber-400/[0.06] shadow-[0_0_20px_rgba(253,224,71,0.18)] transition-all duration-300 group-hover:border-amber-200/50 group-hover:bg-amber-300/[0.12] group-hover:shadow-[0_0_28px_rgba(254,240,138,0.4)] ${dim}`}
    >
      <Ic
        size={size}
        className="text-amber-200 drop-shadow-[0_0_8px_rgba(254,240,138,0.7)] transition-all duration-300 group-hover:text-amber-100 group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.95)]"
      />
    </div>
  );
}

// ─── Individual cards ─────────────────────────────────────────────────────────

/**
 * ① Pixel Comparison — 2 cols wide.
 */
function CardPixelComparison() {
  return (
    <Card className="lg:col-span-2 p-7" delay={0}>
      <div className="flex flex-col h-full gap-5">
        <Icon icon={ScanLine} size={17} />
        <div className="flex-1 space-y-2">
          <Eyebrow>Pixel Comparison</Eyebrow>
          <Title large>
            Compare screenshots with pixel-level precision.
          </Title>
          <Body>
            Every scan diffs routes at the sub-pixel level across every
            viewport you define. Nothing moves without you knowing.
          </Body>
        </div>
        {/* Typographic accent — clean sans */}
        <div className="flex items-center gap-3 pt-1 border-t border-white/[0.05]">
          <span className="text-[11px] font-medium text-white/30">before</span>
          <div className="flex-1 h-px bg-white/[0.05]" />
          <span className="text-[11px] font-semibold text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.4)]">diff</span>
          <div className="flex-1 h-px bg-white/[0.05]" />
          <span className="text-[11px] font-medium text-white/30">after</span>
        </div>
      </div>
    </Card>
  );
}

/**
 * ② Heatmaps — 1 col.
 */
function CardHeatmaps() {
  return (
    <Card className="p-7" delay={0.06}>
      <div className="flex items-start justify-between mb-5">
        <Icon icon={Flame} size={16} />
        <span className="rounded-full border border-white/[0.08] px-2.5 py-0.5 text-[10px] font-medium text-white/40">
          per scan
        </span>
      </div>
      <div className="h-px bg-white/[0.05] mb-5" />
      <Eyebrow>Heatmaps</Eyebrow>
      <div className="mt-2">
        <Title>Instantly see where your UI changed.</Title>
      </div>
    </Card>
  );
}

/**
 * ③ CI Integration — 1 col.
 */
function CardCI() {
  return (
    <Card className="p-7" delay={0.10}>
      <Icon icon={GitBranch} size={16} />
      <div className="mt-5 space-y-2">
        <Eyebrow>CI Integration</Eyebrow>
        <Title>Run visual checks in every deployment pipeline.</Title>
        <Body>GitHub Actions, GitLab CI, CircleCI. Or skip CI and scan from the dashboard.</Body>
      </div>
    </Card>
  );
}

/**
 * ④ Pull Requests — 1 col.
 */
function CardPR() {
  return (
    <Card className="p-7" delay={0.14}>
      <Icon icon={GitPullRequest} size={17} large />
      <div className="mt-6 space-y-2">
        <Eyebrow>Pull Requests</Eyebrow>
        <Title>Review visual changes directly inside every PR.</Title>
      </div>
    </Card>
  );
}

/**
 * ⑤ Fast Scans — 1 col.
 */
function CardFastScans() {
  return (
    <Card className="p-7" delay={0.18}>
      <Icon icon={Zap} size={16} />
      <div className="mt-5 space-y-2">
        <Eyebrow>Fast Scans</Eyebrow>
        <Title>Parallelized screenshots without slowing your workflow.</Title>
      </div>
      <div className="mt-6 pt-5 border-t border-white/[0.05]">
        <span className="tabular-nums text-[32px] font-semibold leading-none tracking-[-0.04em] text-white/80">
          2.3
          <span className="ml-1 text-base font-normal text-white/30">s avg</span>
        </span>
        <p className="mt-1.5 text-[11px] font-medium text-white/30">24 routes · parallelized</p>
      </div>
    </Card>
  );
}

/**
 * ⑥ Baselines — full 3-col width.
 */
function CardBaselines() {
  const versions = [
    { tag: "v2.4.1", status: "current",   note: "48 routes" },
    { tag: "v2.4.0", status: "2 changes", note: "48 routes" },
    { tag: "v2.3.9", status: "passed",    note: "47 routes" },
  ];

  return (
    <Card className="lg:col-span-3 p-7" delay={0.22}>
      <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        {/* Left: text */}
        <div className="flex flex-col gap-5 sm:max-w-xs">
          <Icon icon={Layers} size={16} />
          <div className="space-y-2">
            <Eyebrow>Baselines</Eyebrow>
            <Title large>Manage reference snapshots across releases.</Title>
            <Body>
              Promote any scan to a new baseline. Roll back to any previous
              version without losing history.
            </Body>
          </div>
        </div>

        {/* Right: version list — pure typography */}
        <div className="flex flex-col gap-2 sm:min-w-[260px]">
          {versions.map((v, i) => (
            <div
              key={v.tag}
              className={`flex items-center justify-between rounded-xl border px-4 py-3 transition-colors ${
                i === 0
                  ? "border-white/[0.09] bg-white/[0.04]"
                  : "border-white/[0.05] bg-white/[0.015]"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-[12px] font-semibold text-white/70">{v.tag}</span>
                <span className="text-[11px] text-white/30">{v.note}</span>
              </div>
              <span
                className={`text-[11px] font-medium ${
                  i === 0
                    ? "text-white/50"
                    : v.status.includes("changes")
                    ? "text-blue-400"
                    : "text-white/30"
                }`}
              >
                {v.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
export function FeaturesSection() {
  return (
    <section id="features" className="relative py-32 px-6">
      <div className="mx-auto max-w-6xl">

        {/* Heading */}
        <div className="mb-16 text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease }}
            className="mb-5 text-xs font-medium tracking-[0.12em] uppercase text-white/30"
          >
            Features
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: 0.08, duration: 0.5, ease }}
            className="mb-4 text-4xl sm:text-5xl font-semibold tracking-[-0.04em] leading-[1.1] text-white font-boldonse"
          >
            One platform. Every workflow.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: 0.14, duration: 0.5, ease }}
            className="mx-auto max-w-md text-base text-zinc-400 leading-7"
          >
            Trigger scans from the dashboard, the CLI, or your CI pipeline.
            Results always land in one place.
          </motion.p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <CardPixelComparison />
          <CardHeatmaps />
          <CardCI />
          <CardPR />
          <CardFastScans />
          <CardBaselines />
        </div>

      </div>
    </section>
  );
}
