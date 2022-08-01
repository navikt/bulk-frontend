import { useCallback, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { WonderwallJwtPayload } from "../server/tokenValidation";
import { getAuthToken, getPeopleAsCSVFromAPI } from "./requests";
import { csvToArrayOfObjects, parseJwt } from "./utils";

/**
 * Hook to handle the request of people
 * @param inputPnrs The list of strings, each intended as pnr. This array is filtered upon making the request to only contain numbers.
 * @returns An object containing the response data, function to fetch, if it is currenctly fetching, and the error object (if any).
 * @remarks The request is sent with the filePnrs as input if that array is not empty, otherwise inputPnrs is used.
 */
export const useRequestPeople = (inputPnrs: string[]) => {
  const [returnedError, setReturnedError] = useState<unknown | undefined>(undefined);

  // The function to send the request filtering the appropriate array of pnrs if invalid pnrs.
  const requestPeople = useCallback(() => {
    setReturnedError(undefined);
    const filteredPnrs = inputPnrs.filter((nummer: string) => !isNaN(+nummer) && nummer !== "");

    if (filteredPnrs.length === 0) {
      setReturnedError("Ingen av de oppgitte personidentene er gyldige.");
      return undefined;
    }

    return getPeopleAsCSVFromAPI(filteredPnrs)
      .then((res) => res.text())
      .then((string) => csvToArrayOfObjects(string));
  }, [inputPnrs, setReturnedError]);

  // use react-query to fetch the data
  const { data, isFetching, isError, error, refetch } = useQuery("requestPeople", requestPeople, {
    enabled: false,
  });

  // Function to fetch people
  const fetchPeople = useCallback(() => {
    refetch();
  }, [refetch]);

  // Set error message to the react-query error message only if there is an error
  useEffect(() => {
    if (isError) setReturnedError(error);
  }, [isError, error, setReturnedError]);

  return { data, fetchPeople, isFetching, error: returnedError };
};

/**
 * Hook to get the contents of the jwt access token as a javascript object.
 * @returns The WonderwallJwtPayload which is the contents of the jwt.
 */
export const useAuthPayload = (): WonderwallJwtPayload | null => {
  const { data } = useQuery("authpayload", getAuthToken, {
    staleTime: 1000 * 3600 * 24, // 24 Hours
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  return parseJwt(data || null);
};
