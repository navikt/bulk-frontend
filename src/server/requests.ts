import { NextApiRequest } from "next";
import { BACKEND_URL } from "../helpers/constants";
import logger from "../helpers/logger";
import { fromAPIJson, fromAPIString } from "../lib/fromapi";
import { authConfig, BACKEND_URL_PROXY } from "./constants";

export const getIsAliveFromAPI = () => {
  return fromAPIString({
    url: `${BACKEND_URL}/isalive`,
    method: "GET",
  });
};

export type OBOExchangeResponse = {
  token_type: string;
  scope: string;
  expires_in: number;
  ext_expires_in: number;
  access_token: string;
};
/**
 * Function that sends request to azure ad to make a token exhange scoped for the ktor backend
 */
export const getExchangedTokenFromAPI = (token: string) => {
  /* eslint-disable camelcase */
  const body = {
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    client_id: authConfig.CLIENT_ID,
    client_secret: authConfig.CLIENT_SECRET,
    assertion: token,
    requested_token_use: "on_behalf_of",
    scope: authConfig.BULK_BACKEND_SCOPE,
  };
  /* eslint-enable camelcase */
  return fromAPIJson<OBOExchangeResponse>({
    url: authConfig.TOKEN_ENDPOINT,
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": new URLSearchParams(body).toString().length.toString(),
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    bodyFunc: (body: any) => new URLSearchParams(body).toString(),
    body,
  });
};

export type AzureAdOpenIdConfig = {
  jwks_uri: string;
  issuer: string;
  token_endpoint: string;
  authorization_endpoint: string;
};
// TODO: dont fetch this config every time you verify a token
export function getAzureAdConfig() {
  try {
    return fromAPIJson<AzureAdOpenIdConfig>({
      url: authConfig.AZURE_APP_WELL_KNOWN_URL,
      method: "GET",
    });
  } catch {
    return null;
  }
}

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
export async function getPublicJwk(kid: string) {
  const azureAdConfig = await getAzureAdConfig();
  if (azureAdConfig === null) return null;

  try {
    const jwks = await fromAPIJson<JwksResponse>({
      // eslint-disable-next-line camelcase
      url: azureAdConfig.jwks_uri,
      method: "GET",
    });
    return jwks.keys.filter((jwk) => jwk.kid === kid)[0] ?? null;
  } catch {
    return null;
  }
}

/**
 * Forward requests without throwing errors
 *
 * @param req
 * @param res
 * @param additionalHeaders
 * @returns
 */
export const forwardRequest = async (req: NextApiRequest, headers: HeadersInit) => {
  if (req.url === undefined) return null;
  const path = req.url.split("/").splice(3).join("/");
  req.headers.cookie = "";
  let response;
  try {
    response = await fetch(`${BACKEND_URL_PROXY}/${path}`, {
      method: req.method,
      headers: headers,
      body: JSON.stringify(req.body),
    });
  } catch (e) {
    logger.error(`Error forwarding request: ${e}`);
    return null;
  }

  return { data: await response.blob(), status: response.status };
};
