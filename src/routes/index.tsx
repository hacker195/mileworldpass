import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useScroll, useTransform, useReducedMotion } from "motion/react";
import { QRCodeSVG } from "qrcode.react";
import mLogo from "@/assets/mile-m-logo.png.asset.json";
import wordmark from "@/assets/mileworld-wordmark-official.png.asset.json";
import soundtrack from "@/assets/genesis-soundtrack.mp3.asset.json";
import bgSilk from "@/assets/bg-silk.jpg.asset.json";
import bgSilkGold from "@/assets/bg-silk-gold.jpg.asset.json";
import bgChrome from "@/assets/bg-chrome-liquid.jpg.asset.json";
import bgCorridor from "@/assets/bg-corridor.jpg.asset.json";
import bgLights from "@/assets/bg-lights.jpg.asset.json";
import bgIridescent from "@/assets/bg-iridescent.jpg.asset.json";
import bgSilver from "@/assets/bg-silver.jpg.asset.json";
import bgSwirl from "@/assets/bg-swirl.jpg.asset.json";
import silkNavy from "@/assets/silk-navy.webp.asset.json";
import silkElectric from "@/assets/silk-electric.webp.asset.json";
import chromeFlow from "@/assets/chrome-flow.webp.asset.json";
import chromeRipple from "@/assets/chrome-ripple.webp.asset.json";
import iridescentDrape from "@/assets/iridescent-drape.webp.asset.json";
import memory1 from "@/assets/memory-1.webm.asset.json";
import memory2 from "@/assets/memory-2.webm.asset.json";
import memory3 from "@/assets/memory-3.webm.asset.json";
import memory4 from "@/assets/memory-4.webm.asset.json";
import milePortrait from "@/assets/mile-portrait.jpg.asset.json";
import mile1 from "@/assets/mile-1.png.asset.json";
import mile2 from "@/assets/mile-2.png.asset.json";
import mile3 from "@/assets/mile-3.png.asset.json";
import mile4 from "@/assets/mile-4.png.asset.json";
import giftRain from "@/assets/lluvia-de-sobres.mp4.asset.json";
import { SceneBg } from "@/components/scene";
import {
  searchGuests,
  visibleMembers,
  titleCase,
  firstName,
  welcomeGreeting,
  accessCodeFor,
  type GuestMember,
} from "@/lib/guests";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "MILE WORLD — Milena Anahi Montiel Chaparro" },
      { name: "description", content: "MILE LIVE · 01 · 01 · 2027. Invitación digital privada a MILE WORLD, la noche de Milena Anahi Montiel Chaparro." },
      { property: "og:title", content: "MILE WORLD — MILE LIVE · 01 · 01 · 2027" },
      { property: "og:description", content: "Invitación digital privada a MILE WORLD, la noche de Milena Anahi Montiel Chaparro." },
    ],
  }),
});

type Stage = "intro" | "access" | "validating" | "welcome" | "experience";
interface GuestData { nombre: string; rol: "adulto" | "joven" }

const EVENT_DATE = new Date("2027-01-01T20:30:00-03:00");
const MAPS_URL = "https://www.google.com/maps/search/?api=1&query=Oga+Guasu+Salon+de+Eventos";
const WHATSAPP_NUMBER = "19313275485";
const GIFT_ALIAS = "CI.3.510.962";
/** Curva de desaceleración cinematográfica compartida. */
const EASE = [0.16, 1, 0.3, 1] as const;

/* ============================================================ */
/*  ROOT                                                        */
/* ============================================================ */
function Index() {
  const [stage, setStage] = useState<Stage>("intro");
  const [guest, setGuest] = useState<GuestData>({ nombre: "", rol: "adulto" });
  const [muted, setMuted] = useState(false);
  const [level, setLevel] = useState(0.6);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const musicShouldPlay = stage === "validating" || stage === "welcome" || stage === "experience";

  useEffect(() => {
    if (stage === "validating") setLevel(0.6);
    if (stage === "welcome") setLevel(0.66);
  }, [stage]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (musicShouldPlay && !muted) a.play().catch(() => {});
    else a.pause();
  }, [musicShouldPlay, muted]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const from = a.volume;
    const to = Math.max(0, Math.min(1, level)) * 0.85;
    const start = performance.now();
    const DUR = 5200;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / DUR);
      const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      a.volume = from + (to - from) * e;
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [level]);

  useEffect(() => () => { audioRef.current?.pause(); }, []);

  return (
    <main
      className="relative min-h-screen w-full text-foreground overflow-x-hidden font-sans"
      style={{ background: "oklch(0.10 0.035 261)" }}
    >
      <audio ref={audioRef} src={soundtrack.url} loop preload="auto" />
      <AmbientBackdrop />
      <TravellingLight />
      {musicShouldPlay && <MuteToggle muted={muted} onToggle={() => setMuted((m) => !m)} />}
      {stage === "experience" && <FloatingMark />}
      <AnimatePresence mode="wait">
        {stage === "intro" && <IntroScreen key="intro" onEnter={() => setStage("access")} />}
        {stage === "access" && (
          <AccessScreen key="access" onSubmit={(m) => { setGuest({ nombre: m.nombre, rol: m.rol }); setStage("validating"); }} />
        )}
        {stage === "validating" && <ValidatingScreen key="val" onDone={() => setStage("welcome")} />}
        {stage === "welcome" && <WelcomeScreen key="wel" guest={guest} onContinue={() => setStage("experience")} />}
        {stage === "experience" && <Experience key="exp" guest={guest} onLevel={setLevel} />}
      </AnimatePresence>
    </main>
  );
}

/* ============================================================ */
/*  SHARED EDITORIAL PRIMITIVES                                 */
/* ============================================================ */

/** Manrope Thin metadata / label. */
function Meta({ children, className = "", style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9 }}
      className={`font-meta text-[10px] ${className}`}
      style={{ color: "oklch(0.74 0.02 255)", ...style }}
    >
      {children}
    </motion.div>
  );
}

/** NOIR et BLANC editorial title. */
function Title({
  children,
  size = "text-[13vw] sm:text-6xl",
  align = "left",
  italic = false,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  size?: string;
  align?: "left" | "center" | "right";
  italic?: boolean;
  className?: string;
  delay?: number;
}) {
  const alignCls = align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left";
  return (
    <motion.h2
      initial={{ opacity: 0, y: 22, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-12%" }}
      transition={{ duration: 1.3, delay, ease: [0.22, 0.9, 0.3, 1] }}
      className={`font-noir text-chrome leading-[0.95] ${italic ? "italic" : ""} ${size} ${alignCls} ${className}`}
    >
      {children}
    </motion.h2>
  );
}

/** Small recurring MILE WORLD identity mark. */
function Mark({ className = "", w = "w-8" }: { className?: string; w?: string }) {
  return (
    <img
      src={mLogo.url}
      alt=""
      aria-hidden
      className={`${w} opacity-70 ${className}`}
      style={{ filter: "drop-shadow(0 0 14px oklch(0.7 0.15 258 / 0.4))" }}
      loading="lazy"
    />
  );
}

/** Persistent corner identity during the journey. */
function FloatingMark() {
  return (
    <motion.div
      aria-hidden
      className="fixed top-4 left-4 z-40 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.45 }}
      transition={{ delay: 1.2, duration: 1.4 }}
    >
      <img src={mLogo.url} alt="" className="w-7" />
    </motion.div>
  );
}

/* ============================================================ */
/*  AMBIENT BACKDROP + TRAVELLING LIGHT                         */
/* ============================================================ */
function AmbientBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-20 overflow-hidden">
      <div className="absolute inset-0" style={{
        background:
          "radial-gradient(ellipse 100% 65% at 50% 0%, oklch(0.24 0.09 262) 0%, oklch(0.12 0.04 261) 55%, oklch(0.095 0.03 260) 100%)",
      }} />
      <motion.div
        className="absolute -top-1/3 left-1/2 w-[140vw] h-[80vh] rounded-full -translate-x-1/2 hidden sm:block"
        style={{ background: "radial-gradient(closest-side, oklch(0.58 0.18 258 / 0.30), transparent 70%)", filter: "blur(80px)" }}
        animate={{ y: [0, 24, -12, 0], opacity: [0.7, 1, 0.75, 0.7] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-x-0 top-1/3 h-[60vh] hidden sm:block"
        style={{
          background: "linear-gradient(180deg, transparent, oklch(0.92 0.02 250 / 0.07), transparent)",
          transform: "skewY(-8deg)",
        }}
        animate={{ y: [-40, 40, -40] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

/** Cinematic light leak that occasionally travels across the whole environment. */
function TravellingLight() {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 hidden sm:block overflow-hidden">
      <motion.div
        className="absolute top-[-20%] h-[140vh] w-[46vw]"
        style={{
          background:
            "linear-gradient(100deg, transparent 20%, oklch(0.92 0.04 252 / 0.10) 45%, oklch(0.78 0.12 258 / 0.14) 52%, transparent 78%)",
          filter: "blur(50px)",
          mixBlendMode: "screen",
          transform: "rotate(8deg)",
        }}
        animate={{ x: ["-60vw", "130vw"] }}
        transition={{ duration: 26, repeat: Infinity, repeatDelay: 14, ease: "easeInOut" }}
      />
    </div>
  );
}

/* ============================================================ */
/*  MUTE TOGGLE                                                 */
/* ============================================================ */
function MuteToggle({ muted, onToggle }: { muted: boolean; onToggle: () => void }) {
  return (
    <motion.button
      onClick={onToggle}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
      className="fixed top-4 right-4 z-50 w-10 h-10 rounded-2xl grid place-items-center backdrop-blur-md"
      style={{
        background: "oklch(1 0 0 / 0.06)",
        border: "1px solid oklch(1 0 0 / 0.16)",
        boxShadow: "0 8px 24px oklch(0 0 0 / 0.4)",
      }}
      aria-label={muted ? "Activar sonido" : "Silenciar"}
    >
      {muted ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M11 5 6 9H2v6h4l5 4V5Z" /><path d="m22 9-6 6M16 9l6 6" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M11 5 6 9H2v6h4l5 4V5Z" /><path d="M15.5 8.5a5 5 0 0 1 0 7" /><path d="M18.5 5.5a9 9 0 0 1 0 13" />
        </svg>
      )}
    </motion.button>
  );
}

/* ============================================================ */
/*  1 · ENTRADA                                                 */
/* ============================================================ */
function IntroScreen({ onEnter }: { onEnter: () => void }) {
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 1900); return () => clearTimeout(t); }, []);

  return (
    <motion.section
      className="relative isolate min-h-[100svh] flex flex-col items-center justify-center px-7 overflow-hidden"
      style={{
        paddingTop: "max(2.5rem, env(safe-area-inset-top))",
        paddingBottom: "max(2.5rem, env(safe-area-inset-bottom))",
      }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.7 }}
    >
      <SceneBg image={bgLights.url} opacity={0.52} blur={2} position="50% 50%" tint="oklch(0.12 0.05 262 / 0.34)" duration={30} />

      {/* 0.3s — la línea de origen */}
      <motion.div
        aria-hidden
        className="h-px w-[120px] mb-9"
        style={{ background: "linear-gradient(90deg, transparent, oklch(0.94 0.02 250 / 0.85), transparent)" }}
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 0.3, duration: 0.8, ease: EASE }}
      />

      {/* 0.6s — el logo se revela */}
      <motion.img
        src={mLogo.url} alt="MILE WORLD"
        className="w-[50vw] max-w-[220px] object-contain"
        style={{ filter: "drop-shadow(0 20px 50px oklch(0.55 0.18 258 / 0.45))" }}
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.9, ease: EASE }}
      />

      {/* 1.1s — THE MILE EXPERIENCE */}
      <motion.img
        src={wordmark.url} alt="MILE WORLD — The Mile Experience"
        className="mt-8 w-[70vw] max-w-[300px] object-contain"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 0.92, y: 0 }}
        transition={{ delay: 1.1, duration: 0.9, ease: EASE }}
      />

      {/* 1.5s — fecha */}
      <motion.div
        className="mt-9 font-meta text-[15px]"
        style={{ letterSpacing: "0.42em", color: "oklch(0.92 0.015 250)" }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.9, ease: EASE }}
      >
        01 · 01 · 2027
      </motion.div>

      <motion.div
        className="mt-4 font-meta text-[9px]"
        style={{ letterSpacing: "0.45em", color: "oklch(0.7 0.02 255)" }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.7, duration: 0.8 }}
      >
        Una producción MILEWOOD
      </motion.div>

      {/* 1.9s — todo se asienta */}
      <AnimatePresence>
        {ready && (
          <motion.button
            key="cta" onClick={onEnter}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="btn-ghost mt-14 w-full max-w-[320px] !py-[18px] active:scale-[0.98]"
          >
            Comenzar experiencia
          </motion.button>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

/* ============================================================ */
/*  2 · ACCESO                                                  */
/* ============================================================ */
function AccessScreen({ onSubmit }: { onSubmit: (m: GuestMember) => void }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<GuestMember | null>(null);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const results = useMemo(() => (selected ? [] : searchGuests(query, 6)), [query, selected]);

  const choose = (m: GuestMember) => {
    setSelected(m); setQuery(titleCase(m.nombre)); setOpen(false); setError(null);
  };

  const submit = () => {
    if (selected) return onSubmit(selected);
    if (results.length === 1) return onSubmit(results[0]);
    setError("Seleccioná tu nombre de la lista.");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || !results.length) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => (a + 1) % results.length); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => (a - 1 + results.length) % results.length); }
    else if (e.key === "Enter") { e.preventDefault(); choose(results[active]); }
    else if (e.key === "Escape") { setOpen(false); }
  };

  return (
    <motion.section
      className="relative isolate min-h-[100svh] flex items-center justify-center px-5 sm:px-6 py-16 overflow-hidden"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.9, ease: [0.22, 0.9, 0.3, 1] }}
    >
      <SceneBg image={bgCorridor.url} opacity={0.56} blur={2} position="50% 50%" tint="oklch(0.12 0.05 262 / 0.34)" duration={28} />

      <div className="relative w-full max-w-md">
        <div className="glass-panel rounded-[26px] px-6 sm:px-8 py-10 relative overflow-hidden">
          <div className="text-center">
            <Mark className="mx-auto mb-5" w="w-9" />
            <div className="font-meta text-[10px]" style={{ letterSpacing: "0.45em", color: "oklch(0.74 0.02 255)" }}>
              MILE WORLD
            </div>
            <h1 className="mt-4 font-noir text-chrome text-[14vw] sm:text-5xl leading-none">Acceso</h1>
            <div className="mx-auto mt-5 h-px w-16" style={{ background: "linear-gradient(90deg, transparent, oklch(0.9 0.02 250 / 0.6), transparent)" }} />
            <p className="mt-5 font-info text-[13px]" style={{ color: "oklch(0.88 0.01 250)" }}>
              Ingresá tu nombre para continuar
            </p>
          </div>

          <form className="mt-9" onSubmit={(e) => { e.preventDefault(); submit(); }}>
            <Field label="Nombre">
              <input
                required autoFocus
                value={query}
                onChange={(e) => { setQuery(e.target.value); setSelected(null); setActive(0); setOpen(true); setError(null); }}
                onFocus={() => setOpen(true)}
                onBlur={() => setTimeout(() => setOpen(false), 120)}
                onKeyDown={onKeyDown}
                placeholder="Escribí tu nombre"
                autoComplete="off"
                className="w-full bg-transparent outline-none text-[16px] font-info py-2"
                style={{ color: "oklch(0.96 0.01 250)" }}
              />
            </Field>

            <div className="relative">
              <AnimatePresence>
                {open && results.length > 0 && (
                  <motion.ul
                    initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute left-0 right-0 mt-2 rounded-2xl overflow-hidden z-20"
                    style={{
                      background: "oklch(0.14 0.04 262 / 0.94)",
                      backdropFilter: "blur(24px) saturate(140%)",
                      border: "1px solid oklch(1 0 0 / 0.12)",
                      boxShadow: "0 24px 48px -12px oklch(0 0 0 / 0.6)",
                    }}
                  >
                    {results.map((m, i) => (
                      <li key={m.nombre + i}>
                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => choose(m)}
                          onMouseEnter={() => setActive(i)}
                          className="w-full text-left px-4 py-3 text-[13px] font-info transition-colors"
                          style={{
                            color: "oklch(0.96 0.01 250)",
                            background: i === active ? "oklch(0.55 0.14 258 / 0.22)" : "transparent",
                          }}
                        >
                          {titleCase(m.nombre)}
                        </button>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>

            {error && (
              <div className="mt-3 font-meta text-[10px]" style={{ color: "oklch(0.75 0.14 25)" }}>{error}</div>
            )}

            <button type="submit" disabled={!selected} className="btn-premium w-full mt-7">
              Validar acceso
            </button>
          </form>
        </div>
      </div>
    </motion.section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="font-meta text-[9px] mb-1.5" style={{ letterSpacing: "0.35em", color: "oklch(0.66 0.03 255)" }}>{label}</div>
      <div className="relative border-b" style={{ borderColor: "oklch(1 0 0 / 0.18)" }}>{children}</div>
    </label>
  );
}

/* ============================================================ */
/*  ACCESO AUTORIZADO                                           */
/* ============================================================ */
function ValidatingScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 3600); return () => clearTimeout(t); }, [onDone]);

  return (
    <motion.section
      className="relative isolate min-h-[100svh] flex items-center justify-center px-6 overflow-hidden"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}
    >
      <SceneBg image={chromeFlow.url} opacity={0.54} blur={2} tint="oklch(0.12 0.05 262 / 0.34)" duration={22} />
      <div aria-hidden className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] max-w-[600px] h-[80vh]" style={{
        background: "radial-gradient(ellipse at top, oklch(0.85 0.15 258 / 0.4), transparent 60%)", mixBlendMode: "screen",
      }} />

      <div className="relative text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.1, ease: [0.16, 0.84, 0.24, 1] }}
          className="mx-auto w-20 h-20 rounded-full grid place-items-center relative"
          style={{
            background: "linear-gradient(180deg, oklch(0.7 0.16 258 / 0.35), oklch(0.35 0.12 258 / 0.15))",
            border: "1px solid oklch(0.85 0.1 258 / 0.6)",
            boxShadow: "0 0 60px oklch(0.6 0.18 258 / 0.6)",
          }}
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "oklch(0.98 0.01 250)" }}>
            <motion.path d="m5 12 5 5L20 7" strokeLinecap="round" strokeLinejoin="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.7, duration: 0.9, ease: [0.22, 0.9, 0.3, 1] }}
            />
          </svg>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 1.5, duration: 1.1, ease: [0.22, 0.9, 0.3, 1] }}
          className="mt-9 font-noir text-chrome text-[9vw] sm:text-[42px] leading-none uppercase"
          style={{ letterSpacing: "0.06em" }}
        >
          Acceso autorizado
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.1, duration: 0.9 }}
          className="mt-5 font-meta text-[10px]" style={{ color: "oklch(0.74 0.03 255)" }}
        >
          Tu invitación personal fue activada
        </motion.div>
      </div>
    </motion.section>
  );
}

/* ============================================================ */
/*  BIENVENIDA                                                  */
/* ============================================================ */
function WelcomeScreen({ guest, onContinue }: { guest: GuestData; onContinue: () => void }) {
  const display = firstName(guest.nombre);
  const greeting = welcomeGreeting(guest.nombre);
  return (
    <motion.section
      className="relative isolate min-h-[100svh] flex items-center px-6 sm:px-10 py-20 overflow-hidden"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 1 }}
    >
      <SceneBg image={silkNavy.url} opacity={0.62} blur={2} position="50% 50%" tint="oklch(0.12 0.05 262 / 0.34)" duration={30} />

      <div className="relative w-full max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 1, ease: [0.22, 0.9, 0.3, 1] }}
          className="font-meta text-[10px]" style={{ letterSpacing: "0.5em", color: "oklch(0.76 0.03 255)" }}
        >
          {greeting}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 14, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.7, duration: 1.3, ease: [0.22, 0.9, 0.3, 1] }}
          className="mt-4 font-noir text-chrome text-[18vw] sm:text-8xl leading-[0.9]"
        >
          {display}
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }}
          className="mt-8 ml-[6%] font-noir italic text-[8vw] sm:text-4xl leading-tight"
          style={{ color: "oklch(0.95 0.01 250)" }}
        >
          Prepárate para brillar
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.1, duration: 1 }}
          className="mt-7 ml-[6%] max-w-sm font-meta text-[10px] leading-[2]"
          style={{ color: "oklch(0.8 0.02 255)" }}
        >
          Te invitamos a conocer MILE WORLD
        </motion.p>

        <motion.button
          onClick={onContinue}
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.8, duration: 0.9 }}
          className="btn-premium mt-12 ml-[6%]"
        >
          Continuar
        </motion.button>
      </div>
    </motion.section>
  );
}

/* ============================================================ */
/*  VOLUME ZONE                                                 */
/* ============================================================ */
function VolumeZone({ level, onLevel, children, className = "" }: {
  level: number; onLevel: (v: number) => void; children: React.ReactNode; className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });
  useEffect(() => { if (inView) onLevel(level); }, [inView, level, onLevel]);
  return <div ref={ref} className={className}>{children}</div>;
}

/* ============================================================ */
/*  EXPERIENCIA                                                 */
/* ============================================================ */
function Experience({ guest, onLevel }: { guest: GuestData; onLevel: (v: number) => void }) {
  const set = useCallback((v: number) => onLevel(v), [onLevel]);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }} className="w-full overflow-x-hidden">
      <VolumeZone level={0.72} onLevel={set}><Hero /></VolumeZone>
      <VolumeZone level={0.84} onLevel={set}><VipPass guest={guest} /></VolumeZone>
      <VolumeZone level={0.86} onLevel={set}><Countdown /></VolumeZone>
      <VolumeZone level={0.88} onLevel={set}><Ruleta /></VolumeZone>
      <VolumeZone level={0.86} onLevel={set}><TenidaElegante /></VolumeZone>
      <VolumeZone level={0.86} onLevel={set}><Regalo /></VolumeZone>
      <VolumeZone level={0.92} onLevel={set}><Rsvp guest={guest} /></VolumeZone>
      <VolumeZone level={0.86} onLevel={set}><LocationScene /></VolumeZone>
      <VolumeZone level={1} onLevel={set}><ClosingCredits /></VolumeZone>
    </motion.div>
  );
}

/* ---------- 3 · MILE WORLD (HERO) ---------- */
function Hero() {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);

  return (
    <section ref={ref} className="relative isolate min-h-[100svh] flex flex-col items-center justify-center px-6 sm:px-10 py-24 overflow-hidden">
      <motion.div style={{ y: bgY }} className="absolute inset-0 -z-10">
        <SceneBg image={silkElectric.url} opacity={0.62} blur={2} position="50% 50%" tint="oklch(0.12 0.05 262 / 0.34)" duration={34} />
      </motion.div>

      <motion.img
        src={wordmark.url} alt="MILE WORLD"
        className="w-[82vw] max-w-[520px] object-contain"
        initial={{ opacity: 0, y: 22, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: [0.22, 0.9, 0.3, 1] }}
      />

      <motion.div
        className="mt-7 h-px w-24"
        style={{ background: "linear-gradient(90deg, transparent, oklch(0.9 0.02 250 / 0.7), transparent)" }}
        initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ delay: 0.6, duration: 1 }}
      />

      <motion.p
        className="mt-7 font-noir italic text-center text-[8vw] sm:text-4xl leading-[1.12]"
        style={{ color: "oklch(0.96 0.01 250)" }}
        initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.8, duration: 1.2 }}
      >
        <em>Milena Anahi<br />Montiel Chaparro</em>
      </motion.p>

      {/* Fotografía oficial — dos retratos que se alternan lentamente */}
      <motion.div
        className="mt-12 w-[72vw] max-w-[340px] aspect-[3/4] rounded-[22px] overflow-hidden relative"
        style={{
          background: "linear-gradient(180deg, oklch(0.06 0.02 260), oklch(0.03 0.01 260))",
          border: "1px solid oklch(0.85 0.02 250 / 0.18)",
          boxShadow: "0 50px 100px -40px oklch(0 0 0 / 0.85), inset 0 1px 0 oklch(1 0 0 / 0.08)",
        }}
        initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 1, duration: 1.3, ease: [0.22, 0.9, 0.3, 1] }}
      >
        <PortraitFade />
        <motion.div
          aria-hidden className="absolute inset-y-0 -left-1/2 w-1/2 pointer-events-none"
          style={{ background: "linear-gradient(105deg, transparent 40%, oklch(1 0 0 / 0.08) 50%, transparent 60%)" }}
          animate={{ x: ["-40%", "320%"] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", repeatDelay: 4 }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1.4, duration: 1 }}
        className="mt-10 font-meta text-[16px]" style={{ letterSpacing: "0.45em", color: "oklch(0.92 0.015 250)" }}
      >
        01 · 01 · 2027
      </motion.div>
    </section>
  );
}

/** Dos retratos oficiales que se funden lentamente en el mismo marco. */
function PortraitFade() {
  const shots = [mile1.url, mile2.url];
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % shots.length), 6000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="absolute inset-0">
      {shots.map((src, idx) => (
        <motion.img
          key={src}
          src={src}
          alt="Milena Anahi Montiel Chaparro"
          className="absolute inset-0 w-full h-full object-cover"
          initial={false}
          animate={{ opacity: i === idx ? 1 : 0 }}
          transition={{ duration: 2.2, ease: "easeInOut" }}
          loading="lazy"
        />
      ))}
      <div aria-hidden className="absolute inset-0" style={{
        background: "linear-gradient(180deg, oklch(0.12 0.05 262 / 0.12), oklch(0.08 0.03 261 / 0.42))",
      }} />
    </div>
  );
}


/* ---------- 4 · TU PASE ---------- */
function VipPass({ guest }: { guest: GuestData }) {
  const members = useMemo(() => visibleMembers(guest.nombre), [guest.nombre]);
  const code = useMemo(() => accessCodeFor(guest.nombre), [guest.nombre]);


  const [saving, setSaving] = useState(false);
  const savePass = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const QRCode = await import("qrcode");
      await document.fonts.ready;
      const canvas = document.createElement("canvas");
      canvas.width = 1080;
      canvas.height = 1600;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const gradient = ctx.createLinearGradient(0, 0, 1080, 1600);
      gradient.addColorStop(0, "#344978");
      gradient.addColorStop(0.48, "#101a38");
      gradient.addColorStop(1, "#243b70");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1080, 1600);
      const glow = ctx.createRadialGradient(170, 100, 0, 170, 100, 760);
      glow.addColorStop(0, "rgba(210,225,255,.32)");
      glow.addColorStop(1, "rgba(10,16,35,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, 1080, 1600);
      ctx.strokeStyle = "rgba(235,242,255,.38)";
      ctx.lineWidth = 3;
      ctx.strokeRect(36, 36, 1008, 1528);
      ctx.fillStyle = "#dbe5f7";
      ctx.font = "500 28px Manrope, sans-serif";
      ctx.fillText("MILE WORLD", 90, 125);
      ctx.font = "400 98px NoirEtBlanc, serif";
      ctx.fillText("ACCESO", 90, 245);
      ctx.fillStyle = "rgba(219,229,247,.65)";
      ctx.font = "500 23px Manrope, sans-serif";
      ctx.fillText(members.length > 1 ? "INVITADOS" : "INVITADO", 90, 390);
      ctx.fillStyle = "#f6f8fc";
      ctx.font = "400 48px NoirEtBlanc, serif";
      members.forEach((member, index) => ctx.fillText(titleCase(member.nombre), 90, 470 + index * 64));
      const detailsY = 710;
      const spaced = ctx as CanvasRenderingContext2D & { letterSpacing?: string };
      const label = (t: string, x: number, y: number) => {
        ctx.fillStyle = "rgba(219,229,247,.6)";
        ctx.font = "500 20px Manrope, sans-serif";
        spaced.letterSpacing = "7px";
        ctx.fillText(t, x, y);
      };
      const value = (t: string, x: number, y: number) => {
        ctx.fillStyle = "#f2f6fd";
        ctx.font = "300 30px Manrope, sans-serif";
        spaced.letterSpacing = "6px";
        ctx.fillText(t, x, y);
      };
      label("FECHA", 90, detailsY);
      label("APERTURA", 580, detailsY);
      value("01 · 01 · 27", 90, detailsY + 56);
      value("20:30 HS", 580, detailsY + 56);
      label("LUGAR", 90, detailsY + 145);
      value("OGA GUASU · SALÓN DE EVENTOS", 90, detailsY + 201);
      spaced.letterSpacing = "0px";
      ctx.strokeStyle = "rgba(235,242,255,.22)";
      ctx.beginPath(); ctx.moveTo(90, 1015); ctx.lineTo(990, 1015); ctx.stroke();
      const qrUrl = await QRCode.toDataURL(code || "MILE-WORLD", { width: 300, margin: 2, errorCorrectionLevel: "M" });
      const qr = new Image();
      await new Promise<void>((resolve, reject) => { qr.onload = () => resolve(); qr.onerror = () => reject(); qr.src = qrUrl; });
      ctx.fillStyle = "#f7f8fb";
      ctx.fillRect(690, 1110, 300, 300);
      ctx.drawImage(qr, 690, 1110, 300, 300);
      ctx.fillStyle = "#f6f8fc";
      for (let i = 0; i < 52; i += 1) {
        const width = i % 7 === 0 ? 7 : i % 3 === 0 ? 4 : 2;
        ctx.fillRect(90 + i * 9, 1140, width, 220);
      }
      ctx.fillStyle = "rgba(219,229,247,.72)";
      ctx.font = "500 25px Manrope, sans-serif";
      ctx.fillText(code || "MILE WORLD", 90, 1420);
      ctx.font = "400 21px Manrope, sans-serif";
      ctx.fillText("PASE PERSONAL · OBLIGATORIO PARA TU ENTRADA", 90, 1500);
      const blob: Blob | null = await new Promise((res) => canvas.toBlob(res, "image/png"));
      if (!blob) return;
      const file = new File([blob], `MILE-WORLD-${code || "PASE"}.png`, { type: "image/png" });
      const nav = navigator as Navigator & { canShare?: (d: { files: File[] }) => boolean };
      if (nav.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "MILE WORLD · Pase de acceso" });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = file.name; a.click();
        setTimeout(() => URL.revokeObjectURL(url), 2000);
      }
    } catch { /* silencioso */ }
    finally { setSaving(false); }
  };

  return (
    <section className="relative isolate py-28 px-5 sm:px-8 overflow-hidden">
      <SceneBg image={chromeRipple.url} opacity={0.58} blur={2} position="50% 50%" tint="oklch(0.12 0.05 262 / 0.34)" duration={28} />
      {/* retrato de Mile — presencia suave y desenfocada detrás del pase */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage: `url(${milePortrait.url})`,
          backgroundSize: "cover",
          backgroundPosition: "50% 28%",
          filter: "blur(26px) saturate(55%) brightness(0.85)",
          opacity: 0.3,
          maskImage: "radial-gradient(ellipse 80% 70% at 50% 45%, #000 30%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 45%, #000 30%, transparent 80%)",
          mixBlendMode: "luminosity",
        }}
      />

      <div className="mx-auto max-w-md">
        <Meta style={{ letterSpacing: "0.45em" }}>Credencial de acceso</Meta>
        <Title size="text-[clamp(38px,14vw,64px)]" className="mt-3 uppercase">Tu acceso</Title>
      </div>

      <div className="mt-12 mx-auto max-w-[350px]">
        <motion.div
          className="relative rounded-[26px] overflow-hidden"
          style={{
            background: "linear-gradient(160deg, oklch(0.24 0.07 262) 0%, oklch(0.13 0.045 262) 45%, oklch(0.18 0.055 262) 100%)",
            border: "1px solid oklch(1 0 0 / 0.16)",
            boxShadow: "0 40px 80px -34px oklch(0.55 0.18 258 / 0.45), inset 0 1px 0 oklch(1 0 0 / 0.2)",
          }}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8%" }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          {/* iluminación fija de vidrio y cromo */}
          <div aria-hidden className="absolute inset-0 pointer-events-none" style={{
            background: "radial-gradient(ellipse at 20% 10%, oklch(0.9 0.03 250 / 0.14), transparent 52%), radial-gradient(ellipse at 90% 80%, oklch(0.65 0.16 258 / 0.14), transparent 58%)",
          }} />


          <div className="relative p-6 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="font-meta text-[9px]" style={{ letterSpacing: "0.45em", color: "oklch(0.76 0.03 255)" }}>MILE WORLD</div>
                <div className="mt-2 font-noir text-chrome text-[30px] leading-none uppercase">Acceso</div>
              </div>
              <img src={mLogo.url} alt="" className="w-11 h-11 shrink-0 opacity-90" style={{ filter: "drop-shadow(0 0 14px oklch(0.7 0.15 258 / 0.45))" }} />
            </div>

            <div className="mt-9">
              <div className="font-meta text-[9px]" style={{ letterSpacing: "0.35em", color: "oklch(0.66 0.03 255)" }}>
                {members.length > 1 ? "INVITADOS" : "INVITADO"}
              </div>
              <div className="mt-3 space-y-1.5">
                {members.map((m) => (
                  <div key={m.nombre} className="font-noir text-[18px] leading-tight uppercase" style={{ color: "oklch(0.97 0.01 250)", letterSpacing: "0.05em" }}>
                    {titleCase(m.nombre)}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-7 grid grid-cols-2 gap-x-5 gap-y-4">
              <PassRow label="Fecha" value="01 · 01 · 27" />
              <PassRow label="Apertura" value="20:30 hs" />
              <PassRow label="Lugar" value="Oga Guasu · Salón de Eventos" wide />
            </div>

            <div className="mt-7 pt-5 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4" style={{ borderTop: "1px solid oklch(1 0 0 / 0.1)" }}>
              <div className="min-w-0">
                <div className="flex items-end gap-[1.5px] h-8">
                  {Array.from({ length: 42 }).map((_, i) => (
                    <div key={i} style={{ width: i % 7 === 0 || i % 11 === 0 ? 3 : 1.5, height: "100%", background: "oklch(0.98 0.005 250 / 0.65)" }} />
                  ))}
                </div>
                <div className="mt-2.5 font-meta text-[10px]" style={{ letterSpacing: "0.4em", color: "oklch(0.74 0.03 255)" }}>{code}</div>
              </div>

              <div className="shrink-0 rounded-[14px] p-2" style={{ background: "oklch(0.97 0.005 250)", boxShadow: "0 10px 26px -12px oklch(0 0 0 / 0.7)" }}>
                {code ? (
                  <QRCodeSVG value={code} size={72} level="M" marginSize={1} bgColor="#F7F8FB" fgColor="#0C1224" />
                ) : (
                  <div className="w-[72px] h-[72px]" />
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="mt-8 mx-auto max-w-sm text-center">
        <button
          type="button"
          onClick={savePass}
          disabled={saving}
          className="btn-premium w-full rounded-full px-6 py-4 font-meta text-[11px] disabled:opacity-60"
          style={{ letterSpacing: "0.32em" }}
        >
          {saving ? "GUARDANDO..." : "DESCARGAR PASE"}
        </button>
        <div className="mt-3 font-info text-[12px]" style={{ color: "oklch(0.72 0.02 255)" }}>
          Obligatorio para tu entrada
        </div>
      </div>

    </section>
  );
}
function PassRow({ label, value, wide }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={wide ? "col-span-2" : ""}>
      <div className="font-meta text-[9px]" style={{ letterSpacing: "0.35em", color: "oklch(0.64 0.03 255)" }}>{label}</div>
      <div
        className="mt-2 font-meta font-light text-[12px] uppercase text-chrome"
        style={{ letterSpacing: "0.2em", lineHeight: 1.5 }}
      >
        {value}
      </div>
    </div>
  );
}

/* ---------- 5 · COUNTDOWN ---------- */
function Countdown() {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const i = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(i); }, []);
  const diff = Math.max(0, EVENT_DATE.getTime() - now);
  const units = [
    { l: "Días", v: Math.floor(diff / 86400000) },
    { l: "Horas", v: Math.floor((diff / 3600000) % 24) },
    { l: "Minutos", v: Math.floor((diff / 60000) % 60) },
    { l: "Segundos", v: Math.floor((diff / 1000) % 60) },
  ];
  return (
    <section className="relative isolate py-32 px-5 sm:px-8 overflow-hidden">
      <SceneBg image={bgChrome.url} opacity={0.60} blur={2} position="50% 50%" tint="oklch(0.12 0.05 262 / 0.34)" duration={30} />
      <div aria-hidden className="absolute inset-x-0 top-1/3 h-[40vh] pointer-events-none" style={{
        background: "radial-gradient(ellipse 60% 100% at 50% 0%, oklch(0.8 0.12 258 / 0.18), transparent 70%)",
        mixBlendMode: "screen",
      }} />

      <div className="mx-auto max-w-2xl text-center">
        <Meta className="!text-center" style={{ letterSpacing: "0.45em" }}>Cuenta regresiva</Meta>
        <Title align="center" size="text-[clamp(30px,10vw,56px)]" className="mt-3 uppercase">La noche se acerca</Title>
      </div>

      <div className="mt-16 mx-auto max-w-2xl grid grid-cols-2 sm:grid-cols-4 gap-y-10 gap-x-4">
        {units.map((u, i) => (
          <motion.div
            key={u.l}
            className="text-center"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 1, ease: [0.22, 0.9, 0.3, 1] }}
          >
            <div className="num-clock text-chrome text-[clamp(36px,12vw,64px)] leading-[1.35] pt-2 pb-2">
              {String(u.v).padStart(2, "0")}
            </div>
            <div className="mt-3 font-meta text-[9px]" style={{ color: "oklch(0.7 0.02 255)" }}>{u.l}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ---------- 6 · TU DESTINO DE LA NOCHE ---------- */
const DESTINOS = [
  "Vas a bailar hasta el final",
  "Vas a ser el alma de la fiesta",
  "Vas a sacar demasiadas fotos",
  "Vas a decir “una más”",
  "Vas a ser el último en irte",
  "Vas a perder la noción del tiempo",
  "Vas a ser parte del chisme",
  "Vas a decir “no puedo creer que hice eso”",
];

function Ruleta() {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const seg = 360 / DESTINOS.length;

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);
    const idx = Math.floor(Math.random() * DESTINOS.length);
    const target = 360 * 6 + (360 - idx * seg - seg / 2);
    const next = rotation + target - (rotation % 360);
    setRotation(next);
    window.setTimeout(() => {
      setResult(DESTINOS[idx]);
      setSpinning(false);
      window.setTimeout(() => setResult(null), 5000);
    }, 4300);
  };

  return (
    <section className="relative isolate py-28 px-5 sm:px-8 overflow-hidden">
      <SceneBg image={bgSwirl.url} opacity={0.54} blur={2} position="50% 50%" tint="oklch(0.12 0.05 262 / 0.34)" duration={32} />

      <div className="mx-auto max-w-xl text-center">
        <Title align="center" size="text-[clamp(30px,10vw,52px)]" className="uppercase">Tu destino de la noche</Title>
      </div>

      <div className="mt-14 mx-auto w-[76vw] max-w-[330px] relative">
        {/* chrome indicator */}
        <div aria-hidden className="absolute left-1/2 -translate-x-1/2 -top-3 z-20"
          style={{
            width: 0, height: 0,
            borderLeft: "9px solid transparent",
            borderRight: "9px solid transparent",
            borderTop: "18px solid oklch(0.94 0.01 250)",
            filter: "drop-shadow(0 4px 10px oklch(0 0 0 / 0.7))",
          }}
        />
        <motion.div
          className="relative aspect-square rounded-full overflow-hidden"
          style={{
            border: "2px solid oklch(0.88 0.02 250 / 0.55)",
            boxShadow: "0 0 70px -10px oklch(0.6 0.18 258 / 0.55), inset 0 0 60px oklch(0 0 0 / 0.6)",
            filter: spinning ? "blur(0.6px)" : "none",
          }}
          animate={{ rotate: rotation }}
          transition={{ duration: 4.2, ease: [0.12, 0.72, 0.12, 1] }}
        >
          <div className="absolute inset-0" style={{
            background: `conic-gradient(${DESTINOS.map((_, i) =>
              `${i % 2 === 0 ? "oklch(0.20 0.07 262)" : "oklch(0.13 0.045 262)"} ${i * seg}deg ${(i + 1) * seg}deg`
            ).join(", ")})`,
          }} />
          {DESTINOS.map((_, i) => (
            <div key={i} className="absolute inset-0">
              <div
                className="absolute left-1/2 top-0 h-1/2 w-px origin-bottom"
                style={{ background: "linear-gradient(180deg, oklch(0.92 0.02 250 / 0.55), transparent)", transform: `rotate(${i * seg}deg)` }}
              />
              <div
                className="absolute left-1/2 top-0 h-1/2 w-0 origin-bottom"
                style={{ transform: `rotate(${i * seg + seg / 2}deg)` }}
              >
                <div
                  className="absolute left-0 top-[12%] font-noir text-[15px] leading-none"
                  style={{ color: "oklch(0.95 0.01 250)", transform: "translateX(-50%)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
              </div>
            </div>
          ))}
          <div aria-hidden className="absolute inset-0 rounded-full" style={{
            background: "radial-gradient(circle at 30% 25%, oklch(0.95 0.02 250 / 0.16), transparent 55%)",
            mixBlendMode: "screen",
          }} />
        </motion.div>

        {/* hub */}
        <button
          onClick={spin}
          disabled={spinning}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-[30%] aspect-square rounded-full grid place-items-center"
          style={{
            background: "linear-gradient(160deg, oklch(0.30 0.08 262), oklch(0.10 0.04 261))",
            border: "1px solid oklch(0.9 0.02 250 / 0.45)",
            boxShadow: "0 12px 30px -10px oklch(0 0 0 / 0.85), inset 0 1px 0 oklch(1 0 0 / 0.18)",
          }}
          aria-label="Girar la ruleta"
        >
          <span className="font-meta text-[8px]" style={{ color: "oklch(0.92 0.01 250)", letterSpacing: "0.2em" }}>
            {spinning ? "···" : "Girar"}
          </span>
        </button>
      </div>

      <div className="mt-10 mx-auto max-w-md text-center font-meta text-[9px]" style={{ color: "oklch(0.62 0.02 255)" }}>
        {spinning ? "Girando…" : "Girá para descubrir tu destino"}
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            key="destino-popup"
            className="fixed inset-0 z-[60] grid place-items-center px-6"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute inset-0" style={{ background: "oklch(0.06 0.025 260 / 0.86)", backdropFilter: "blur(14px)" }} />
            <motion.div
              className="relative text-center max-w-lg"
              initial={{ opacity: 0, scale: 0.92, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.9, ease: [0.22, 0.9, 0.3, 1] }}
            >
              <div className="font-meta text-[10px]" style={{ letterSpacing: "0.5em", color: "oklch(0.74 0.02 255)" }}>Tu destino</div>
              <div className="mt-6 font-noir italic text-chrome text-[clamp(30px,9vw,56px)] leading-[1.1]">{result}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ---------- 7 · TENIDA ELEGANTE (fashion editorial) ---------- */
function TenidaElegante() {
  return (
    <section className="relative isolate py-32 px-5 sm:px-8 overflow-hidden">
      <SceneBg image={iridescentDrape.url} opacity={0.54} blur={2} position="50% 50%" tint="oklch(0.12 0.05 262 / 0.34)" duration={26} />

      <div className="mx-auto max-w-5xl">
        <div className="flex items-end justify-between gap-6">
          <Meta style={{ letterSpacing: "0.45em" }}>Dress code</Meta>
          <Meta style={{ letterSpacing: "0.35em" }}>Nº 01</Meta>
        </div>
        <Title size="text-[17vw] sm:text-8xl" className="mt-4 uppercase">Tenida</Title>
        <Title size="text-[15vw] sm:text-7xl" italic className="pl-[12%] -mt-1" delay={0.15}>elegante</Title>
        <p className="mt-8 max-w-md font-noir italic text-[clamp(20px,6vw,30px)] leading-snug" style={{ color: "oklch(0.92 0.02 250)" }}>
          Una noche especial merece una presencia especial.
        </p>

        {/* editorial spread */}
        <div className="mt-14 grid grid-cols-12 gap-4 sm:gap-6 items-start">
          <div className="col-span-7 sm:col-span-5">
            <EditorialPlate image={mile3.url} ratio="aspect-[3/4]" />
          </div>

          <div className="col-span-5 sm:col-span-4 mt-16">
            <EditorialPlate image={mile4.url} ratio="aspect-[4/5]" />
          </div>

          <div className="col-span-12 sm:col-span-3 sm:mt-24">
            <motion.div
              initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 1.1, ease: [0.22, 0.9, 0.3, 1] }}
              className="mt-10 sm:mt-0 border-t pt-6"
              style={{ borderColor: "oklch(0.85 0.02 250 / 0.25)" }}
            >
              <div className="font-meta text-[9px]" style={{ color: "oklch(0.66 0.02 255)" }}>Única indicación</div>
              <div className="mt-4 font-noir text-chrome uppercase text-[9vw] sm:text-[30px] leading-[1.05]">
                Evitar blanco y plateado como colores predominantes
              </div>
              <div className="mt-6 h-px w-full" style={{ background: "linear-gradient(90deg, oklch(0.9 0.02 250 / 0.55), transparent)" }} />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function EditorialPlate({ image, ratio }: { image: string; ratio: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 1.3, ease: [0.22, 0.9, 0.3, 1] }}
      className={`relative ${ratio} rounded-[18px] overflow-hidden`}
      style={{
        border: "1px solid oklch(1 0 0 / 0.12)",
        boxShadow: "0 46px 90px -44px oklch(0 0 0 / 0.8)",
      }}
    >
      <div className="absolute inset-0" style={{
        backgroundImage: `url(${image})`, backgroundSize: "cover", backgroundPosition: "center",
        filter: "saturate(85%) contrast(106%)",
      }} />
      <div className="absolute inset-0" style={{
        background: "linear-gradient(180deg, oklch(0.14 0.05 262 / 0.2), oklch(0.10 0.04 261 / 0.6))",
      }} />
      <motion.div
        aria-hidden className="absolute inset-y-0 -left-1/2 w-1/2 pointer-events-none"
        style={{ background: "linear-gradient(105deg, transparent 40%, oklch(1 0 0 / 0.16) 50%, transparent 60%)", mixBlendMode: "screen" }}
        animate={{ x: ["-40%", "300%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", repeatDelay: 4 }}
      />
    </motion.div>
  );
}

/* ---------- 8 · REGALO ---------- */
function Regalo() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  return (
    <section className="relative isolate py-32 px-5 sm:px-8 overflow-hidden">
      <SceneBg image={bgSilkGold.url} opacity={0.58} blur={2} position="50% 50%" tint="oklch(0.12 0.05 262 / 0.34)" duration={30} />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-[5] overflow-hidden">
        <video
          src={giftRain.url}
          autoPlay muted loop playsInline preload="metadata"
          className="h-full w-full object-cover opacity-55"
          style={{ maskImage: "radial-gradient(ellipse 82% 68% at 50% 47%, #000 25%, transparent 88%)", WebkitMaskImage: "radial-gradient(ellipse 82% 68% at 50% 47%, #000 25%, transparent 88%)" }}
        />
        <div className="absolute inset-0" style={{ background: "oklch(0.10 0.04 261 / 0.34)" }} />
      </div>

      <div className="mx-auto max-w-xl text-center">
        
        <Title align="center" size="text-[clamp(40px,15vw,80px)]" className="mt-4 uppercase">Regalos</Title>

        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 1.1, ease: [0.22, 0.9, 0.3, 1] }}
          className="mt-12 mx-auto max-w-lg"
          style={{ color: "oklch(0.9 0.02 255)" }}
        >
          <span className="font-noir text-chrome text-[clamp(40px,13vw,70px)] leading-none">Lluvia de sobres</span>
          <span className="ml-2 font-info text-[clamp(14px,4vw,18px)]">durante la celebración.</span>
          <p className="mt-10 font-info text-[clamp(14px,4vw,17px)] leading-[1.8]">
            Para quienes prefieran hacerlo de forma digital, habilitamos esta cuenta bancaria.
          </p>
        </motion.div>

        <div className="mt-10">
          <button onClick={() => setOpen((o) => !o)} className="btn-premium !px-8 !py-4 !text-[12px]">
            {open ? "Ocultar alias" : "Ver alias"}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 0.9, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-8 mx-auto max-w-sm glass-panel rounded-2xl p-8">
                <div className="font-meta text-[9px]" style={{ letterSpacing: "0.4em", color: "oklch(0.68 0.03 255)" }}>Alias</div>
                <div className="mt-4 font-noir text-chrome text-[clamp(20px,6vw,28px)]" style={{ letterSpacing: "0.1em" }}>{GIFT_ALIAS}</div>
                <button
                  onClick={() => { navigator.clipboard.writeText(GIFT_ALIAS); setCopied(true); setTimeout(() => setCopied(false), 1800); }}
                  className="btn-ghost mt-7 !py-3 !px-6 !text-[10px]"
                >
                  {copied ? "Copiado ✓" : "Copiar"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ---------- 9 · CONFIRMAR PRESENCIA ---------- */
function Rsvp({ guest }: { guest: GuestData }) {
  const [confirmed, setConfirmed] = useState(false);
  const message = useMemo(() => {
    const members = visibleMembers(guest.nombre);
    const list = members.map((m) => `• ${titleCase(m.nombre)}`).join("\n");
    const code = accessCodeFor(guest.nombre);
    return `Hola.\nConfirmo mi presencia a MILE WORLD.\n\nInvitados:\n${list}\n\nCódigo de acceso: ${code}`;
  }, [guest.nombre]);
  const text = encodeURIComponent(message);

  return (
    <section className="relative isolate py-28 px-5 sm:px-8 overflow-hidden">
      <SceneBg image={bgIridescent.url} opacity={0.54} blur={2} position="50% 50%" tint="oklch(0.12 0.05 262 / 0.34)" duration={28} />

      <div className="mx-auto max-w-xl text-center">
        <Meta className="!text-center" style={{ letterSpacing: "0.45em" }}>Confirmación</Meta>
        <Title align="center" size="text-[12vw] sm:text-5xl" className="mt-4 uppercase">¿Vas a ser parte de la noche?</Title>
        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 1 }}
          className="mt-6 font-noir italic text-[6.5vw] sm:text-2xl"
          style={{ color: "oklch(0.94 0.01 250)" }}
        >
          Confirma tu presencia.
        </motion.p>
      </div>

      <motion.div
        className="mt-12 mx-auto max-w-md text-center"
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.1, ease: [0.22, 0.9, 0.3, 1] }}
      >
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`}
          target="_blank" rel="noreferrer"
          onClick={() => setConfirmed(true)}
          className="btn-premium w-full"
        >
          {confirmed ? "Acceso activado ✓" : "Confirmar por WhatsApp"}
        </a>
      </motion.div>
    </section>
  );
}

/* ---------- 10 · UBICACIÓN ---------- */
function LocationScene() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.55], [1.6, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0.25, 1]);

  return (
    <section ref={ref} className="relative isolate py-28 px-5 sm:px-8 overflow-hidden">
      <SceneBg image={bgSilver.url} opacity={0.50} blur={2} position="50% 50%" tint="oklch(0.12 0.05 262 / 0.34)" duration={30} />

      <div className="mx-auto max-w-xl">
        <Meta style={{ letterSpacing: "0.45em" }}>Ubicación</Meta>
        <Title size="text-[14vw] sm:text-6xl" className="mt-3 uppercase">Oga Guasu</Title>
        <div className="mt-4 font-meta text-[10px]" style={{ color: "oklch(0.72 0.02 255)" }}>Salón de eventos</div>
      </div>

      <div className="mt-10 mx-auto max-w-md relative rounded-[28px] overflow-hidden"
        style={{ border: "1px solid oklch(1 0 0 / 0.12)", boxShadow: "0 40px 90px -40px oklch(0 0 0 / 0.7)" }}>
        <motion.div style={{ scale, opacity }} className="relative aspect-[4/3] will-change-transform">
          <IllustratedMap />
        </motion.div>
        <div aria-hidden className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse at 50% 40%, transparent 40%, oklch(0.10 0.04 261 / 0.85) 100%)",
        }} />
        <div className="absolute inset-x-0 bottom-0 p-5 flex justify-center">
          <a href={MAPS_URL} target="_blank" rel="noreferrer" className="btn-premium">
            Abrir en Google Maps
          </a>
        </div>
      </div>
    </section>
  );
}

function IllustratedMap() {
  return (
    <svg viewBox="0 0 400 300" className="absolute inset-0 w-full h-full" aria-hidden>
      <defs>
        <linearGradient id="mapbg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.24 0.09 262)" />
          <stop offset="60%" stopColor="oklch(0.15 0.06 261)" />
          <stop offset="100%" stopColor="oklch(0.20 0.08 258)" />
        </linearGradient>
        <radialGradient id="mapglow">
          <stop offset="0%" stopColor="oklch(0.85 0.14 258 / 0.75)" />
          <stop offset="100%" stopColor="oklch(0.6 0.18 258 / 0)" />
        </radialGradient>
      </defs>
      <rect width="400" height="300" fill="url(#mapbg)" />
      <g stroke="oklch(0.85 0.05 255 / 0.16)" strokeWidth="1" fill="none">
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={"h" + i} x1="0" y1={i * 34 + 12} x2="400" y2={i * 34 + 20} />
        ))}
        {Array.from({ length: 11 }).map((_, i) => (
          <line key={"v" + i} x1={i * 38 + 10} y1="0" x2={i * 38 + 26} y2="300" />
        ))}
      </g>
      <g fill="none" strokeLinecap="round">
        <motion.path
          d="M-10 210 C 80 190, 150 240, 250 200 S 380 150, 420 170"
          stroke="oklch(0.9 0.03 250 / 0.45)" strokeWidth="6"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
          transition={{ duration: 2.4, ease: "easeInOut" }}
        />
        <motion.path
          d="M40 -10 C 70 90, 140 130, 190 160 S 260 250, 250 320"
          stroke="oklch(0.8 0.1 258 / 0.4)" strokeWidth="4"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
          transition={{ duration: 2.8, delay: 0.3, ease: "easeInOut" }}
        />
        <path d="M400 40 C 320 60, 280 110, 210 150" stroke="oklch(0.9 0.03 250 / 0.25)" strokeWidth="3" />
      </g>
      <g opacity="0.5" fill="oklch(0.75 0.06 258 / 0.28)">
        <rect x="60" y="60" width="52" height="38" rx="8" />
        <rect x="290" y="90" width="64" height="44" rx="10" />
        <rect x="100" y="220" width="70" height="40" rx="10" />
        <rect x="300" y="215" width="46" height="34" rx="8" />
      </g>
      <circle cx="210" cy="158" r="70" fill="url(#mapglow)" />
      <motion.circle
        cx="210" cy="158" r="18" fill="none" stroke="oklch(0.95 0.02 250 / 0.6)" strokeWidth="1.5"
        initial={{ r: 16, opacity: 0.7 }}
        animate={{ r: [16, 34], opacity: [0.7, 0] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut" }}
      />
      <circle cx="210" cy="158" r="9" fill="oklch(0.97 0.01 250)" />
    </svg>
  );
}

/* ---------- 11 · CIERRE · MEMORIAS + CRÉDITOS ---------- */
/** Cuatro recuerdos, dos por turno, alternando en loop detrás de los créditos. */
const MEMORIES = [
  { src: memory1.url, className: "left-[4%] top-[7%] w-[56vw] sm:left-[7%] sm:w-[30vw]", pair: 0 },
  { src: memory2.url, className: "right-[4%] bottom-[8%] w-[56vw] sm:right-[7%] sm:w-[27vw]", pair: 0 },
  { src: memory4.url, className: "right-[4%] top-[8%] w-[56vw] sm:right-[7%] sm:w-[26vw]", pair: 1 },
  { src: memory3.url, className: "left-[4%] bottom-[7%] w-[56vw] sm:left-[7%] sm:w-[25vw]", pair: 1 },
];

function ClosingCredits() {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const fade = useTransform(scrollYProgress, [0.85, 1], [1, 0.15]);

  const [turn, setTurn] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTurn((v) => (v + 1) % 2), 7000);
    return () => clearInterval(t);
  }, []);

  return (
    <section ref={ref} className="relative isolate min-h-[130svh] flex flex-col items-center justify-center px-6 py-32 overflow-hidden">
      <SceneBg image={bgSilk.url} opacity={0.6} blur={2} position="50% 50%" tint="oklch(0.12 0.05 262 / 0.3)" duration={34} />

      {/* memorias — se funden con el fondo, de a dos por turno */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {MEMORIES.map((m, i) => (
          <MemoryCloud key={i} src={m.src} className={m.className} active={m.pair === turn} index={i} />
        ))}
      </div>


      <motion.div style={{ opacity: fade }} className="relative z-10 text-center max-w-md">
        <motion.img
          src={wordmark.url} alt="MILE WORLD"
          className="mx-auto w-[68vw] max-w-[300px] opacity-90"
          initial={{ opacity: 0 }} whileInView={{ opacity: 0.9 }} viewport={{ once: true }} transition={{ duration: 1.6 }}
          loading="lazy"
        />

        <motion.div
          initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.7, duration: 1.5 }}
          className="mt-14 font-noir italic text-[7.5vw] sm:text-4xl leading-tight"
          style={{ color: "oklch(0.96 0.01 250)", textShadow: "0 4px 30px oklch(0.1 0.04 261 / 0.9)" }}
        >
          Algunos momentos merecen vivir para siempre.
        </motion.div>

        <div className="mt-20 space-y-8">
          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4, duration: 1.4 }}
            className="font-noir text-chrome uppercase text-[11vw] sm:text-5xl leading-none"
          >
            Mile
          </motion.div>
          <div className="font-meta text-[11px]" style={{ letterSpacing: "0.5em", color: "oklch(0.82 0.02 255)" }}>
            01 · 01 · 2027
          </div>
        </div>

        <div className="mt-20 space-y-5 font-meta text-[9px]" style={{ color: "oklch(0.7 0.02 255)", textShadow: "0 2px 20px oklch(0.1 0.04 261 / 0.95)" }}>
          <div>
            <div style={{ color: "oklch(0.56 0.02 255)" }}>Producción</div>
            <div className="mt-2">MILE WORLD · A MILEWOOD PRODUCTION</div>
          </div>
          <div>
            <div style={{ color: "oklch(0.56 0.02 255)" }}>Concepto</div>
            <div className="mt-2">Lucas Montiel · Milena Montiel</div>
          </div>
          <div className="pt-6" style={{ color: "oklch(0.54 0.02 255)" }}>© MILEWOOD · Todos los derechos reservados</div>
          <div style={{ color: "oklch(0.82 0.02 255)" }}>@mileeemontiel</div>
        </div>
      </motion.div>

      {/* fade out cinematográfico final */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[35vh] z-20" style={{
        background: "linear-gradient(0deg, oklch(0.045 0.015 260) 0%, transparent 100%)",
      }} />
    </section>
  );
}

function MemoryCloud({
  src, className, active, index,
}: {
  src: string;
  className: string;
  active: boolean;
  index: number;
}) {
  return (
    <motion.div
      className={`absolute ${className} aspect-[3/4]`}
      style={{
        WebkitMaskImage:
          "radial-gradient(ellipse 66% 64% at 50% 50%, #000 45%, rgba(0,0,0,0.45) 72%, transparent 92%)",
        maskImage:
          "radial-gradient(ellipse 66% 64% at 50% 50%, #000 45%, rgba(0,0,0,0.45) 72%, transparent 92%)",
        filter: "none",
      }}
      initial={false}
      animate={{ opacity: active ? 0.5 : 0, scale: active ? 1 : 1.025 }}
      transition={{ duration: 2.6, ease: "easeInOut", delay: (index % 2) * 0.5 }}
    >
      <video
        src={src} autoPlay muted loop playsInline preload="metadata"
        className="w-full h-full object-cover rounded-[38%]"
      />
    </motion.div>
  );
}
