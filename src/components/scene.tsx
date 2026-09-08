import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * SceneBg — per-section cinematic environment.
 * Real photograph, duotone-graded into the blue/silver universe:
 *   opacity 35–55% · saturation reduced 40–60% · light blur 2–6px
 * Over it, 2–3 radial light layers drift on different loop durations.
 * Top and bottom edges feather into the shared base colour so consecutive
 * sections cross-fade instead of cutting to black.
 */
export function SceneBg({
  image,
  position = "center",
  scale = 1.08,
  opacity = 0.46,
  blur = 4,
  saturation = 50,
  duration = 24,
  tint,
  alt = "",
}: {
  image: string;
  position?: string;
  scale?: number;
  opacity?: number;
  blur?: number;
  saturation?: number;
  duration?: number;
  tint?: string;
  alt?: string;
}) {
  const reduce = useReducedMotion();
  const anim = <T,>(v: T) => (reduce ? undefined : v);

  return (
    <div
      aria-hidden={alt ? undefined : true}
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
      className="pointer-events-none absolute inset-0 overflow-hidden -z-10"
    >
      {/* base luminous field — never pure black */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 120% 80% at 50% 0%, oklch(0.19 0.07 262) 0%, oklch(0.12 0.04 261) 55%, oklch(0.09 0.03 260) 100%)",
        }}
      />
      {/* the real photograph — desaturated, lightly blurred, held at 35–55% */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: position,
          filter: `blur(${blur}px) saturate(${saturation}%) contrast(104%)`,
          opacity,
          willChange: "transform",
        }}
        initial={{ scale }}
        animate={anim({ scale: [scale, scale * 1.05, scale] })}
        transition={{ duration: duration * 2.4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* DUOTONE — shadows to deep blue, highlights to silver-blue */}
      <div
        className="absolute inset-0"
        style={{ background: "oklch(0.34 0.09 262)", mixBlendMode: "color", opacity: 0.6 }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, oklch(0.86 0.03 250 / 0.30) 0%, oklch(0.14 0.06 262 / 0.55) 55%, oklch(0.09 0.03 260 / 0.72) 100%)",
          mixBlendMode: "soft-light",
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: tint ?? "oklch(0.11 0.045 262 / 0.35)" }}
      />


      {/* three drifting light layers — 18s / 24s / 30s, never the source itself */}
      <motion.div
        className="absolute -inset-[25%]"
        style={{
          background:
            "radial-gradient(45% 40% at 50% 50%, oklch(0.92 0.02 250 / 0.26), transparent 70%)",
          mixBlendMode: "screen",
          filter: "blur(30px)",
          willChange: "transform, opacity",
        }}
        animate={anim({
          x: ["-14%", "10%", "-4%", "-14%"],
          y: ["-8%", "9%", "-3%", "-8%"],
          opacity: [0.6, 1, 0.7, 0.6],
        })}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -inset-[25%]"
        style={{
          background:
            "radial-gradient(40% 46% at 50% 50%, oklch(0.66 0.11 258 / 0.22), transparent 72%)",
          mixBlendMode: "soft-light",
          filter: "blur(34px)",
          willChange: "transform, opacity",
        }}
        animate={anim({
          x: ["11%", "-13%", "5%", "11%"],
          y: ["7%", "-9%", "12%", "7%"],
          opacity: [0.45, 0.85, 0.5, 0.45],
        })}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -inset-[25%] hidden sm:block"
        style={{
          background:
            "radial-gradient(52% 38% at 50% 50%, oklch(0.80 0.05 252 / 0.18), transparent 74%)",
          mixBlendMode: "screen",
          filter: "blur(36px)",
          willChange: "transform, opacity",
        }}
        animate={anim({
          x: ["-6%", "12%", "-9%", "-6%"],
          y: ["10%", "-6%", "4%", "10%"],
          opacity: [0.5, 0.9, 0.55, 0.5],
        })}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* soft film grain */}
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, oklch(1 0 0) 0.5px, transparent 1px), radial-gradient(circle at 80% 70%, oklch(1 0 0) 0.5px, transparent 1px)",
          backgroundSize: "3px 3px, 5px 5px",
        }}
      />
      {/* shared 130px edge blend — consecutive sections melt into each other */}
      <div
        className="absolute inset-x-0 top-0 h-[130px]"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.105 0.035 261) 0%, oklch(0.105 0.035 261 / 0) 100%)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-[130px]"
        style={{
          background:
            "linear-gradient(0deg, oklch(0.105 0.035 261) 0%, oklch(0.105 0.035 261 / 0) 100%)",
        }}
      />
    </div>
  );
}

/**
 * EditorialTitle — Instrument Serif headline.
 * `mixed` opts into the mixed-scale gesture (reserved for hero, VIP pass, countdown).
 */
export function EditorialTitle({
  text,
  accent,
  align = "left",
  className = "",
  size = "text-[11vw] sm:text-6xl md:text-7xl",
  mixed = false,
  italic = false,
}: {
  text: string;
  accent?: string;
  align?: "left" | "center" | "right";
  className?: string;
  size?: string;
  mixed?: boolean;
  italic?: boolean;
}) {
  const words = text.split(" ");
  const alignCls =
    align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left";
  return (
    <motion.h2
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12%" }}
      transition={{ duration: 1.1, ease: [0.22, 0.9, 0.3, 1] }}
      className={`font-editorial text-chrome ${italic ? "italic" : ""} ${size} ${alignCls} ${className}`}
    >
      {mixed
        ? words.map((w, wi) => (
            <span key={wi} className="inline-block mr-[0.2em] last:mr-0">
              {wi === 0 ? (
                <>
                  <span className="drop-letter">{w.charAt(0)}</span>
                  <span className="text-[0.8em]">{w.slice(1)}</span>
                </>
              ) : (
                <span className="text-[0.8em]">{w}</span>
              )}
            </span>
          ))
        : text}
      {accent && (
        <span className="block mt-[0.18em] text-[0.4em] italic tracking-[0.14em] normal-case opacity-80">
          {accent}
        </span>
      )}
    </motion.h2>
  );
}

export function Kicker({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9 }}
      className={`eyebrow ${className}`}
    >
      {children}
    </motion.div>
  );
}

/** Eyebrow label + value pair, with the fine silver rule. */
export function LabelValue({
  label,
  value,
  className = "",
}: {
  label: string;
  value: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <div
        className="h-px w-8 mb-2"
        style={{ background: "linear-gradient(90deg, oklch(0.85 0.02 250 / 0.5), transparent)" }}
      />
      <div className="eyebrow">{label}</div>
      <div
        className="mt-1.5 text-[13px] font-medium"
        style={{ color: "oklch(0.97 0.01 250)", letterSpacing: "0.03em" }}
      >
        {value}
      </div>
    </div>
  );
}
