import { Button, Heading, Loader } from "@navikt/ds-react";
import { NextPage } from "next/types";
import { useState } from "react";
import { useQuery } from "react-query";
import InputPnr from "../components/InputPnr";
import PageContainer from "../components/PageContainer";
import PeopleTable from "../components/PeopleTable";
import UploadFile from "../components/UploadFile";
import { useRequestPeople } from "../lib/hooks";
import { getIsAliveFromAPI } from "../lib/requests";

const Main: NextPage = () => {
  const [inputPnrs, setInputPnrs] = useState<string[]>([]);
  const [filePnrs, setFilePnrs] = useState<string[]>([]);
  const { data, fetchPeople, isFetching } = useRequestPeople(inputPnrs, filePnrs);
  const { data: isAliveText } = useQuery("isalive", getIsAliveFromAPI);
  return (
    <PageContainer
      title="Bulk-uttrekk"
      ingress="Denne applikasjonen lar deg hente ut kontaktinformasjon fra KRR for en stor mengde personer."
      description="Legg inn ett personnummer per linje i tekstfeltet under eller last opp en fil med et personnummer per linje (.txt eller .csv).
      Dersom du fyller inn både tekstfeltet og laster opp en fil, vil bare filen prosesseres. Tabelloverskrifter som ikke er tall blir ignorert. 
      Resultatet vises frem i en tabell og lastes ned automatisk som en .csv fil."
    >
      <>
        <div>
          <Heading level="1" size="xlarge">
            {isAliveText}
          </Heading>
          <div className="flex">
            <InputPnr onInputChange={(personnumre) => setInputPnrs(personnumre)} />
            <UploadFile
              onFileChanged={(personnumre) => {
                setFilePnrs(personnumre);
              }}
            />
          </div>
          <Button type="button" onClick={fetchPeople} className="mt-6">
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
