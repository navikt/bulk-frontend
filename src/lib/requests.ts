import { saveAs } from "file-saver";
import { BACKEND_URL } from "./constants";
import { KRRResponse } from "./types";

type FromAPIArgsCommon = {
  url: string;
  method: "GET" | "POST" | "DELETE" | "PUT";
  body?: unknown;
  headers?: HeadersInit;
};

type ResponseFormatJson = {
  responseFormat: "json";
};

type ResponseFormatBlob = {
  responseFormat: "blob";
};

type ResponseFormatText = {
  responseFormat: "text";
};

type FromAPIArgs = FromAPIArgsCommon &
  (ResponseFormatJson | ResponseFormatText | ResponseFormatBlob);

type FromAPIJson<ResponseType> = (
  args: FromAPIArgsCommon & ResponseFormatJson,
) => Promise<ResponseType>;

type FromAPIText = (args: FromAPIArgsCommon & ResponseFormatText) => Promise<string>;

type FromAPIBlob = (args: FromAPIArgsCommon & ResponseFormatBlob) => Promise<Blob>;

type FromAPI<ResponseType> = FromAPIJson<ResponseType> | FromAPIText | FromAPIBlob;

async function fromAPI<ResponseType>(args: FromAPIArgs) {
  const fromAPIInner: FromAPI<ResponseType> = async (args: FromAPIArgs) => {
    const { url, method, body, headers, responseFormat } = args;
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify(body),
    });
    if (!res.ok)
      throw new Error(`Request failed with code: ${res.status}, message: ${res.statusText}`);
    switch (responseFormat) {
      case "json":
        return res.json();
      case "blob":
        return res.blob();
      case "text":
        return res.text();
      default:
        throw new Error(`Unsupported request type ${responseFormat}`);
    }
  };
  return await fromAPIInner(args as never);
}

function getPeopleGeneralFromAPI<ResponseType>(
  personidenter: string[],
  responseFormat: "json" | "csv" = "json",
) {
  return fromAPI<ResponseType>({
    url: `${BACKEND_URL}/personer?` + new URLSearchParams({ type: responseFormat }),
    method: "POST",
    body: {
      personidenter: personidenter,
    },
    responseFormat: responseFormat === "json" ? "json" : "blob",
  }) as Promise<Blob | ResponseType>;
}

export const getPeopleFromAPI = (personidenter: string[]) => {
  return getPeopleGeneralFromAPI<KRRResponse>(personidenter) as Promise<KRRResponse>;
};

export const getPeopleAsCSVFromAPI = async (personidenter: string[]) => {
  const res = await getPeopleGeneralFromAPI<Blob>(personidenter, "csv");
  saveAs(res, "persondata.csv");
  return res;
};

export const getIsAliveFromAPI = () => {
  return fetch(`${BACKEND_URL}/isalive`, {
    method: "GET",
  }).then((res) => res.text());
};
