import { BACKEND_URL } from "./constants";
import { HelloResponse } from "./types";

export const getHelloFromAPI = () => {
  //return fetch(`${getEnv("BACKEND_URL")}/`).then((data) =>
  return fetch(`${BACKEND_URL}/`).then((data) =>
    data.json()
  ) as Promise<HelloResponse>;
};
