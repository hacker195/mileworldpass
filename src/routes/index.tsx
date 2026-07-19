import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import mLogo from "@/assets/mile-m-logo.png.asset.json";
import chromeImg from "@/assets/mileworld-chrome-v2.jpg.asset.json";

export const Route = createFileRoute("/")({
  component: Index,
});

type Stage = "intro" | "access" | "welcome" | "experience";

interface GuestData {
  nombre: string;
  validFor: number;
  companions: string[];
}

const EVENT_DATE = new Date("2027-01-01T20:30:00-03:00");
const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Oga+Guasu+Salon+de+Eventos";
const WHATSAPP_NUMBER = "19313275485";
const GIFT_ALIAS = "CI.3.510.962";

function Index() {
  const [stage, setStage] = useState<Stage>("intro");
  const [guest, setGuest] = useState<GuestData>({ nombre: "", validFor: 1, companions: [] });
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [showMusicPrompt, setShowMusicPrompt] = useState(false);

  useEffect(() => {
    if (stage === "experience" && !musicEnabled) {
      const t = setTimeout(() => setShowMusicPrompt(true), 1500);
      return () => clearTimeout(t);
    }
  }, [stage, musicEnabled]);

  return (
    <main className="relative min-h-screen bg-midnight text-foreground overflow-hidden font-sans">
      <AmbientBackground />
      <MusicPlayer
        active={stage === "experience"}
        enabled={musicEnabled}
        onEnable={() => {
          setMusicEnabled(true);
          setShowMusicPrompt(false);
        }}
      />
      {showMusicPrompt && stage === "experience" && (
        <MusicPrompt
          onAccept={() => {
            setMusicEnabled(true);
            setShowMusicPrompt(false);
          }}
          onDismiss={() => setShowMusicPrompt(false)}
        />
      )}
      <AnimatePresence mode="wait">
        {stage === "intro" && <IntroScreen key="intro" onEnter={() => setStage("access")} />}
        {stage === "access" && (
          <AccessScreen
            key="access"
            onSubmit={(data) => {
              setGuest(data);
              setStage("welcome");
            }}
          />
        )}
        {stage === "welcome" && (
          <WelcomeScreen key="welcome" guest={guest} onContinue={() => setStage("experience")} />
        )}
        {stage === "experience" && <Experience key="exp" guest={guest} />}
      </AnimatePresence>
    </main>
  );
}

/* ------------------------------- BACKGROUND ------------------------------- */

function AmbientBackground() {
  const particles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        x: (i * 53) % 100,
        y: (i * 37) % 100,
        d: 3 + ((i * 7) % 6),
        s: 0.6 + ((i * 11) % 10) / 10,
      })),
    [],
  );
  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-midnight" />
      <div className="spotlight left-[-20vw] top-[-20vh]" />
      <div className="spotlight right-[-20vw] top-[20vh]" style={{ animationDelay: "-6s" }} />
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 3 }}
        className="absolute left-1/2 top-1/2 h-[75vw] w-[75vw] max-h-[560px] max-w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 35% 30%, oklch(0.85 0.05 258 / 0.20), oklch(0.55 0.14 258 / 0.10) 45%, transparent 72%)",
          filter: "blur(30px)",
          animation: "float-particle 14s ease-in-out infinite",
        }}
      />
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.d,
            height: p.d,
            filter: "blur(0.5px)",
            animation: `float-particle ${9 + p.s * 6}s ease-in-out ${p.s * -2}s infinite`,
            background: "oklch(0.92 0.008 250 / 0.35)",
          }}
        />
      ))}
      {/* Chrome grid lines */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.9 0.01 250) 1px, transparent 1px), linear-gradient(90deg, oklch(0.9 0.01 250) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,transparent_40%,oklch(0.04_0.02_260)_100%)]" />
    </div>
  );
}

/* --------------------------------- INTRO --------------------------------- */

function IntroScreen({ onEnter }: { onEnter: () => void }) {
  return (
    <motion.section
      key="intro"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(24px)", scale: 1.15 }}
      transition={{ duration: 1.2, ease: [0.7, 0, 0.3, 1] }}
      className="relative flex min-h-screen flex-col items-center justify-center px-6 py-12"
    >
      {/* Cinematic 3D-ish chrome M */}
      <motion.div
        initial={{ scale: 0.4, opacity: 0, rotateY: -40 }}
        animate={{ scale: 1, opacity: 1, rotateY: 0 }}
        transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1] }}
        style={{ perspective: 1400 }}
        className="relative"
      >
        <motion.div
          animate={{ rotateY: [0, 8, -8, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative"
        >
          <img
            src={mLogo.url}
            alt="M"
            width={480}
            height={480}
            className="w-[70vw] max-w-[420px] h-auto object-contain drop-shadow-[0_0_100px_oklch(0.55_0.18_258/0.85)]"
            style={{
              filter:
                "drop-shadow(0 0 40px oklch(0.7 0.15 258 / 0.6)) drop-shadow(0 0 8px oklch(0.95 0.01 250 / 0.4))",
            }}
          />
          {/* Chrome sweep */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden mix-blend-overlay">
            <div className="shimmer absolute inset-0" />
          </div>
        </motion.div>
      </motion.div>

      <motion.button
        onClick={onEnter}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 2.6 }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        className="mt-16 group relative overflow-hidden rounded-full border border-chrome-soft/40 px-10 py-4 text-[11px] tracking-cinema text-chrome-soft transition-colors hover:text-chrome"
      >
        <span className="relative z-10">Iniciar Experiencia</span>
        <span className="shimmer absolute inset-0" />
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 2, delay: 3 }}
        className="absolute bottom-8 text-[9px] tracking-cinema text-chrome-soft/50"
      >
        01 · 01 · 2027
      </motion.p>
    </motion.section>
  );
}

/* --------------------------------- ACCESS -------------------------------- */

function AccessScreen({ onSubmit }: { onSubmit: (d: GuestData) => void }) {
  const [nombre, setNombre] = useState("");
  const [validFor, setValidFor] = useState(1);
  const [companions, setCompanions] = useState<string[]>([]);

  useEffect(() => {
    setCompanions((prev) => {
      const need = validFor - 1;
      const next = [...prev];
      while (next.length < need) next.push("");
      return next.slice(0, need);
    });
  }, [validFor]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const n = nombre.trim().toUpperCase().slice(0, 80);
    if (!n) return;
    onSubmit({
      nombre: n,
      validFor,
      companions: companions.map((c) => c.trim().toUpperCase()).filter(Boolean),
    });
  };

  return (
    <motion.section
      initial={{ opacity: 0, filter: "blur(20px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex min-h-screen flex-col items-center justify-center px-6 py-10"
    >
      <motion.form
        onSubmit={submit}
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="glass-panel chrome-border relative w-full max-w-md rounded-2xl p-7 md:p-9"
      >
        <div className="mb-6 text-center">
          <p className="text-[9px] tracking-cinema text-chrome-soft/70">
            MILEWORLD · Control de Acceso
          </p>
          <h2 className="mt-2 font-display text-2xl text-chrome md:text-3xl">
            Identifica tu acceso
          </h2>
        </div>

        <div className="space-y-4">
          <Field
            label="Nombre del invitado"
            value={nombre}
            onChange={(v) => setNombre(v.toUpperCase())}
            placeholder="TU NOMBRE COMPLETO"
            maxLength={80}
            required
          />

          <label className="block">
            <span className="mb-2 block text-[9px] tracking-cinema text-chrome-soft/80">
              Valid for
            </span>
            <div className="relative">
              <select
                value={validFor}
                onChange={(e) => setValidFor(Number(e.target.value))}
                className="w-full appearance-none rounded-lg border border-chrome-soft/20 bg-[oklch(0.05_0.02_260/0.6)] px-4 py-3 text-sm text-chrome outline-none transition-colors focus:border-chrome/60"
              >
                {[1, 2, 3, 4].map((n) => (
                  <option key={n} value={n} className="bg-[oklch(0.08_0.03_262)]">
                    {n} {n === 1 ? "invitado" : "invitados"}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-chrome-soft/60">
                ▾
              </span>
            </div>
          </label>

          <AnimatePresence>
            {companions.map((val, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <Field
                  label={`Acompañante ${i + 1}`}
                  value={val}
                  onChange={(v) => {
                    const next = [...companions];
                    next[i] = v.toUpperCase();
                    setCompanions(next);
                  }}
                  placeholder="NOMBRE COMPLETO"
                  maxLength={80}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <button
          type="submit"
          disabled={!nombre.trim()}
          className="mt-7 w-full rounded-full border border-chrome-soft/40 bg-[oklch(1_0_0/0.04)] py-3.5 text-[11px] tracking-cinema text-chrome transition-all hover:bg-[oklch(1_0_0/0.08)] hover:border-chrome/60 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continuar
        </button>
      </motion.form>
    </motion.section>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  maxLength,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  maxLength: number;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[9px] tracking-cinema text-chrome-soft/80">
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        required={required}
        autoCapitalize="characters"
        style={{ textTransform: "uppercase" }}
        className="w-full rounded-lg border border-chrome-soft/20 bg-[oklch(0.05_0.02_260/0.6)] px-4 py-3 text-sm tracking-wide text-chrome placeholder:text-chrome-soft/30 outline-none transition-colors focus:border-chrome/60 focus:bg-[oklch(0.08_0.03_262/0.8)]"
      />
    </label>
  );
}

/* --------------------------------- WELCOME ------------------------------- */

function WelcomeScreen({ guest, onContinue }: { guest: GuestData; onContinue: () => void }) {
  const firstName = guest.nombre.split(" ")[0] || "INVITADO";
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 1 }}
      className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center"
    >
      <Reveal>
        <p className="font-display text-3xl md:text-5xl italic text-chrome/95 leading-tight">
          {firstName}, te doy la bienvenida.
        </p>
      </Reveal>
      <Reveal delay={0.3}>
        <div className="my-8 h-px w-24 mx-auto bg-gradient-to-r from-transparent via-chrome-soft to-transparent" />
        <p className="font-display text-lg md:text-2xl italic text-chrome/85">
          MILEWOOD hace posible <span className="text-chrome">MILE WORLD</span>.
        </p>
        <p className="mt-4 font-display text-base md:text-lg italic text-muted-foreground">
          Esta experiencia será única.
        </p>
      </Reveal>
      <motion.button
        onClick={onContinue}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        className="mt-16 group relative overflow-hidden rounded-full border border-chrome-soft/40 px-10 py-4 text-[11px] tracking-cinema text-chrome-soft hover:text-chrome"
      >
        <span className="relative z-10">Deslizar para continuar</span>
        <span className="shimmer absolute inset-0" />
      </motion.button>
    </motion.section>
  );
}

/* ------------------------------- EXPERIENCE ------------------------------ */

function Experience({ guest }: { guest: GuestData }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.4, ease: "easeOut" }}
      className="relative"
    >
      <Hero />
      <PhotoPlaceholder id="portrait-1" label="Escena 01" />
      <Produccion />
      <PaseAcceso guest={guest} />
      <BlueCarpet />
      <CodigoVestimenta />
      <PhotoPlaceholder id="portrait-2" label="Escena 02" />
      <GiftSection />
      <ArchivoRestringido />
      <CuentaRegresiva />
      <ConfirmarAcceso guest={guest} />
      <FirmaFinal />
      <Footer />
    </motion.div>
  );
}

/* ---------- section helpers ---------- */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] tracking-cinema text-chrome-soft/70">{children}</p>
  );
}

function Reveal({
  children,
  delay = 0,
  y = 30,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function ChromeDivider() {
  return (
    <div className="my-8 h-px w-full bg-gradient-to-r from-transparent via-chrome-soft/40 to-transparent" />
  );
}

/* 1. HERO */
function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[92vh] items-center justify-center overflow-hidden px-6"
    >
      {/* metallic backdrop */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-full w-[70%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,oklch(0.55_0.14_258/0.35),transparent_65%)]" />
        <img
          src={chromeImg.url}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-[0.28] mix-blend-screen"
          style={{ filter: "blur(1px) saturate(1.1)" }}
        />
        {/* light beams */}
        <div
          className="absolute left-[10%] top-[-20%] h-[140%] w-[25%] rotate-[10deg] opacity-40"
          style={{
            background:
              "linear-gradient(to bottom, oklch(0.85 0.1 258 / 0.28), transparent 65%)",
            filter: "blur(30px)",
          }}
        />
        <div
          className="absolute right-[10%] top-[-20%] h-[140%] w-[25%] -rotate-[10deg] opacity-40"
          style={{
            background:
              "linear-gradient(to bottom, oklch(0.85 0.1 258 / 0.28), transparent 65%)",
            filter: "blur(30px)",
          }}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[oklch(0.05_0.02_260/0.3)] to-[oklch(0.05_0.02_260)]" />

      <motion.div style={{ y, opacity }} className="relative z-10 flex flex-col items-center text-center max-w-2xl">
        <motion.p
          initial={{ opacity: 0, letterSpacing: "0.1em" }}
          animate={{ opacity: 1, letterSpacing: "0.5em" }}
          transition={{ duration: 2, delay: 0.2 }}
          className="text-[10px] tracking-cinema text-chrome-soft mb-6"
        >
          Una producción de MILEWOOD
        </motion.p>

        <motion.img
          src={mLogo.url}
          alt="M"
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-56 h-56 sm:w-64 sm:h-64 md:w-80 md:h-80 object-contain drop-shadow-[0_0_80px_oklch(0.55_0.18_258/0.7)]"
        />

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 1.4 }}
          className="mt-4 font-display text-chrome text-5xl md:text-7xl lg:text-8xl leading-none tracking-[0.05em]"
        >
          MILE WORLD
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 1.9 }}
          className="my-4 flex items-center gap-3 opacity-70"
        >
          <span className="h-px w-10 bg-chrome-soft/60" />
          <span className="text-[8px] tracking-cinema text-chrome-soft/70">MMXXVII</span>
          <span className="h-px w-10 bg-chrome-soft/60" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 2.2 }}
          className="text-chrome/95 text-3xl md:text-4xl leading-none"
          style={{ fontFamily: 'var(--font-signature)' }}
        >
          Milena Anahí Montiel Chaparro
        </motion.p>
      </motion.div>
    </section>
  );
}

/* PHOTO PLACEHOLDER */
function PhotoPlaceholder({ id, label }: { id: string; label: string }) {
  return (
    <section className="relative px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <div
            id={id}
            className="glass-panel chrome-border relative overflow-hidden rounded-2xl aspect-[4/5] md:aspect-[16/9]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.55_0.14_258/0.15),transparent_70%)]" />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-chrome-soft/30">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-chrome-soft/70">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <p className="mt-4 text-[9px] tracking-cinema text-chrome-soft/60">{label}</p>
            </div>
            <span className="shimmer absolute inset-0 opacity-40" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* 2. LA PRODUCCIÓN */
function Produccion() {
  const cards = [
    { icon: "🌍", k: "World Tour", v: "Stop #01" },
    { icon: "🎬", k: "VIP Invitation", v: "Reparto" },
    { icon: "🎟", k: "Premiere Access", v: "Confidencial" },
    { icon: "⭐", k: "Special Guest", v: "Reservado" },
    { icon: "🔵", k: "Blue Carpet", v: "Entry Only" },
    { icon: "🎖", k: "Exclusive", v: "MILEWOOD Inc." },
  ];
  return (
    <section className="relative px-6 py-20">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <SectionLabel>MILEWOOD</SectionLabel>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-6 space-y-5 font-display text-lg md:text-xl italic leading-relaxed text-chrome/90">
            <p>
              Cada detalle de esta noche fue pensado para llevarnos más allá
              de lo habitual y hacernos sentir como verdaderas celebridades.
            </p>
            <p>
              Esta invitación especial es para avisarte que formas parte del
              reparto.
            </p>
            <p>
              Hoy solo conocerás el tráiler. La historia completa será
              revelada cuando se abran las puertas de <span className="text-chrome">MILE WORLD</span>.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-3">
            {cards.map((c) => (
              <motion.div
                key={c.k}
                whileHover={{ y: -4, borderColor: "oklch(0.85 0.02 250 / 0.5)" }}
                className="glass-panel chrome-border rounded-xl p-4 md:p-5 text-left"
              >
                <p className="text-lg">{c.icon}</p>
                <p className="mt-3 text-[9px] tracking-cinema text-chrome-soft/70">
                  {c.k}
                </p>
                <p className="mt-1 font-display text-sm md:text-base text-chrome italic leading-tight">
                  {c.v}
                </p>
              </motion.div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* 3. PASE DE ACCESO */
function PaseAcceso({ guest }: { guest: GuestData }) {
  const guestList = [guest.nombre, ...guest.companions].filter(Boolean);
  return (
    <section className="relative px-6 py-20">
      <div className="mx-auto max-w-md text-center">
        <Reveal>
          <SectionLabel>Credencial</SectionLabel>
          <h2 className="mt-3 font-display text-3xl md:text-5xl text-chrome tracking-wide">
            PASE DE ACCESO
          </h2>
        </Reveal>

        <Reveal delay={0.2} y={50}>
          <motion.div
            whileHover={{ rotateY: 6, rotateX: -4 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            style={{ transformStyle: "preserve-3d", perspective: 1200 }}
            className="glass-panel chrome-border relative mt-10 overflow-hidden rounded-2xl p-7 text-left"
          >
            <div className="absolute inset-0 opacity-40">
              <img src={chromeImg.url} alt="" className="h-full w-full object-cover" loading="lazy" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.08_0.03_260/0.75)] to-[oklch(0.06_0.02_260/0.92)]" />

            <div className="relative">
              <div className="flex items-center justify-between">
                <img src={mLogo.url} alt="M" className="h-14 w-14 object-contain opacity-95 drop-shadow-[0_0_20px_oklch(0.55_0.18_258/0.7)]" />
                <div className="text-right">
                  <p className="text-[8px] tracking-cinema text-chrome-soft/70">MILEWOOD</p>
                  <p className="text-[9px] tracking-cinema text-chrome/90">PASE DE ACCESO</p>
                </div>
              </div>

              <ChromeDivider />

              <p className="text-[10px] tracking-cinema text-chrome-soft/70">Identificación</p>
              <div className="mt-2 space-y-1.5">
                {guestList.length ? (
                  guestList.map((n, i) => (
                    <p key={i} className="font-display text-lg md:text-xl text-chrome leading-tight tracking-wide">
                      {n}
                    </p>
                  ))
                ) : (
                  <p className="font-display text-lg text-chrome/60">—</p>
                )}
              </div>

              <ChromeDivider />

              <PassRow label="Fecha" value="01 · 01 · 2027" />
              <PassRow label="Hora" value="20:30 hs" />
              <PassRow label="Lugar" value="Oga Guasu · Salón de Eventos" />

              <ChromeDivider />

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[9px] tracking-cinema text-chrome-soft/70">Producción</p>
                  <p className="font-display text-base text-chrome">MILEWOOD</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] tracking-cinema text-chrome-soft/70">Acceso</p>
                  <p className="font-mono text-sm text-chrome">
                    #{hashCode(guest.nombre || "MILE")}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex gap-1">
                {Array.from({ length: 32 }).map((_, i) => (
                  <span
                    key={i}
                    className="h-6 bg-chrome/80"
                    style={{ width: `${1 + ((i * 7) % 3)}px`, opacity: 0.3 + ((i % 5) / 7) }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}

function PassRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-3">
      <p className="text-[10px] tracking-cinema text-chrome-soft/70">{label}</p>
      <p className="mt-1 font-display text-base md:text-lg text-chrome leading-tight">
        {value}
      </p>
    </div>
  );
}

function hashCode(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h).toString(16).padStart(6, "0").slice(0, 6).toUpperCase();
}

/* 4. BLUE CARPET */
function BlueCarpet() {
  return (
    <section className="relative min-h-[70vh] px-6 py-20">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-full w-[60%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,oklch(0.55_0.14_258/0.4),transparent_60%)]" />
        <div
          className="absolute left-[15%] top-[-10%] h-[120%] w-[25%] rotate-[8deg] opacity-40"
          style={{ background: "linear-gradient(to bottom, oklch(0.7 0.14 258 / 0.28), transparent 70%)", filter: "blur(30px)" }}
        />
        <div
          className="absolute right-[15%] top-[-10%] h-[120%] w-[25%] -rotate-[8deg] opacity-40"
          style={{ background: "linear-gradient(to bottom, oklch(0.7 0.14 258 / 0.28), transparent 70%)", filter: "blur(30px)" }}
        />
      </div>
      <div className="relative mx-auto max-w-2xl text-center">
        <Reveal>
          <h2 className="font-display text-4xl md:text-6xl text-chrome tracking-wide">
            BLUE CARPET
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-8 font-display text-lg md:text-2xl italic leading-relaxed text-chrome/90">
            Como en toda premiere, la Blue Carpet será tu primer momento de brillar.
          </p>
          <p className="mt-4 font-display text-base md:text-lg text-muted-foreground italic">
            Todo forma parte de la experiencia, incluso ese primer look.
          </p>
          <div className="my-8 h-px w-24 mx-auto bg-gradient-to-r from-transparent via-chrome-soft to-transparent" />
          <p className="text-[10px] tracking-cinema text-chrome-soft/80">
            Apertura de puertas · 20:30 hs
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* 5. CÓDIGO DE VESTIMENTA */
function CodigoVestimenta() {
  return (
    <section className="relative px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <h2 className="font-display text-4xl md:text-6xl text-chrome tracking-wide">
            CÓDIGO DE VESTIMENTA
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="glass-panel chrome-border mt-10 rounded-2xl p-8 md:p-12">
            <p className="font-display text-xl md:text-2xl italic text-chrome/90 leading-relaxed">
              Una noche especial merece una presencia especial.
            </p>
            <ChromeDivider />
            <p className="font-display text-2xl md:text-4xl text-chrome tracking-[0.25em]">
              TENIDA ELEGANTE
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* 6. GIFT */
function GiftSection() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard?.writeText(GIFT_ALIAS).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }).catch(() => {});
  };

  return (
    <section className="relative px-6 py-20">
      <div className="mx-auto max-w-xl text-center">
        <Reveal>
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-chrome-soft/30">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" className="text-chrome">
              <rect x="3" y="8" width="18" height="4" rx="1" />
              <path d="M12 8v13M5 12v9h14v-9M7.5 8a2.5 2.5 0 0 1 0-5C10 3 12 8 12 8s2-5 4.5-5a2.5 2.5 0 0 1 0 5" />
            </svg>
          </div>
          <p className="mt-6 font-display text-lg md:text-xl italic text-chrome/90 leading-relaxed">
            Lo más valioso para mí será tu presencia.
          </p>
          <p className="mt-3 font-display text-base md:text-lg italic text-muted-foreground leading-relaxed">
            Pero si deseas tener un detalle conmigo, sea cual sea, lo apreciaré muchísimo.
          </p>
          <p className="mt-3 font-display text-base italic text-muted-foreground/85 leading-relaxed">
            También habilitamos esta cuenta por si tu elección es realizar una
            contribución en efectivo.
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-8 relative">
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="group relative overflow-hidden rounded-full border border-chrome-soft/40 bg-[oklch(1_0_0/0.04)] px-8 py-3.5 text-[11px] tracking-cinema text-chrome transition-all hover:bg-[oklch(1_0_0/0.08)] hover:border-chrome/60"
            >
              <span className="relative z-10">
                {open ? "OCULTAR DATOS" : "VER DATOS BANCARIOS"}
              </span>
              <span className="shimmer absolute inset-0" />
            </button>

            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.92, height: 0 }}
                  animate={{ opacity: 1, y: 0, scale: 1, height: "auto" }}
                  exit={{ opacity: 0, y: -10, scale: 0.92, height: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-6 overflow-hidden"
                >
                  <div className="glass-panel chrome-border rounded-2xl p-8">
                    <p className="text-[10px] tracking-cinema text-chrome-soft/70">Alias</p>
                    <p className="mt-3 font-mono text-2xl md:text-3xl text-chrome tracking-wider">
                      {GIFT_ALIAS}
                    </p>
                    <button
                      type="button"
                      onClick={copy}
                      className="mt-6 inline-flex items-center justify-center rounded-full border border-chrome-soft/40 px-6 py-2.5 text-[10px] tracking-cinema text-chrome-soft transition-colors hover:text-chrome hover:border-chrome/60"
                    >
                      {copied ? "Copiado ✓" : "Copiar alias"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* 7. ARCHIVO RESTRINGIDO */
function ArchivoRestringido() {
  const [state, setState] = useState<"locked" | "scanning" | "denied">("locked");

  const attempt = () => {
    if (state !== "locked") return;
    setState("scanning");
    setTimeout(() => setState("denied"), 1600);
  };

  return (
    <section className="relative px-6 py-20">
      <div className="mx-auto max-w-md">
        <Reveal>
          <p className="mb-4 text-center text-[10px] tracking-cinema text-chrome-soft/70">
            VER TODOS LOS DETALLES DE LA FIESTA
          </p>
          <div className="glass-panel chrome-border relative overflow-hidden rounded-2xl p-8 text-center">
            <div className="absolute right-4 top-4 flex items-center gap-1.5 text-[8px] tracking-cinema text-destructive/80">
              <span className="h-1.5 w-1.5 rounded-full bg-destructive animate-pulse" />
              CONFIDENCIAL
            </div>

            <AnimatePresence mode="wait">
              {state === "locked" && (
                <motion.button
                  key="locked"
                  type="button"
                  onClick={attempt}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mx-auto flex flex-col items-center py-4"
                >
                  <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-chrome-soft/30">
                    <Fingerprint />
                  </div>
                  <p className="mt-5 text-xs text-muted-foreground">
                    Toca la huella para intentar acceder
                  </p>
                </motion.button>
              )}

              {state === "scanning" && (
                <motion.div
                  key="scanning"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-4"
                >
                  <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-chrome/50 overflow-hidden">
                    <Fingerprint glowing />
                    <motion.div
                      initial={{ y: -40 }}
                      animate={{ y: 40 }}
                      transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-chrome to-transparent"
                    />
                  </div>
                  <p className="mt-5 font-mono text-[10px] tracking-widest text-chrome/80">
                    ESCANEANDO...
                  </p>
                </motion.div>
              )}

              {state === "denied" && (
                <motion.div
                  key="denied"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-3"
                >
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0.5, 1] }}
                    transition={{ duration: 0.8 }}
                    className="font-mono text-sm tracking-widest text-destructive"
                  >
                    ACCESS DENIED
                  </motion.p>
                  <div className="my-5 h-px bg-gradient-to-r from-transparent via-destructive/40 to-transparent" />
                  <p className="font-display text-2xl md:text-3xl text-chrome tracking-[0.2em]">
                    ARCHIVO RESTRINGIDO
                  </p>
                  <p className="mt-5 font-display text-sm italic text-chrome/85 leading-relaxed">
                    Algunos detalles de esta producción permanecen reservados
                    hasta la noche del evento.
                  </p>
                  <ChromeDivider />
                  <div className="flex items-center justify-between text-[9px] tracking-cinema text-chrome-soft/70">
                    <span>MILEWOOD INC.</span>
                    <span>SECURITY LEVEL · <span className="text-destructive">ALTO</span></span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Fingerprint({ glowing }: { glowing?: boolean }) {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      className={glowing ? "text-chrome drop-shadow-[0_0_10px_oklch(0.7_0.15_258/0.8)]" : "text-chrome"}
    >
      <path d="M12 4a8 8 0 0 0-8 8v3" />
      <path d="M20 15v-3a8 8 0 0 0-4-6.93" />
      <path d="M8 20a15 15 0 0 1-.75-6" />
      <path d="M16 20c.5-2 .75-4 .75-6a4.75 4.75 0 0 0-9.5 0" />
      <path d="M12 20c.4-1.5.6-3 .6-4.5a1.6 1.6 0 0 0-3.2 0" />
      <path d="M12 11a1 1 0 0 1 1 1c0 3 .3 5 .8 7" />
    </svg>
  );
}

/* 8. COUNTDOWN */
function CuentaRegresiva() {
  const [time, setTime] = useState(() => diff(EVENT_DATE));
  useEffect(() => {
    const t = setInterval(() => setTime(diff(EVENT_DATE)), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <section className="relative px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <h2 className="font-display text-2xl md:text-4xl italic text-chrome/90 tracking-wide">
            La premiere comienza en
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="mt-10 grid grid-cols-4 gap-2 md:gap-4">
            {[
              { k: "Días", v: time.d },
              { k: "Horas", v: time.h },
              { k: "Min", v: time.m },
              { k: "Seg", v: time.s },
            ].map((u) => (
              <div
                key={u.k}
                className="glass-panel chrome-border rounded-xl py-5 md:py-6"
              >
                <p className="font-display text-3xl md:text-5xl text-chrome tabular-nums">
                  {String(u.v).padStart(2, "0")}
                </p>
                <p className="mt-1.5 text-[8px] tracking-cinema text-chrome-soft/70">
                  {u.k}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs tracking-cinema text-chrome-soft/60">
            01 · Enero · 2027 · 20:30 hs
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function diff(target: Date) {
  const ms = Math.max(0, target.getTime() - Date.now());
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms / 3600000) % 24);
  const m = Math.floor((ms / 60000) % 60);
  const s = Math.floor((ms / 1000) % 60);
  return { d, h, m, s };
}

/* 9. CONFIRMAR ACCESO */
function ConfirmarAcceso({ guest }: { guest: GuestData }) {
  const [confirmed, setConfirmed] = useState(false);
  const allNames = [guest.nombre, ...guest.companions].filter(Boolean).join(", ");
  const whatsappText = encodeURIComponent(
    `Confirmo mi acceso a MILE WORLD. Invitados: ${allNames}.`,
  );
  return (
    <section className="relative px-6 py-20">
      <div className="mx-auto max-w-md text-center">
        <Reveal>
          <h2 className="font-display text-4xl md:text-5xl text-chrome tracking-wide">
            CONFIRMAR ACCESO
          </h2>
          <p className="mt-6 font-display text-base md:text-lg italic text-muted-foreground leading-relaxed">
            Activa tu invitación privada.
          </p>
          <p className="mt-2 font-display text-sm md:text-base italic text-muted-foreground/85">
            Sin confirmación tu asiento no estará reservado en la sala.
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-8 flex flex-col gap-3">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappText}`}
              target="_blank"
              rel="noreferrer"
              onClick={() => setConfirmed(true)}
              className="group relative overflow-hidden rounded-full border border-chrome/40 bg-[oklch(1_0_0/0.05)] py-4 px-6 text-[11px] tracking-cinema text-chrome transition-all hover:bg-[oklch(1_0_0/0.1)] hover:border-chrome"
            >
              <span className="relative z-10">
                {confirmed ? "ACCESO ACTIVADO ✓" : "CONFIRMAR POR WHATSAPP"}
              </span>
              <span className="shimmer absolute inset-0" />
            </a>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-chrome-soft/30 py-4 px-6 text-[11px] tracking-cinema text-chrome-soft transition-colors hover:text-chrome hover:border-chrome/40"
            >
              VER UBICACIÓN · OGA GUASU
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* FIRMA FINAL */
function FirmaFinal() {
  return (
    <section className="relative px-6 py-20">
      <div className="mx-auto max-w-md text-center">
        <Reveal>
          <div className="h-px w-16 mx-auto bg-gradient-to-r from-transparent via-chrome-soft/50 to-transparent" />
          <p className="mt-6 text-[10px] tracking-cinema text-chrome-soft/70">
            Con cariño,
          </p>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 text-chrome text-6xl md:text-7xl leading-none"
            style={{
              fontFamily: "var(--font-signature)",
              textShadow: "0 0 30px oklch(0.7 0.15 258 / 0.4)",
            }}
          >
            Milena
          </motion.p>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative px-6 pb-14 pt-10 text-center">
      <div className="mx-auto max-w-md space-y-4">
        <img src={mLogo.url} alt="M" className="mx-auto h-14 w-14 object-contain opacity-80" />
        <p className="text-[10px] tracking-cinema text-chrome-soft/70">
          Una producción MILEWOOD
        </p>
        <p className="text-[9px] tracking-cinema text-chrome-soft/50">
          MILE WORLD · Access Reserved · MMXXVII
        </p>
      </div>
    </footer>
  );
}

/* ------------------------------ MUSIC PROMPT ----------------------------- */

function MusicPrompt({ onAccept, onDismiss }: { onAccept: () => void; onDismiss: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      className="fixed bottom-24 right-5 z-50 max-w-[280px] glass-panel chrome-border rounded-2xl p-4"
    >
      <p className="text-xs text-chrome flex items-center gap-2">
        <span>🎵</span>
        <span>Activar banda sonora</span>
      </p>
      <p className="mt-1.5 text-[10px] text-chrome-soft/70 leading-snug">
        Suma la música oficial de MILE WORLD.
      </p>
      <div className="mt-3 flex gap-2">
        <button
          onClick={onAccept}
          className="flex-1 rounded-full border border-chrome/50 bg-[oklch(1_0_0/0.05)] px-3 py-2 text-[10px] tracking-cinema text-chrome hover:bg-[oklch(1_0_0/0.1)]"
        >
          Activar
        </button>
        <button
          onClick={onDismiss}
          className="rounded-full border border-chrome-soft/20 px-3 py-2 text-[10px] tracking-cinema text-chrome-soft hover:text-chrome"
        >
          Ahora no
        </button>
      </div>
    </motion.div>
  );
}

/* ------------------------------ MUSIC PLAYER ----------------------------- */

function MusicPlayer({
  active,
  enabled,
  onEnable,
}: {
  active: boolean;
  enabled: boolean;
  onEnable: () => void;
}) {
  const [playing, setPlaying] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (enabled && audioRef.current && !playing) {
      audioRef.current.volume = 0.4;
      audioRef.current
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    }
  }, [enabled, playing]);

  const toggle = async () => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      try {
        el.volume = 0.4;
        await el.play();
        setPlaying(true);
        if (!enabled) onEnable();
      } catch {
        setPlaying(false);
      }
    }
  };

  if (!active) return null;

  return (
    <>
      <audio ref={audioRef} src="/music/genesis.mp3" loop preload="none" />
      <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2">
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, x: 20, width: 0 }}
              animate={{ opacity: 1, x: 0, width: "auto" }}
              exit={{ opacity: 0, x: 20, width: 0 }}
              className="glass-panel chrome-border overflow-hidden rounded-full px-4 py-2"
            >
              <p className="whitespace-nowrap text-[10px] tracking-cinema text-chrome">
                Genesis · Dua Lipa
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={toggle}
          onMouseEnter={() => setExpanded(true)}
          onMouseLeave={() => setExpanded(false)}
          aria-label={playing ? "Pausar música" : "Reproducir música"}
          className="relative flex h-12 w-12 items-center justify-center rounded-full border border-chrome-soft/40 bg-[oklch(0.08_0.03_260/0.7)] backdrop-blur-lg text-chrome transition-all hover:scale-110 hover:border-chrome/70"
        >
          {playing ? (
            <div className="flex items-end gap-[2px] h-4">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  animate={{ height: ["30%", "100%", "50%", "80%", "30%"] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                  className="w-[3px] bg-chrome rounded-sm"
                />
              ))}
            </div>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 5v14l12-7z" />
            </svg>
          )}
          {playing && (
            <span className="absolute inset-0 rounded-full border border-chrome/30 animate-ping" />
          )}
        </button>
      </div>
    </>
  );
}