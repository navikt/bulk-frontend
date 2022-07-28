import { NextApiRequest, NextApiResponse } from "next";
import { BACKEND_URL_PROXY } from "../../../helpers/constants";
import logger from "../../../helpers/logger";
import { getExchangedTokenFromAPI } from "../../../helpers/requests";
import isValidToken from "../../../helpers/tokenValidation";

/**
 * Forward requests without throwing errors
 *
 * @param req
 * @param res
 * @param additionalHeaders
 * @returns
 */
const forwardRequest = async (req: NextApiRequest, headers: HeadersInit) => {
  if (req.url === undefined) return null;
  const path = req.url.split("/").splice(3).join("/");
  req.headers.cookie = "";
  let response;
  try {
    response = await fetch(`${BACKEND_URL_PROXY}/${path}`, {
      method: req.method,
      headers: headers,
      body: JSON.stringify(req.body),
    });
  } catch (e) {
    logger.error(`Error forwarding request: ${e}`);
    return null;
  }

  return { data: await response.blob(), status: response.status };
};

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const thisToken = req.headers.authorization ?? "";
  const token = thisToken.split(" ")[1];
  if (!(await isValidToken(token))) return res.status(401).end();

  const { type } = req.query;
  const typeUsed = type ?? "json";

  let exhangedToken;
  try {
    exhangedToken = await getExchangedTokenFromAPI(token);
  } catch (e) {
    logger.error(`Error exchanging token ${e}`);
    return res.status(500).end();
  }
  const personerResponse = await forwardRequest(req, {
    "content-type": "application/json",
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
