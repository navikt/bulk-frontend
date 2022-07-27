import { saveAs } from "file-saver";
import { authConfig, BACKEND_URL } from "./constants";
import { AzureAdOpenIdConfig, OBOExchangeResponse, PublicJwk } from "./types";

type FromAPIArgs = {
  url: string;
  method: "GET" | "POST" | "DELETE" | "PUT";
  body?: unknown;
  headers?: HeadersInit;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bodyFunc?: (body: any) => string;
};

export async function fromAPIGeneral(args: FromAPIArgs) {
  const { url, method, body, headers, bodyFunc } = args;
  const thisBodyFunc = !bodyFunc ? JSON.stringify : bodyFunc;

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json", ...headers },
    body: thisBodyFunc(body),
  });

  if (!res.ok)
    throw new Error(
      `Request failed with code: ${res.status}, message: ${res.statusText}, ${await res.text()}`,
    );
  return res;
}

export async function fromAPIJson<ResponseType>(args: FromAPIArgs) {
  const res = await fromAPIGeneral(args);
  return (await res.json()) as ResponseType;
}

export async function fromAPIString(args: FromAPIArgs) {
  const res = await fromAPIGeneral(args);
  return await res.text();
}

export async function fromAPIBlob(args: FromAPIArgs) {
  const res = await fromAPIGeneral(args);
  return await res.blob();
}

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
      //Host: "login.microsoftonline.com/966ac572-f5b7-4bbe-aa88-c76419c0f851",
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    bodyFunc: (body: any) => new URLSearchParams(body).toString(),
    body,
  });
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

export async function getPublicJwk(kid: string) {
  try {
    return fromAPIJson<PublicJwk[]>({
      // eslint-disable-next-line camelcase
      url: ((await getAzureAdConfig()) || { jwks_uri: "" }).jwks_uri,
      method: "GET",
    });
  } catch {
    return null;
  }
}
