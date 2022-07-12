import { Button, Textarea } from "@navikt/ds-react";
import { NextPage } from "next/types";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useQuery } from "react-query";
import PageContainer from "../components/PageContainer";
import { getPeople } from "../lib/requests";

const Main: NextPage = () => {
  const { data, isLoading, isError, error, refetch } = useQuery("hello-world", getPeople, {
    enabled: false,
  });
  const [personnumre, setPersonnumre] = useState("");

  const onRequestClick = useCallback(() => {
    refetch();
  }, []);

  const onPersonnumreChanged = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      const valueFiltered = value.match(/[0-9\n]+/g)?.join("");
      setPersonnumre(valueFiltered ?? "");
    },
    [setPersonnumre],
  );

  useEffect(() => {
    console.log(personnumre);
  }, [personnumre]);

  return (
    <PageContainer
      title="Bulk-uttrekk"
      ingress="Denne applikasjonen lar deg hente ut kontaktinformasjon fra KRR for en stor mengde personer."
      description="Legg inn ett personnummer per linje i tekstfeltet under eller last opp en fil med et personnummer per linje (.txt eller .csv).
      Dersom du fyller inn både tekstfeltet og laster opp en fil, vil bare filen prosesseres. 
      Resultatet vises frem i en tabell og lastes ned automatisk som en .csv fil."
    >
      <>
        <Textarea
          label="Oppgi personnumre"
          size="medium"
          description="Her kan du fylle inn personnumre"
          className="w-1/3"
          value={personnumre}
          onChange={onPersonnumreChanged}
        />
        <Button type="button" onClick={onRequestClick}>
          Send forespørsel
        </Button>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </>
    </PageContainer>
  );
};

export default Main;
