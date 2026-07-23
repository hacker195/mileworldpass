import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import mLogo from "@/assets/mile-m-logo.png.asset.json";
import wordmark from "@/assets/mileworld-wordmark-official.png.asset.json";
import soundtrack from "@/assets/genesis-soundtrack.mp3.asset.json";
import giftIll from "@/assets/gift-illustration.png.asset.json";
import {
  searchGuests,
  visibleMembers,
  titleCase,
  welcomeGreeting,
  findReservationByGuestName,
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

  // Autoplay after user gesture on "VALIDAR ACCESO"
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const musicShouldPlay = stage === "validating" || stage === "welcome" || stage === "experience";

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (musicShouldPlay && !muted) {
      a.volume = 0.55;
      a.play().catch(() => {});
    } else {
      a.pause();
    }
  }, [musicShouldPlay, muted]);

  useEffect(() => {
    return () => { audioRef.current?.pause(); };
  }, []);

  return (
    <main className="relative min-h-screen text-foreground overflow-x-hidden font-sans" style={{ background: "var(--midnight-deep)" }}>
      <audio ref={audioRef} src={soundtrack.url} loop preload="auto" />
      <AmbientBackdrop />
      {musicShouldPlay && (
        <MuteToggle muted={muted} onToggle={() => setMuted((m) => !m)} />
      )}
      <AnimatePresence mode="wait">
        {stage === "intro" && <IntroScreen key="intro" onEnter={() => setStage("access")} />}
        {stage === "access" && (
          <AccessScreen key="access" onSubmit={(m) => { setGuest({ nombre: m.nombre, rol: m.rol }); setStage("validating"); }} />
        )}
        {stage === "validating" && (
          <ValidatingScreen key="val" onDone={() => setStage("welcome")} />
        )}
        {stage === "welcome" && (
          <WelcomeScreen key="wel" guest={guest} onContinue={() => setStage("experience")} />
        )}
        {stage === "experience" && <Experience key="exp" guest={guest} />}
      </AnimatePresence>
    </main>
  );
}

/* ============================================================ */
/*  AMBIENT BACKDROP — fixed, continuous across the site        */
/* ============================================================ */
function AmbientBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Base radial midnight gradient */}
      <div className="absolute inset-0" style={{
        background:
          "radial-gradient(ellipse 90% 60% at 50% 0%, oklch(0.20 0.08 262) 0%, oklch(0.08 0.03 260) 55%, oklch(0.045 0.02 260) 100%)",
      }} />
      {/* Sapphire drifting bloom */}
      <motion.div
        className="absolute -top-1/3 left-1/2 -translate-x-1/2 w-[140vw] h-[80vh] rounded-full"
        style={{ background: "radial-gradient(closest-side, oklch(0.55 0.18 258 / 0.35), transparent 70%)", filter: "blur(80px)" }}
        animate={{ x: ["-50%", "-45%", "-55%", "-50%"], y: [0, 20, -10, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Chrome sheen band */}
      <motion.div
        className="absolute inset-x-0 top-1/3 h-[60vh]"
        style={{
          background: "linear-gradient(180deg, transparent, oklch(0.9 0.02 250 / 0.06), transparent)",
          transform: "skewY(-8deg)",
        }}
        animate={{ y: [-40, 40, -40] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Overhead sapphire beam */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[110vh]" style={{
        background: "radial-gradient(ellipse at top, oklch(0.7 0.18 258 / 0.22), transparent 55%)",
      }} />
      {/* Silver grain */}
      <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay" style={{
        backgroundImage:
          "radial-gradient(circle at 20% 30%, oklch(1 0 0) 0.5px, transparent 1px), radial-gradient(circle at 80% 70%, oklch(1 0 0) 0.5px, transparent 1px)",
        backgroundSize: "3px 3px, 5px 5px",
      }} />
      {/* Floor vignette */}
      <div className="absolute inset-x-0 bottom-0 h-[40vh]" style={{
        background: "linear-gradient(180deg, transparent, oklch(0.04 0.02 260) 90%)",
      }} />
    </div>
  );
}

/* ============================================================ */
/*  MUTE TOGGLE — small, unobtrusive                            */
/* ============================================================ */
function MuteToggle({ muted, onToggle }: { muted: boolean; onToggle: () => void }) {
  return (
    <motion.button
      onClick={onToggle}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
      className="fixed top-5 right-5 z-50 w-10 h-10 rounded-full grid place-items-center backdrop-blur-md"
      style={{
        background: "oklch(1 0 0 / 0.05)",
        border: "1px solid oklch(1 0 0 / 0.14)",
        boxShadow: "0 8px 24px oklch(0 0 0 / 0.4)",
      }}
      aria-label={muted ? "Activar sonido" : "Silenciar"}
    >
      {muted ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M11 5 6 9H2v6h4l5 4V5Z" />
          <path d="m22 9-6 6M16 9l6 6" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M11 5 6 9H2v6h4l5 4V5Z" />
          <path d="M15.5 8.5a5 5 0 0 1 0 7" />
          <path d="M18.5 5.5a9 9 0 0 1 0 13" />
        </svg>
      )}
    </motion.button>
  );
}

/* ============================================================ */
/*  INTRO — cinematic reveal of the M                           */
/* ============================================================ */
function IntroScreen({ onEnter }: { onEnter: () => void }) {
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 3200); return () => clearTimeout(t); }, []);

  return (
    <motion.section
      className="relative min-h-screen flex flex-col items-center justify-center px-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }}
    >
      {/* Sweeping spotlights */}
      <motion.div
        aria-hidden className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[60vw] h-[140vh]"
        style={{ background: "radial-gradient(ellipse at top, oklch(0.85 0.12 258 / 0.35), transparent 55%)", filter: "blur(20px)" }}
        initial={{ rotate: -8, opacity: 0 }} animate={{ rotate: [-8, 8, -4], opacity: [0, 0.9, 0.6] }}
        transition={{ duration: 6, ease: "easeInOut" }}
      />

      {/* Studio label */}
      <motion.div
        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 1 }}
        className="tracking-cinema text-[10px] mb-14"
        style={{ color: "oklch(0.75 0.03 255)", letterSpacing: "0.5em" }}
      >
        A MILEWOOD PRODUCTION
      </motion.div>

      {/* M with reflection sweep */}
      <div className="relative w-[62vw] max-w-[280px] aspect-square">
        <motion.img
          src={mLogo.url}
          alt="MILEWORLD"
          className="absolute inset-0 w-full h-full object-contain"
          style={{ filter: "drop-shadow(0 20px 60px oklch(0.55 0.18 258 / 0.5))" }}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.8, ease: [0.2, 0.8, 0.2, 1] }}
        />
        {/* Chrome light sweep — masked to the logo shape */}
        <motion.div
          className="absolute inset-0"
          style={{
            WebkitMaskImage: `url(${mLogo.url})`,
            maskImage: `url(${mLogo.url})`,
            WebkitMaskSize: "contain",
            maskSize: "contain",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            maskPosition: "center",
          }}
        >
          <motion.div
            className="absolute inset-y-0 -left-full w-1/2"
            style={{ background: "linear-gradient(105deg, transparent 30%, oklch(1 0 0 / 0.9) 50%, transparent 70%)", filter: "blur(6px)" }}
            initial={{ x: "-40%" }}
            animate={{ x: "260%" }}
            transition={{ delay: 1.4, duration: 1.6, ease: [0.22, 0.9, 0.3, 1] }}
          />
        </motion.div>
      </div>

      {/* Wordmark */}
      <motion.img
        src={wordmark.url}
        alt="MILE WORLD — The Mile Experience"
        className="mt-10 w-[70vw] max-w-[340px] opacity-90"
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 0.9, y: 0 }} transition={{ delay: 2.4, duration: 1.2 }}
      />

      {/* CTA */}
      <AnimatePresence>
        {ready && (
          <motion.button
            key="cta"
            onClick={onEnter}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.9 }}
            className="mt-16 px-10 py-3 text-[11px] tracking-cinema relative overflow-hidden"
            style={{
              color: "oklch(0.96 0.01 250)",
              border: "1px solid oklch(1 0 0 / 0.25)",
              background: "linear-gradient(180deg, oklch(1 0 0 / 0.05), oklch(1 0 0 / 0.01))",
              backdropFilter: "blur(8px)",
              letterSpacing: "0.4em",
            }}
          >
            START EXPERIENCE
            <motion.span
              aria-hidden className="absolute inset-0 pointer-events-none"
              style={{ background: "linear-gradient(105deg, transparent 40%, oklch(1 0 0 / 0.25) 50%, transparent 60%)" }}
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
/*  ACCESS — guest validation                                   */
/* ============================================================ */
function AccessScreen({ onSubmit }: { onSubmit: (m: GuestMember) => void }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<GuestMember | null>(null);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const results = useMemo(() => (selected ? [] : searchGuests(query, 6)), [query, selected]);

  const choose = (m: GuestMember) => {
    setSelected(m);
    setQuery(titleCase(m.nombre));
    setOpen(false);
    setError(null);
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
      className="relative min-h-screen flex items-center justify-center px-6 py-16"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.9, ease: [0.22, 0.9, 0.3, 1] }}
    >
      <div className="relative w-full max-w-md">
        <div className="glass-panel rounded-2xl px-7 py-9 relative overflow-hidden">
          <div className="text-center">
            <div className="tracking-cinema text-[10px] mb-4" style={{ color: "oklch(0.68 0.03 255)", letterSpacing: "0.5em" }}>
              MILE WORLD
            </div>
            <div className="font-display text-[26px] leading-[1.15] text-chrome">VERIFICACIÓN DE ACCESO</div>
            <div className="mx-auto mt-5 h-px w-16" style={{ background: "linear-gradient(90deg, transparent, oklch(0.9 0.02 250 / 0.6), transparent)" }} />
            <p className="mt-5 text-[13px] font-semibold leading-relaxed" style={{ color: "oklch(0.92 0.01 250)" }}>
              Ingresa tu nombre para continuar
            </p>
          </div>

          <form
            className="mt-8"
            onSubmit={(e) => { e.preventDefault(); submit(); }}
          >
            <Field label="NOMBRE">
              <input
                required autoFocus
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelected(null); setActive(0); setOpen(true); setError(null);
                }}
                onFocus={() => setOpen(true)}
                onBlur={() => setTimeout(() => setOpen(false), 120)}
                onKeyDown={onKeyDown}
                placeholder="Buscá tu nombre"
                autoComplete="off"
                className="w-full bg-transparent outline-none text-[15px] tracking-[0.05em] py-2"
                style={{ color: "oklch(0.96 0.01 250)" }}
              />
            </Field>

            <div className="relative">
              <AnimatePresence>
                {open && results.length > 0 && (
                  <motion.ul
                    initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute left-0 right-0 mt-2 rounded-xl overflow-hidden z-20"
                    style={{
                      background: "oklch(0.1 0.03 262 / 0.92)",
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

            <button
              type="submit" disabled={!selected}
              className="w-full mt-6 py-3.5 text-[11px] relative overflow-hidden transition-opacity"
              style={{
                letterSpacing: "0.4em",
                color: "oklch(0.98 0.01 250)",
                background: selected
                  ? "linear-gradient(180deg, oklch(0.55 0.16 258 / 0.55), oklch(0.32 0.12 258 / 0.4))"
                  : "oklch(1 0 0 / 0.04)",
                border: `1px solid ${selected ? "oklch(0.72 0.15 258 / 0.65)" : "oklch(1 0 0 / 0.1)"}`,
                opacity: selected ? 1 : 0.5,
                cursor: selected ? "pointer" : "not-allowed",
                boxShadow: selected ? "0 18px 40px -14px oklch(0.55 0.18 258 / 0.6)" : "none",
              }}
            >
              VALIDAR ACCESO
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
      <div className="text-[9px] tracking-[0.35em] mb-1.5" style={{ color: "oklch(0.62 0.03 255)" }}>{label}</div>
      <div className="relative border-b" style={{ borderColor: "oklch(1 0 0 / 0.15)" }}>{children}</div>
    </label>
  );
}

/* ============================================================ */
/*  VALIDATING → ACCESS AUTHORIZED (2s auto-continue)           */
/* ============================================================ */
function ValidatingScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 3600); return () => clearTimeout(t); }, [onDone]);

  return (
    <motion.section
      className="relative min-h-screen flex items-center justify-center px-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}
    >
      {/* Overhead spotlight */}
      <div aria-hidden className="absolute top-0 left-1/2 -translate-x-1/2 w-[70vw] h-[80vh]" style={{
        background: "radial-gradient(ellipse at top, oklch(0.85 0.15 258 / 0.5), transparent 60%)",
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
          <motion.svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.7, duration: 0.9, ease: [0.22, 0.9, 0.3, 1] }}
            style={{ color: "oklch(0.98 0.01 250)" }}
          >
            <motion.path d="m5 12 5 5L20 7" strokeLinecap="round" strokeLinejoin="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.7, duration: 0.9, ease: [0.22, 0.9, 0.3, 1] }}
            />
          </motion.svg>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 0.9, ease: [0.22, 0.9, 0.3, 1] }}
          className="mt-8 font-display text-[18px]" style={{ letterSpacing: "0.02em", color: "oklch(0.94 0.03 258)" }}
        >
          Acceso autorizado
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.1, duration: 0.9 }}
          className="mt-3 text-[12px]" style={{ color: "oklch(0.68 0.03 255)" }}
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
  const displayName = titleCase(guest.nombre);
  const greeting = welcomeGreeting(guest.nombre);
  return (
    <motion.section
      className="relative min-h-screen flex items-center justify-center px-6 py-20"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 1 }}
    >
      <div className="relative max-w-lg text-center">
        <motion.div
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 1, ease: [0.22, 0.9, 0.3, 1] }}
          className="text-[11px] tracking-cinema" style={{ letterSpacing: "0.5em", color: "oklch(0.72 0.03 255)" }}
        >
          {greeting}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 1.1, ease: [0.22, 0.9, 0.3, 1] }}
          className="mt-5 font-signature italic text-[44px] md:text-6xl leading-[1.05]"
          style={{ color: "oklch(0.96 0.01 250)" }}
        >
          {displayName}
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }}
          className="mt-10 font-display font-semibold text-3xl md:text-4xl leading-tight text-chrome"
        >
          Prepárate para brillar
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.1, duration: 1 }}
          className="mt-8 font-display text-xl md:text-2xl tracking-[0.08em]"
          style={{ color: "oklch(0.94 0.01 250)" }}
        >
          Te invitamos a conocer{" "}
          <span className="text-chrome whitespace-nowrap">MILE WORLD</span>
        </motion.p>

        <motion.button
          onClick={onContinue}
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.8, duration: 0.9 }}
          className="mt-14 px-10 py-3 text-[11px] relative overflow-hidden"
          style={{
            letterSpacing: "0.4em",
            color: "oklch(0.98 0.01 250)",
            border: "1px solid oklch(1 0 0 / 0.25)",
            background: "linear-gradient(180deg, oklch(1 0 0 / 0.05), transparent)",
          }}
        >
          CONTINUAR
        </motion.button>
      </div>
    </motion.section>
  );
}

/* ============================================================ */
/*  EXPERIENCE                                                  */
/* ============================================================ */
function Experience({ guest }: { guest: GuestData }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }}>
      <Hero />
      <StoryPlaceholders />
      <VipPass guest={guest} />
      <Countdown />
      <DressCode />
      <GiftSection />
      <Restricted />
      <Rsvp guest={guest} />
      <ClosingCredits />
    </motion.div>
  );
}

/* ---------- HERO ---------- */
function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24">
      <motion.img
        src={wordmark.url} alt="MILE WORLD"
        className="w-[78vw] max-w-[420px] opacity-95"
        initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 0.95, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.4 }}
      />
      <motion.div
        className="mx-auto mt-10 h-px w-24"
        style={{ background: "linear-gradient(90deg, transparent, oklch(0.9 0.02 250 / 0.7), transparent)" }}
        initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ delay: 0.6, duration: 1 }}
      />
      <motion.div
        className="mt-8 text-center font-display leading-[1.05]"
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.8, duration: 1.2 }}
      >
        <div className="text-4xl md:text-6xl text-chrome tracking-[0.02em]">Milena Anahí</div>
        <div className="text-4xl md:text-6xl text-chrome tracking-[0.02em] mt-1">Montiel Chaparro</div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1.4, duration: 1 }}
        className="mt-10 tracking-cinema text-[10px]" style={{ letterSpacing: "0.5em", color: "oklch(0.7 0.03 255)" }}
      >
        01 · 01 · 2027
      </motion.div>
    </section>
  );
}

/* ---------- STORY PLACEHOLDERS ---------- */
function StoryPlaceholders() {
  return (
    <section className="relative py-24 px-6">
      <div className="mx-auto max-w-4xl grid gap-8 md:grid-cols-2">
        {[0, 1].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 1.1, delay: i * 0.15, ease: [0.22, 0.9, 0.3, 1] }}
            whileHover={{ y: -4 }}
            className="relative aspect-[3/4] rounded-2xl overflow-hidden group"
            style={{
              background:
                "linear-gradient(160deg, oklch(0.16 0.05 262) 0%, oklch(0.09 0.03 260) 60%, oklch(0.14 0.05 262) 100%)",
              border: "1px solid oklch(1 0 0 / 0.1)",
              boxShadow: "0 40px 80px -30px oklch(0 0 0 / 0.6)",
            }}
          >
            <div aria-hidden className="absolute inset-0" style={{
              background: "radial-gradient(ellipse at 30% 20%, oklch(0.55 0.16 258 / 0.28), transparent 60%)",
            }} />
            <div aria-hidden className="absolute inset-0 opacity-40 mix-blend-screen" style={{
              background: "radial-gradient(ellipse at 80% 90%, oklch(0.9 0.02 250 / 0.3), transparent 55%)",
            }} />
            <motion.div
              aria-hidden className="absolute inset-y-0 -left-1/2 w-1/2 pointer-events-none"
              style={{ background: "linear-gradient(105deg, transparent 40%, oklch(1 0 0 / 0.15) 50%, transparent 60%)" }}
              animate={{ x: ["-40%", "260%"] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", repeatDelay: 3 + i * 1.5 }}
            />
            <div className="absolute inset-0 flex items-center justify-center px-8">
              <img src={wordmark.url} alt="MILE WORLD" className="w-2/3 opacity-60" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ---------- VIP PASS ---------- */
function VipPass({ guest }: { guest: GuestData }) {
  const members = useMemo(() => visibleMembers(guest.nombre), [guest.nombre]);
  const code = useMemo(() => {
    const res = findReservationByGuestName(guest.nombre);
    const seed = (res ? "R" + res.id + "-" : "") + (guest.nombre || "MILEWORLD");
    let h = 0; for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) & 0xffffff;
    return "MW-" + h.toString(16).toUpperCase().padStart(6, "0");
  }, [guest.nombre]);

  return (
    <section className="relative py-24 px-6">
      <SectionKicker>Access Credential</SectionKicker>
      <SectionTitle>Pase de Acceso</SectionTitle>

      {/* Environmental lighting around the pass */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-1/3 h-[60vh]" style={{
        background:
          "radial-gradient(ellipse at 30% 40%, oklch(0.55 0.18 258 / 0.22), transparent 55%), radial-gradient(ellipse at 70% 60%, oklch(0.9 0.02 250 / 0.08), transparent 60%)",
        filter: "blur(20px)",
      }} />

      <motion.div
        className="mt-12 mx-auto max-w-sm relative rounded-[22px] overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, oklch(0.22 0.06 262) 0%, oklch(0.11 0.04 262) 45%, oklch(0.16 0.05 262) 100%)",
          border: "1px solid oklch(1 0 0 / 0.14)",
          boxShadow:
            "0 50px 100px -24px oklch(0.55 0.18 258 / 0.5), inset 0 1px 0 oklch(1 0 0 / 0.18), 0 0 0 1px oklch(0 0 0 / 0.2)",
        }}
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.1, ease: [0.22, 0.9, 0.3, 1] }}
      >
        <div aria-hidden className="absolute inset-0 opacity-30 mix-blend-screen" style={{
          background:
            "radial-gradient(ellipse at 20% 10%, oklch(0.9 0.03 250 / 0.4), transparent 50%), radial-gradient(ellipse at 90% 80%, oklch(0.65 0.16 258 / 0.35), transparent 55%)",
        }} />

        <motion.div
          aria-hidden className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(115deg, transparent 25%, oklch(1 0 0 / 0.22) 45%, oklch(0.75 0.15 258 / 0.3) 50%, oklch(1 0 0 / 0.22) 55%, transparent 75%)",
            mixBlendMode: "screen",
          }}
          initial={{ x: "-130%" }} animate={{ x: "130%" }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", repeatDelay: 2.5 }}
        />

        <div className="relative p-7">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[9px] tracking-[0.45em]" style={{ color: "oklch(0.72 0.03 255)" }}>MILE WORLD</div>
              <div className="mt-1.5 font-display text-[19px] leading-none text-chrome">Access Pass</div>
            </div>
            <img src={mLogo.url} alt="" className="w-11 h-11 opacity-90" style={{ filter: "drop-shadow(0 0 14px oklch(0.7 0.15 258 / 0.45))" }} />
          </div>

          <div className="mt-7">
            <div className="text-[9px] tracking-[0.35em]" style={{ color: "oklch(0.62 0.03 255)" }}>
              {members.length > 1 ? "INVITADOS" : "INVITADO"}
            </div>
            <div className="mt-2 space-y-1.5">
              {members.map((m) => (
                <div key={m.nombre} className="font-display text-[17px] leading-tight" style={{ color: "oklch(0.97 0.01 250)", letterSpacing: "0.01em" }}>
                  {titleCase(m.nombre)}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-4">
            <PassRow label="Fecha" value="01 · 01 · 2027" />
            <PassRow label="Apertura" value="20:30 hs" />
            <PassRow label="Lugar" value="Oga Guasu · Salón de Eventos" wide />
            <PassRow label="Código" value={code} wide mono />
          </div>

          {/* Classic premium barcode — white, semi-transparent, uniform-thin bars */}
          <div className="mt-7 pt-5" style={{ borderTop: "1px solid oklch(1 0 0 / 0.08)" }}>
            <div className="flex items-end gap-[1.5px] h-9">
              {Array.from({ length: 72 }).map((_, i) => {
                const wide = i % 7 === 0 || i % 11 === 0;
                return (
                  <div key={i}
                    style={{
                      width: wide ? 3 : 1.5,
                      height: "100%",
                      background: "oklch(0.98 0.005 250 / 0.78)",
                    }}
                  />
                );
              })}
            </div>
            <div className="mt-2.5 text-center text-[9px] tracking-[0.45em]" style={{ color: "oklch(0.62 0.03 255)" }}>
              {code}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
function PassRow({ label, value, wide, mono }: { label: string; value: string; wide?: boolean; mono?: boolean }) {
  return (
    <div className={wide ? "col-span-2" : ""}>
      <div className="text-[9px] tracking-[0.35em]" style={{ color: "oklch(0.6 0.03 255)" }}>{label.toUpperCase()}</div>
      <div className={`mt-1 text-[13px] ${mono ? "font-mono" : ""}`} style={{ color: "oklch(0.96 0.01 250)", letterSpacing: mono ? "0.12em" : "0.04em" }}>{value}</div>
    </div>
  );
}

/* ---------- COUNTDOWN ---------- */
function Countdown() {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const i = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(i); }, []);
  const diff = Math.max(0, EVENT_DATE.getTime() - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff / 3600000) % 24);
  const m = Math.floor((diff / 60000) % 60);
  const s = Math.floor((diff / 1000) % 60);
  const units = [
    { l: "Días", v: d }, { l: "Horas", v: h }, { l: "Min", v: m }, { l: "Seg", v: s },
  ];
  return (
    <section className="relative py-28 px-6">
      <SectionKicker>Cuenta Regresiva</SectionKicker>
      <SectionTitle>La premiere se acerca</SectionTitle>
      <div className="mt-12 mx-auto max-w-md grid grid-cols-4 gap-3">
        {units.map((u) => (
          <div key={u.l} className="glass-panel rounded-xl py-5 text-center">
            <div className="font-display text-3xl md:text-4xl text-chrome tabular-nums">{String(u.v).padStart(2, "0")}</div>
            <div className="mt-1 text-[9px] tracking-[0.3em]" style={{ color: "oklch(0.65 0.03 255)" }}>{u.l.toUpperCase()}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- DRESS CODE ---------- */
function DressCode() {
  return (
    <section className="relative py-24 px-6">
      <SectionKicker>Dress Code</SectionKicker>
      <SectionTitle>Tenida elegante</SectionTitle>
      <motion.p
        className="mt-10 mx-auto max-w-md text-center font-display italic text-[22px] md:text-[26px] leading-snug"
        style={{ color: "oklch(0.94 0.01 250)" }}
        initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.1, ease: [0.22, 0.9, 0.3, 1] }}
      >
        Una noche especial merece una presencia especial.
      </motion.p>
      <motion.div
        className="mx-auto mt-10 h-px w-20"
        style={{ background: "linear-gradient(90deg, transparent, oklch(0.9 0.02 250 / 0.6), transparent)" }}
        initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1 }}
      />
    </section>
  );
}

/* ---------- GIFT ---------- */
function GiftSection() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  return (
    <section className="relative py-24 px-6">
      <motion.div
        className="mx-auto max-w-md"
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.1, ease: [0.22, 0.9, 0.3, 1] }}
      >
        <div className="relative flex justify-center pt-4 pb-2">
          <div aria-hidden className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at center, oklch(0.65 0.15 258 / 0.28), transparent 60%)",
          }} />
          <img
            src={giftIll.url}
            alt="Regalo"
            className="relative w-44"
            style={{ filter: "brightness(0) invert(1) drop-shadow(0 12px 32px oklch(0.55 0.18 258 / 0.4))", opacity: 0.95 }}
            loading="lazy"
          />
        </div>

        <p className="mt-6 text-center text-[13px] leading-[1.7] max-w-sm mx-auto" style={{ color: "oklch(0.85 0.02 255)" }}>
          Tu presencia es el mejor regalo.
          <br />
          <span style={{ color: "oklch(0.72 0.02 255)" }}>Sin embargo, habilitamos esta cuenta por si deseas realizar tu obsequio en efectivo.</span>
        </p>

        <div className="mt-7">
          <button
            onClick={() => setOpen((o) => !o)}
            className="w-full py-3.5 text-[11px] tracking-cinema relative transition-colors"
            style={{
              letterSpacing: "0.4em",
              color: "oklch(0.98 0.01 250)",
              background: "linear-gradient(180deg, oklch(1 0 0 / 0.06), oklch(1 0 0 / 0.02))",
              border: "1px solid oklch(1 0 0 / 0.22)",
              boxShadow: "0 12px 24px -12px oklch(0 0 0 / 0.5)",
            }}
          >
            {open ? "OCULTAR ALIAS" : "VER ALIAS"}
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 glass-panel rounded-xl p-5 text-center">
                  <div className="text-[9px] tracking-[0.4em]" style={{ color: "oklch(0.65 0.03 255)" }}>ALIAS</div>
                  <div className="mt-2 font-mono text-lg tracking-[0.15em] text-chrome">{GIFT_ALIAS}</div>
                  <button
                    onClick={() => { navigator.clipboard.writeText(GIFT_ALIAS); setCopied(true); setTimeout(() => setCopied(false), 1800); }}
                    className="mt-4 text-[10px] tracking-[0.35em] py-1.5 px-4"
                    style={{ color: "oklch(0.9 0.02 250)", border: "1px solid oklch(1 0 0 / 0.18)" }}
                  >
                    {copied ? "COPIADO ✓" : "COPIAR"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
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
    <section className="relative py-24 px-6">
      <SectionKicker>Archivo Restringido</SectionKicker>
      <SectionTitle>Accede a todos los detalles de la fiesta</SectionTitle>

      <motion.div
        className="mt-10 mx-auto max-w-md glass-panel rounded-2xl p-8"
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.1, ease: [0.22, 0.9, 0.3, 1] }}
      >
        <div className="flex items-center justify-between text-[9px] tracking-[0.35em]" style={{ color: "oklch(0.6 0.03 255)" }}>
          <span>CLASSIFIED</span>
          <span>SECURITY · LVL 05</span>
        </div>

        <div className="mt-8 flex flex-col items-center">
          <button
            onClick={start}
            className="relative w-32 h-32 rounded-full grid place-items-center"
            style={{
              background: "radial-gradient(circle at 30% 30%, oklch(0.25 0.06 262), oklch(0.12 0.04 262))",
              border: `1px solid ${denied ? "oklch(0.7 0.18 25 / 0.6)" : "oklch(0.7 0.15 258 / 0.4)"}`,
              boxShadow: denied
                ? "0 0 50px oklch(0.6 0.22 25 / 0.4)"
                : "0 0 40px oklch(0.6 0.18 258 / 0.35)",
              transition: "border 400ms ease, box-shadow 400ms ease",
            }}
            aria-label="Escanear huella"
          >
            <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"
              style={{ color: denied ? "oklch(0.75 0.18 25)" : "oklch(0.7 0.05 258)", transition: "color 400ms ease" }}
            >
              <path d="M12 11a2 2 0 0 0-2 2v1a6 6 0 0 0 6 6" />
              <path d="M12 7a5 5 0 0 0-5 5v2a10 10 0 0 0 3.5 7.6" />
              <path d="M15 22a10 10 0 0 1-5-8.7v-.7a2 2 0 1 1 4 0v.9a6 6 0 0 0 2 4.6" />
              <path d="M6.5 5.5A9 9 0 0 1 21 12v1" />
              <path d="M3 12a8.9 8.9 0 0 1 1.5-5" />
            </svg>

            <AnimatePresence>
              {scanning && (
                <motion.div
                  className="absolute inset-0 overflow-hidden rounded-full"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
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
                <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[10px] tracking-[0.35em]" style={{ color: "oklch(0.65 0.03 255)" }}>
                  PRESIONÁ PARA ESCANEAR
                </motion.div>
              )}
              {scanning && (
                <motion.div key="scan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[10px] tracking-[0.35em]" style={{ color: "oklch(0.75 0.12 258)" }}>
                  ESCANEANDO...
                </motion.div>
              )}
              {denied && (
                <motion.div key="deny" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[11px] tracking-[0.35em]" style={{ color: "oklch(0.78 0.16 25)" }}>
                  ACCESO DENEGADO
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-8 pt-6 text-center text-[11px] leading-relaxed" style={{ borderTop: "1px solid oklch(1 0 0 / 0.08)", color: "oklch(0.62 0.03 255)" }}>
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
    return `Hola.\nConfirmo mi presencia a MILE WORLD.\n\nInvitados:\n${list}`;
  }, [guest.nombre]);
  const text = encodeURIComponent(message);

  return (
    <section className="relative py-24 px-6">
      <SectionKicker>Confirmación</SectionKicker>
      <SectionTitle>Confirmá tu presencia</SectionTitle>

      <motion.div
        className="mt-10 mx-auto max-w-md glass-panel rounded-2xl p-7 text-center"
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.1, ease: [0.22, 0.9, 0.3, 1] }}
      >
        <p className="text-[13px] leading-relaxed" style={{ color: "oklch(0.85 0.02 255)" }}>
          Enviá tu confirmación directamente por WhatsApp para reservar tu lugar.
        </p>

        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`}
          target="_blank" rel="noreferrer"
          onClick={() => setConfirmed(true)}
          className="mt-6 inline-block w-full py-3.5 text-[11px] transition-transform active:scale-[0.98]"
          style={{
            letterSpacing: "0.35em",
            color: "oklch(0.98 0.01 250)",
            background: "linear-gradient(180deg, oklch(0.55 0.16 258 / 0.55), oklch(0.35 0.12 258 / 0.4))",
            border: "1px solid oklch(0.75 0.15 258 / 0.65)",
            boxShadow: "0 22px 44px -12px oklch(0.55 0.18 258 / 0.55)",
          }}
        >
          {confirmed ? "ACCESO ACTIVADO ✓" : "CONFIRMAR POR WHATSAPP"}
        </a>

        <div className="mt-8 pt-6 flex items-start gap-3 text-left" style={{ borderTop: "1px solid oklch(1 0 0 / 0.08)" }}>
          <div className="mt-0.5 w-9 h-9 rounded-full grid place-items-center shrink-0"
            style={{ background: "oklch(0.55 0.14 258 / 0.18)", border: "1px solid oklch(0.7 0.15 258 / 0.35)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "oklch(0.9 0.05 258)" }}>
              <path d="M12 22s-8-7.5-8-13a8 8 0 1 1 16 0c0 5.5-8 13-8 13Z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="text-[9px] tracking-[0.4em]" style={{ color: "oklch(0.62 0.03 255)" }}>LUGAR</div>
            <div className="mt-1 font-display text-[16px] leading-tight" style={{ color: "oklch(0.96 0.01 250)" }}>Oga Guasu</div>
            <div className="text-[12px]" style={{ color: "oklch(0.75 0.02 255)" }}>Salón de Eventos</div>
            <a href={MAPS_URL} target="_blank" rel="noreferrer" className="mt-2 inline-block text-[11px] underline underline-offset-4" style={{ color: "oklch(0.75 0.12 258)" }}>
              Ver ubicación
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ---------- CLOSING CREDITS ---------- */
function ClosingCredits() {
  return (
    <section className="relative min-h-[90svh] flex flex-col items-center justify-center px-6 py-24 overflow-hidden">
      <div aria-hidden className="absolute inset-0" style={{
        background:
          "radial-gradient(ellipse at 50% 30%, oklch(0.28 0.1 262 / 0.9), oklch(0.06 0.02 260) 70%)",
      }} />
      <motion.div aria-hidden className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 20% 20%, oklch(0.55 0.18 258 / 0.35), transparent 55%), radial-gradient(ellipse at 80% 80%, oklch(0.9 0.02 250 / 0.15), transparent 55%)",
          filter: "blur(30px)",
        }}
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 3 }}
      />
      <div className="absolute inset-0" style={{
        background: "linear-gradient(180deg, oklch(0.05 0.02 260 / 0.85) 0%, transparent 40%, oklch(0.05 0.02 260 / 0.95) 100%)",
      }} />

      <div className="relative text-center max-w-md">
        <motion.img
          src={wordmark.url} alt="MILE WORLD"
          className="mx-auto w-[70vw] max-w-[300px] opacity-90"
          initial={{ opacity: 0 }} whileInView={{ opacity: 0.9 }} viewport={{ once: true }} transition={{ duration: 1.6 }}
        />
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.8, duration: 1.4 }}
          className="mt-10 font-signature italic text-4xl" style={{ color: "oklch(0.94 0.01 250)" }}
        >
          Nos vemos en la premiere
        </motion.div>

        <div className="mt-16 space-y-5 text-center text-[10px] tracking-[0.35em]" style={{ color: "oklch(0.68 0.03 255)" }}>
          <div>
            <div style={{ color: "oklch(0.55 0.03 255)" }}>PRODUCTION</div>
            <div className="mt-1">MILE WORLD · The Mile Experience</div>
            <div className="mt-0.5">A Milewood Production</div>
          </div>
          <div>
            <div style={{ color: "oklch(0.55 0.03 255)" }}>CONCEPT DEVELOPMENT</div>
            <div className="mt-1">Lucas Montiel · Milena Montiel</div>
          </div>
          <div className="pt-6" style={{ color: "oklch(0.5 0.03 255)" }}>
            © XV MILEWOOD · All Rights Reserved
          </div>
          <div style={{ color: "oklch(0.7 0.03 255)" }}>@mileeemontiel</div>
        </div>
      </div>
    </section>
  );
}

/* ---------- SHARED SECTION HEADERS ---------- */
function SectionKicker({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="text-center tracking-cinema text-[10px]"
      style={{ letterSpacing: "0.5em", color: "oklch(0.68 0.03 255)" }}
      initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9 }}
    >
      {children}
    </motion.div>
  );
}
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <motion.h2
      className="mt-3 text-center font-display text-3xl md:text-5xl text-chrome"
      initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15, duration: 1 }}
    >
      {children}
    </motion.h2>
  );
}
