import { useCallback } from "react";
import { useQuery } from "react-query";
import { getPeople } from "./requests";

export const useRequestPeople = (inputPnrs: string[], filePnrs: string[]) => {
  const requestPeople = useCallback(() => {
    const pnrs = filePnrs.length === 0 ? inputPnrs : filePnrs;
    const filteredPnrs = pnrs.filter((nummer: string) => !isNaN(+nummer) && nummer !== "");
    if (filteredPnrs.length === 0) return; // TODO: SHOW ALERT;
    return getPeople(filteredPnrs);
  }, [inputPnrs, filePnrs]);

  const { data, isFetching, isError, error, refetch } = useQuery("hello-world", requestPeople, {
    enabled: false,
  });

  const fetchPeople = useCallback(() => {
    refetch();
  }, [refetch]);

  return { data, fetchPeople, isFetching };
};
