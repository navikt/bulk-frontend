import { NextApiRequest, NextApiResponse } from "next";
import logger from "../../../helpers/logger";
import { forwardRequest, getExchangedTokenFromAPI } from "../../../server/requests";
import isValidToken from "../../../server/tokenValidation";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  // Validate token
  const token = req.headers.authorization?.split(" ")[1];
  const type = (req.query.type ?? "json") as string;
  if (token === undefined || !(await isValidToken(token))) return res.status(401).end();

  // Exchange token
  let exhangedToken;
  try {
    exhangedToken = await getExchangedTokenFromAPI(token);
  } catch (e) {
    logger.error(`Error exchanging token ${e}`);
    return res.status(500).end();
  }

  // Forward request
  const personerResponse = await forwardRequest(req, {
    "content-type": "application/json",
    authorization: `${exhangedToken.token_type} ${exhangedToken.access_token}`,
  });
  if (personerResponse === null) return res.status(500).end();
  const data = await personerResponse.data.text();
  res.setHeader("content-type", type === "csv" ? "text/plain" : "application/json");
  return res.status(personerResponse.status).send(data);
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "50mb",
    },
    responseLimit: "50mb",
  },
};
