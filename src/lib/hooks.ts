import { useCallback, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getAuthToken, getPeopleAsCSVFromAPI } from "./requests";
import { WonderwallJwtPayload } from "./types";
import { csvToArrayOfObjects, parseJwt } from "./utils";

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
    return getPeopleAsCSVFromAPI(filteredPnrs)
      .then((res) => res.text())
      .then((string) => csvToArrayOfObjects(string));
    // getPeopleFromAPI(filteredPnrs);
  }, [inputPnrs, filePnrs, setReturnedError]);

  const { data, isFetching, isError, error, refetch } = useQuery("requestPeople", requestPeople, {
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

export const useAuthPayload = (): WonderwallJwtPayload => {
  const { data } = useQuery("auth", getAuthToken);
  return parseJwt(
    data ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
  );
};
