import { useCallback, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getPeopleFromAPI } from "./requests";

export const useRequestPeople = (inputPnrs: string[], filePnrs: string[]) => {
  const [returnedError, setReturnedError] = useState<unknown | undefined>(undefined);

  const requestPeople = useCallback(() => {
    setReturnedError(undefined);
    const pnrs = filePnrs.length === 0 ? inputPnrs : filePnrs;
    const filteredPnrs = pnrs.filter((nummer: string) => !isNaN(+nummer) && nummer !== "");
    if (filteredPnrs.length === 0) {
      setReturnedError("Ingen av de oppgitte personidentene er gyldige.");
      return;
    }
    return getPeopleFromAPI(filteredPnrs);
  }, [inputPnrs, filePnrs, setReturnedError]);

  const { data, isFetching, isError, error, refetch } = useQuery("hello-world", requestPeople, {
    enabled: false,
  });

  const fetchPeople = useCallback(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (isError) setReturnedError(error);
  }, [isError, error, setReturnedError]);

  return { data, fetchPeople, isFetching, error: returnedError };
};
