import { Button, Textarea } from "@navikt/ds-react";
import { NextPage } from "next/types";
import { ChangeEvent, useCallback, useState } from "react";
import { useQuery } from "react-query";
import PageContainer from "../components/PageContainer";
import PeopleTable from "../components/PeopleTable";
import { getPeople } from "../lib/requests";

const Main: NextPage = () => {
  const [personnumre, setPersonnumre] = useState("");

  const requestPeople = useCallback(() => {
    return getPeople(
      personnumre.split("\n").filter((nummer: string) => !isNaN(+nummer) && nummer !== ""),
    );
  }, [personnumre]);

  const { data, isLoading, isError, error, refetch } = useQuery("hello-world", requestPeople, {
    enabled: false,
  });

  const onRequestClick = useCallback(() => {
    refetch();
  }, [refetch]);

  const onPersonnumreChanged = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      const valueFiltered = value.match(/[0-9\n]+/g)?.join("");
      setPersonnumre(valueFiltered ?? "");
    },
    [setPersonnumre],
  );

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
          className="w-1/3 mt-4"
          value={personnumre}
          onChange={onPersonnumreChanged}
        />
        <Button type="button" onClick={onRequestClick} className="mt-6">
          Send forespørsel
        </Button>
        {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
        {data && <PeopleTable peopleResponse={data} />}
      </>
    </PageContainer>
  );
};

export default Main;
