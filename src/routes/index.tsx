import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import mLogo from "@/assets/mile-m-logo.png.asset.json";
import wordmark from "@/assets/mileworld-wordmark-official.png.asset.json";
import soundtrack from "@/assets/genesis-soundtrack.mp3.asset.json";
import editorial1 from "@/assets/editorial-1.jpg.asset.json";
import editorial2 from "@/assets/editorial-2.jpg.asset.json";
import editorial3 from "@/assets/editorial-3.jpg.asset.json";
import groupIll from "@/assets/mile-group-illustration.png.asset.json";
import giftIll from "@/assets/gift-illustration.png.asset.json";

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
interface GuestData { nombre: string; validFor: number; companions: string[] }

const EVENT_DATE = new Date("2027-01-01T20:30:00-03:00");
const MAPS_URL = "https://www.google.com/maps/search/?api=1&query=Oga+Guasu+Salon+de+Eventos";
const WHATSAPP_NUMBER = "19313275485";
const GIFT_ALIAS = "CI.3.510.962";

/* ============================================================ */
/*  ROOT                                                        */
/* ============================================================ */
function Index() {
  const [stage, setStage] = useState<Stage>("intro");
  const [guest, setGuest] = useState<GuestData>({ nombre: "", validFor: 1, companions: [] });
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
          <AccessScreen key="access" onSubmit={(d) => { setGuest(d); setStage("validating"); }} />
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
function AccessScreen({ onSubmit }: { onSubmit: (d: GuestData) => void }) {
  const [nombre, setNombre] = useState("");
  const [validFor, setValidFor] = useState(1);
  const [companions, setCompanions] = useState<string[]>([]);

  const setCompanion = (i: number, v: string) => {
    const next = [...companions]; next[i] = v.toUpperCase(); setCompanions(next);
  };

  const canSubmit = nombre.trim().length > 1 &&
    Array.from({ length: validFor - 1 }).every((_, i) => (companions[i] || "").trim().length > 1);

  return (
    <motion.section
      className="relative min-h-screen flex items-center justify-center px-6 py-16"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.8 }}
    >
      <div className="relative w-full max-w-md">
        {/* Panel */}
        <div className="glass-panel rounded-2xl px-7 py-9 relative overflow-hidden">
          <div className="text-center">
            <div className="tracking-cinema text-[10px] mb-3" style={{ color: "oklch(0.68 0.03 255)", letterSpacing: "0.5em" }}>
              Access Verification
            </div>
            <div className="font-display text-3xl leading-tight text-chrome">Validación</div>
            <div className="mx-auto mt-4 h-px w-16" style={{ background: "linear-gradient(90deg, transparent, oklch(0.9 0.02 250 / 0.6), transparent)" }} />
            <p className="mt-4 text-[12px] leading-relaxed" style={{ color: "oklch(0.72 0.03 255)" }}>
              Ingresá tu nombre para activar tu invitación personalizada.
            </p>
          </div>

          <form
            className="mt-8 space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              if (!canSubmit) return;
              onSubmit({ nombre: nombre.trim(), validFor, companions: companions.slice(0, validFor - 1).map((c) => c.trim()) });
            }}
          >
            <Field label="NOMBRE DEL INVITADO">
              <input
                required autoFocus value={nombre}
                onChange={(e) => setNombre(e.target.value.toUpperCase())}
                placeholder="TU NOMBRE"
                className="w-full bg-transparent outline-none text-[15px] tracking-[0.15em] py-2"
                style={{ color: "oklch(0.96 0.01 250)" }}
              />
            </Field>

            <Field label="VÁLIDO PARA">
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((n) => (
                  <button
                    type="button" key={n}
                    onClick={() => { setValidFor(n); setCompanions((c) => c.slice(0, n - 1)); }}
                    className="flex-1 py-2 text-[12px] tracking-[0.2em] transition-colors"
                    style={{
                      background: validFor === n ? "oklch(0.55 0.14 258 / 0.35)" : "oklch(1 0 0 / 0.04)",
                      border: `1px solid ${validFor === n ? "oklch(0.7 0.15 258 / 0.6)" : "oklch(1 0 0 / 0.12)"}`,
                      color: "oklch(0.94 0.01 250)",
                    }}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </Field>

            <AnimatePresence>
              {Array.from({ length: validFor - 1 }).map((_, i) => (
                <motion.div key={i} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                  <Field label={`ACOMPAÑANTE ${i + 1}`}>
                    <input
                      value={companions[i] || ""}
                      onChange={(e) => setCompanion(i, e.target.value)}
                      placeholder="NOMBRE"
                      className="w-full bg-transparent outline-none text-[14px] tracking-[0.15em] py-2"
                      style={{ color: "oklch(0.96 0.01 250)" }}
                    />
                  </Field>
                </motion.div>
              ))}
            </AnimatePresence>

            <button
              type="submit" disabled={!canSubmit}
              className="w-full mt-2 py-3.5 text-[11px] tracking-cinema relative overflow-hidden"
              style={{
                letterSpacing: "0.4em",
                color: "oklch(0.98 0.01 250)",
                background: canSubmit
                  ? "linear-gradient(180deg, oklch(0.55 0.16 258 / 0.5), oklch(0.35 0.12 258 / 0.4))"
                  : "oklch(1 0 0 / 0.04)",
                border: `1px solid ${canSubmit ? "oklch(0.7 0.15 258 / 0.6)" : "oklch(1 0 0 / 0.1)"}`,
                opacity: canSubmit ? 1 : 0.5,
                cursor: canSubmit ? "pointer" : "not-allowed",
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
  useEffect(() => { const t = setTimeout(onDone, 2600); return () => clearTimeout(t); }, [onDone]);

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
          initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
          className="mx-auto w-20 h-20 rounded-full grid place-items-center relative"
          style={{
            background: "linear-gradient(180deg, oklch(0.7 0.16 258 / 0.35), oklch(0.35 0.12 258 / 0.15))",
            border: "1px solid oklch(0.85 0.1 258 / 0.6)",
            boxShadow: "0 0 60px oklch(0.6 0.18 258 / 0.6)",
          }}
        >
          <motion.svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4, duration: 0.6 }}
            style={{ color: "oklch(0.98 0.01 250)" }}
          >
            <motion.path d="m5 12 5 5L20 7" strokeLinecap="round" strokeLinejoin="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.35, duration: 0.7 }}
            />
          </motion.svg>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.7 }}
          className="mt-8 tracking-cinema text-[11px]" style={{ letterSpacing: "0.5em", color: "oklch(0.85 0.05 258)" }}
        >
          ACCESS AUTHORIZED
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3, duration: 0.7 }}
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
  const first = guest.nombre.split(" ")[0];
  return (
    <motion.section
      className="relative min-h-screen flex items-center justify-center px-6 py-20"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 1 }}
    >
      <div className="relative max-w-lg text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 1 }}
          className="font-signature text-5xl md:text-6xl"
          style={{ color: "oklch(0.96 0.01 250)" }}
        >
          {first},
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }}
          className="mt-8 font-display text-2xl md:text-3xl leading-snug text-chrome"
        >
          Bienvenido a MILEWOOD.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6, duration: 1 }}
          className="mt-5 text-[13px] leading-relaxed" style={{ color: "oklch(0.75 0.03 255)" }}
        >
          Donde las historias más extraordinarias cobran vida.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2, duration: 1 }}
          className="mt-8 font-display text-xl md:text-2xl tracking-[0.15em]"
          style={{ color: "oklch(0.94 0.01 250)" }}
        >
          Esta noche comienza <span className="text-chrome">MILE WORLD</span>.
        </motion.p>

        <motion.button
          onClick={onContinue}
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.9, duration: 0.9 }}
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
      <EditorialGallery />
      <VipPass guest={guest} />
      <Countdown />
      <DressCode />
      <GiftSection />
      <Restricted />
      <Rsvp />
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

/* ---------- EDITORIAL GALLERY ---------- */
function EditorialGallery() {
  const items = [
    { img: editorial1.url, kicker: "CAPÍTULO 01", title: "El Universo", copy: "Un mundo de seda azul, chrome y luz." },
    { img: editorial2.url, kicker: "CAPÍTULO 02", title: "El Origen", copy: "Toda historia extraordinaria comienza con un instante." },
    { img: editorial3.url, kicker: "CAPÍTULO 03", title: "La Entrada", copy: "Un corredor de luz hacia la premiere." },
  ];
  return (
    <section className="relative">
      {items.map((it, i) => (
        <div key={i} className="relative min-h-[100svh] flex items-end justify-start overflow-hidden">
          <motion.div className="absolute inset-0"
            initial={{ scale: 1.08, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true, margin: "-20%" }} transition={{ duration: 1.6 }}
          >
            <img src={it.img} alt="" className="w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0" style={{
              background: "linear-gradient(180deg, oklch(0.05 0.02 260 / 0.55) 0%, transparent 40%, oklch(0.05 0.02 260 / 0.9) 100%)",
            }} />
          </motion.div>
          <motion.div
            className="relative z-10 px-8 pb-24 max-w-lg"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-15%" }} transition={{ delay: 0.4, duration: 1 }}
          >
            <div className="tracking-cinema text-[10px]" style={{ letterSpacing: "0.5em", color: "oklch(0.8 0.03 255)" }}>{it.kicker}</div>
            <div className="mt-3 font-display text-4xl md:text-5xl text-chrome">{it.title}</div>
            <div className="mt-3 text-[13px] max-w-sm" style={{ color: "oklch(0.85 0.02 255)" }}>{it.copy}</div>
          </motion.div>
        </div>
      ))}
    </section>
  );
}

/* ---------- VIP PASS ---------- */
function VipPass({ guest }: { guest: GuestData }) {
  const code = useMemo(() => {
    const seed = guest.nombre || "MILEWORLD";
    let h = 0; for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) & 0xffffff;
    return "MW-" + h.toString(16).toUpperCase().padStart(6, "0");
  }, [guest.nombre]);

  return (
    <section className="relative py-28 px-6">
      <SectionKicker>Access Credential</SectionKicker>
      <SectionTitle>Pase de Acceso</SectionTitle>

      <motion.div
        className="mt-14 mx-auto max-w-sm relative rounded-2xl overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, oklch(0.20 0.06 262) 0%, oklch(0.11 0.04 262) 45%, oklch(0.15 0.05 262) 100%)",
          border: "1px solid oklch(1 0 0 / 0.14)",
          boxShadow: "0 40px 90px -20px oklch(0.55 0.18 258 / 0.4), inset 0 1px 0 oklch(1 0 0 / 0.15)",
        }}
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.1 }}
      >
        {/* Abstract chrome texture overlay */}
        <div aria-hidden className="absolute inset-0 opacity-30 mix-blend-screen" style={{
          background:
            "radial-gradient(ellipse at 20% 10%, oklch(0.9 0.03 250 / 0.4), transparent 50%), radial-gradient(ellipse at 90% 80%, oklch(0.65 0.16 258 / 0.35), transparent 55%)",
        }} />

        {/* Holographic reflection — full sweep */}
        <motion.div
          aria-hidden className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(115deg, transparent 25%, oklch(1 0 0 / 0.22) 45%, oklch(0.75 0.15 258 / 0.3) 50%, oklch(1 0 0 / 0.22) 55%, transparent 75%)",
            mixBlendMode: "screen",
          }}
          initial={{ x: "-120%" }} animate={{ x: "120%" }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
        />

        <div className="relative p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[9px] tracking-[0.4em]" style={{ color: "oklch(0.7 0.03 255)" }}>MILE WORLD</div>
              <div className="mt-1 font-display text-lg text-chrome">Access Pass</div>
            </div>
            <img src={mLogo.url} alt="" className="w-10 h-10 opacity-90" style={{ filter: "drop-shadow(0 0 12px oklch(0.7 0.15 258 / 0.4))" }} />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-5">
            <PassRow label="Invitado" value={guest.nombre} />
            <PassRow label="Válido para" value={String(guest.validFor)} />
            <PassRow label="Fecha" value="01 · 01 · 2027" />
            <PassRow label="Apertura" value="20:30 hs" />
            <PassRow label="Lugar" value="Oga Guasu · Salón de Eventos" wide />
            <PassRow label="Código" value={code} wide mono />
          </div>

          {/* Elegant translucent barcode */}
          <div className="mt-6 pt-4" style={{ borderTop: "1px dashed oklch(1 0 0 / 0.15)" }}>
            <div className="flex items-end gap-[2px] h-10">
              {Array.from({ length: 56 }).map((_, i) => (
                <div key={i} className="flex-1"
                  style={{
                    background: "oklch(1 0 0 / 0.85)",
                    opacity: 0.35 + ((i * 37) % 55) / 100,
                    height: `${40 + ((i * 53) % 60)}%`,
                  }}
                />
              ))}
            </div>
            <div className="mt-2 text-center text-[9px] tracking-[0.4em]" style={{ color: "oklch(0.65 0.03 255)" }}>
              {code} · MW-XV
            </div>
          </div>

          {/* Corner ticks */}
          {["top-2 left-2", "top-2 right-2", "bottom-2 left-2", "bottom-2 right-2"].map((c) => (
            <div key={c} className={`absolute ${c} w-3 h-3`} style={{
              borderColor: "oklch(0.9 0.02 250 / 0.5)",
              borderStyle: "solid",
              borderTopWidth: c.includes("top") ? 1 : 0,
              borderBottomWidth: c.includes("bottom") ? 1 : 0,
              borderLeftWidth: c.includes("left") ? 1 : 0,
              borderRightWidth: c.includes("right") ? 1 : 0,
            }} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
function PassRow({ label, value, wide, mono }: { label: string; value: string; wide?: boolean; mono?: boolean }) {
  return (
    <div className={wide ? "col-span-2" : ""}>
      <div className="text-[9px] tracking-[0.3em]" style={{ color: "oklch(0.6 0.03 255)" }}>{label.toUpperCase()}</div>
      <div className={`mt-1 text-[13px] ${mono ? "font-mono" : ""}`} style={{ color: "oklch(0.96 0.01 250)", letterSpacing: mono ? "0.1em" : "0.05em" }}>{value}</div>
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
    <section className="relative py-28 px-6">
      <SectionKicker>Dress Code</SectionKicker>
      <SectionTitle>Tenida Elegante</SectionTitle>
      <motion.div
        className="mt-12 mx-auto max-w-md relative rounded-2xl overflow-hidden glass-panel p-6"
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}
      >
        <div className="relative flex items-center justify-center py-4">
          {/* Soft light halo behind the illustration */}
          <div aria-hidden className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at center, oklch(0.65 0.15 258 / 0.25), transparent 65%)",
          }} />
          <img src={groupIll.url} alt="Grupo elegante — inspiración de vestimenta" className="relative w-full max-w-xs invert opacity-95"
            style={{ mixBlendMode: "screen" }} loading="lazy" />
        </div>
        <div className="mt-6 text-center text-[12px] leading-relaxed" style={{ color: "oklch(0.78 0.02 255)" }}>
          Inspiración editorial para una noche de premiere.
          <br />Colores oscuros, texturas nobles.
        </div>
      </motion.div>
    </section>
  );
}

/* ---------- GIFT ---------- */
function GiftSection() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  return (
    <section className="relative py-28 px-6">
      <SectionKicker>Detalles para Mile</SectionKicker>
      <SectionTitle>Un gesto elegante</SectionTitle>

      <motion.div
        className="mt-10 mx-auto max-w-md"
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}
      >
        <div className="relative flex justify-center py-4">
          <div aria-hidden className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at center, oklch(0.65 0.15 258 / 0.2), transparent 60%)",
          }} />
          <img src={giftIll.url} alt="Regalo" className="relative w-40 invert opacity-95" style={{ mixBlendMode: "screen" }} loading="lazy" />
        </div>

        <p className="mt-6 text-center text-[12.5px] leading-relaxed" style={{ color: "oklch(0.78 0.02 255)" }}>
          Tu presencia es el mejor regalo. Si querés hacer un detalle a Mile,
          podés colaborar con el viaje que dará continuidad a esta historia.
        </p>

        <div className="mt-8">
          <button
            onClick={() => setOpen((o) => !o)}
            className="w-full py-3 text-[11px] tracking-cinema relative"
            style={{
              letterSpacing: "0.4em",
              color: "oklch(0.98 0.01 250)",
              background: "linear-gradient(180deg, oklch(1 0 0 / 0.05), transparent)",
              border: "1px solid oklch(1 0 0 / 0.2)",
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
  const [unlocked, setUnlocked] = useState(false);

  const start = () => {
    if (scanning || unlocked) return;
    setScanning(true);
    setTimeout(() => { setScanning(false); setUnlocked(true); }, 2200);
  };

  return (
    <section className="relative py-28 px-6">
      <SectionKicker>Restricted File</SectionKicker>
      <SectionTitle>Archivo Restringido</SectionTitle>

      <motion.div
        className="mt-12 mx-auto max-w-md glass-panel rounded-2xl p-8"
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}
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
              border: "1px solid oklch(0.7 0.15 258 / 0.4)",
              boxShadow: "0 0 40px oklch(0.6 0.18 258 / 0.35)",
            }}
            aria-label="Escanear huella"
          >
            <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" style={{ color: unlocked ? "oklch(0.85 0.1 258)" : "oklch(0.7 0.05 258)" }}>
              <path d="M12 11a2 2 0 0 0-2 2v1a6 6 0 0 0 6 6" />
              <path d="M12 7a5 5 0 0 0-5 5v2a10 10 0 0 0 3.5 7.6" />
              <path d="M15 22a10 10 0 0 1-5-8.7v-.7a2 2 0 1 1 4 0v.9a6 6 0 0 0 2 4.6" />
              <path d="M6.5 5.5A9 9 0 0 1 21 12v1" />
              <path d="M3 12a8.9 8.9 0 0 1 1.5-5" />
            </svg>

            {/* Laser scan */}
            <AnimatePresence>
              {scanning && (
                <motion.div
                  className="absolute inset-0 overflow-hidden rounded-full"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="absolute inset-x-0 h-[2px]"
                    style={{ background: "linear-gradient(90deg, transparent, oklch(0.85 0.18 258), transparent)", boxShadow: "0 0 20px oklch(0.75 0.2 258)" }}
                    initial={{ y: "0%" }} animate={{ y: ["0%", "100%", "0%"] }} transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <div className="absolute inset-0 rounded-full" style={{ background: "radial-gradient(circle, oklch(0.65 0.18 258 / 0.2), transparent 70%)" }} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          <div className="mt-6 h-6 text-center">
            <AnimatePresence mode="wait">
              {!scanning && !unlocked && (
                <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[10px] tracking-[0.35em]" style={{ color: "oklch(0.65 0.03 255)" }}>
                  PRESIONÁ PARA ESCANEAR
                </motion.div>
              )}
              {scanning && (
                <motion.div key="scan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[10px] tracking-[0.35em]" style={{ color: "oklch(0.75 0.12 258)" }}>
                  ESCANEANDO...
                </motion.div>
              )}
              {unlocked && (
                <motion.div key="ok" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] tracking-[0.35em]" style={{ color: "oklch(0.85 0.1 258)" }}>
                  ACCESO CONCEDIDO ✓
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-8" style={{ borderTop: "1px solid oklch(1 0 0 / 0.08)" }} />

        <AnimatePresence>
          {unlocked ? (
            <motion.div key="content" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mt-6">
              <div className="text-[9px] tracking-[0.35em]" style={{ color: "oklch(0.6 0.03 255)" }}>ARCHIVO · 001</div>
              <div className="mt-1 font-display text-2xl text-chrome">Ver todos los detalles del evento</div>
              <ul className="mt-4 space-y-2 text-[12.5px]" style={{ color: "oklch(0.82 0.02 255)" }}>
                <li>· Apertura de puertas: 20:30 hs</li>
                <li>· Lugar: Oga Guasu, Salón de Eventos</li>
                <li>· Fecha: 01 · 01 · 2027</li>
                <li>· Dress code: Tenida elegante</li>
              </ul>
            </motion.div>
          ) : (
            <motion.div key="locked" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 text-center text-[11px]" style={{ color: "oklch(0.6 0.03 255)" }}>
              Este archivo contiene información sensible del evento.
              <br />Validá tu huella para continuar.
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

/* ---------- RSVP ---------- */
function Rsvp() {
  const [confirmed, setConfirmed] = useState(false);
  const text = encodeURIComponent("Hola Mile — confirmo mi asistencia a MILE WORLD · 01 · 01 · 2027.");

  return (
    <section className="relative py-28 px-6">
      <SectionKicker>Confirmación</SectionKicker>
      <SectionTitle>Confirmá tu acceso</SectionTitle>

      <motion.div
        className="mt-12 mx-auto max-w-md glass-panel rounded-2xl p-7 text-center"
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}
      >
        <p className="text-[12.5px] leading-relaxed" style={{ color: "oklch(0.8 0.02 255)" }}>
          Enviá tu confirmación directamente por WhatsApp para reservar tu lugar en la premiere.
        </p>

        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`}
          target="_blank" rel="noreferrer"
          onClick={() => setConfirmed(true)}
          className="mt-6 inline-block w-full py-3.5 text-[11px]"
          style={{
            letterSpacing: "0.35em",
            color: "oklch(0.98 0.01 250)",
            background: "linear-gradient(180deg, oklch(0.55 0.16 258 / 0.55), oklch(0.35 0.12 258 / 0.4))",
            border: "1px solid oklch(0.75 0.15 258 / 0.65)",
            boxShadow: "0 20px 40px -10px oklch(0.55 0.18 258 / 0.5)",
          }}
        >
          {confirmed ? "ACCESO ACTIVADO ✓" : "CONFIRMAR POR WHATSAPP"}
        </a>

        <div className="mt-8 pt-6 text-left" style={{ borderTop: "1px solid oklch(1 0 0 / 0.08)" }}>
          <div className="text-[9px] tracking-[0.35em]" style={{ color: "oklch(0.6 0.03 255)" }}>LUGAR</div>
          <div className="mt-1 text-[13px]" style={{ color: "oklch(0.94 0.01 250)" }}>Oga Guasu · Salón de Eventos</div>
          <a href={MAPS_URL} target="_blank" rel="noreferrer" className="mt-2 inline-block text-[11px] underline underline-offset-4" style={{ color: "oklch(0.75 0.12 258)" }}>
            Ver ubicación
          </a>
        </div>
      </motion.div>
    </section>
  );
}

/* ---------- CLOSING CREDITS ---------- */
function ClosingCredits() {
  return (
    <section className="relative min-h-[90svh] flex flex-col items-center justify-center px-6 py-24 overflow-hidden">
      {/* Fabric-like closing curtain */}
      <div aria-hidden className="absolute inset-0" style={{
        background:
          "radial-gradient(ellipse at 50% 30%, oklch(0.28 0.1 262 / 0.9), oklch(0.06 0.02 260) 70%)",
      }} />
      <motion.img
        src={editorial1.url} alt="" aria-hidden
        className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-screen"
        initial={{ scale: 1.1 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 4 }}
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
          className="mt-10 font-signature text-4xl" style={{ color: "oklch(0.94 0.01 250)" }}
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
