import { BACKEND_URL } from "./constants";
import { KRRResponse } from "./types";
import { getCookie } from "./utils";

/**
 * Default fetch implementation.
 * @param url The url to send a request to.
 * @param method The requst method.
 * @param body The request body.
 * @returns An APIResponse containing the status of the response, if it is ok (200-299),
 * and the request data (or an error message if it not ok).
 */
async function fromAPI<ResponseType>(
  url: string,
  method: "GET" | "POST" | "DELETE" | "PUT",
  body?: unknown,
  header?: HeadersInit,
): Promise<ResponseType> {
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json", ...header },
    body: JSON.stringify(body),
  });
  if (!res.ok)
    throw new Error(`Request failed with code: ${res.status}, message: ${res.statusText}`);
  const data = (await res.json()) as ResponseType;
  return data;
}

export const getPeople = (personidenter: string[]) => {
  const authCookie = getCookie("AuthorizationCookie");
  const token = `Bearer ${authCookie}`;
  return fromAPI<KRRResponse>(
    `${BACKEND_URL}/personer`,
    "POST",
    {
      personidenter: personidenter,
    },
    { Authorization: token },
  );
};

export const getIsAliveFromAPI = () => {
  return fetch(`${BACKEND_URL}/isalive`, {
    method: "GET",
  }).then((res) => res.text());
};
