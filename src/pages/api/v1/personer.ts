import { NextApiRequest, NextApiResponse } from "next";
import { BACKEND_URL_PROXY } from "../../../lib/constants";
import { getExchangedTokenFromAPI } from "../../../lib/requests";
import isValidToken from "../../../lib/tokenValidation";

/**
 * Forward requests without throwing errors
 *
 * @param req
 * @param res
 * @param additionalHeaders
 * @returns
 */
const forwardRequest = async (
  req: NextApiRequest,
  res: NextApiResponse,
  additionalHeaders: HeadersInit,
) => {
  if (req.url === undefined) return null;
  const path = req.url.split("/").splice(3).join("/");
  let response;
  try {
    response = await fetch(`${BACKEND_URL_PROXY}/${path}`, {
      method: req.method,
      headers: { ...req.headers, ...additionalHeaders } as HeadersInit,
      body: JSON.stringify(req.body),
    });
  } catch (e) {
    return null;
  }

  return { data: await response.blob(), status: response.status };
};

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const thisToken = req.headers.authorization ?? "";
  const token = thisToken.split(" ")[1];
  if (!isValidToken(token)) return res.status(401).end();

  const { type } = req.query;
  const typeUsed = type ?? "json";

  let exhangedToken;
  try {
    exhangedToken = await getExchangedTokenFromAPI(token);
  } catch (e) {
    return res.status(500).end();
  }
  const personerResponse = await forwardRequest(req, res, {
    authorization: `${exhangedToken.token_type} ${exhangedToken.access_token}`,
  });
  if (personerResponse === null) return res.status(500).end();
  const data = await personerResponse.data.text();

  res.setHeader("Content-type", typeUsed === "csv" ? "text/plain" : "application/json");

  return res.status(personerResponse.status).send(data);
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
    responseLimit: "10mb",
  },
};
