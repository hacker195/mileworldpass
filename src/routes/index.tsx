import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import mLogo from "@/assets/mile-m-logo.png.asset.json";
import wordmark from "@/assets/mileworld-wordmark.png.asset.json";
import heroImg from "@/assets/mileworld-hero.jpg";
import chromeImg from "@/assets/mileworld-chrome.jpg";
import carpetImg from "@/assets/mileworld-carpet.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

type Stage = "intro" | "access" | "experience";

interface GuestData {
  nombre: string;
  invitacionPara: string;
}

const EVENT_DATE = new Date("2027-01-01T20:30:00-03:00");
const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Oga+Guasu+Salon+de+Eventos";

function Index() {
  const [stage, setStage] = useState<Stage>("intro");
  const [guest, setGuest] = useState<GuestData>({ nombre: "", invitacionPara: "" });

  return (
    <main className="relative min-h-screen bg-midnight text-foreground overflow-hidden font-sans">
      <AmbientBackground />
      <MusicPlayer active={stage !== "intro"} />
      <AnimatePresence mode="wait">
        {stage === "intro" && <IntroScreen key="intro" onEnter={() => setStage("access")} />}
        {stage === "access" && (
          <AccessScreen
            key="access"
            onSubmit={(data) => {
              setGuest(data);
              setStage("experience");
            }}
          />
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
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        d: 4 + Math.random() * 8,
        s: 0.5 + Math.random() * 1.5,
      })),
    [],
  );
  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-midnight" />
      <div className="spotlight left-[-10vw] top-[-20vh]" />
      <div
        className="spotlight right-[-10vw] top-[10vh]"
        style={{ animationDelay: "-6s" }}
      />
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full bg-chrome/40 blur-[1px]"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.d,
            height: p.d,
            animation: `float-particle ${8 + p.s * 6}s ease-in-out ${p.s * -2}s infinite`,
            background: "oklch(0.92 0.008 250 / 0.35)",
          }}
        />
      ))}
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
      exit={{ opacity: 0, filter: "blur(20px)", scale: 1.1 }}
      transition={{ duration: 1.1, ease: [0.7, 0, 0.3, 1] }}
      className="relative flex min-h-screen flex-col items-center justify-center px-6 py-16"
    >
      <motion.div
        initial={{ opacity: 0, y: 40, filter: "blur(20px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center"
      >
        <motion.p
          initial={{ opacity: 0, letterSpacing: "0.1em" }}
          animate={{ opacity: 1, letterSpacing: "0.5em" }}
          transition={{ duration: 2.5, delay: 0.3 }}
          className="text-[10px] tracking-cinema text-chrome-soft mb-8"
        >
          Una producción de Milewood
        </motion.p>

        <motion.img
          src={mLogo.url}
          alt="MILEWOOD"
          width={220}
          height={220}
          className="w-40 h-40 md:w-52 md:h-52 object-contain opacity-90 drop-shadow-[0_0_40px_oklch(0.55_0.18_258/0.6)]"
          initial={{ scale: 0.6, opacity: 0, rotate: -8 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, delay: 2 }}
          className="mt-10 flex flex-col items-center"
        >
          <h1 className="font-display text-chrome text-4xl md:text-6xl leading-none tracking-wide">
            MILEWOOD
          </h1>
          <div className="my-5 flex items-center gap-3 opacity-70">
            <span className="h-px w-10 bg-chrome-soft/60" />
            <span className="text-[10px] tracking-cinema text-chrome-soft">
              presenta
            </span>
            <span className="h-px w-10 bg-chrome-soft/60" />
          </div>
          <p className="font-display italic text-2xl md:text-3xl text-chrome/90">
            Los XV de Mile
          </p>
        </motion.div>
      </motion.div>

      <motion.button
        onClick={onEnter}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 3.2 }}
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
        transition={{ duration: 2, delay: 3.6 }}
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
  const [invitacionPara, setInvitacionPara] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const n = nombre.trim().slice(0, 80);
    const i = invitacionPara.trim().slice(0, 200);
    if (!n) return;
    onSubmit({ nombre: n, invitacionPara: i || n });
  };

  return (
    <motion.section
      initial={{ opacity: 0, filter: "blur(20px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex min-h-screen flex-col items-center justify-center px-6"
    >
      <motion.form
        onSubmit={submit}
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="glass-panel chrome-border relative w-full max-w-md rounded-2xl p-8 md:p-10"
      >
        <div className="mb-8 text-center">
          <p className="text-[9px] tracking-cinema text-chrome-soft/70">
            Milewood · Control de Acceso
          </p>
          <h2 className="mt-3 font-display text-2xl text-chrome md:text-3xl">
            Identifica tu acceso
          </h2>
          <p className="mt-3 text-xs text-muted-foreground">
            Ingresa los datos de tu invitación para desbloquear la experiencia.
          </p>
        </div>

        <div className="space-y-5">
          <Field
            label="Nombre del invitado"
            value={nombre}
            onChange={setNombre}
            placeholder="Tu nombre completo"
            maxLength={80}
            required
          />
          <Field
            label="Invitación válida para"
            value={invitacionPara}
            onChange={setInvitacionPara}
            placeholder="Personas incluidas en tu invitación"
            maxLength={200}
          />
        </div>

        <button
          type="submit"
          disabled={!nombre.trim()}
          className="mt-8 w-full rounded-full border border-chrome-soft/40 bg-[oklch(1_0_0/0.04)] py-3.5 text-[11px] tracking-cinema text-chrome transition-all hover:bg-[oklch(1_0_0/0.08)] hover:border-chrome/60 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continuar
        </button>

        <p className="mt-6 text-center text-[9px] tracking-cinema text-chrome-soft/50">
          Acceso exclusivo · No compartir
        </p>
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
        className="w-full rounded-lg border border-chrome-soft/20 bg-[oklch(0.05_0.02_260/0.6)] px-4 py-3 text-sm text-chrome placeholder:text-chrome-soft/30 outline-none transition-colors focus:border-chrome/60 focus:bg-[oklch(0.08_0.03_262/0.8)]"
      />
    </label>
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
      <Inicio />
      <Produccion />
      <PaseAcceso guest={guest} />
      <AlfombraAzul />
      <CodigoVestimenta />
      <MileworldSection />
      <ArchivoRestringido />
      <CuentaRegresiva />
      <ConfirmarAcceso guest={guest} />
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
  y = 40,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y, filter: "blur(12px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* 1. INICIO */
function Inicio() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6"
    >
      <motion.img
        src={heroImg}
        alt=""
        style={{ y }}
        className="absolute inset-0 h-full w-full object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[oklch(0.06_0.03_260/0.6)] to-[oklch(0.05_0.02_260)]" />
      <motion.div style={{ opacity }} className="relative z-10 text-center max-w-2xl">
        <SectionLabel>Inicio</SectionLabel>
        <img
          src={wordmark.url}
          alt="MILE WORLD"
          className="mx-auto my-8 w-72 md:w-96 opacity-95 drop-shadow-[0_0_60px_oklch(0.55_0.18_258/0.5)]"
        />
        <Reveal delay={0.3}>
          <p className="font-display text-xl md:text-2xl italic text-chrome/90 leading-relaxed">
            Bienvenido al universo de Mile.
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Las luces se atenúan. La función está por comenzar.
          </p>
        </Reveal>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.4, 1] }}
          transition={{ duration: 3, delay: 2, repeat: Infinity, repeatType: "reverse" }}
          className="absolute bottom-[-80px] left-1/2 -translate-x-1/2 text-[9px] tracking-cinema text-chrome-soft/60"
        >
          Desliza para continuar
        </motion.div>
      </motion.div>
    </section>
  );
}

/* 2. LA PRODUCCIÓN */
function Produccion() {
  return (
    <section className="relative px-6 py-32">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <SectionLabel>Capítulo I</SectionLabel>
          <h2 className="mt-4 font-display text-4xl md:text-6xl text-chrome">
            La Producción
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="mt-8 h-px w-24 mx-auto bg-gradient-to-r from-transparent via-chrome-soft to-transparent" />
          <p className="mt-8 font-display text-xl md:text-2xl italic leading-relaxed text-chrome/85">
            "Milewood no es un evento. Es una producción."
          </p>
          <p className="mt-6 text-sm md:text-base leading-relaxed text-muted-foreground">
            Cada detalle de esta noche fue pensado como una escena. Cada
            invitado, parte del reparto. Lo que verás es solo el tráiler —
            la película se estrena el 01 de enero de 2027.
          </p>
        </Reveal>

        <Reveal delay={0.4}>
          <div className="mt-14 grid grid-cols-3 gap-4 text-center">
            {[
              { k: "Dirección", v: "Milewood" },
              { k: "Protagonista", v: "Mile" },
              { k: "Género", v: "Reservado" },
            ].map((c) => (
              <div key={c.k} className="glass-panel rounded-xl px-2 py-4">
                <p className="text-[8px] tracking-cinema text-chrome-soft/60">
                  {c.k}
                </p>
                <p className="mt-2 font-display text-sm text-chrome">{c.v}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* 3. PASE DE ACCESO */
function PaseAcceso({ guest }: { guest: GuestData }) {
  return (
    <section className="relative px-6 py-32">
      <div className="mx-auto max-w-md text-center">
        <Reveal>
          <SectionLabel>Credencial</SectionLabel>
          <h2 className="mt-4 font-display text-4xl md:text-5xl text-chrome">
            Pase de Acceso
          </h2>
        </Reveal>

        <Reveal delay={0.3} y={60}>
          <motion.div
            whileHover={{ rotateY: 6, rotateX: -4 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            style={{ transformStyle: "preserve-3d", perspective: 1200 }}
            className="glass-panel chrome-border relative mt-12 overflow-hidden rounded-2xl p-8 text-left"
          >
            <div className="absolute inset-0 opacity-30">
              <img src={chromeImg} alt="" className="h-full w-full object-cover" loading="lazy" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.08_0.03_260/0.7)] to-[oklch(0.06_0.02_260/0.9)]" />

            <div className="relative">
              <div className="flex items-center justify-between">
                <img src={mLogo.url} alt="M" className="h-10 w-10 object-contain opacity-90" />
                <div className="text-right">
                  <p className="text-[8px] tracking-cinema text-chrome-soft/70">Milewood</p>
                  <p className="text-[9px] tracking-cinema text-chrome/90">Pase de Acceso</p>
                </div>
              </div>

              <div className="my-8 h-px bg-gradient-to-r from-transparent via-chrome-soft/40 to-transparent" />

              <PassRow label="Invitado" value={guest.nombre || "—"} />
              <PassRow label="Invitación válida para" value={guest.invitacionPara || "—"} />
              <PassRow label="Fecha" value="01 · 01 · 2027" />
              <PassRow label="Hora" value="20:30 hs" />
              <PassRow label="Lugar" value="Oga Guasu · Salón de Eventos" />

              <div className="my-6 h-px bg-gradient-to-r from-transparent via-chrome-soft/40 to-transparent" />

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[8px] tracking-cinema text-chrome-soft/60">Producción</p>
                  <p className="font-display text-sm text-chrome">Los XV de Mile</p>
                </div>
                <div className="text-right">
                  <p className="text-[8px] tracking-cinema text-chrome-soft/60">Acceso</p>
                  <p className="font-mono text-xs text-chrome">
                    #{hashCode(guest.nombre || "MILE")}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex gap-1">
                {Array.from({ length: 32 }).map((_, i) => (
                  <span
                    key={i}
                    className="h-6 bg-chrome/80"
                    style={{ width: `${1 + Math.random() * 3}px`, opacity: 0.3 + Math.random() * 0.7 }}
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
      <p className="text-[8px] tracking-cinema text-chrome-soft/60">{label}</p>
      <p className="mt-1 font-display text-base text-chrome">{value}</p>
    </div>
  );
}

function hashCode(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h).toString(16).padStart(6, "0").slice(0, 6).toUpperCase();
}

/* 4. ALFOMBRA AZUL */
function AlfombraAzul() {
  return (
    <section className="relative min-h-[90vh] px-6 py-32">
      <div className="absolute inset-0 overflow-hidden">
        <img src={carpetImg} alt="" className="h-full w-full object-cover opacity-50" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.05_0.02_260)] via-transparent to-[oklch(0.05_0.02_260)]" />
      </div>
      <div className="relative mx-auto max-w-2xl text-center">
        <Reveal>
          <SectionLabel>Capítulo II</SectionLabel>
          <h2 className="mt-4 font-display text-4xl md:text-6xl text-chrome">
            Alfombra Azul
          </h2>
        </Reveal>
        <Reveal delay={0.3}>
          <p className="mt-10 font-display text-xl md:text-2xl italic leading-relaxed text-chrome/90">
            "Antes de que las luces se enciendan, comienza el primer momento
            de la experiencia."
          </p>
          <p className="mt-6 text-sm text-muted-foreground">
            Tu llegada es parte del guión. Camina despacio. Todos están mirando.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* 5. CÓDIGO DE VESTIMENTA */
function CodigoVestimenta() {
  return (
    <section className="relative px-6 py-32">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <SectionLabel>Dress Code</SectionLabel>
          <h2 className="mt-4 font-display text-4xl md:text-6xl text-chrome">
            Código de Vestimenta
          </h2>
        </Reveal>
        <Reveal delay={0.3}>
          <div className="glass-panel chrome-border mt-12 rounded-2xl p-10">
            <p className="text-[10px] tracking-cinema text-chrome-soft/70">Tema</p>
            <p className="mt-4 font-display text-3xl md:text-5xl text-chrome italic">
              Noche de Estreno
            </p>
            <div className="my-8 h-px bg-gradient-to-r from-transparent via-chrome-soft/40 to-transparent" />
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              Elegancia cinematográfica. Tonos oscuros, metálicos y cromados.
              Vístete como si esta noche fuera tu premiere.
            </p>
            <div className="mt-8 flex justify-center gap-3">
              {["oklch(0.08 0.03 260)", "oklch(0.18 0.05 262)", "oklch(0.55 0.14 258)", "oklch(0.92 0.008 250)"].map(
                (c) => (
                  <div
                    key={c}
                    className="h-10 w-10 rounded-full border border-chrome-soft/30 shadow-lg"
                    style={{ background: c }}
                  />
                ),
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* 6. MILEWORLD */
function MileworldSection() {
  return (
    <section className="relative px-6 py-32">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <SectionLabel>El Universo</SectionLabel>
          <h2 className="mt-4 font-display text-5xl md:text-7xl text-chrome tracking-wide">
            Mileworld
          </h2>
        </Reveal>
        <Reveal delay={0.3}>
          <p className="mt-8 font-display text-xl md:text-2xl italic text-chrome/85">
            No es un lugar. Es un mundo que existe una sola noche.
          </p>
          <p className="mt-6 text-sm text-muted-foreground leading-relaxed">
            Cada rincón, cada mesa, cada luz forma parte de un mismo relato.
            Lo que verás allí no existe en ningún otro lugar — y no volverá
            a existir.
          </p>
        </Reveal>

        <Reveal delay={0.5}>
          <div className="mt-14 grid grid-cols-2 gap-3 text-left">
            {[
              "Escenas ocultas",
              "Personajes secundarios",
              "Momentos sin guion",
              "Un final reservado",
            ].map((t, i) => (
              <motion.div
                key={t}
                whileHover={{ y: -4 }}
                className="glass-panel rounded-xl p-4"
              >
                <p className="text-[8px] tracking-cinema text-chrome-soft/60">
                  Escena {String(i + 1).padStart(2, "0")}
                </p>
                <p className="mt-2 font-display text-base text-chrome">{t}</p>
              </motion.div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* 7. ARCHIVO RESTRINGIDO */
function ArchivoRestringido() {
  const [open, setOpen] = useState(false);
  return (
    <section className="relative px-6 py-32">
      <div className="mx-auto max-w-md">
        <Reveal>
          <div
            className="glass-panel chrome-border relative cursor-pointer overflow-hidden rounded-2xl p-8 text-center"
            onClick={() => setOpen((o) => !o)}
          >
            <div className="absolute right-4 top-4 flex items-center gap-1.5 text-[8px] tracking-cinema text-destructive/80">
              <span className="h-1.5 w-1.5 rounded-full bg-destructive animate-pulse" />
              Confidencial
            </div>
            <SectionLabel>Milewood · Archivo</SectionLabel>
            <h2 className="mt-3 font-display text-3xl md:text-4xl text-chrome">
              Archivo Restringido
            </h2>
            <div className="my-6 h-px bg-gradient-to-r from-transparent via-destructive/40 to-transparent" />

            <AnimatePresence mode="wait">
              {!open ? (
                <motion.div
                  key="locked"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-6"
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-chrome-soft/30">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="text-chrome">
                      <rect x="4" y="10" width="16" height="11" rx="2" />
                      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                    </svg>
                  </div>
                  <p className="mt-5 text-xs text-muted-foreground">
                    Toca para intentar acceder
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="unlocked"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="py-4"
                >
                  <p className="font-mono text-[10px] tracking-widest text-destructive/80">
                    ACCESO DENEGADO
                  </p>
                  <p className="mt-4 font-display text-base italic text-chrome/90 leading-relaxed">
                    "Algunos detalles de esta producción permanecen reservados
                    hasta la noche del evento."
                  </p>
                  <p className="mt-4 text-[9px] tracking-cinema text-chrome-soft/50">
                    Milewood · Nivel de Seguridad 05
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* 8. CUENTA REGRESIVA */
function CuentaRegresiva() {
  const [time, setTime] = useState(() => diff(EVENT_DATE));
  useEffect(() => {
    const t = setInterval(() => setTime(diff(EVENT_DATE)), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <section className="relative px-6 py-32">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <SectionLabel>Countdown</SectionLabel>
          <h2 className="mt-4 font-display text-3xl md:text-5xl text-chrome">
            La Premiere Comienza En
          </h2>
        </Reveal>
        <Reveal delay={0.3}>
          <div className="mt-12 grid grid-cols-4 gap-2 md:gap-4">
            {[
              { k: "Días", v: time.d },
              { k: "Horas", v: time.h },
              { k: "Min", v: time.m },
              { k: "Seg", v: time.s },
            ].map((u) => (
              <div
                key={u.k}
                className="glass-panel chrome-border rounded-xl py-6"
              >
                <p className="font-display text-3xl md:text-5xl text-chrome tabular-nums">
                  {String(u.v).padStart(2, "0")}
                </p>
                <p className="mt-2 text-[8px] tracking-cinema text-chrome-soft/70">
                  {u.k}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-xs tracking-cinema text-chrome-soft/60">
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
  const whatsappText = encodeURIComponent(
    `Confirmo mi acceso a MILEWOOD — Los XV de Mile. Invitado: ${guest.nombre}. Invitación válida para: ${guest.invitacionPara}.`,
  );
  return (
    <section className="relative px-6 py-32">
      <div className="mx-auto max-w-md text-center">
        <Reveal>
          <SectionLabel>Confirmación</SectionLabel>
          <h2 className="mt-4 font-display text-4xl md:text-5xl text-chrome">
            Confirmar Acceso
          </h2>
          <p className="mt-6 text-sm text-muted-foreground">
            Activa tu invitación privada. Sin confirmación, tu asiento no
            estará reservado en la sala.
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-10 flex flex-col gap-3">
            <a
              href={`https://wa.me/?text=${whatsappText}`}
              target="_blank"
              rel="noreferrer"
              onClick={() => setConfirmed(true)}
              className="group relative overflow-hidden rounded-full border border-chrome/40 bg-[oklch(1_0_0/0.05)] py-4 text-[11px] tracking-cinema text-chrome transition-all hover:bg-[oklch(1_0_0/0.1)] hover:border-chrome"
            >
              <span className="relative z-10">
                {confirmed ? "Acceso Activado ✓" : "Confirmar Acceso"}
              </span>
              <span className="shimmer absolute inset-0" />
            </a>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-chrome-soft/30 py-4 text-[11px] tracking-cinema text-chrome-soft transition-colors hover:text-chrome hover:border-chrome/40"
            >
              Ver Ubicación · Oga Guasu
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative px-6 pb-16 pt-24 text-center">
      <div className="mx-auto max-w-md">
        <img src={mLogo.url} alt="M" className="mx-auto h-16 w-16 opacity-70" />
        <p className="mt-6 font-display text-lg italic text-chrome/80">
          Los XV de Mile
        </p>
        <p className="mt-2 text-[10px] tracking-cinema text-chrome-soft/60">
          Una producción de Milewood
        </p>
        <div className="mt-8 h-px bg-gradient-to-r from-transparent via-chrome-soft/30 to-transparent" />
        <p className="mt-6 text-[9px] tracking-cinema text-chrome-soft/40">
          © MMXXVII · All Access Reserved
        </p>
      </div>
    </footer>
  );
}

/* ------------------------------ MUSIC PLAYER ----------------------------- */

function MusicPlayer({ active }: { active: boolean }) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
      } catch {
        setPlaying(false);
      }
    }
  };

  if (!active) return null;

  return (
    <>
      <audio
        ref={audioRef}
        src="/music/genesis.mp3"
        loop
        preload="none"
      />
      <button
        onClick={toggle}
        aria-label={playing ? "Pausar música" : "Reproducir música"}
        className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-chrome-soft/40 bg-[oklch(0.08_0.03_260/0.7)] backdrop-blur-lg text-chrome transition-all hover:scale-110 hover:border-chrome/70"
      >
        {playing ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 5v14l12-7z" />
          </svg>
        )}
        {playing && (
          <span className="absolute inset-0 rounded-full border border-chrome/40 animate-ping" />
        )}
      </button>
    </>
  );
}
