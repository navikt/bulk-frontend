import { BACKEND_URL } from "./constants";
import { HelloResponse } from "./types";

export const getHelloFromAPI = () => {
  //return fetch(`${getEnv("BACKEND_URL")}/`).then((data) =>
  return fetch(`${BACKEND_URL}/`).then((data) => data.json()) as Promise<HelloResponse>;
};

export const getIsAlive = () => {
  return fetch(`${BACKEND_URL}/isalive`).then((res) => res.text());
};

export const getPeople = () => {
  return fetch(`${BACKEND_URL}/personer`, {
    method: "POST",
    // mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ personidenter: ["1233"] }),
  }).then((res) => res.json());
};
