import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import mLogo from "@/assets/mile-m-logo.png.asset.json";
import chromeImg from "@/assets/mileworld-chrome-v2.jpg.asset.json";
import wordmark from "@/assets/mileworld-wordmark-official.png.asset.json";
import soundtrack from "@/assets/mileworld-soundtrack.mp3.asset.json";

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
      Array.from({ length: 22 }, (_, i) => ({
        id: i,
        x: (i * 53) % 100,
        y: (i * 37) % 100,
        d: 2 + ((i * 7) % 5),
        s: 0.6 + ((i * 11) % 10) / 10,
      })),
    [],
  );
  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      {/* richer midnight base — less pure black */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 20% 10%, oklch(0.24 0.09 262) 0%, oklch(0.12 0.05 260) 40%, oklch(0.08 0.03 260) 100%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(ellipse at 80% 90%, oklch(0.28 0.11 258 / 0.55), transparent 55%)",
        }}
      />
      <div className="spotlight left-[-20vw] top-[-20vh]" />
      <div className="spotlight right-[-20vw] top-[20vh]" style={{ animationDelay: "-6s" }} />
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
      {/* Chrome grid lines — subtle */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.9 0.01 250) 1px, transparent 1px), linear-gradient(90deg, oklch(0.9 0.01 250) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
      {/* Giant embossed M watermark */}
      <img
        src={mLogo.url}
        alt=""
        aria-hidden
        className="absolute left-1/2 top-1/2 w-[130vw] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-[0.025] mix-blend-screen"
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,transparent_50%,oklch(0.05_0.02_260/0.85)_100%)]" />
    </div>
  );
}

/* --------------------------------- INTRO --------------------------------- */

function IntroScreen({ onEnter }: { onEnter: () => void }) {
  return (
    <motion.section
      key="intro"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(24px)", scale: 1.1 }}
      transition={{ duration: 1.2, ease: [0.7, 0, 0.3, 1] }}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-12"
    >
      {/* Cinematic spotlights sweeping the emblem */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="pointer-events-none absolute inset-0"
      >
        <motion.div
          initial={{ x: "-40%", rotate: -18, opacity: 0 }}
          animate={{ x: "10%", rotate: -8, opacity: 0.55 }}
          transition={{ duration: 3, ease: [0.16, 1, 0.3, 1] }}
          className="absolute -top-[30%] left-1/2 h-[140vh] w-[35vw] origin-top"
          style={{
            background:
              "linear-gradient(to bottom, oklch(0.85 0.12 258 / 0.45), oklch(0.6 0.16 258 / 0.15) 40%, transparent 75%)",
            filter: "blur(30px)",
          }}
        />
        <motion.div
          initial={{ x: "40%", rotate: 18, opacity: 0 }}
          animate={{ x: "-10%", rotate: 8, opacity: 0.55 }}
          transition={{ duration: 3, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute -top-[30%] right-1/2 h-[140vh] w-[35vw] origin-top"
          style={{
            background:
              "linear-gradient(to bottom, oklch(0.9 0.08 250 / 0.4), oklch(0.6 0.16 258 / 0.15) 40%, transparent 75%)",
            filter: "blur(30px)",
          }}
        />
        {/* horizon glow */}
        <div
          className="absolute inset-x-0 bottom-0 h-[45vh]"
          style={{
            background:
              "radial-gradient(ellipse at 50% 100%, oklch(0.5 0.18 258 / 0.5), transparent 65%)",
          }}
        />
      </motion.div>

      {/* Subtle camera-move on the emblem */}
      <motion.div
        initial={{ scale: 1.15, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 3.2, ease: [0.16, 1, 0.3, 1] }}
        style={{ perspective: 1600 }}
        className="relative"
      >
        <motion.div
          animate={{ rotateY: [0, 6, -6, 0], rotateX: [0, -2, 2, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative"
        >
          {/* base chrome halo — soft radial, not a box */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle, oklch(0.7 0.14 258 / 0.35), oklch(0.5 0.16 258 / 0.15) 45%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />
          <img
            src={mLogo.url}
            alt="MILEWOOD"
            width={480}
            height={480}
            className="relative w-[72vw] max-w-[440px] h-auto object-contain"
            style={{
              filter:
                "drop-shadow(0 20px 60px oklch(0.4 0.15 258 / 0.55)) drop-shadow(0 0 30px oklch(0.85 0.08 250 / 0.35))",
            }}
          />
          {/* Chrome highlight sweep across the emblem itself */}
          <motion.div
            aria-hidden
            initial={{ x: "-120%" }}
            animate={{ x: "120%" }}
            transition={{ duration: 3.5, delay: 1.2, ease: [0.7, 0, 0.3, 1] }}
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(105deg, transparent 40%, oklch(1 0 0 / 0.35) 50%, transparent 60%)",
              mixBlendMode: "screen",
              WebkitMaskImage: `url(${mLogo.url})`,
              maskImage: `url(${mLogo.url})`,
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskPosition: "center",
            }}
          />
        </motion.div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 1.4, delay: 2.4 }}
        className="mt-10 text-[10px] tracking-cinema text-chrome-soft/80"
      >
        A MILEWOOD PRODUCTION
      </motion.p>

      <motion.button
        onClick={onEnter}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 2.8 }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        className="mt-10 group relative overflow-hidden rounded-full border border-chrome-soft/40 px-12 py-4 text-[11px] tracking-cinema text-chrome-soft transition-colors hover:text-chrome"
      >
        <span className="relative z-10">Iniciar Experiencia</span>
        <span className="shimmer absolute inset-0" />
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.55 }}
        transition={{ duration: 2, delay: 3.2 }}
        className="absolute bottom-8 text-[9px] tracking-cinema text-chrome-soft/60"
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
        <img
          src={mLogo.url}
          alt=""
          aria-hidden
          className="pointer-events-none absolute right-3 top-3 h-16 w-16 opacity-[0.06]"
        />
        <div className="mb-6 text-center">
          <p className="text-[9px] tracking-cinema text-chrome-soft/70">
            MILE WORLD · Control de Acceso
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
              Válido para
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
        style={{ textTransform: "uppercase", fontFamily: "var(--font-display)", letterSpacing: "0.14em" }}
        className="w-full rounded-lg border border-chrome-soft/20 bg-[oklch(0.05_0.02_260/0.6)] px-4 py-3 text-base text-chrome placeholder:text-chrome-soft/30 outline-none transition-colors focus:border-chrome/60 focus:bg-[oklch(0.08_0.03_262/0.8)]"
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
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center"
    >
      {/* soft chrome vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, oklch(0.6 0.16 258 / 0.35), transparent 60%)",
        }}
      />
      <img
        src={mLogo.url}
        alt=""
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 w-[95vw] max-w-[520px] -translate-x-1/2 -translate-y-1/2 opacity-[0.04]"
      />

      <div className="relative max-w-xl">
        <Reveal>
          <p className="font-display text-3xl md:text-5xl italic text-chrome leading-tight">
            <span className="text-chrome">{firstName}</span>, bienvenido a <span className="text-chrome">MILEWOOD</span>.
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <div className="my-7 h-px w-24 mx-auto bg-gradient-to-r from-transparent via-chrome-soft to-transparent" />
          <p className="font-display text-lg md:text-2xl italic text-chrome/90 leading-relaxed">
            Donde las historias más extraordinarias cobran vida.
          </p>
          <p className="mt-5 font-display text-base md:text-lg italic text-chrome-soft/85">
            Esta noche comienza <span className="text-chrome">MILE WORLD</span>.
          </p>
        </Reveal>
        <motion.button
          onClick={onContinue}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="mt-14 group relative overflow-hidden rounded-full border border-chrome-soft/40 px-14 py-4 text-[11px] tracking-cinema text-chrome hover:text-chrome"
        >
          <span className="relative z-10">Ingresar</span>
          <span className="shimmer absolute inset-0" />
        </motion.button>
      </div>
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
      className="relative flex min-h-[95vh] items-center justify-center overflow-hidden px-6"
    >
      {/* metallic backdrop */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-full w-[80%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,oklch(0.55_0.16_258/0.45),transparent_65%)]" />
        <img
          src={chromeImg.url}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-[0.32] mix-blend-screen"
          style={{ filter: "blur(1px) saturate(1.15)" }}
        />
        {/* light beams */}
        <div
          className="absolute left-[10%] top-[-20%] h-[140%] w-[25%] rotate-[10deg] opacity-40"
          style={{
            background:
              "linear-gradient(to bottom, oklch(0.85 0.1 258 / 0.32), transparent 65%)",
            filter: "blur(30px)",
          }}
        />
        <div
          className="absolute right-[10%] top-[-20%] h-[140%] w-[25%] -rotate-[10deg] opacity-40"
          style={{
            background:
              "linear-gradient(to bottom, oklch(0.85 0.1 258 / 0.32), transparent 65%)",
            filter: "blur(30px)",
          }}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[oklch(0.06_0.03_260/0.25)] to-[oklch(0.06_0.03_260)]" />

      <motion.div style={{ y, opacity }} className="relative z-10 flex flex-col items-center text-center max-w-2xl">
        <motion.img
          src={mLogo.url}
          alt=""
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-40 h-40 sm:w-48 sm:h-48 object-contain"
          style={{
            filter:
              "drop-shadow(0 15px 40px oklch(0.5 0.16 258 / 0.55)) drop-shadow(0 0 20px oklch(0.85 0.08 250 / 0.3))",
          }}
        />

        {/* Official wordmark image (MILE WORLD / The Mile Experience / A Milewood Production) */}
        <motion.img
          src={wordmark.url}
          alt="MILE WORLD — The Mile Experience — A Milewood Production"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, delay: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 w-[88vw] max-w-[520px] h-auto"
          style={{ filter: "drop-shadow(0 0 30px oklch(0.7 0.14 258 / 0.35))" }}
        />

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.6, delay: 1.8 }}
          className="mt-8 h-px w-32 bg-gradient-to-r from-transparent via-chrome-soft/70 to-transparent"
        />

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 2 }}
          className="mt-6 text-chrome text-3xl md:text-4xl leading-[1.1]"
          style={{ fontFamily: "var(--font-signature)" }}
        >
          Milena Anahí
          <br />
          Montiel Chaparro
        </motion.p>
      </motion.div>

      {/* scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6, y: [0, 8, 0] }}
        transition={{ opacity: { duration: 2, delay: 2.6 }, y: { duration: 2.4, repeat: Infinity, ease: "easeInOut" } }}
        className="absolute bottom-6 flex flex-col items-center gap-2 text-chrome-soft/70"
      >
        <span className="text-[9px] tracking-cinema">Desliza</span>
        <span className="h-8 w-px bg-gradient-to-b from-chrome-soft/60 to-transparent" />
      </motion.div>
    </section>
  );
}

/* PHOTO PLACEHOLDER */
function PhotoPlaceholder({ id, label }: { id: string; label: string }) {
  return (
    <section className="relative px-6 py-14">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <div
            id={id}
            className="glass-panel chrome-border relative overflow-hidden rounded-2xl aspect-[4/5] md:aspect-[16/9]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.55_0.14_258/0.2),transparent_70%)]" />
            <img
              src={mLogo.url}
              alt=""
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 w-3/5 -translate-x-1/2 -translate-y-1/2 opacity-[0.06]"
            />
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
    { k: "World Tour", v: "Stop #01" },
    { k: "VIP Invitation", v: "Reparto" },
    { k: "Premiere Access", v: "Confidencial" },
    { k: "Special Guest", v: "Reservado" },
    { k: "Blue Carpet", v: "Entry Only" },
    { k: "Exclusive", v: "MILEWOOD" },
  ];
  return (
    <section className="relative px-6 py-20">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <p className="text-[10px] tracking-cinema text-chrome-soft/70">MILEWOOD</p>
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
                whileHover={{ y: -4 }}
                className="glass-panel chrome-border relative overflow-hidden rounded-xl p-4 md:p-5 text-left"
              >
                <img
                  src={mLogo.url}
                  alt=""
                  aria-hidden
                  className="pointer-events-none absolute -right-3 -bottom-3 h-16 w-16 opacity-[0.05]"
                />
                <p className="text-[9px] tracking-cinema text-chrome-soft/70">
                  {c.k}
                </p>
                <p className="mt-2 font-display text-base md:text-lg text-chrome italic leading-tight">
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
          <p className="text-[10px] tracking-cinema text-chrome-soft/70">Credencial</p>
          <h2 className="mt-3 font-display text-3xl md:text-5xl text-chrome tracking-wide">
            PASE DE ACCESO
          </h2>
        </Reveal>

        <Reveal delay={0.2} y={50}>
          <motion.div
            whileHover={{ rotateY: 6, rotateX: -4 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            style={{ transformStyle: "preserve-3d", perspective: 1200 }}
            className="glass-panel chrome-border relative mt-10 overflow-hidden rounded-2xl p-6 text-left"
          >
            {/* Rich chrome background */}
            <div className="absolute inset-0 opacity-60">
              <img src={chromeImg.url} alt="" className="h-full w-full object-cover" loading="lazy" />
            </div>
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.14 0.06 262 / 0.85) 0%, oklch(0.08 0.04 260 / 0.9) 55%, oklch(0.18 0.09 262 / 0.7) 100%)",
              }}
            />
            {/* Holographic reflection */}
            <motion.div
              aria-hidden
              initial={{ x: "-100%" }}
              animate={{ x: "120%" }}
              transition={{ duration: 6, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(105deg, transparent 40%, oklch(0.85 0.12 200 / 0.18) 46%, oklch(0.9 0.18 320 / 0.15) 52%, transparent 60%)",
                mixBlendMode: "screen",
              }}
            />
            {/* Security pattern — embossed M grid */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage: `url(${mLogo.url})`,
                backgroundSize: "60px 60px",
                backgroundRepeat: "repeat",
              }}
            />
            {/* Corner ticks */}
            <span className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l border-t border-chrome/60" />
            <span className="pointer-events-none absolute right-3 top-3 h-3 w-3 border-r border-t border-chrome/60" />
            <span className="pointer-events-none absolute left-3 bottom-3 h-3 w-3 border-l border-b border-chrome/60" />
            <span className="pointer-events-none absolute right-3 bottom-3 h-3 w-3 border-r border-b border-chrome/60" />

            <div className="relative">
              <div className="flex items-center justify-between">
                <img src={mLogo.url} alt="M" className="h-14 w-14 object-contain opacity-95 drop-shadow-[0_0_20px_oklch(0.55_0.18_258/0.7)]" />
                <div className="text-right">
                  <p className="text-[8px] tracking-cinema text-chrome-soft/70">MILE WORLD</p>
                  <p className="text-[9px] tracking-cinema text-chrome/90">PASE DE ACCESO</p>
                </div>
              </div>

              <ChromeDivider />

              <p className="text-[10px] tracking-cinema text-chrome-soft/70">Identificación</p>
              <div className="mt-2 space-y-1.5">
                {guestList.length ? (
                  guestList.map((n, i) => (
                    <p key={i} className="font-display text-lg md:text-xl text-chrome leading-tight tracking-[0.12em]">
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

              {/* Translucent barcode */}
              <div className="mt-6">
                <div className="flex h-7 items-end gap-[1.5px] opacity-80">
                  {Array.from({ length: 56 }).map((_, i) => (
                    <span
                      key={i}
                      className="bg-chrome"
                      style={{
                        width: `${1 + ((i * 7) % 3)}px`,
                        height: `${60 + ((i * 13) % 40)}%`,
                        opacity: 0.35 + ((i % 5) / 10),
                      }}
                    />
                  ))}
                </div>
                <p className="mt-2 font-mono text-[8px] tracking-[0.4em] text-chrome-soft/60">
                  MW · {hashCode(guest.nombre || "MILE")} · 2027
                </p>
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
          <div className="glass-panel chrome-border relative mt-10 overflow-hidden rounded-2xl p-8 md:p-12">
            <img
              src={mLogo.url}
              alt=""
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 h-[85%] -translate-x-1/2 -translate-y-1/2 opacity-[0.04]"
            />
            <p className="font-display text-lg md:text-xl italic text-chrome/90 leading-relaxed">
              Una noche especial merece una presencia especial.
            </p>

            <div className="mt-8 flex items-end justify-center gap-8 md:gap-14">
              <TuxSilhouette />
              <div className="h-32 w-px self-center bg-gradient-to-b from-transparent via-chrome-soft/40 to-transparent" />
              <GownSilhouette />
            </div>

            <p className="mt-6 font-display text-2xl md:text-4xl text-chrome tracking-[0.28em]">
              TENIDA ELEGANTE
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function TuxSilhouette() {
  return (
    <svg viewBox="0 0 80 160" width="70" height="140" className="text-chrome" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round">
      {/* head */}
      <circle cx="40" cy="14" r="8" />
      {/* shoulders / jacket */}
      <path d="M22 34 Q40 26 58 34 L64 60 L58 62 L58 130 L22 130 L22 62 L16 60 Z" />
      {/* lapel */}
      <path d="M40 34 L32 62 L40 80 L48 62 Z" fill="currentColor" fillOpacity="0.15" />
      {/* bowtie */}
      <path d="M35 36 L40 40 L45 36 L45 40 L40 40 L35 40 Z" fill="currentColor" />
      {/* legs */}
      <path d="M28 130 L26 158 M52 130 L54 158" />
      {/* buttons */}
      <circle cx="40" cy="80" r="0.9" fill="currentColor" />
      <circle cx="40" cy="92" r="0.9" fill="currentColor" />
    </svg>
  );
}

function GownSilhouette() {
  return (
    <svg viewBox="0 0 80 160" width="70" height="140" className="text-chrome" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round">
      <circle cx="40" cy="14" r="8" />
      {/* bodice */}
      <path d="M26 34 Q40 28 54 34 L52 66 Q40 70 28 66 Z" />
      {/* long gown */}
      <path d="M28 66 Q40 70 52 66 L64 158 L16 158 Z" />
      {/* shimmer line */}
      <path d="M32 90 L44 156" opacity="0.4" />
      <path d="M48 90 L38 156" opacity="0.3" />
    </svg>
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
            Pero si deseas hacer un detalle en efectivo, habilitamos esta cuenta para transferencias.
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
                {open ? "OCULTAR ALIAS" : "VER ALIAS"}
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
    setTimeout(() => setState("denied"), 2000);
  };

  return (
    <section className="relative px-6 py-20">
      <div className="mx-auto max-w-md">
        <Reveal>
          <h3 className="mb-6 text-center font-display text-2xl md:text-3xl italic text-chrome tracking-wide">
            Ver todos los detalles<br />de la fiesta
          </h3>
          <div className="glass-panel chrome-border relative overflow-hidden rounded-2xl p-8 text-center">
            {/* classified paper grain */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, oklch(0.95 0.02 250) 0 1px, transparent 1px 3px)",
              }}
            />
            <img
              src={mLogo.url}
              alt=""
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 h-[90%] -translate-x-1/2 -translate-y-1/2 opacity-[0.04]"
            />
            <div className="absolute right-4 top-4 flex items-center gap-1.5 text-[8px] tracking-cinema text-destructive/80">
              <span className="h-1.5 w-1.5 rounded-full bg-destructive animate-pulse" />
              CONFIDENCIAL
            </div>
            <div className="absolute left-4 top-4 text-[8px] tracking-cinema text-chrome-soft/60">
              CLASIFICADO · 001
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
                  className="mx-auto flex flex-col items-center py-6 outline-none"
                >
                  <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-chrome-soft/30">
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
                  className="py-6"
                >
                  <div className="relative mx-auto h-24 w-24">
                    <div className="absolute inset-0 flex items-center justify-center rounded-full border border-chrome/60">
                      <Fingerprint glowing />
                    </div>
                    {/* laser scan */}
                    <motion.div
                      initial={{ top: 0 }}
                      animate={{ top: "100%" }}
                      transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }}
                      className="absolute left-0 right-0 h-[2px] rounded-full"
                      style={{
                        background:
                          "linear-gradient(to right, transparent, oklch(0.72 0.19 258 / 0.95), transparent)",
                        boxShadow:
                          "0 0 12px oklch(0.72 0.19 258 / 0.9), 0 0 24px oklch(0.6 0.2 258 / 0.6)",
                      }}
                    />
                    {/* mask to circle */}
                    <div
                      aria-hidden
                      className="absolute inset-0 rounded-full"
                      style={{
                        boxShadow:
                          "inset 0 0 30px oklch(0.65 0.18 258 / 0.35)",
                      }}
                    />
                  </div>
                  <p className="mt-5 font-mono text-[10px] tracking-[0.4em] text-chrome/85">
                    ESCANEANDO HUELLA
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
                    animate={{ opacity: [0, 1, 0.4, 1] }}
                    transition={{ duration: 0.9 }}
                    className="font-mono text-base md:text-lg tracking-[0.4em] text-destructive"
                  >
                    ACCESO DENEGADO
                  </motion.p>
                  <div className="my-5 h-px bg-gradient-to-r from-transparent via-destructive/50 to-transparent" />
                  <p
                    className="font-display text-3xl md:text-4xl text-chrome tracking-[0.32em]"
                    style={{
                      textShadow: "0 0 20px oklch(0.7 0.15 258 / 0.4)",
                    }}
                  >
                    ARCHIVO
                    <br />
                    RESTRINGIDO
                  </p>
                  <p className="mt-5 font-display text-base italic text-chrome/85 leading-relaxed">
                    Algunos detalles de esta producción permanecen reservados
                    hasta la noche del evento.
                  </p>
                  <ChromeDivider />
                  <div className="flex items-center justify-between text-[9px] tracking-cinema text-chrome-soft/70">
                    <div className="flex items-center gap-2">
                      <img src={mLogo.url} alt="MILE WORLD" className="h-5 w-5 object-contain" />
                      <span className="text-chrome">MILE WORLD</span>
                    </div>
                    <span>NIVEL · <span className="text-destructive">ALTO</span></span>
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
      width="42"
      height="42"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      className={glowing ? "text-chrome drop-shadow-[0_0_12px_oklch(0.7_0.18_258/0.9)]" : "text-chrome"}
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
      <div className="mx-auto max-w-lg text-center">
        <Reveal>
          <h2 className="font-display text-5xl md:text-6xl text-chrome tracking-wide">
            CONFIRMAR<br />ACCESO
          </h2>
          <p className="mt-6 font-display text-lg md:text-xl italic text-chrome/85 leading-relaxed">
            Activa tu invitación privada.
          </p>
          <p className="mt-2 font-display text-base md:text-lg italic text-muted-foreground">
            Sin confirmación tu asiento no estará reservado en la sala.
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-10 flex flex-col gap-3">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappText}`}
              target="_blank"
              rel="noreferrer"
              onClick={() => setConfirmed(true)}
              className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-full border border-chrome/40 bg-[oklch(1_0_0/0.05)] py-4 px-6 text-[12px] tracking-cinema text-chrome transition-all hover:bg-[oklch(1_0_0/0.1)] hover:border-chrome"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="relative z-10">
                <path d="M20.5 3.5A11 11 0 0 0 3.9 17.6L3 21l3.5-.9A11 11 0 1 0 20.5 3.5Zm-8.5 17a9 9 0 0 1-4.6-1.3l-.3-.2-2 .5.5-2-.2-.3A9 9 0 1 1 12 20.5Zm5-6.5c-.3-.2-1.6-.8-1.9-.9-.3-.1-.5-.1-.7.1s-.8.9-1 1.1c-.2.2-.4.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.4.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5s-.7-1.7-.9-2.3c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.7.4-.3.3-1 .9-1 2.3s1 2.7 1.2 2.9c.1.2 2.1 3.3 5.2 4.5 1.9.7 2.6.8 3.5.7.6-.1 1.6-.7 1.9-1.4.3-.7.3-1.3.2-1.4-.1-.2-.3-.3-.6-.4Z" />
              </svg>
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
        <span>♪</span>
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
      <audio ref={audioRef} src={soundtrack.url} loop preload="auto" />
      <div className="fixed bottom-5 right-5 z-50">
        <button
          onClick={toggle}
          aria-label={playing ? "Pausar música" : "Reproducir música"}
          className="relative flex h-14 w-14 items-center justify-center rounded-full border border-chrome-soft/40 backdrop-blur-xl text-chrome transition-all hover:scale-110 hover:border-chrome/70"
          style={{
            background:
              "radial-gradient(circle at 30% 25%, oklch(0.3 0.09 260 / 0.75), oklch(0.08 0.03 260 / 0.85) 70%)",
            boxShadow:
              "0 10px 40px oklch(0.5 0.16 258 / 0.35), inset 0 1px 0 oklch(1 0 0 / 0.15)",
          }}
        >
          {playing ? (
            <div className="flex items-end gap-[3px] h-5">
              {[0, 1, 2, 3].map((i) => (
                <motion.span
                  key={i}
                  animate={{ height: ["30%", "100%", "50%", "80%", "30%"] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                  className="w-[3px] bg-chrome rounded-sm"
                />
              ))}
            </div>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
          {playing && (
            <span className="pointer-events-none absolute inset-0 rounded-full border border-chrome/30 animate-ping" />
          )}
        </button>
      </div>
    </>
  );
}
