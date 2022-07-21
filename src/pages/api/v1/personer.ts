import { NextApiRequest, NextApiResponse } from "next";
import { BACKEND_URL_PROXY } from "../../../lib/constants";

const catchAll = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.url === undefined) return res;

  const path = new URL(req.url).pathname.split("/").splice(3).join("/");
  const token = req.headers.authorization ?? "";
  const { type } = req.query;
  const typeUsed = type ?? "json";

  const personerResponse = (
    await fetch(`${BACKEND_URL_PROXY}/${path}?type=${typeUsed}`, {
      method: "POST",
      headers: {
        Authorization: token,
      },
      body: req.body,
    }).then((res) => res.blob())
  ).text();

  return res.status(200).send(personerResponse);
};

export default catchAll;
