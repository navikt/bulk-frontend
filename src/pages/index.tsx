import { Attachment, Notes } from "@navikt/ds-icons";
import { Button, ErrorMessage } from "@navikt/ds-react";
import { NextPage } from "next/types";
import { useState } from "react";
import CondiditionCheckbox from "../components/ConditionCheckbox";
import InputPnr from "../components/InputPnr";
import PageContainer from "../components/PageContainer";
import ObjectTable from "../components/PeopleTable";
import TabComponent, { TabIndex } from "../components/TabComponent";
import UploadFile from "../components/UploadFile";
import { MAX_DATA_RENDERING_SIZE } from "../helpers/constants";
import { useRequestPeople } from "../helpers/hooks";

const Main: NextPage = () => {
  const [inputPnrs, setInputPnrs] = useState<string[]>([]);
  const [filePnrs, setFilePnrs] = useState<string[]>([]);
  const [showTableChecked, setShowTableChecked] = useState(false);
  const [selectedTab, setSelectedTab] = useState<TabIndex>("ComponentOne");
  const { data, fetchPeople, isFetching, error } = useRequestPeople(
    selectedTab == "ComponentOne" ? filePnrs : inputPnrs,
  );
  const showTableCondition = (data?.length ?? 0) <= MAX_DATA_RENDERING_SIZE;

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
            <TabComponent
              onChange={(tab: TabIndex) => setSelectedTab(tab)}
              labelOne="Last opp fil"
              iconOne={<Attachment title="last opp fil" />}
              ComponentOne={
                <UploadFile onFileChanged={(personnumre) => setFilePnrs(personnumre)} />
              }
              labelTwo="Skriv inn"
              iconTwo={<Notes title="skriv inn" />}
              ComponentTwo={<InputPnr onInputChange={(personnumre) => setInputPnrs(personnumre)} />}
            />
          </div>
          <Button type="button" loading={isFetching} onClick={fetchPeople} className="mt-8">
            Utfør uttrekk
          </Button>
          <CondiditionCheckbox
            title="Vis tabell"
            condition={showTableCondition}
            errorMessage="Tabell var for stor til å kunne vises her."
            onChange={(checked) => setShowTableChecked(checked)}
          />
          <ErrorMessage className="mt-2">{error && `* ${error}`}</ErrorMessage>
          <br />
        </div>
        {showTableCondition && showTableChecked && <ObjectTable table={data} />}
      </>
    </PageContainer>
  );
};

export default Main;
