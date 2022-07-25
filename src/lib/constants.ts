export const BACKEND_URL =
  process.env.NODE_ENV === "development" ? "http://0.0.0.0:8080" : "/api/v1";

export const BACKEND_URL_PROXY =
  process.env.NODE_ENV === "development"
    ? "http://0.0.0.0:8080"
    : "https://bulk-backend.dev.intern.nav.no";

export const MAX_DATA_RENDERING_SIZE = 1000;
