export const BACKEND_URL =
  process.env.NODE_ENV === "development" ? "http://0.0.0.0:8080" : "/api/v1";

export const BACKEND_URL_PROXY =
  process.env.NODE_ENV === "development"
    ? "http://0.0.0.0:8080"
    : "https://bulk-backend.dev.intern.nav.no";

export const MAX_DATA_RENDERING_SIZE = 1000;

export const authConfig = {
  TOKEN_ENDPOINT: process.env.AZURE_OPENID_CONFIG_TOKEN_ENDPOINT ?? "",
  CLIENT_ID: process.env.AZURE_APP_CLIENT_ID ?? "",
  CLIENT_SECRET: process.env.AZURE_APP_CLIENT_SECRET ?? "",
  BULK_BACKEND_SCOPE: "api://dev-gcp.team-bulk.bulk-backend/.default",
};
