import { saveAs } from "file-saver";
import { BACKEND_URL } from "./constants";

type FromAPIArgs = {
  url: string;
  method: "GET" | "POST" | "DELETE" | "PUT";
  body?: unknown;
  headers?: HeadersInit;
};

async function fromAPIGeneral(args: FromAPIArgs) {
  const { url, method, body, headers } = args;
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
  if (!res.ok)
    throw new Error(`Request failed with code: ${res.status}, message: ${res.statusText}`);
  return res;
}

async function fromAPIJson<ResponseType>(args: FromAPIArgs) {
  const res = await fromAPIGeneral(args);
  return (await res.json()) as ResponseType;
}

async function fromAPIString(args: FromAPIArgs) {
  const res = await fromAPIGeneral(args);
  return await res.text();
}

async function fromAPIBlob(args: FromAPIArgs) {
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
