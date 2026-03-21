/**
 * URL de l’API.
 * - En dev : chaîne vide = appels relatifs `/api/...` (proxy Vite → backend).
 * - Sinon : `VITE_API_BASE` ou fallback localhost.
 */
const env = import.meta.env.VITE_API_BASE;

export const API_BASE =
  env !== undefined && env !== ""
    ? env.replace(/\/$/, "")
    : import.meta.env.DEV
      ? ""
      : "http://localhost:8000";

export const STORAGE_TOKEN_KEY = "mentorbenin_token";
