import { NextPage } from "next/types";
import { useCallback } from "react";
import { useQuery } from "react-query";
import { getHelloFromAPI } from "../lib/requests";

const Main: NextPage = () => {
  const { data, isLoading, isError, error, refetch } = useQuery(
    "hello-world",
    getHelloFromAPI,
    {
      enabled: false,
    }
  );

  const onRequestClick = useCallback(() => {
    refetch();
  }, []);

  return (
    <>
      <button onClick={onRequestClick}>Send forespørsel</button>
      <div>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </>
  );
};

export default Main;
