import { saveAs } from "file-saver";
import { v4 as uuidv4 } from "uuid";
import { FromAPIArgs, fromAPIBlob, fromAPIJson, fromAPIString } from "../lib/fromapi";
import { BACKEND_URL } from "./constants";

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
const getPeopleArgs = (personidenter: string[], responseFormat: "json" | "csv" = "csv") =>
  ({
    url: `${BACKEND_URL}/personer?` + new URLSearchParams({ type: responseFormat }),
    method: "POST",
    headers: { "nav-call-id": uuidv4() },
    body: {
      personidenter: personidenter,
    },
  } as FromAPIArgs);

export const getPeopleFromAPI = (personidenter: string[]) => {
  const args = getPeopleArgs(personidenter, "json");
  return fromAPIJson<KRRResponse>({ ...args });
};

export const getPeopleAsCSVFromAPI = async (personidenter: string[], saveFile = true) => {
  const args = getPeopleArgs(personidenter, "csv");
  const res = await fromAPIBlob({ ...args });
  if (saveFile) saveAs(res, "persondata.csv");
  return res;
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
