import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import videoUrl from "@/assets/video.mp4";

const ease = [0.22, 1, 0.36, 1] as const;

export function ComparisonSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative py-32 px-6">
      {/* Faint center glow */}
      <div className="pointer-events-none absolute inset-0 flex justify-center items-center">
        <div className="h-72 w-72 rounded-full bg-blue-500/[0.06] blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-4xl">
        {/* Heading */}
        <div className="mb-14 text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease }}
            className="mb-5 text-xs font-medium tracking-[0.12em] uppercase text-white/30"
          >
            Visual Comparison
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.08, duration: 0.5, ease }}
            className="mb-4 text-4xl sm:text-5xl font-semibold tracking-[-0.04em] leading-[1.3] text-white font-boldonse"
          >
            Spot the difference instantly.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.14, duration: 0.5, ease }}
            className="text-base text-zinc-400 leading-7"
          >
            Pixel-by-pixel diffs on every commit. No guessing, no eyeballing.
          </motion.p>
        </div>

        {/* Browser window containing the video */}
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ delay: 0.22, duration: 0.65, ease }}
          className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] shadow-[0_24px_64px_rgba(0,0,0,0.6)]"
        >
          {/* Browser chrome bar */}
          <div className="flex h-10 items-center justify-between border-b border-white/[0.05] bg-white/[0.015] px-4">
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-white/[0.08]" />
              <div className="h-2.5 w-2.5 rounded-full bg-white/[0.08]" />
              <div className="h-2.5 w-2.5 rounded-full bg-white/[0.08]" />
            </div>

            <span className="text-[10px] font-mono text-white/30"></span>

            <div className="flex items-center gap-1.5">
              
              <span className="text-[10px] font-mono text-white/30"></span>
            </div>
          </div>

          {/* Video Container */}
          <div className="relative w-full aspect-video overflow-hidden bg-black">
            <video
              src={videoUrl}
              autoPlay
              loop
              muted
              playsInline
              onEnded={(e) => e.currentTarget.play()}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Status footer */}
          <div className="flex items-center justify-between border-t border-white/[0.04] px-5 py-2.5 text-[10px] font-serif text-white/20">
            <span>scan · hyd_a3f192</span>
            <span>interactive visual diff</span>
            <span>2.3s</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
