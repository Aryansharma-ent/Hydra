import { motion, AnimatePresence, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Plus } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

const FAQS = [
  {
    q: "Does Hydra work with React?",
    a: "Yes. Hydra works with any frontend stack — React, Next.js, Vue, Svelte, plain HTML. The platform captures screenshots from your live URLs or locally served app, so your framework choice doesn't matter.",
  },
  {
    q: "Do I need to install the npm package?",
    a: "No. The npm package (@hydra/cli) is an optional connector that lets you trigger scans from your terminal or CI pipeline. You can also run scans directly from your Hydra dashboard without installing anything.",
  },
  {
    q: "Does it support GitHub Actions?",
    a: "Yes. Hydra ships with a plug-and-play GitHub Action. It runs visual regression scans on every pull request and posts an inline diff report directly to the PR thread — fully automated.",
  },
  {
    q: "Is Hydra open source?",
    a: "The CLI connector is open source under the MIT license. The Hydra platform — dashboard, scan infrastructure, AI analysis, and diff engine — is offered as a hosted product.",
  },
  {
    q: "Does Hydra support monorepos?",
    a: "Yes. You can configure Hydra to scan specific URLs or routes per package in a monorepo, or scan your entire app in one run. Works with Turborepo, Nx, and pnpm workspaces.",
  },
];

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ delay: index * 0.05, duration: 0.45, ease }}
      className="border-b border-white/[0.05] last:border-0"
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-6 py-5 text-left group"
      >
        <span className="text-sm font-medium text-white/70 group-hover:text-white/90 transition leading-snug">
          {q}
        </span>
        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.22, ease }}
          className="shrink-0 text-white/25 group-hover:text-white/50 transition"
        >
          <Plus size={14} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm text-zinc-500 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FAQSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="faq" ref={ref} className="relative py-32 px-6">
      <div className="mx-auto max-w-2xl">
        {/* Heading */}
        <div className="mb-12 text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease }}
            className="mb-5 text-xs font-medium tracking-[0.12em] uppercase text-white/30"
          >
            FAQ
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.08, duration: 0.5, ease }}
            className="text-4xl sm:text-5xl font-semibold tracking-[-0.04em] leading-[1.1] text-white font-boldonse"
          >
            Got questions?
          </motion.h2>
        </div>

        {/* Accordion container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.18, duration: 0.55, ease }}
          className="rounded-2xl border border-white/[0.06] bg-white/[0.02] px-6"
        >
          {FAQS.map((item, i) => (
            <FAQItem key={i} index={i} q={item.q} a={item.a} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
