import { Button, Loader } from "@navikt/ds-react";
import { NextPage } from "next/types";
import { useState } from "react";
import InputPnr from "../components/InputPnr";
import PageContainer from "../components/PageContainer";
import PeopleTable from "../components/PeopleTable";
import UploadFile from "../components/UploadFile";
import { useRequestPeople } from "../lib/hooks";

const Main: NextPage = () => {
  const [inputPnrs, setInputPnrs] = useState<string[]>([]);
  const [filePnrs, setFilePnrs] = useState<string[]>([]);
  const { data, fetchPeople, isFetching } = useRequestPeople(inputPnrs, filePnrs);
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
          <InputPnr onInputChange={(personnumre) => setInputPnrs(personnumre)} />
          <UploadFile
            onFileChanged={(personnumre) => {
              setFilePnrs(personnumre);
            }}
          />
          <Button type="button" onClick={fetchPeople} className="mt-6">
            Utfør uttrekk
          </Button>
          {/* <Button type="button" onClick={onCheckIsAlive} className="mt-6">
            Check isAlive
          </Button> */}
          <br />
          {isFetching && <Loader className="mt-4" variant="interaction" size="3xlarge" />}
        </div>
        {data && <PeopleTable peopleResponse={data} />}
      </>
    </PageContainer>
  );
};

export default Main;
