import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const STEPS = [
  {
    label: "Sign up",
    detail: "Create your Hydra account and set up a project in the dashboard. No credit card required.",
  },
  {
    label: "Connect your codebase",
    detail: "Optionally add the npm connector to your project. This lets you trigger scans directly from your terminal or CI pipeline — but it's not required.",
  },
  {
    label: "Capture baselines",
    detail: "Hydra captures pixel-perfect screenshots of your routes and components. Trigger from the dashboard, CLI, or automatically on every push.",
  },
  {
    label: "Compare on every change",
    detail: "Each new scan is diffed against the baseline. Results are available instantly in your Hydra dashboard with annotated heatmaps.",
  },
  {
    label: "Ship with confidence",
    detail: "A passing Hydra report means zero visual surprises in production. Block merges on regressions, or review and approve them manually.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative py-32 px-6">
      <div className="mx-auto max-w-2xl">
        {/* Heading */}
        <div className="mb-16 text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease }}
            className="mb-5 text-xs font-medium tracking-[0.12em] uppercase text-white/30"
          >
            How it works
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: 0.08, duration: 0.5, ease }}
            className="mb-4 text-4xl sm:text-5xl font-semibold tracking-[-0.04em] leading-[1.3] text-white font-boldonse"
          >
            From signup to zero regressions.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: 0.14, duration: 0.5, ease }}
            className="text-base text-zinc-400 leading-7"
          >
            Works from the dashboard, the CLI, or both. You choose.
          </motion.p>
        </div>

        {/* Timeline */}
        <div className="relative pl-7">
          {/* Vertical thread */}
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-white/[0.06]" />

          <div className="flex flex-col gap-0">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.08, duration: 0.5, ease }}
                className="relative pb-10 last:pb-0 group"
              >
                {/* Dot */}
                <div className="absolute -left-7 top-1 flex h-[15px] w-[15px] items-center justify-center">
                  <div className="h-[5px] w-[5px] rounded-full bg-white/25 transition group-hover:bg-white/60" />
                </div>

                {/* Content */}
                <div>
                  <h3 className="mb-1.5 text-sm font-semibold text-white/80 tracking-tight leading-snug">
                    {step.label}
                  </h3>
                  <p className="text-sm text-zinc-500 leading-relaxed font-normal">
                    {step.detail}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
