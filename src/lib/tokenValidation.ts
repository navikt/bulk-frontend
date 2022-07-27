import { verify } from "jsonwebtoken";
import { authConfig } from "./constants";
import { getAzureAdConfig } from "./requests";
import { WonderwallJwtPayload } from "./types";

function isValidGroupsClaim(decodedToken: WonderwallJwtPayload | null): boolean {
  return (
    decodedToken?.groups.some(
      (value) => value === authConfig.BULK_TEAM_ID_DEV || value === authConfig.BULK_TEAM_ID_PROD,
    ) ?? false
  );
}

export default async function isValidToken(accessToken: string) {
  const azureAdConfig = await getAzureAdConfig();
  if (azureAdConfig === null) return false;

  let decoded;
  try {
    decoded = verify(accessToken, authConfig.AZURE_APP_JWK, {
      complete: false,
      algorithms: ["RS256"],
      audience: authConfig.CLIENT_ID,
      issuer: azureAdConfig.issuer,
    }) as WonderwallJwtPayload;
    console.log(decoded.aud);
  } catch {
    return false;
  }

  return isValidGroupsClaim(decoded) && decoded.sub;
}
