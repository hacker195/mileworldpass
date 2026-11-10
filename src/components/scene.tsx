import { motion } from "motion/react";
import { type ReactNode } from "react";

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
  void scale; void blur; void duration; void saturation;
  return (
    <div
      aria-hidden={alt ? undefined : true}
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
      className="pointer-events-none absolute inset-0 overflow-hidden -z-10"
    >
      {/* Campo continuo y liso: sin grano, trama ni mosaicos. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.17 0.055 262) 0%, oklch(0.115 0.038 261) 52%, oklch(0.09 0.03 260) 100%)",
        }}
      />
      {/* Fotografía estática: sin filtros ni animaciones (iPhone la compone una sola vez). */}
      <img
        src={image}
        alt=""
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: position, opacity: opacity * 0.82 }}
      />
      {/* DUOTONE plano */}
      <div className="absolute inset-0" style={{ background: "oklch(0.30 0.085 262 / 0.42)" }} />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, oklch(0.80 0.03 250 / 0.10) 0%, oklch(0.14 0.06 262 / 0.42) 55%, oklch(0.09 0.03 260 / 0.66) 100%)",
        }}
      />
      <div className="absolute inset-0" style={{ background: tint ?? "oklch(0.11 0.045 262 / 0.35)" }} />

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
      animate={{ opacity: 1, y: 0 }}
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
      animate={{ opacity: 1, y: 0 }}
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
