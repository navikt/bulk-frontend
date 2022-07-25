import { Button, ErrorMessage } from "@navikt/ds-react";
import { NextPage } from "next/types";
import { useState } from "react";
import CondiditionCheckbox from "../components/ConditionCheckbox";
import InputPnr from "../components/InputPnr";
import PageContainer from "../components/PageContainer";
import ObjectTable from "../components/PeopleTable";
import UploadFile from "../components/UploadFile";
import { MAX_DATA_RENDERING_SIZE } from "../lib/constants";
import { useRequestPeople } from "../lib/hooks";

const Main: NextPage = () => {
  const [inputPnrs, setInputPnrs] = useState<string[]>([]);
  const [filePnrs, setFilePnrs] = useState<string[]>([]);
  const [showTableChecked, setShowTableChecked] = useState(false);
  const { data, fetchPeople, isFetching, error } = useRequestPeople(inputPnrs, filePnrs);

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
          <div className="flex flex-col mt-8">
            <UploadFile onFileChanged={(personnumre) => setFilePnrs(personnumre)} />
            <InputPnr onInputChange={(personnumre) => setInputPnrs(personnumre)} />
          </div>
          <Button type="button" loading={isFetching} onClick={fetchPeople} className="mt-6">
            Utfør uttrekk
          </Button>
          <CondiditionCheckbox
            title="Vis tabell"
            condition={(data?.length ?? 0) <= MAX_DATA_RENDERING_SIZE}
            errorMessage="Tabell var for stor til å kunne vises her."
            onChange={(checked) => setShowTableChecked(checked)}
          />
          <ErrorMessage className="mt-2">{error && `* ${error}`}</ErrorMessage>
          <br />
        </div>
        {data && showTableChecked && <ObjectTable table={data} />}
      </>
    </PageContainer>
  );
};

export default Main;
