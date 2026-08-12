import guestsData from "@/data/guests.json";

export type Role = "adulto" | "joven";
export interface GuestMember { nombre: string; rol: Role }
export interface Reservation { id: number; accessCode: string; integrantes: GuestMember[] }

export const RESERVATIONS: Reservation[] = guestsData as Reservation[];

/** Lowercase + strip diacritics + collapse whitespace. */
export function normalize(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

/** Title-cased name, preserving small words in lowercase. */
export function titleCase(s: string): string {
  const small = new Set(["de", "del", "la", "las", "los", "y", "da", "do"]);
  return s
    .toLowerCase()
    .split(/\s+/)
    .map((w, i) => (i > 0 && small.has(w)) ? w : w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Fuzzy-ish autocomplete: every token in the query must appear in the name. */
export function searchGuests(query: string, limit = 8): GuestMember[] {
  const q = normalize(query);
  if (!q) return [];
  const tokens = q.split(" ");
  const results: { member: GuestMember; score: number }[] = [];
  for (const r of RESERVATIONS) {
    for (const m of r.integrantes) {
      const nn = normalize(m.nombre);
      if (!tokens.every((t) => nn.includes(t))) continue;
      // Score: starts-with beats includes; shorter names win ties.
      const score = (nn.startsWith(q) ? 0 : 1) * 100 + nn.length;
      results.push({ member: m, score });
    }
  }
  return results.sort((a, b) => a.score - b.score).slice(0, limit).map((r) => r.member);
}

/** Locate the reservation containing a specific member (by exact name). */
export function findReservationByGuestName(name: string): Reservation | undefined {
  const target = normalize(name);
  return RESERVATIONS.find((r) => r.integrantes.some((m) => normalize(m.nombre) === target));
}

/**
 * The access code of the group a guest belongs to. This is the single value
 * encoded in the QR — read live from guests.json, never random or cached.
 */
export function accessCodeFor(name: string): string {
  return findReservationByGuestName(name)?.accessCode ?? "";
}

/** All members of the guest's group (used for the QR / group identity). */
export function groupMembers(name: string): GuestMember[] {
  return findReservationByGuestName(name)?.integrantes ?? [];
}

/** First name only, Title Cased. */
export function firstName(fullName: string): string {
  return titleCase(normalize(fullName).split(" ")[0] || "");
}

/** Given the authenticated guest, return the members to display on the pass/RSVP. */
export function visibleMembers(guestName: string): GuestMember[] {
  const res = findReservationByGuestName(guestName);
  if (!res) return [];
  const me = res.integrantes.find((m) => normalize(m.nombre) === normalize(guestName))!;
  if (res.integrantes.length === 1) return [me];
  if (me.rol === "adulto") return res.integrantes;
  return [me];
}

/** Very light Spanish gender heuristic for "Bienvenido/Bienvenida". */
export function welcomeGreeting(fullName: string): "Bienvenido" | "Bienvenida" {
  const first = normalize(fullName).split(" ")[0] || "";
  const femExceptions = new Set([
    "isabel", "carmen", "esther", "beatriz", "raquel", "sol", "azucena", "abril", "miriam", "mirian",
    "meylin", "meyling", "florencia", "gladys", "elva", "mimi", "gloria", "sandra", "julia", "julieta",
    "lucia", "martina", "mia", "kitty", "andrea", "zaira", "flopy", "francisca", "romina", "elva",
    "elvira", "herminia", "vero", "esmelda", "carmen", "epifania", "maky", "yesi", "yamila", "mirian",
    "rocio", "andy", "marilin", "rossana", "noemi", "elena", "camila", "mon", "eliana", "alexandra",
    "patricia", "carolina", "beatriz", "anahi", "alicia", "ayelen", "laura", "ludmila", "izzy", "talia",
    "lara", "gracie", "xio", "steffy", "sara", "nicole", "danna", "aylen", "zaira", "gisella", "maira",
    "hinata", "tatiana", "analia", "oyuki", "kiara", "nhayeli", "luana", "melody", "sofia", "aylin",
    "dulce", "leila", "jimena", "norma", "barbie",
  ]);
  const mascExceptions = new Set([
    "andres", "nicolas", "tomas", "matias", "elias", "jose", "luis", "jesus", "moises", "ismael",
    "rumildo", "pablo", "richard", "mateo", "nelson", "joaquin", "guillermo", "evelio", "diego",
    "juan", "rodrigo", "alan", "carlos", "eugenio", "andy", "fernando", "nestor", "patricio",
    "julio", "valentin", "santos", "sebas", "junior", "gito", "matias", "fede", "german", "dario",
    "hector", "gustavo", "david", "jorge", "nico", "edmar", "nahuel", "dante", "jarred", "joseph",
    "fabri", "maxi", "rufino", "kevin", "xander", "angel", "dylan", "joan", "thiago", "mathias",
    "igor", "yan", "magno",
  ]);
  if (femExceptions.has(first)) return "Bienvenida";
  if (mascExceptions.has(first)) return "Bienvenido";
  if (first.endsWith("a")) return "Bienvenida";
  return "Bienvenido";
}