export type HelloResponse = {
  message: string;
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

export type WonderwallJwtPayload = {
  aud: string;
  iss: string;
  iat: number;
  nbf: number;
  exp: number;
  aio: string;
  azp: string;
  azpacr: string;
  groups: string[];
  name: string;
  oid: string;
  preferred_username: string;
  rh: string;
  scp: string;
  sub: string;
  tid: string;
  uti: string;
  ver: string;
};
