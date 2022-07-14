import { Button, Loader } from "@navikt/ds-react";
import { NextPage } from "next/types";
import { useCallback, useState } from "react";
import { useQuery } from "react-query";
import InputPnr from "../components/InputPnr";
import PageContainer from "../components/PageContainer";
import PeopleTable from "../components/PeopleTable";
import { getPeople } from "../lib/requests";

const Main: NextPage = () => {
  const [personnumre, setPersonnumre] = useState<string[]>([]);

  const requestPeople = useCallback(() => {
    const filteredPnrs = personnumre.filter((nummer: string) => !isNaN(+nummer) && nummer !== "");
    if (filteredPnrs.length === 0) return; // TODO: SHOW ALERT;
    return getPeople(filteredPnrs);
  }, [personnumre]);

  const { data, isFetching, isError, error, refetch } = useQuery("hello-world", requestPeople, {
    enabled: false,
  });

  const onRequestClick = useCallback(() => {
    refetch();
  }, [refetch]);
  return (
    <PageContainer
      title="Bulk-uttrekk"
      ingress="Denne applikasjonen lar deg hente ut kontaktinformasjon fra KRR for en stor mengde personer."
      description="Legg inn ett personnummer per linje i tekstfeltet under eller last opp en fil med et personnummer per linje (.txt eller .csv).
      Dersom du fyller inn både tekstfeltet og laster opp en fil, vil bare filen prosesseres. 
      Resultatet vises frem i en tabell og lastes ned automatisk som en .csv fil."
    >
      <>
        <div>
          <InputPnr onInputDebounce={(personnumre) => setPersonnumre(personnumre)} />
          <Button type="button" onClick={onRequestClick} className="mt-6">
            Utfør uttrekk
          </Button>
          <br />
          {isFetching && <Loader className="mt-4" variant="interaction" size="3xlarge" />}
        </div>
        {data && <PeopleTable peopleResponse={data} />}
      </>
    </PageContainer>
  );
};

export default Main;
