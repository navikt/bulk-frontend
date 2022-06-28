export const BACKEND_URL =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_BACKEND_URL
    : "http://127.0.0.1:8080";
