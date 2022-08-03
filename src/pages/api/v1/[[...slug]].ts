import { NextApiRequest, NextApiResponse } from "next";
import logger from "../../../helpers/logger";
import {
  forwardRequest,
  getExchangedTokenFromAPI,
  OBOExchangeResponse,
} from "../../../server/requests";
import isValidToken from "../../../server/tokenValidation";

enum TokenStatus {
  INVALID_TOKEN,
  ERROR_EXCHANGING_TOKEN,
  NO_TOKEN_NEEDED,
}

const isOBOToken = (value: TokenStatus | OBOExchangeResponse): value is OBOExchangeResponse => {
  return typeof value === "object";
};

const getCorrectBearerToken = async (req: NextApiRequest) => {
  if (process.env.NODE_ENV === "development") return TokenStatus.NO_TOKEN_NEEDED;
  // Validate token
  const token = req.headers.authorization?.split(" ")[1];
  if (token === undefined || !(await isValidToken(token))) return TokenStatus.INVALID_TOKEN;

  // Exchange token
  let exhangedToken;
  try {
    exhangedToken = await getExchangedTokenFromAPI(token);
  } catch (e) {
    logger.error(`Error exchanging token ${e}`);
    return TokenStatus.ERROR_EXCHANGING_TOKEN;
  }
  return exhangedToken;
};

export default async function (req: NextApiRequest, res: NextApiResponse) {
  // Validate token
  let headers = {};
  const result = await getCorrectBearerToken(req);
  if (isOBOToken(result))
    headers = { authorization: `${result.token_type} ${result.access_token}` };
  else if (result === TokenStatus.INVALID_TOKEN) return res.status(401).end();
  else if (result === TokenStatus.ERROR_EXCHANGING_TOKEN) return res.status(500).end();
  // Forward request
  const personerResponse = await forwardRequest(req, {
    "content-type": "application/json",
    ...headers,
  });
  if (personerResponse === null) return res.status(500).end();
  const data = await personerResponse.data.text();
  const type = (req.query.type ?? "json") as string;
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
