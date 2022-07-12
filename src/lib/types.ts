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
  KAN_IKKE_VARSLES = "KAN_IKKE_VARSLES",
  PERSON_IKKE_FUNNET = "PERSON_IKKE_FUNNET",
  UTDATERT_KONTAKTINFORMASJON = "UTDATERT_KONTAKTINFORMASJON",
  STREGNT_FORTROLIG_ADRESSE = "STREGNT_FORTROLIG_ADRESSE",
  STRENGT_FORTROLIG_UTENLANDSK_ADRESSE = "STRENGT_FORTROLIG_UTENLANDSK_ADRESSE",
  FORTROLIG_ADRESSE = "FORTROLIG_ADRESSE",
  SKJERMET = "SKJERMET",
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
