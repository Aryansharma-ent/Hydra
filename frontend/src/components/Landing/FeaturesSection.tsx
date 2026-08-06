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
      className={`group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] transition-all duration-300 hover:border-white/[0.11] hover:bg-white/[0.03] hover:shadow-[0_8px_32px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.07)] ${className}`}
    >
      {children}
    </motion.div>
  );
}

// ─── Shared typographic atoms ─────────────────────────────────────────────────
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-white/25">
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
    <p className="text-[13px] leading-relaxed text-zinc-500">{children}</p>
  );
}

// Icon container — hovered: very faint blue glow, icon brightens
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
      className={`inline-flex shrink-0 items-center justify-center border border-white/[0.07] bg-white/[0.03] transition-all duration-300 group-hover:border-white/[0.12] group-hover:shadow-[0_0_18px_rgba(59,130,246,0.10)] ${dim}`}
    >
      <Ic
        size={size}
        className="text-white/40 transition-colors duration-300 group-hover:text-white/75"
      />
    </div>
  );
}

// ─── Individual cards ─────────────────────────────────────────────────────────

/**
 * ① Pixel Comparison — 2 cols wide.
 *    Icon top-left. Below: title then body. A thin rule + two typographic
 *    "before · after" labels at the bottom serve as the only accent.
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
        {/* Typographic accent — no fake UI */}
        <div className="flex items-center gap-3 pt-1 border-t border-white/[0.05]">
          <span className="font-mono text-[10px] text-white/25">before</span>
          <div className="flex-1 h-px bg-white/[0.05]" />
          <span className="font-mono text-[10px] text-blue-400/50">diff</span>
          <div className="flex-1 h-px bg-white/[0.05]" />
          <span className="font-mono text-[10px] text-white/25">after</span>
        </div>
      </div>
    </Card>
  );
}

/**
 * ② Heatmaps — 1 col.
 *    Icon top-left. Thin horizontal rule between icon row and text.
 *    Rule creates breathing rhythm unique to this card.
 */
function CardHeatmaps() {
  return (
    <Card className="p-7" delay={0.06}>
      <div className="flex items-start justify-between mb-5">
        <Icon icon={Flame} size={16} />
        <span className="rounded-full border border-white/[0.07] px-2.5 py-0.5 font-mono text-[9px] text-white/30">
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
 *    Standard top-left icon, compact text. Short and confident.
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
 *    Slightly larger icon container. Title-only, no body.
 *    Extra whitespace lets the title breathe.
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
 *    Icon top. Then title. Then a pure typographic metric — no chart, no bar.
 *    The number itself is the visual element.
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
        <span className="tabular-nums text-[32px] font-semibold leading-none tracking-[-0.04em] text-white/70">
          2.3
          <span className="ml-1 text-base font-normal text-white/25">s avg</span>
        </span>
        <p className="mt-1 font-mono text-[10px] text-white/20">24 routes · parallelized</p>
      </div>
    </Card>
  );
}

/**
 * ⑥ Baselines — full 3-col width.
 *    Horizontal split: description left, version history right as plain text.
 *    No fake UI — version tags are just typography.
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

        {/* Right: version list — pure typography, no fake windows */}
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
                <span className="font-mono text-[11px] text-white/60">{v.tag}</span>
                <span className="font-mono text-[10px] text-white/20">{v.note}</span>
              </div>
              <span
                className={`font-mono text-[10px] ${
                  i === 0
                    ? "text-white/50"
                    : v.status.includes("changes")
                    ? "text-blue-400/60"
                    : "text-white/25"
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
