import { NextApiRequest, NextApiResponse } from "next";

const auth = (req: NextApiRequest, res: NextApiResponse) => {
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).send(null);
  return res.status(200).send(authorization.substring(7));
};

export default auth;
