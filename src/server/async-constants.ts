import { fromAPIJson } from "../lib/fromapi";
import { authConfig } from "./constants";

// Open ID configuration from Azure
export type AzureAdOpenIdConfig = {
  jwks_uri: string;
  issuer: string;
  token_endpoint: string;
  authorization_endpoint: string;
};

function getOpenIdConfigFromAzure() {
  return fromAPIJson<AzureAdOpenIdConfig>({
    url: authConfig.AZURE_APP_WELL_KNOWN_URL,
    method: "GET",
  });
}

export const AZURE_AD_CONFIG = getOpenIdConfigFromAzure();

// Jwks from the OpenId configuration
export interface JwksResponse {
  keys: {
    kty: "RSA";
    use: string;
    kid: string;
    x5t: string;
    n: string;
    e: string;
    x5c: string[];
    issuer: string;
  }[];
}

async function getPublicJwksFromAzure() {
  const azureConfig = await AZURE_AD_CONFIG;
  return await fromAPIJson<JwksResponse>({
    // eslint-disable-next-line camelcase
    url: azureConfig.jwks_uri,
    method: "GET",
  });
}

export const PUBLIC_JWKS = getPublicJwksFromAzure();
