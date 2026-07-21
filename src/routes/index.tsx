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
      const t = setTimeout(() => setShowMusicPrompt(true), 1600);
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
        onDisable={() => setMusicEnabled(false)}
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
/* Continuous cinematic environment — no reset per section. Blue lighting,
 * brushed metal wash, drifting chrome sheens, subtle grain. Never pure black.
 */
function AmbientBackground() {
  const particles = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        id: i,
        x: (i * 53) % 100,
        y: (i * 37) % 100,
        d: 1.5 + ((i * 7) % 4),
        s: 0.6 + ((i * 11) % 10) / 10,
      })),
    [],
  );
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* base — layered midnight to sapphire, never flat black */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 15% 0%, oklch(0.28 0.10 262) 0%, oklch(0.13 0.05 260) 42%, oklch(0.09 0.035 260) 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 85% 100%, oklch(0.30 0.13 258 / 0.75), transparent 55%)",
        }}
      />
      {/* brushed-metal chrome sheen — slow drift, screen blend */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0.18, backgroundPosition: "0% 0%" }}
        animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
        transition={{ duration: 60, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
        className="absolute inset-0 mix-blend-screen opacity-[0.10]"
        style={{
          backgroundImage: `url(${chromeImg.url})`,
          backgroundSize: "200% 200%",
          filter: "blur(2px) saturate(1.1)",
        }}
      />
      {/* drifting sapphire spotlights */}
      <motion.div
        aria-hidden
        initial={{ x: "-15%", y: "-20%" }}
        animate={{ x: ["-15%", "10%", "-15%"], y: ["-20%", "10%", "-20%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
        className="absolute h-[80vh] w-[80vw]"
        style={{
          background:
            "radial-gradient(circle, oklch(0.6 0.18 258 / 0.30), transparent 60%)",
          filter: "blur(40px)",
        }}
      />
      <motion.div
        aria-hidden
        initial={{ x: "60%", y: "60%" }}
        animate={{ x: ["60%", "40%", "60%"], y: ["60%", "40%", "60%"] }}
        transition={{ duration: 34, repeat: Infinity, ease: "easeInOut" }}
        className="absolute h-[70vh] w-[70vw]"
        style={{
          background:
            "radial-gradient(circle, oklch(0.55 0.18 262 / 0.28), transparent 60%)",
          filter: "blur(50px)",
        }}
      />
      {/* horizontal chrome bands — extremely subtle brushed feel */}
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "repeating-linear-gradient(180deg, oklch(0.95 0.01 250 / 0.6) 0 1px, transparent 1px 3px)",
        }}
      />
      {/* fine chrome grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.9 0.01 250) 1px, transparent 1px), linear-gradient(90deg, oklch(0.9 0.01 250) 1px, transparent 1px)",
          backgroundSize: "120px 120px",
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
            filter: "blur(0.6px)",
            animation: `float-particle ${10 + p.s * 7}s ease-in-out ${p.s * -2}s infinite`,
            background: "oklch(0.92 0.008 250 / 0.35)",
          }}
        />
      ))}
      {/* soft vignette — never sinks to pure black */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 55%, oklch(0.06 0.03 260 / 0.55) 100%)",
        }}
      />
    </div>
  );
}

/* --------------------------------- INTRO --------------------------------- */

function IntroScreen({ onEnter }: { onEnter: () => void }) {
  return (
    <motion.section
      key="intro"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(24px)", scale: 1.08 }}
      transition={{ duration: 1.2, ease: [0.7, 0, 0.3, 1] }}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-12"
    >
      {/* Cinematic spotlights — travel across the surface, no square glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="pointer-events-none absolute inset-0"
      >
        <motion.div
          initial={{ x: "-45%", rotate: -22, opacity: 0 }}
          animate={{ x: "8%", rotate: -8, opacity: 0.55 }}
          transition={{ duration: 3.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute -top-[30%] left-1/2 h-[140vh] w-[35vw] origin-top"
          style={{
            background:
              "linear-gradient(to bottom, oklch(0.85 0.12 258 / 0.5), oklch(0.6 0.16 258 / 0.15) 40%, transparent 78%)",
            filter: "blur(34px)",
          }}
        />
        <motion.div
          initial={{ x: "45%", rotate: 22, opacity: 0 }}
          animate={{ x: "-8%", rotate: 8, opacity: 0.55 }}
          transition={{ duration: 3.2, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="absolute -top-[30%] right-1/2 h-[140vh] w-[35vw] origin-top"
          style={{
            background:
              "linear-gradient(to bottom, oklch(0.9 0.08 250 / 0.42), oklch(0.6 0.16 258 / 0.15) 40%, transparent 78%)",
            filter: "blur(34px)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-[45vh]"
          style={{
            background:
              "radial-gradient(ellipse at 50% 100%, oklch(0.5 0.18 258 / 0.5), transparent 65%)",
          }}
        />
      </motion.div>

      {/* Emblem — chrome, reflections not glow */}
      <motion.div
        initial={{ scale: 1.15, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 3.2, ease: [0.16, 1, 0.3, 1] }}
        style={{ perspective: 1600 }}
        className="relative"
      >
        <motion.div
          animate={{ rotateY: [0, 5, -5, 0], rotateX: [0, -2, 2, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative"
        >
          {/* soft round chrome pool — radial, never a square */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[140%] w-[140%] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle, oklch(0.7 0.14 258 / 0.30), oklch(0.5 0.16 258 / 0.12) 42%, transparent 72%)",
              filter: "blur(44px)",
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
                "drop-shadow(0 22px 60px oklch(0.4 0.15 258 / 0.55)) drop-shadow(0 0 24px oklch(0.85 0.08 250 / 0.30))",
            }}
          />
          {/* Reflection travelling across the metallic surface (masked to logo) */}
          <motion.div
            aria-hidden
            initial={{ x: "-130%" }}
            animate={{ x: "130%" }}
            transition={{ duration: 3.8, delay: 1.2, ease: [0.65, 0, 0.35, 1] }}
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(105deg, transparent 42%, oklch(1 0 0 / 0.38) 50%, transparent 58%)",
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
        animate={{ opacity: 0.75 }}
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
        <span className="relative z-10">Iniciar experiencia</span>
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
        <div className="mb-6 text-center">
          <p className="text-[9px] tracking-cinema text-chrome-soft/70">
            MILE WORLD · Control de acceso
          </p>
          <h2 className="mt-3 font-display text-2xl text-chrome md:text-3xl tracking-wide">
            Identifica tu acceso
          </h2>
          <div className="mx-auto mt-3 h-px w-16 bg-gradient-to-r from-transparent via-chrome-soft/60 to-transparent" />
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
                className="w-full appearance-none rounded-lg border border-chrome-soft/20 bg-[oklch(0.05_0.02_260/0.55)] px-4 py-3 text-sm text-chrome outline-none transition-colors focus:border-chrome/60"
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
        style={{ textTransform: "uppercase", fontFamily: "var(--font-display)", letterSpacing: "0.16em" }}
        className="w-full rounded-lg border border-chrome-soft/20 bg-[oklch(0.05_0.02_260/0.55)] px-4 py-3 text-base text-chrome placeholder:text-chrome-soft/30 outline-none transition-colors focus:border-chrome/60 focus:bg-[oklch(0.08_0.03_262/0.75)]"
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
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, oklch(0.6 0.16 258 / 0.35), transparent 60%)",
        }}
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
      <Produccion />
      <PaseAcceso guest={guest} />
      <CodigoVestimenta />
      <GiftSection />
      <ArchivoRestringido />
      <CuentaRegresiva />
      <ConfirmarAcceso guest={guest} />
      <ClosingCurtain />
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

/* Slow chrome band that rides between sections to keep the continuous
 * atmosphere. Never a hard boundary. */
function SectionBridge() {
  return (
    <div aria-hidden className="relative h-24 w-full overflow-hidden">
      <div
        className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.85 0.06 258 / 0.35), transparent)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, oklch(0.55 0.16 258 / 0.12), transparent 60%)",
        }}
      />
    </div>
  );
}

function ChromeDivider() {
  return (
    <div className="my-6 h-px w-full bg-gradient-to-r from-transparent via-chrome-soft/40 to-transparent" />
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
      className="relative flex min-h-[100vh] items-center justify-center overflow-hidden px-6 pb-24 pt-20"
    >
      {/* metallic backdrop layered on top of ambient */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-full w-[85%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,oklch(0.55_0.16_258/0.45),transparent_65%)]" />
        <img
          src={chromeImg.url}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-[0.22] mix-blend-screen"
          style={{ filter: "blur(1px) saturate(1.15)" }}
        />
        <div
          className="absolute left-[8%] top-[-20%] h-[140%] w-[26%] rotate-[10deg] opacity-40"
          style={{
            background:
              "linear-gradient(to bottom, oklch(0.85 0.1 258 / 0.32), transparent 65%)",
            filter: "blur(32px)",
          }}
        />
        <div
          className="absolute right-[8%] top-[-20%] h-[140%] w-[26%] -rotate-[10deg] opacity-40"
          style={{
            background:
              "linear-gradient(to bottom, oklch(0.85 0.1 258 / 0.32), transparent 65%)",
            filter: "blur(32px)",
          }}
        />
      </div>

      <motion.div style={{ y, opacity }} className="relative z-10 flex flex-col items-center text-center max-w-2xl">
        <motion.img
          src={mLogo.url}
          alt=""
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-32 h-32 sm:w-40 sm:h-40 object-contain"
          style={{
            filter:
              "drop-shadow(0 15px 40px oklch(0.5 0.16 258 / 0.55)) drop-shadow(0 0 20px oklch(0.85 0.08 250 / 0.3))",
          }}
        />

        <motion.img
          src={wordmark.url}
          alt="MILE WORLD — The Mile Experience — A Milewood Production"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, delay: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 w-[86vw] max-w-[480px] h-auto"
          style={{ filter: "drop-shadow(0 0 30px oklch(0.7 0.14 258 / 0.35))" }}
        />

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.6, delay: 1.8 }}
          className="mt-8 h-px w-24 bg-gradient-to-r from-transparent via-chrome-soft/70 to-transparent"
        />

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 2 }}
          className="mt-5 text-chrome text-3xl md:text-4xl leading-[1.05]"
          style={{ fontFamily: "var(--font-signature)" }}
        >
          Milena Anahí
          <br />
          Montiel Chaparro
        </motion.p>
      </motion.div>

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

/* 2. LA PRODUCCIÓN — editorial, no info cards */
function Produccion() {
  return (
    <section className="relative px-6 pt-8 pb-20">
      <div className="mx-auto max-w-2xl">
        <Reveal>
          <p className="text-[10px] tracking-cinema text-chrome-soft/70 text-center">MILEWOOD</p>
          <div className="mx-auto mt-3 h-px w-16 bg-gradient-to-r from-transparent via-chrome-soft/60 to-transparent" />
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-8 space-y-6 font-display text-lg md:text-xl italic leading-relaxed text-chrome/90 text-center">
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
              revelada cuando se abran las puertas de{" "}
              <span className="text-chrome not-italic tracking-[0.18em] text-base md:text-lg">MILE WORLD</span>.
            </p>
          </div>
        </Reveal>
      </div>
      <SectionBridge />
    </section>
  );
}

/* 3. PASE DE ACCESO */
function PaseAcceso({ guest }: { guest: GuestData }) {
  const guestList = [guest.nombre, ...guest.companions].filter(Boolean);
  return (
    <section className="relative px-6 py-16">
      <div className="mx-auto max-w-md">
        <Reveal>
          <div className="text-center">
            <p className="text-[10px] tracking-cinema text-chrome-soft/70">Credencial</p>
            <h2 className="mt-3 font-display text-3xl md:text-5xl text-chrome tracking-[0.18em]">
              PASE DE ACCESO
            </h2>
          </div>
        </Reveal>

        <Reveal delay={0.2} y={50}>
          <motion.div
            whileHover={{ rotateY: 6, rotateX: -4 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            style={{ transformStyle: "preserve-3d", perspective: 1200 }}
            className="glass-panel chrome-border relative mt-10 overflow-hidden rounded-2xl p-6 text-left"
          >
            {/* Rich chrome background */}
            <div className="absolute inset-0 opacity-55">
              <img src={chromeImg.url} alt="" className="h-full w-full object-cover" loading="lazy" />
            </div>
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.14 0.06 262 / 0.88) 0%, oklch(0.08 0.04 260 / 0.92) 55%, oklch(0.18 0.09 262 / 0.75) 100%)",
              }}
            />
            {/* Abstract premium texture — soft chromatic wisps, no repeated logos */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                background:
                  "radial-gradient(ellipse at 20% 15%, oklch(0.7 0.14 258 / 0.30), transparent 55%), radial-gradient(ellipse at 85% 85%, oklch(0.75 0.16 320 / 0.18), transparent 55%)",
              }}
            />
            {/* Guilloché-style security lines — subtle diagonal filaments */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.10] mix-blend-overlay"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, oklch(0.9 0.02 250 / 0.9) 0 1px, transparent 1px 6px), repeating-linear-gradient(-45deg, oklch(0.9 0.02 250 / 0.9) 0 1px, transparent 1px 9px)",
              }}
            />
            {/* Holographic reflection — full-width sweep, natural travel */}
            <motion.div
              aria-hidden
              initial={{ x: "-120%" }}
              animate={{ x: "220%" }}
              transition={{ duration: 5.5, repeat: Infinity, repeatDelay: 2.5, ease: [0.5, 0, 0.5, 1] }}
              className="pointer-events-none absolute inset-y-0 w-[220%] -left-full"
              style={{
                background:
                  "linear-gradient(105deg, transparent 42%, oklch(0.85 0.12 200 / 0.22) 47%, oklch(0.95 0.05 250 / 0.28) 50%, oklch(0.9 0.18 320 / 0.20) 53%, transparent 58%)",
                mixBlendMode: "screen",
              }}
            />
            {/* Corner ticks */}
            <span className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l border-t border-chrome/70" />
            <span className="pointer-events-none absolute right-3 top-3 h-3 w-3 border-r border-t border-chrome/70" />
            <span className="pointer-events-none absolute left-3 bottom-3 h-3 w-3 border-l border-b border-chrome/70" />
            <span className="pointer-events-none absolute right-3 bottom-3 h-3 w-3 border-r border-b border-chrome/70" />

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
                    <p key={i} className="font-display text-lg md:text-xl text-chrome leading-tight tracking-[0.14em]">
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

              {/* Barcode — clearly visible, still elegant */}
              <div className="mt-6 rounded-md bg-[oklch(0.06_0.02_260/0.55)] px-3 py-3">
                <div className="flex h-9 items-end gap-[2px]">
                  {Array.from({ length: 52 }).map((_, i) => (
                    <span
                      key={i}
                      className="bg-chrome"
                      style={{
                        width: `${1 + ((i * 7) % 3)}px`,
                        height: `${55 + ((i * 13) % 45)}%`,
                        opacity: 0.75 + ((i % 4) / 15),
                      }}
                    />
                  ))}
                </div>
                <p className="mt-2 font-mono text-[9px] tracking-[0.42em] text-chrome/80">
                  MW · {hashCode(guest.nombre || "MILE")} · 2027
                </p>
              </div>
            </div>
          </motion.div>
        </Reveal>
      </div>
      <SectionBridge />
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
    <section className="relative px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <Reveal>
          <p className="text-center text-[10px] tracking-cinema text-chrome-soft/70">
            Código de vestimenta
          </p>
          <h2 className="mt-3 text-center font-display text-3xl md:text-5xl text-chrome tracking-[0.16em]">
            TENIDA ELEGANTE
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="glass-panel chrome-border relative mt-8 overflow-hidden rounded-2xl px-6 py-8 md:px-10 md:py-10">
            <div className="grid grid-cols-2 items-end gap-6 md:gap-10">
              <div className="flex flex-col items-center gap-3">
                <TuxSilhouette />
                <p className="text-[9px] tracking-cinema text-chrome-soft/80">Caballero</p>
              </div>
              <div className="flex flex-col items-center gap-3">
                <GownSilhouette />
                <p className="text-[9px] tracking-cinema text-chrome-soft/80">Dama</p>
              </div>
            </div>
            <div className="mx-auto my-6 h-px w-16 bg-gradient-to-r from-transparent via-chrome-soft/50 to-transparent" />
            <p className="text-center font-display text-base md:text-lg italic text-chrome/85 leading-relaxed">
              Una noche especial merece una presencia especial.
            </p>
          </div>
        </Reveal>
      </div>
      <SectionBridge />
    </section>
  );
}

function TuxSilhouette() {
  return (
    <svg viewBox="0 0 80 160" width="72" height="150" className="text-chrome" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round">
      <circle cx="40" cy="14" r="8" />
      <path d="M22 34 Q40 26 58 34 L64 60 L58 62 L58 130 L22 130 L22 62 L16 60 Z" />
      <path d="M40 34 L32 62 L40 80 L48 62 Z" fill="currentColor" fillOpacity="0.15" />
      <path d="M35 36 L40 40 L45 36 L45 40 L40 40 L35 40 Z" fill="currentColor" />
      <path d="M28 130 L26 158 M52 130 L54 158" />
      <circle cx="40" cy="80" r="0.9" fill="currentColor" />
      <circle cx="40" cy="92" r="0.9" fill="currentColor" />
    </svg>
  );
}

function GownSilhouette() {
  return (
    <svg viewBox="0 0 80 160" width="72" height="150" className="text-chrome" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round">
      <circle cx="40" cy="14" r="8" />
      <path d="M26 34 Q40 28 54 34 L52 66 Q40 70 28 66 Z" />
      <path d="M28 66 Q40 70 52 66 L64 158 L16 158 Z" />
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
    <section className="relative px-6 py-16">
      <div className="mx-auto max-w-xl text-center">
        <Reveal>
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-chrome-soft/40 bg-[oklch(1_0_0/0.04)]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="text-chrome">
              <rect x="3" y="8" width="18" height="4" rx="1" />
              <path d="M12 8v13M5 12v9h14v-9M7.5 8a2.5 2.5 0 0 1 0-5C10 3 12 8 12 8s2-5 4.5-5a2.5 2.5 0 0 1 0 5" />
            </svg>
          </div>
          <p className="mt-6 font-display text-lg md:text-xl italic text-chrome/90 leading-relaxed">
            Lo más valioso para mí será tu presencia.
          </p>
          <p className="mt-3 font-display text-base md:text-lg italic text-chrome-soft/80 leading-relaxed">
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
      <SectionBridge />
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
    <section className="relative px-6 py-16">
      <div className="mx-auto max-w-md">
        <Reveal>
          <p className="text-center text-[10px] tracking-cinema text-chrome-soft/70">
            Ver todos los detalles de la fiesta
          </p>
          <div className="glass-panel chrome-border relative mt-6 overflow-hidden rounded-2xl p-8 text-center">
            {/* subtle sapphire wash — no horizontal paper lines */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-70"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 0%, oklch(0.4 0.14 258 / 0.30), transparent 60%)",
              }}
            />
            {/* header — CLASIFICADO + confidential badge */}
            <div className="relative flex items-center justify-between text-[8px] tracking-cinema">
              <span className="text-chrome-soft/60">CLASIFICADO · 001</span>
              <span className="flex items-center gap-1.5 text-destructive/85">
                <span className="h-1.5 w-1.5 rounded-full bg-destructive animate-pulse" />
                CONFIDENCIAL
              </span>
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
                  className="mx-auto mt-8 flex flex-col items-center py-4 outline-none"
                >
                  <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-chrome-soft/30 bg-[oklch(0.06_0.02_260/0.4)]">
                    <Fingerprint />
                  </div>
                  <p className="mt-5 text-[10px] tracking-cinema text-chrome-soft/70">
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
                  className="mt-8 py-4"
                >
                  <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-full border border-chrome/60 bg-[oklch(0.06_0.02_260/0.4)]">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Fingerprint glowing />
                    </div>
                    <motion.div
                      initial={{ top: 0 }}
                      animate={{ top: "100%" }}
                      transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }}
                      className="absolute left-0 right-0 h-[2px]"
                      style={{
                        background:
                          "linear-gradient(to right, transparent, oklch(0.72 0.19 258 / 0.95), transparent)",
                        boxShadow:
                          "0 0 12px oklch(0.72 0.19 258 / 0.9), 0 0 24px oklch(0.6 0.2 258 / 0.6)",
                      }}
                    />
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
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-6 py-2"
                >
                  {/* Status */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0.5, 1] }}
                    transition={{ duration: 0.9 }}
                    className="font-mono text-[11px] tracking-[0.42em] text-destructive"
                  >
                    ACCESO DENEGADO
                  </motion.p>
                  {/* Headline */}
                  <p
                    className="mt-6 font-display text-xl md:text-2xl text-chrome tracking-[0.32em]"
                    style={{ textShadow: "0 0 20px oklch(0.7 0.15 258 / 0.35)" }}
                  >
                    ARCHIVO
                    <br />
                    RESTRINGIDO
                  </p>
                  {/* Description */}
                  <p className="mx-auto mt-5 max-w-xs font-display text-sm italic text-chrome-soft/85 leading-relaxed">
                    Algunos detalles de esta producción permanecen reservados
                    hasta la noche del evento.
                  </p>
                  <div className="my-6 h-px bg-gradient-to-r from-transparent via-chrome-soft/30 to-transparent" />
                  {/* Metadata line */}
                  <div className="flex items-center justify-between text-[9px] tracking-cinema text-chrome-soft/70">
                    <span>MILE WORLD</span>
                    <span>NIVEL DE SEGURIDAD · <span className="text-destructive">ALTO</span></span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
      <SectionBridge />
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
    <section className="relative px-6 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <h2 className="font-display text-2xl md:text-4xl italic text-chrome/90 tracking-wide">
            La premiere comienza en
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="mt-8 grid grid-cols-4 gap-2 md:gap-4">
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
      <SectionBridge />
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
    <section className="relative px-6 py-16">
      <div className="mx-auto max-w-lg text-center">
        <Reveal>
          <h2 className="font-display text-5xl md:text-6xl text-chrome tracking-[0.14em]">
            CONFIRMAR<br />ACCESO
          </h2>
          <p className="mt-6 font-display text-lg md:text-xl italic text-chrome/85 leading-relaxed">
            Activa tu invitación privada.
          </p>
          <p className="mt-2 font-display text-base md:text-lg italic text-chrome-soft/75">
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
      <SectionBridge />
    </section>
  );
}

/* CLOSING CURTAIN — emotional finale mirroring the opening */
function ClosingCurtain() {
  return (
    <section className="relative overflow-hidden px-6 pt-20 pb-24">
      {/* mirror spotlight from top-back to bottom-front */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2 }}
        className="pointer-events-none absolute inset-0"
      >
        <div
          className="absolute inset-x-0 top-0 h-[60%]"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, oklch(0.55 0.18 258 / 0.45), transparent 65%)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-[45%]"
          style={{
            background:
              "radial-gradient(ellipse at 50% 100%, oklch(0.5 0.18 258 / 0.35), transparent 65%)",
          }}
        />
      </motion.div>

      <div className="relative mx-auto max-w-xl text-center">
        <Reveal>
          <p className="font-display text-xl md:text-2xl italic text-chrome/85 leading-relaxed">
            Se apagan las luces.
          </p>
          <p className="mt-3 font-display text-lg md:text-xl italic text-chrome-soft/80 leading-relaxed">
            El telón está a punto de subir.
          </p>
        </Reveal>
        <Reveal delay={0.25}>
          <div className="mx-auto my-8 h-px w-24 bg-gradient-to-r from-transparent via-chrome-soft/60 to-transparent" />
          <p className="text-[10px] tracking-cinema text-chrome-soft/70">Con cariño,</p>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            className="mt-3 text-chrome text-6xl md:text-7xl leading-none"
            style={{
              fontFamily: "var(--font-signature)",
              textShadow: "0 0 30px oklch(0.7 0.15 258 / 0.4)",
            }}
          >
            Milena
          </motion.p>
        </Reveal>
        <Reveal delay={0.45}>
          <p className="mt-10 text-[10px] tracking-[0.5em] text-chrome-soft/70">
            NOS VEMOS EN LA PREMIERE
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative px-6 pb-14 pt-6 text-center">
      <div className="mx-auto max-w-md space-y-3">
        <div className="mx-auto h-px w-16 bg-gradient-to-r from-transparent via-chrome-soft/40 to-transparent" />
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
      className="fixed bottom-24 left-5 z-50 max-w-[280px] glass-panel chrome-border rounded-2xl p-4"
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
  onDisable,
}: {
  active: boolean;
  enabled: boolean;
  onEnable: () => void;
  onDisable: () => void;
}) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const autoStartedRef = useRef(false);

  // Auto-start once when the user first enables the soundtrack. Never
  // re-trigger after the user manually pauses.
  useEffect(() => {
    if (!enabled) {
      autoStartedRef.current = false;
      return;
    }
    if (autoStartedRef.current) return;
    const el = audioRef.current;
    if (!el) return;
    autoStartedRef.current = true;
    el.volume = 0.4;
    el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }, [enabled]);

  // Stop and reset if the experience ends (user rewinds to intro etc.)
  useEffect(() => {
    if (active) return;
    const el = audioRef.current;
    if (!el) return;
    el.pause();
    el.currentTime = 0;
    setPlaying(false);
  }, [active]);

  const toggle = async () => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
      onDisable();
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
      <div className="fixed bottom-5 left-5 z-50">
        <button
          onClick={toggle}
          aria-label={playing ? "Pausar música" : "Reproducir música"}
          className="relative flex h-12 w-12 items-center justify-center rounded-full border border-chrome-soft/40 backdrop-blur-xl text-chrome transition-all hover:scale-110 hover:border-chrome/70"
          style={{
            background:
              "radial-gradient(circle at 30% 25%, oklch(0.3 0.09 260 / 0.75), oklch(0.08 0.03 260 / 0.85) 70%)",
            boxShadow:
              "0 10px 40px oklch(0.5 0.16 258 / 0.35), inset 0 1px 0 oklch(1 0 0 / 0.15)",
          }}
        >
          {playing ? (
            <div className="flex items-end gap-[3px] h-4">
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
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      </div>
    </>
  );
}