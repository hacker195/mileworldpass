import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useScroll, useTransform } from "motion/react";
import { QRCodeSVG } from "qrcode.react";
import mLogo from "@/assets/mile-m-logo.png.asset.json";
import wordmark from "@/assets/mileworld-wordmark-official.png.asset.json";
import soundtrack from "@/assets/genesis-soundtrack.mp3.asset.json";
import giftIll from "@/assets/gift-illustration.png.asset.json";
import bgSilk from "@/assets/bg-silk.jpg.asset.json";
import bgSilkGold from "@/assets/bg-silk-gold.jpg.asset.json";
import bgStage from "@/assets/bg-stage.jpg.asset.json";
import bgChrome from "@/assets/bg-chrome-liquid.jpg.asset.json";
import bgCorridor from "@/assets/bg-corridor.jpg.asset.json";
import bgLights from "@/assets/bg-lights.jpg.asset.json";
import bgIridescent from "@/assets/bg-iridescent.jpg.asset.json";
import bgSilver from "@/assets/bg-silver.jpg.asset.json";
import bgSwirl from "@/assets/bg-swirl.jpg.asset.json";
import memory1 from "@/assets/memory-1.webm.asset.json";
import memory2 from "@/assets/memory-2.webm.asset.json";
import memory3 from "@/assets/memory-3.webm.asset.json";
import { SceneBg, EditorialTitle, Kicker } from "@/components/scene";
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
      { title: "MILE WORLD — Milena Montiel" },
      { name: "description", content: "MILE WORLD — The Mile Experience. A Milewood Production. Premiere privada 01 · 01 · 2027." },
      { property: "og:title", content: "MILE WORLD — Milena Montiel" },
      { property: "og:description", content: "The Mile Experience. A Milewood Production. 01 · 01 · 2027." },
    ],
  }),
});

type Stage = "intro" | "access" | "validating" | "welcome" | "experience";
interface GuestData { nombre: string; rol: "adulto" | "joven" }

const EVENT_DATE = new Date("2027-01-01T20:30:00-03:00");
const MAPS_URL = "https://www.google.com/maps/search/?api=1&query=Oga+Guasu+Salon+de+Eventos";
const WHATSAPP_NUMBER = "19313275485";
const GIFT_ALIAS = "CI.3.510.962";

/* ============================================================ */
/*  ROOT                                                        */
/* ============================================================ */
function Index() {
  const [stage, setStage] = useState<Stage>("intro");
  const [guest, setGuest] = useState<GuestData>({ nombre: "", rol: "adulto" });
  const [muted, setMuted] = useState(false);
  // Emotional volume curve: 0.60 (opening) → 1.00 (final scene)
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
    if (musicShouldPlay && !muted) {
      a.play().catch(() => {});
    } else {
      a.pause();
    }
  }, [musicShouldPlay, muted]);

  // Long eased fades (≈5s) between section volumes — never a jump.
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
      {musicShouldPlay && <MuteToggle muted={muted} onToggle={() => setMuted((m) => !m)} />}
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
/*  AMBIENT BACKDROP — global, always lit (never flat black)    */
/* ============================================================ */
function AmbientBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-20 overflow-hidden">
      <div className="absolute inset-0" style={{
        background:
          "radial-gradient(ellipse 100% 65% at 50% 0%, oklch(0.24 0.09 262) 0%, oklch(0.12 0.04 261) 55%, oklch(0.095 0.03 260) 100%)",
      }} />
      <motion.div
        className="absolute -top-1/3 left-1/2 w-[140vw] h-[80vh] rounded-full -translate-x-1/2"
        style={{ background: "radial-gradient(closest-side, oklch(0.58 0.18 258 / 0.30), transparent 70%)", filter: "blur(80px)" }}
        animate={{ y: [0, 24, -12, 0], opacity: [0.7, 1, 0.75, 0.7] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-x-0 top-1/3 h-[60vh]"
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
/*  INTRO                                                       */
/* ============================================================ */
function IntroScreen({ onEnter }: { onEnter: () => void }) {
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 3200); return () => clearTimeout(t); }, []);

  return (
    <motion.section
      className="relative min-h-[100svh] flex flex-col items-center justify-center px-5 sm:px-6 overflow-hidden"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }}
    >
      <SceneBg image={bgLights.url} opacity={0.42} blur={34} position="50% 30%" tint="oklch(0.13 0.05 262 / 0.68)" duration={30} />

      <motion.div
        aria-hidden className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[70vw] max-w-[520px] h-[140vh]"
        style={{ background: "radial-gradient(ellipse at top, oklch(0.85 0.12 258 / 0.30), transparent 55%)", filter: "blur(28px)", mixBlendMode: "screen" }}
        initial={{ rotate: -8, opacity: 0 }} animate={{ rotate: [-8, 8, -4], opacity: [0.2, 0.9, 0.6] }}
        transition={{ duration: 6, ease: "easeInOut" }}
      />

      <motion.div
        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 1 }}
        className="text-[9px] sm:text-[10px] font-medium mb-10 sm:mb-14"
        style={{ color: "oklch(0.78 0.03 255)", letterSpacing: "0.5em", textTransform: "uppercase" }}
      >
        A Milewood Production
      </motion.div>

      <div className="relative w-[56vw] max-w-[250px] aspect-square">
        <motion.img
          src={mLogo.url} alt="MILE WORLD"
          className="absolute inset-0 w-full h-full object-contain"
          style={{ filter: "drop-shadow(0 20px 60px oklch(0.55 0.18 258 / 0.5))" }}
          initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.8, ease: [0.2, 0.8, 0.2, 1] }}
        />
        <div
          className="absolute inset-0"
          style={{
            WebkitMaskImage: `url(${mLogo.url})`, maskImage: `url(${mLogo.url})`,
            WebkitMaskSize: "contain", maskSize: "contain",
            WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat",
            WebkitMaskPosition: "center", maskPosition: "center",
          }}
        >
          <motion.div
            className="absolute inset-y-0 -left-full w-1/2"
            style={{ background: "linear-gradient(105deg, transparent 30%, oklch(1 0 0 / 0.9) 50%, transparent 70%)", filter: "blur(6px)" }}
            initial={{ x: "-40%" }} animate={{ x: "260%" }}
            transition={{ delay: 1.4, duration: 1.6, ease: [0.22, 0.9, 0.3, 1] }}
          />
        </div>
      </div>

      <motion.img
        src={wordmark.url} alt="MILE WORLD — The Mile Experience"
        className="mt-8 sm:mt-10 w-[68vw] max-w-[320px] opacity-90"
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 0.9, y: 0 }} transition={{ delay: 2.4, duration: 1.2 }}
      />

      <AnimatePresence>
        {ready && (
          <motion.button
            key="cta" onClick={onEnter}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.9 }}
            className="btn-ghost mt-12 sm:mt-16"
          >
            Start Experience
            <motion.span
              aria-hidden className="absolute inset-0 pointer-events-none"
              style={{ background: "linear-gradient(105deg, transparent 40%, oklch(1 0 0 / 0.22) 50%, transparent 60%)" }}
              animate={{ x: ["-120%", "120%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
            />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

/* ============================================================ */
/*  ACCESS                                                      */
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
      className="relative min-h-[100svh] flex items-center justify-center px-5 sm:px-6 py-16 overflow-hidden"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.9, ease: [0.22, 0.9, 0.3, 1] }}
    >
      <SceneBg image={bgCorridor.url} opacity={0.4} blur={30} position="50% 45%" tint="oklch(0.12 0.05 262 / 0.7)" duration={28} />

      <div className="relative w-full max-w-md">
        <div className="glass-panel rounded-[26px] px-6 sm:px-8 py-9 relative overflow-hidden">
          <div className="text-center">
            <Kicker className="!text-center">Mile World</Kicker>
            <EditorialTitle text="Acceso" accent="Verificación" align="center" size="text-[15vw] sm:text-5xl" className="mt-3" />
            <div className="mx-auto mt-5 h-px w-16" style={{ background: "linear-gradient(90deg, transparent, oklch(0.9 0.02 250 / 0.6), transparent)" }} />
            <p className="mt-5 text-[13px] font-medium leading-relaxed" style={{ color: "oklch(0.9 0.01 250)" }}>
              Ingresa tu nombre para continuar
            </p>
          </div>

          <form className="mt-8" onSubmit={(e) => { e.preventDefault(); submit(); }}>
            <Field label="Nombre">
              <input
                required autoFocus
                value={query}
                onChange={(e) => { setQuery(e.target.value); setSelected(null); setActive(0); setOpen(true); setError(null); }}
                onFocus={() => setOpen(true)}
                onBlur={() => setTimeout(() => setOpen(false), 120)}
                onKeyDown={onKeyDown}
                placeholder="Escribe tu nombre"
                autoComplete="off"
                className="w-full bg-transparent outline-none text-[16px] tracking-[0.04em] py-2"
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
                          className="w-full text-left px-4 py-3 text-[13px] transition-colors"
                          style={{
                            color: "oklch(0.96 0.01 250)",
                            background: i === active ? "oklch(0.55 0.14 258 / 0.22)" : "transparent",
                            letterSpacing: "0.04em",
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
              <div className="mt-3 text-[11px] tracking-[0.2em]" style={{ color: "oklch(0.75 0.14 25)" }}>{error}</div>
            )}

            <button type="submit" disabled={!selected} className="btn-premium w-full mt-6">
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
      <div className="text-[9px] font-medium tracking-[0.35em] uppercase mb-1.5" style={{ color: "oklch(0.66 0.03 255)" }}>{label}</div>
      <div className="relative border-b" style={{ borderColor: "oklch(1 0 0 / 0.18)" }}>{children}</div>
    </label>
  );
}

/* ============================================================ */
/*  VALIDATING                                                  */
/* ============================================================ */
function ValidatingScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 3600); return () => clearTimeout(t); }, [onDone]);

  return (
    <motion.section
      className="relative min-h-[100svh] flex items-center justify-center px-6 overflow-hidden"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}
    >
      <SceneBg image={bgChrome.url} opacity={0.34} blur={40} tint="oklch(0.12 0.05 262 / 0.72)" duration={22} />
      <div aria-hidden className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] max-w-[600px] h-[80vh]" style={{
        background: "radial-gradient(ellipse at top, oklch(0.85 0.15 258 / 0.45), transparent 60%)", mixBlendMode: "screen",
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
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 0.9, ease: [0.22, 0.9, 0.3, 1] }}
          className="mt-8 font-editorial text-[22px] sm:text-[26px] text-chrome"
        >
          Acceso autorizado
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.1, duration: 0.9 }}
          className="mt-3 text-[12px] font-medium" style={{ color: "oklch(0.74 0.03 255)" }}
        >
          Tu invitación personalizada ha sido activada.
        </motion.div>
      </div>
    </motion.section>
  );
}

/* ============================================================ */
/*  WELCOME                                                     */
/* ============================================================ */
function WelcomeScreen({ guest, onContinue }: { guest: GuestData; onContinue: () => void }) {
  const display = firstName(guest.nombre);
  const greeting = welcomeGreeting(guest.nombre);
  return (
    <motion.section
      className="relative min-h-[100svh] flex items-center px-6 sm:px-10 py-20 overflow-hidden"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 1 }}
    >
      <SceneBg image={bgSilk.url} opacity={0.46} blur={28} position="30% 40%" tint="oklch(0.13 0.05 262 / 0.62)" duration={30} />

      <div className="relative w-full max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 1, ease: [0.22, 0.9, 0.3, 1] }}
          className="text-[10px] font-medium" style={{ letterSpacing: "0.5em", textTransform: "uppercase", color: "oklch(0.76 0.03 255)" }}
        >
          {greeting}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 1.2, ease: [0.22, 0.9, 0.3, 1] }}
          className="mt-3 font-editorial text-chrome text-[19vw] sm:text-8xl"
        >
          <span className="drop-letter">{display.charAt(0)}</span>
          <span className="text-[0.72em]">{display.slice(1)}</span>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }}
          className="mt-8 ml-[6%] font-display italic text-[26px] sm:text-4xl leading-tight"
          style={{ color: "oklch(0.95 0.01 250)" }}
        >
          Prepárate para brillar
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.1, duration: 1 }}
          className="mt-6 ml-[6%] max-w-sm text-[13px] font-medium leading-relaxed"
          style={{ color: "oklch(0.82 0.02 255)", letterSpacing: "0.06em" }}
        >
          Te invitamos a conocer <span className="text-chrome font-display not-italic tracking-[0.2em]">MILE WORLD</span>
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
/*  EXPERIENCE                                                  */
/* ============================================================ */
function Experience({ guest, onLevel }: { guest: GuestData; onLevel: (v: number) => void }) {
  const set = useCallback((v: number) => onLevel(v), [onLevel]);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }} className="w-full overflow-x-hidden">
      <VolumeZone level={0.7} onLevel={set}><Hero /></VolumeZone>
      <VolumeZone level={0.76} onLevel={set}><StoryGallery /></VolumeZone>
      <VolumeZone level={0.84} onLevel={set}><VipPass guest={guest} /></VolumeZone>
      <VolumeZone level={0.86} onLevel={set}><Countdown /></VolumeZone>
      <VolumeZone level={0.86} onLevel={set}><DressCode /></VolumeZone>
      <VolumeZone level={0.86} onLevel={set}><GiftSection /></VolumeZone>
      <VolumeZone level={0.86} onLevel={set}><Restricted /></VolumeZone>
      <VolumeZone level={0.92} onLevel={set}><Rsvp guest={guest} /></VolumeZone>
      <VolumeZone level={0.86} onLevel={set}><LocationScene /></VolumeZone>
      <VolumeZone level={1} onLevel={set}><ClosingCredits /></VolumeZone>
    </motion.div>
  );
}

/* ---------- HERO ---------- */
function Hero() {
  return (
    <section className="relative min-h-[100svh] flex flex-col justify-center px-6 sm:px-10 py-24 overflow-hidden">
      <SceneBg image={bgSilkGold.url} opacity={0.44} blur={26} position="60% 40%" tint="oklch(0.12 0.05 262 / 0.66)" duration={34} />

      <motion.img
        src={wordmark.url} alt="MILE WORLD"
        className="w-[74vw] max-w-[380px] opacity-95"
        initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 0.95, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.4 }}
      />
      <motion.div
        className="mt-8 h-px w-24 origin-left"
        style={{ background: "linear-gradient(90deg, oklch(0.9 0.02 250 / 0.7), transparent)" }}
        initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ delay: 0.6, duration: 1 }}
      />
      <motion.div
        className="mt-8 font-editorial text-chrome text-[12.5vw] sm:text-7xl leading-[0.92]"
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.8, duration: 1.2 }}
      >
        <div>
          <span className="drop-letter">M</span>
          <span className="text-[0.74em]">ilena</span>{" "}
          <span className="text-[0.6em] italic font-medium normal-case tracking-[0.12em]">Anahí</span>
        </div>
        <div className="mt-2 pl-[8%]">
          <span className="text-[0.74em]">Montiel</span>{" "}
          <span className="text-[0.74em] opacity-80">Chaparro</span>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1.4, duration: 1 }}
        className="mt-10 text-[10px] font-medium" style={{ letterSpacing: "0.5em", color: "oklch(0.76 0.03 255)" }}
      >
        01 · 01 · 2027
      </motion.div>
    </section>
  );
}

/* ---------- STORY GALLERY — vertical scroll drives horizontal motion ---------- */
const STORY = [
  { img: bgSilk.url, label: "Chapter I" },
  { img: bgIridescent.url, label: "Chapter II" },
  { img: bgSilver.url, label: "Chapter III" },
];

function StoryGallery() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0.05, 0.95], ["2%", "-68%"]);

  return (
    <section ref={ref} className="relative h-[320svh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden flex flex-col justify-center">
        <SceneBg image={bgSwirl.url} opacity={0.36} blur={38} tint="oklch(0.12 0.05 262 / 0.7)" duration={32} />
        <div className="px-6 sm:px-10">
          <Kicker>The Mile Experience</Kicker>
        </div>
        <motion.div style={{ x }} className="mt-6 flex gap-5 sm:gap-8 pl-6 sm:pl-10 will-change-transform">
          {STORY.map((s, i) => (
            <div
              key={i}
              className="relative shrink-0 w-[72vw] sm:w-[46vw] max-w-[460px] aspect-[3/4] rounded-[26px] overflow-hidden"
              style={{
                border: "1px solid oklch(1 0 0 / 0.12)",
                boxShadow: "0 50px 90px -40px oklch(0 0 0 / 0.7)",
              }}
            >
              <div className="absolute inset-0" style={{
                backgroundImage: `url(${s.img})`, backgroundSize: "cover", backgroundPosition: "center",
                filter: "saturate(110%) contrast(105%)",
              }} />
              <div className="absolute inset-0" style={{
                background: "linear-gradient(180deg, oklch(0.14 0.05 262 / 0.25), oklch(0.10 0.04 261 / 0.7))",
              }} />
              <motion.div
                aria-hidden className="absolute inset-y-0 -left-1/2 w-1/2 pointer-events-none"
                style={{ background: "linear-gradient(105deg, transparent 40%, oklch(1 0 0 / 0.18) 50%, transparent 60%)", mixBlendMode: "screen" }}
                animate={{ x: ["-40%", "300%"] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", repeatDelay: 3 + i * 1.5 }}
              />
              <div className="absolute left-5 bottom-5 right-5">
                <div className="font-editorial text-chrome text-[9vw] sm:text-4xl leading-none">
                  <span className="drop-letter">{s.label.charAt(0)}</span>
                  <span className="text-[0.7em]">{s.label.slice(1)}</span>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- LASER SIGNATURE ---------- */
function LaserSignature() {
  const paths = [
    "M6 46C6 30 8 17 11 17c3 0 4 15 6 15s4-16 7-16 3 18 4 30",
    "M40 29c0 8 1 14 3 17",
    "M40.6 20.5h0.4",
    "M53 11c-2 15-2 27 2 35",
    "M62 37c6 0 10-2 10-6 0-4-4-5-7-2-4 4-3 14 5 14",
  ];
  return (
    <svg width="86" height="54" viewBox="0 0 86 54" fill="none" aria-hidden
      style={{ filter: "drop-shadow(0 0 6px oklch(0.85 0.08 258 / 0.55))" }}>
      {paths.map((d, i) => (
        <motion.path
          key={i} d={d}
          stroke="oklch(0.98 0.01 250 / 0.55)" strokeWidth="1.1" strokeLinecap="round" fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 + i * 0.35, duration: 1.1, ease: "easeInOut" }}
        />
      ))}
    </svg>
  );
}

/* ---------- VIP PASS ---------- */
function VipPass({ guest }: { guest: GuestData }) {
  const members = useMemo(() => visibleMembers(guest.nombre), [guest.nombre]);
  // Deterministic: the QR encodes the group's accessCode read live from guests.json.
  const code = useMemo(() => accessCodeFor(guest.nombre), [guest.nombre]);

  return (
    <section className="relative py-24 px-5 sm:px-8 overflow-hidden">
      <SceneBg image={bgChrome.url} opacity={0.4} blur={32} position="40% 50%" tint="oklch(0.12 0.05 262 / 0.68)" duration={28} />

      <div className="mx-auto max-w-md">
        <Kicker>Access Credential</Kicker>
        <EditorialTitle text="Pase" accent="de acceso" align="left" size="text-[16vw] sm:text-6xl" className="mt-2" />
      </div>

      <motion.div
        className="mt-10 mx-auto max-w-sm relative rounded-[26px] overflow-hidden"
        style={{
          background: "linear-gradient(160deg, oklch(0.24 0.07 262) 0%, oklch(0.13 0.045 262) 45%, oklch(0.18 0.055 262) 100%)",
          border: "1px solid oklch(1 0 0 / 0.16)",
          boxShadow: "0 50px 100px -24px oklch(0.55 0.18 258 / 0.5), inset 0 1px 0 oklch(1 0 0 / 0.2)",
        }}
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.1, ease: [0.22, 0.9, 0.3, 1] }}
      >
        <div aria-hidden className="absolute inset-0 opacity-30 mix-blend-screen" style={{
          background: "radial-gradient(ellipse at 20% 10%, oklch(0.9 0.03 250 / 0.4), transparent 50%), radial-gradient(ellipse at 90% 80%, oklch(0.65 0.16 258 / 0.35), transparent 55%)",
        }} />

        {/* preserved shine animation */}
        <motion.div
          aria-hidden className="absolute inset-0 pointer-events-none z-20"
          style={{
            background: "linear-gradient(115deg, transparent 25%, oklch(1 0 0 / 0.22) 45%, oklch(0.75 0.15 258 / 0.3) 50%, oklch(1 0 0 / 0.22) 55%, transparent 75%)",
            mixBlendMode: "screen",
          }}
          initial={{ x: "-130%" }} animate={{ x: "130%" }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", repeatDelay: 2.5 }}
        />

        <div className="relative p-6 sm:p-7">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
            <div className="min-w-0">
              <div className="text-[9px] font-medium tracking-[0.45em]" style={{ color: "oklch(0.76 0.03 255)" }}>MILE WORLD</div>
              <div className="mt-2 font-editorial text-chrome text-[28px] leading-none">
                <span className="drop-letter">A</span><span className="text-[0.72em]">ccess</span>
              </div>
            </div>
            <img src={mLogo.url} alt="" className="w-11 h-11 shrink-0 opacity-90" style={{ filter: "drop-shadow(0 0 14px oklch(0.7 0.15 258 / 0.45))" }} />
          </div>

          {/* laser-engraved signature */}
          <div className="absolute left-6 sm:left-7 top-[86px] opacity-90 pointer-events-none">
            <LaserSignature />
          </div>

          <div className="mt-24">
            <div className="text-[9px] font-medium tracking-[0.35em]" style={{ color: "oklch(0.66 0.03 255)" }}>
              {members.length > 1 ? "INVITADOS" : "INVITADO"}
            </div>
            <div className="mt-2 space-y-1">
              {members.map((m) => (
                <div key={m.nombre} className="font-display text-[17px] leading-tight" style={{ color: "oklch(0.97 0.01 250)", letterSpacing: "0.03em" }}>
                  {titleCase(m.nombre)}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-4">
            <PassRow label="Fecha" value="01 · 01 · 2027" />
            <PassRow label="Apertura" value="20:30 hs" />
            <PassRow label="Lugar" value="Oga Guasu · Salón de Eventos" wide />
          </div>

          <div className="mt-7 pt-5 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4" style={{ borderTop: "1px solid oklch(1 0 0 / 0.1)" }}>
            <div className="min-w-0">
              <div className="flex items-end gap-[1.5px] h-8">
                {Array.from({ length: 42 }).map((_, i) => (
                  <div key={i} style={{ width: i % 7 === 0 || i % 11 === 0 ? 3 : 1.5, height: "100%", background: "oklch(0.98 0.005 250 / 0.7)" }} />
                ))}
              </div>
              <div className="mt-2.5 text-[10px] font-mono tracking-[0.4em]" style={{ color: "oklch(0.72 0.03 255)" }}>{code}</div>
            </div>

            {/* deterministic QR — bottom right, clean quiet zone */}
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
    </section>
  );
}
function PassRow({ label, value, wide }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={wide ? "col-span-2" : ""}>
      <div className="text-[9px] font-medium tracking-[0.35em] uppercase" style={{ color: "oklch(0.64 0.03 255)" }}>{label}</div>
      <div className="mt-1 text-[13px] font-medium" style={{ color: "oklch(0.96 0.01 250)", letterSpacing: "0.04em" }}>{value}</div>
    </div>
  );
}

/* ---------- COUNTDOWN ---------- */
function Countdown() {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const i = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(i); }, []);
  const diff = Math.max(0, EVENT_DATE.getTime() - now);
  const units = [
    { l: "Días", v: Math.floor(diff / 86400000) },
    { l: "Horas", v: Math.floor((diff / 3600000) % 24) },
    { l: "Min", v: Math.floor((diff / 60000) % 60) },
    { l: "Seg", v: Math.floor((diff / 1000) % 60) },
  ];
  return (
    <section className="relative py-28 px-5 sm:px-8 overflow-hidden">
      <SceneBg image={bgStage.url} opacity={0.4} blur={30} position="50% 35%" tint="oklch(0.12 0.05 262 / 0.7)" duration={30} />
      <div className="mx-auto max-w-md">
        <Kicker className="text-right">Cuenta regresiva</Kicker>
        <EditorialTitle text="Premiere" accent="La noche se acerca" align="right" size="text-[15vw] sm:text-6xl" className="mt-2" />
      </div>
      <div className="mt-12 mx-auto max-w-md grid grid-cols-4 gap-2 sm:gap-3">
        {units.map((u) => (
          <div key={u.l} className="glass-panel rounded-2xl py-5 text-center">
            <div className="font-editorial text-chrome text-[7vw] sm:text-4xl tabular-nums">{String(u.v).padStart(2, "0")}</div>
            <div className="mt-1 text-[8px] sm:text-[9px] font-medium tracking-[0.3em] uppercase" style={{ color: "oklch(0.68 0.03 255)" }}>{u.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- DRESS CODE ---------- */
function DressCode() {
  return (
    <section className="relative py-28 px-5 sm:px-8 overflow-hidden">
      <SceneBg image={bgSilver.url} opacity={0.34} blur={34} position="50% 50%" tint="oklch(0.12 0.05 262 / 0.74)" duration={26} />
      <div className="mx-auto max-w-2xl">
        <Kicker>Dress code</Kicker>
        <motion.div
          initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 1.1, ease: [0.22, 0.9, 0.3, 1] }}
          className="mt-3 font-editorial text-chrome text-[17vw] sm:text-8xl leading-[0.9]"
        >
          <div><span className="drop-letter">T</span><span className="text-[0.72em]">enida</span></div>
          <div className="pl-[10%] text-[0.86em] italic normal-case font-semibold tracking-[0.06em]">elegante</div>
        </motion.div>
        <motion.p
          className="mt-8 max-w-md text-[14px] sm:text-[15px] font-medium leading-relaxed"
          style={{ color: "oklch(0.86 0.02 255)", letterSpacing: "0.04em" }}
          initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.1, delay: 0.2 }}
        >
          Una noche especial merece una presencia especial.
        </motion.p>
      </div>
    </section>
  );
}

/* ---------- GIFT ---------- */
function GiftSection() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  return (
    <section className="relative py-24 px-5 sm:px-8 overflow-hidden">
      <SceneBg image={bgSilkGold.url} opacity={0.38} blur={34} position="70% 60%" tint="oklch(0.12 0.05 262 / 0.7)" duration={30} />
      <motion.div
        className="mx-auto max-w-md"
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.1, ease: [0.22, 0.9, 0.3, 1] }}
      >
        <Kicker className="!text-center text-center">Detalles para Mile</Kicker>

        <div className="relative mt-6 flex justify-center">
          {/* luminous stage for the illustration so it reads as part of the scene */}
          <motion.div aria-hidden className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse at 50% 55%, oklch(0.72 0.14 258 / 0.4), transparent 62%)", filter: "blur(24px)", mixBlendMode: "screen" }}
            animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.06, 1] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <div aria-hidden className="absolute bottom-2 left-1/2 -translate-x-1/2 w-40 h-6 rounded-[50%]"
            style={{ background: "radial-gradient(ellipse, oklch(0.85 0.08 258 / 0.35), transparent 70%)", filter: "blur(10px)" }} />
          <img
            src={giftIll.url}
            alt="Obsequio"
            className="relative w-44 sm:w-52"
            style={{
              filter:
                "brightness(0) invert(1) drop-shadow(0 0 18px oklch(0.9 0.05 258 / 0.55)) drop-shadow(0 18px 40px oklch(0.55 0.18 258 / 0.5))",
              opacity: 1,
            }}
            loading="lazy"
          />
        </div>

        <p className="mt-8 text-center text-[14px] font-medium leading-[1.75] max-w-sm mx-auto" style={{ color: "oklch(0.89 0.02 255)" }}>
          Tu presencia es el mejor regalo.
          <br />
          <span style={{ color: "oklch(0.76 0.02 255)" }}>Si deseas hacer un obsequio, habilitamos esta cuenta.</span>
        </p>

        <div className="mt-8 flex justify-center">
          <button onClick={() => setOpen((o) => !o)} className="btn-ghost">
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
              <div className="mt-5 glass-panel rounded-2xl p-6 text-center">
                <div className="text-[9px] font-medium tracking-[0.4em] uppercase" style={{ color: "oklch(0.68 0.03 255)" }}>Alias</div>
                <div className="mt-2 font-mono text-lg tracking-[0.15em] text-chrome">{GIFT_ALIAS}</div>
                <button
                  onClick={() => { navigator.clipboard.writeText(GIFT_ALIAS); setCopied(true); setTimeout(() => setCopied(false), 1800); }}
                  className="btn-ghost mt-5 !py-2.5 !px-5 !text-[10px]"
                >
                  {copied ? "Copiado ✓" : "Copiar"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

/* ---------- RESTRICTED ---------- */
function Restricted() {
  const [scanning, setScanning] = useState(false);
  const [denied, setDenied] = useState(false);

  const start = () => {
    if (scanning || denied) return;
    setScanning(true);
    setTimeout(() => { setScanning(false); setDenied(true); }, 2400);
  };

  return (
    <section className="relative py-24 px-5 sm:px-8 overflow-hidden">
      <SceneBg image={bgCorridor.url} opacity={0.34} blur={36} position="50% 60%" tint="oklch(0.11 0.05 262 / 0.74)" duration={24} />

      <div className="mx-auto max-w-xl">
        <Kicker>Classified</Kicker>
        <EditorialTitle
          text="Accede a todos los detalles de la fiesta"
          align="left"
          size="text-[10.5vw] sm:text-5xl"
          className="mt-3"
        />
      </div>

      <motion.div
        className="mt-10 mx-auto max-w-md glass-panel rounded-[26px] p-7 sm:p-8"
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.1, ease: [0.22, 0.9, 0.3, 1] }}
      >
        <div className="flex items-center justify-between text-[9px] font-medium tracking-[0.35em]" style={{ color: "oklch(0.66 0.03 255)" }}>
          <span>CLASSIFIED</span>
          <span>SECURITY · LVL 05</span>
        </div>

        <div className="mt-8 flex flex-col items-center">
          <button
            onClick={start}
            className="relative w-32 h-32 rounded-full grid place-items-center"
            style={{
              background: "radial-gradient(circle at 30% 30%, oklch(0.28 0.07 262), oklch(0.15 0.05 262))",
              border: `1px solid ${denied ? "oklch(0.7 0.18 25 / 0.6)" : "oklch(0.7 0.15 258 / 0.4)"}`,
              boxShadow: denied ? "0 0 50px oklch(0.6 0.22 25 / 0.4)" : "0 0 40px oklch(0.6 0.18 258 / 0.35)",
              transition: "border 400ms ease, box-shadow 400ms ease",
            }}
            aria-label="Escanear huella"
          >
            <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"
              style={{ color: denied ? "oklch(0.75 0.18 25)" : "oklch(0.75 0.05 258)", transition: "color 400ms ease" }}>
              <path d="M12 11a2 2 0 0 0-2 2v1a6 6 0 0 0 6 6" />
              <path d="M12 7a5 5 0 0 0-5 5v2a10 10 0 0 0 3.5 7.6" />
              <path d="M15 22a10 10 0 0 1-5-8.7v-.7a2 2 0 1 1 4 0v.9a6 6 0 0 0 2 4.6" />
              <path d="M6.5 5.5A9 9 0 0 1 21 12v1" />
              <path d="M3 12a8.9 8.9 0 0 1 1.5-5" />
            </svg>

            <AnimatePresence>
              {scanning && (
                <motion.div className="absolute inset-0 overflow-hidden rounded-full"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  <motion.div
                    className="absolute inset-x-0 top-0 h-[2px]"
                    style={{ background: "linear-gradient(90deg, transparent, oklch(0.9 0.18 258), transparent)", boxShadow: "0 0 24px oklch(0.75 0.2 258)" }}
                    animate={{ y: [0, 128, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: [0.45, 0, 0.55, 1] }}
                  />
                  <div className="absolute inset-0 rounded-full" style={{ background: "radial-gradient(circle, oklch(0.65 0.18 258 / 0.2), transparent 70%)" }} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          <div className="mt-6 h-6 text-center">
            <AnimatePresence mode="wait">
              {!scanning && !denied && (
                <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[10px] font-medium tracking-[0.35em]" style={{ color: "oklch(0.7 0.03 255)" }}>
                  PRESIONÁ PARA ESCANEAR
                </motion.div>
              )}
              {scanning && (
                <motion.div key="scan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[10px] font-medium tracking-[0.35em]" style={{ color: "oklch(0.78 0.12 258)" }}>
                  ESCANEANDO...
                </motion.div>
              )}
              {denied && (
                <motion.div key="deny" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[12px] font-medium tracking-[0.35em]" style={{ color: "oklch(0.78 0.16 25)" }}>
                  ACCESO DENEGADO
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-8 pt-6 text-center text-[14px] font-medium leading-relaxed" style={{ borderTop: "1px solid oklch(1 0 0 / 0.1)", color: "oklch(0.82 0.02 255)" }}>
          {denied ? (
            <span>Este archivo permanece clasificado.<br />Los detalles se revelarán la noche del evento.</span>
          ) : (
            <span>Contiene información sensible de la producción.<br />Validá tu huella para continuar.</span>
          )}
        </div>
      </motion.div>
    </section>
  );
}

/* ---------- RSVP ---------- */
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
    <section className="relative py-24 px-5 sm:px-8 overflow-hidden">
      <SceneBg image={bgIridescent.url} opacity={0.34} blur={34} position="30% 50%" tint="oklch(0.12 0.05 262 / 0.72)" duration={28} />

      <div className="mx-auto max-w-xl">
        <Kicker>Confirmación</Kicker>
        <EditorialTitle text="Confirmá tu presencia" align="left" size="text-[12vw] sm:text-6xl" className="mt-2" />
      </div>

      <motion.div
        className="mt-10 mx-auto max-w-md glass-panel rounded-[26px] p-7 text-center"
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.1, ease: [0.22, 0.9, 0.3, 1] }}
      >
        <p className="text-[14px] font-medium leading-relaxed" style={{ color: "oklch(0.87 0.02 255)" }}>
          Enviá tu confirmación directamente por WhatsApp para reservar tu lugar.
        </p>

        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`}
          target="_blank" rel="noreferrer"
          onClick={() => setConfirmed(true)}
          className="btn-premium w-full mt-6"
        >
          {confirmed ? "Acceso activado ✓" : "Confirmar por WhatsApp"}
        </a>
      </motion.div>
    </section>
  );
}

/* ---------- LOCATION ---------- */
function LocationScene() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.55], [1.75, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0.2, 1]);

  return (
    <section ref={ref} className="relative py-24 px-5 sm:px-8 overflow-hidden">
      <SceneBg image={bgSwirl.url} opacity={0.32} blur={38} position="50% 40%" tint="oklch(0.12 0.05 262 / 0.74)" duration={30} />

      <div className="mx-auto max-w-xl">
        <Kicker>Ubicación</Kicker>
        <EditorialTitle text="Oga Guasu" accent="Salón de eventos" align="left" size="text-[14vw] sm:text-6xl" className="mt-2" />
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

/** Decorative illustrated map — not interactive, part of the scene. */
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
        <path d="M-10 210 C 80 190, 150 240, 250 200 S 380 150, 420 170" stroke="oklch(0.9 0.03 250 / 0.45)" strokeWidth="6" />
        <path d="M40 -10 C 70 90, 140 130, 190 160 S 260 250, 250 320" stroke="oklch(0.8 0.1 258 / 0.4)" strokeWidth="4" />
        <path d="M400 40 C 320 60, 280 110, 210 150" stroke="oklch(0.9 0.03 250 / 0.25)" strokeWidth="3" />
      </g>
      <g opacity="0.5" fill="oklch(0.75 0.06 258 / 0.28)">
        <rect x="60" y="60" width="52" height="38" rx="8" />
        <rect x="290" y="90" width="64" height="44" rx="10" />
        <rect x="100" y="220" width="70" height="40" rx="10" />
        <rect x="300" y="215" width="46" height="34" rx="8" />
      </g>
      <circle cx="210" cy="158" r="70" fill="url(#mapglow)" />
      <circle cx="210" cy="158" r="9" fill="oklch(0.97 0.01 250)" />
      <circle cx="210" cy="158" r="18" fill="none" stroke="oklch(0.95 0.02 250 / 0.6)" strokeWidth="1.5" />
    </svg>
  );
}

/* ---------- CLOSING CREDITS + MEMORIES ---------- */
const MEMORIES = [
  { src: memory1.url, className: "left-[-6%] top-[8%] w-[62vw] sm:w-[34vw]", delay: 0, dur: 22, blur: 14, op: 0.30 },
  { src: memory2.url, className: "right-[-8%] top-[38%] w-[58vw] sm:w-[30vw]", delay: 7, dur: 24, blur: 12, op: 0.26 },
  { src: memory3.url, className: "left-[10%] bottom-[4%] w-[54vw] sm:w-[26vw]", delay: 14, dur: 26, blur: 16, op: 0.24 },
];

function ClosingCredits() {
  return (
    <section className="relative min-h-[110svh] flex flex-col items-center justify-center px-6 py-28 overflow-hidden">
      <SceneBg image={bgSilk.url} opacity={0.3} blur={44} position="50% 50%" tint="oklch(0.12 0.05 262 / 0.76)" duration={34} />

      {/* memories — translucent clouds behind the credits, never over the text */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {MEMORIES.map((m, i) => (
          <motion.div
            key={i}
            className={`absolute ${m.className} aspect-[4/3]`}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: [0, m.op, m.op * 0.85, 0], y: [16, -10, -18, -26], scale: [1.06, 1, 1.02, 1.05] }}
            transition={{ duration: m.dur, delay: m.delay, repeat: Infinity, repeatDelay: 12, ease: "easeInOut" }}
            style={{
              WebkitMaskImage: "radial-gradient(ellipse 62% 62% at 50% 50%, #000 25%, transparent 78%)",
              maskImage: "radial-gradient(ellipse 62% 62% at 50% 50%, #000 25%, transparent 78%)",
              filter: `blur(${m.blur}px) saturate(70%) brightness(1.05)`,
              mixBlendMode: "screen",
            }}
          >
            <video
              src={m.src} autoPlay muted loop playsInline preload="metadata"
              className="w-full h-full object-cover"
              style={{ filter: "sepia(18%) hue-rotate(185deg) saturate(150%) contrast(95%)" }}
            />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 text-center max-w-md">
        <motion.img
          src={wordmark.url} alt="MILE WORLD"
          className="mx-auto w-[68vw] max-w-[300px] opacity-90"
          initial={{ opacity: 0 }} whileInView={{ opacity: 0.9 }} viewport={{ once: true }} transition={{ duration: 1.6 }}
        />
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.8, duration: 1.4 }}
          className="mt-10 font-signature italic text-4xl" style={{ color: "oklch(0.95 0.01 250)", textShadow: "0 4px 30px oklch(0.1 0.04 261 / 0.9)" }}
        >
          Nos vemos en la premiere
        </motion.div>

        <div className="mt-16 space-y-5 text-center text-[10px] font-medium tracking-[0.35em]" style={{ color: "oklch(0.78 0.03 255)", textShadow: "0 2px 20px oklch(0.1 0.04 261 / 0.95)" }}>
          <div>
            <div style={{ color: "oklch(0.62 0.03 255)" }}>PRODUCTION</div>
            <div className="mt-1">MILE WORLD · The Mile Experience</div>
            <div className="mt-0.5">A Milewood Production</div>
          </div>
          <div>
            <div style={{ color: "oklch(0.62 0.03 255)" }}>CONCEPT DEVELOPMENT</div>
            <div className="mt-1">Lucas Montiel · Milena Montiel</div>
          </div>
          <div className="pt-6" style={{ color: "oklch(0.58 0.03 255)" }}>© XV MILEWOOD · All Rights Reserved</div>
          <div style={{ color: "oklch(0.8 0.03 255)" }}>@mileeemontiel</div>
        </div>
      </div>
    </section>
  );
}
