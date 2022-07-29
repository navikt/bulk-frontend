import { Maybe } from "monet";
import { NextApiRequest, NextApiResponse } from "next";
import logger from "../../../helpers/logger";
import {
  forwardRequest,
  ForwardRequestResponse,
  getExchangedTokenFromAPI,
} from "../../../server/requests";
import isValidToken from "../../../server/tokenValidation";

const toPromise = <T>(value: T): Promise<T> => new Promise((res) => res(value));

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const token = Maybe.fromNull(req.headers.authorization).bind((authHeader) =>
    Maybe.fromUndefined(authHeader.split(" ")[1]),
  );
  const validToken = await token.fold(toPromise(false))((token) => isValidToken(token));
  if (!validToken) return res.status(401).end();

  const typeUsed = req.query.type ?? "json";

  // let exchangedToken;
  // try {
  //   exchangedToken = await getExchangedTokenFromAPI(token);
  // } catch (e) {
  //   logger.error(`Error exchanging token ${e}`);
  //   return res.status(500).end();
  // }
  // const personerResponsee = await forwardRequest(req, {
  //   "content-type": "application/json",
  //   authorization: `${exchangedToken.token_type} ${exchangedToken.access_token}`,
  // });

  const personerResponse = await token
    .bind((token) => {
      let exchangedToken;
      try {
        exchangedToken = getExchangedTokenFromAPI(token);
      } catch (err) {
        logger.error(`Error exchanging token ${err}`);
        exchangedToken = null;
      }
      return Maybe.fromNull(exchangedToken);
    })
    .fold(toPromise<ForwardRequestResponse | null>(null))(async (exTokenn) => {
    const exToken = await exTokenn;
    return await forwardRequest(req, {
      "content-type": "application/json",
      authorization: `${exToken.token_type} ${exToken.access_token}`,
    });
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
