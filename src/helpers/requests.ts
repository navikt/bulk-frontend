import { saveAs } from "file-saver";
import { fromAPIBlob, fromAPIJson, FromAPIArgs, fromAPIString } from "../lib/fromapi";
import { authConfig, BACKEND_URL } from "./constants";

const getPeopleArgs = (personidenter: string[], responseFormat: "json" | "csv" = "csv") =>
  ({
    url: `${BACKEND_URL}/personer?` + new URLSearchParams({ type: responseFormat }),
    method: "POST",
    body: {
      personidenter: personidenter,
    },
  } as FromAPIArgs);

export const getPeopleFromAPI = <ResponseType>(personidenter: string[]) => {
  const args = getPeopleArgs(personidenter, "json");
  return fromAPIJson<ResponseType>({ ...args });
};

export const getPeopleAsCSVFromAPI = async (personidenter: string[], saveFile = true) => {
  const args = getPeopleArgs(personidenter, "csv");
  const res = await fromAPIBlob({ ...args });
  if (saveFile) saveAs(res, "persondata.csv");
  return res;
};

export type Person = {
  personident: string;
  spraak?: string;
  epostadresse?: string;
  mobiltelefonnummer: string;
  adresse?: string;
  leverandoerAdresse?: string;
  leverandoerSertifikat?: string;
};

export enum FeilType {
  KAN_IKKE_VARSLES = "kan_ikke_varsles",
  PERSON_IKKE_FUNNET = "person_ikke_funnet",
  UTDATERT_KONTAKTINFORMASJON = "utdatert_kontaktinformasjon",
  STREGNT_FORTROLIG_ADRESSE = "stregnt_fortrolig_adresse",
  STRENGT_FORTROLIG_UTENLANDSK_ADRESSE = "strengt_fortrolig_utenlandsk_adresse",
  FORTROLIG_ADRESSE = "fortrolig_adresse",
  SKJERMET = "skjermet",
}

export type PersonData = {
  person: Person | null;
  feil: FeilType | null;
};

export type KRRResponse = {
  personer: {
    [personident: string]: PersonData;
  };
};

export const getIsAliveFromAPI = () => {
  return fromAPIString({
    url: `${BACKEND_URL}/isalive`,
    method: "GET",
  });
};

export function getAuthToken() {
  try {
    return fromAPIString({
      url: "/api/auth",
      method: "GET",
    });
  } catch (e) {
    return null;
  }
}

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
