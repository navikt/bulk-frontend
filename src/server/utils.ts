import { PUBLIC_JWKS } from "./async-constants";

export async function getPublicJwk(kid: string) {
  const publicJwks = await PUBLIC_JWKS;
  return publicJwks.keys.filter((jwk) => jwk.kid === kid)[0] ?? null;
}
