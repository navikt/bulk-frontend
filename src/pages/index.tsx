import { Button } from "@navikt/ds-react";
import { NextPage } from "next/types";
import { useCallback } from "react";
import { useQuery } from "react-query";
import PageContainer from "../components/PageContainer";
import { getPeople } from "../lib/requests";

const Main: NextPage = () => {
  const { data, isLoading, isError, error, refetch } = useQuery("hello-world", getPeople, {
    enabled: false,
  });

  const onRequestClick = useCallback(() => {
    refetch();
  }, []);

  return (
    <PageContainer title="Bulk-uttrekk" description="En nydelig tjeneste fra NAV">
      <>
        <Button onClick={onRequestClick}>Send forespørsel</Button>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </>
    </PageContainer>
  );
};

export default Main;
