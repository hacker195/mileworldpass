import { motion } from "motion/react";
import type { ReactNode } from "react";

/**
 * SceneBg — a per-section cinematic environment.
 * Always image + gradient + moving stage light. Never flat black.
 * The light source itself is never drawn: only screen/soft-light gradient
 * layers slowly drifting over the artwork.
 */
export function SceneBg({
  image,
  position = "center",
  scale = 1.15,
  opacity = 0.5,
  blur = 26,
  tint = "oklch(0.16 0.06 262 / 0.62)",
  lightA = "oklch(0.86 0.09 258 / 0.30)",
  lightB = "oklch(0.95 0.02 250 / 0.16)",
  duration = 26,
}: {
  image: string;
  position?: string;
  scale?: number;
  opacity?: number;
  blur?: number;
  tint?: string;
  lightA?: string;
  lightB?: string;
  duration?: number;
}) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden -z-10">
      {/* base luminous field — guarantees no pure black anywhere */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 120% 80% at 50% 0%, oklch(0.22 0.08 262) 0%, oklch(0.11 0.04 261) 55%, oklch(0.08 0.03 260) 100%)",
        }}
      />
      {/* provided artwork, atmospherically integrated */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: position,
          filter: `blur(${blur}px) saturate(115%)`,
          opacity,
        }}
        initial={{ scale }}
        animate={{ scale: [scale, scale * 1.06, scale] }}
        transition={{ duration: duration * 2, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* cool grade over the artwork */}
      <div className="absolute inset-0" style={{ background: tint }} />

      {/* stage light — sweeps slowly, only the effect is visible */}
      <motion.div
        className="absolute -inset-[30%]"
        style={{
          background: `radial-gradient(45% 40% at 50% 50%, ${lightA}, transparent 70%)`,
          mixBlendMode: "screen",
          filter: "blur(60px)",
        }}
        animate={{
          x: ["-16%", "14%", "-6%", "-16%"],
          y: ["-10%", "8%", "-4%", "-10%"],
          opacity: [0.55, 0.95, 0.6, 0.55],
        }}
        transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -inset-[30%]"
        style={{
          background: `radial-gradient(38% 46% at 50% 50%, ${lightB}, transparent 72%)`,
          mixBlendMode: "soft-light",
          filter: "blur(70px)",
        }}
        animate={{
          x: ["12%", "-14%", "6%", "12%"],
          y: ["6%", "-8%", "10%", "6%"],
          opacity: [0.4, 0.8, 0.45, 0.4],
        }}
        transition={{ duration: duration * 1.4, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* rare, gentle chrome glint */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(115deg, transparent 42%, oklch(1 0 0 / 0.14) 50%, transparent 58%)",
          mixBlendMode: "screen",
          filter: "blur(14px)",
        }}
        animate={{ opacity: [0, 0, 0.7, 0], x: ["-20%", "-10%", "10%", "20%"] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", repeatDelay: 6 }}
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
      {/* edge feather so scenes melt into each other */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.09 0.03 260 / 0.85) 0%, transparent 22%, transparent 78%, oklch(0.09 0.03 260 / 0.9) 100%)",
        }}
      />
    </div>
  );
}

/**
 * EditorialTitle — Didone headline with mixed scale inside the word.
 * The first character (or a highlighted word) is set larger on the same baseline.
 */
export function EditorialTitle({
  text,
  accent,
  align = "left",
  className = "",
  size = "text-[13vw] sm:text-6xl md:text-7xl",
}: {
  text: string;
  accent?: string;
  align?: "left" | "center" | "right";
  className?: string;
  size?: string;
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
      className={`font-editorial text-chrome ${size} ${alignCls} ${className}`}
    >
      {words.map((w, wi) => (
        <span key={wi} className="inline-block mr-[0.22em] last:mr-0">
          {wi === 0 ? (
            <>
              <span className="drop-letter">{w.charAt(0)}</span>
              <span className="text-[0.78em]">{w.slice(1)}</span>
            </>
          ) : (
            <span className="text-[0.78em]">{w}</span>
          )}
        </span>
      ))}
      {accent && (
        <span className="block mt-[0.15em] text-[0.42em] italic font-medium tracking-[0.22em] normal-case opacity-80">
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
      className={`font-sans text-[9px] sm:text-[10px] font-medium ${className}`}
      style={{ letterSpacing: "0.45em", textTransform: "uppercase", color: "oklch(0.74 0.03 255)" }}
    >
      {children}
    </motion.div>
  );
}
