import { NextApiRequest, NextApiResponse } from "next";
import { BACKEND_URL_PROXY } from "../../../lib/constants";

const catchAll = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.url === undefined) return res;

  const path = req.url.split("/").splice(3).join("/");
  const token = req.headers.authorization ?? "";
  const { type } = req.query;
  const typeUsed = type ?? "json";

  const personerResponse = await fetch(`${BACKEND_URL_PROXY}/${path}`, {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req.body),
  });
  const data = await (await personerResponse.blob()).text();
  res.setHeader("Content-type", typeUsed === "csv" ? "text/plain" : "application/json");

  return res.status(personerResponse.status).send(data);
};

export default catchAll;

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
    responseLimit: "10mb",
  },
};
