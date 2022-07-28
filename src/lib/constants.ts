export const BACKEND_URL = "/api/v1";

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
  BULK_TEAM_ID_DEV: "0242dce3-f722-4c6b-ac97-2dd7cc798c4e",
  BULK_TEAM_ID_PROD: "e08a856f-6e64-48b0-978b-5b201760fa13",
  AZURE_APP_JWK: process.env.AZURE_APP_JWK ?? "",
  AZURE_APP_WELL_KNOWN_URL:
    "https://login.microsoftonline.com/966ac572-f5b7-4bbe-aa88-c76419c0f851/v2.0/.well-known/openid-configuration",
};
