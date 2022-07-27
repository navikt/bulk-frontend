import { decode, verify } from "jsonwebtoken";
import jwkToPem from "jwk-to-pem";
import { authConfig } from "./constants";
import logger from "./logger";
import { getAzureAdConfig, getPublicJwk } from "./requests";
import { WonderwallJwtPayload } from "./types";

function isValidGroupsClaim(decodedToken: WonderwallJwtPayload | null): boolean {
  return (
    decodedToken?.groups.some(
      (value) => value === authConfig.BULK_TEAM_ID_DEV || value === authConfig.BULK_TEAM_ID_PROD,
    ) ?? false
  );
}

export default async function isValidToken(accessToken: string) {
  const t = decode(accessToken, { complete: true });
  const kid = t?.header.kid;
  if (kid === undefined) return false;
  const azureAdConfig = await getAzureAdConfig();
  if (azureAdConfig === null) return false;
  let decoded;
  logger.info(authConfig.AZURE_APP_JWK);
  const publicJwt = await getPublicJwk(kid);
  if (publicJwt === null) return false;
  const secret = jwkToPem(publicJwt);
  console.log("SEECRET", secret);
  try {
    decoded = verify(accessToken, secret, {
      complete: false,
      algorithms: ["RS256"],
      audience: authConfig.CLIENT_ID,
      issuer: azureAdConfig.issuer,
      clockTimestamp: new Date().getTime() / 1000,
      clockTolerance: 0,
    }) as WonderwallJwtPayload;
  } catch (e) {
    console.log(e);
    return false;
  }

  return isValidGroupsClaim(decoded) && decoded.sub !== null;
}
