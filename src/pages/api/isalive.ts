import { NextApiRequest, NextApiResponse } from "next";

const isalive = (_req: NextApiRequest, res: NextApiResponse) => {
  return res.status(200).end("Alive");
};

export default isalive;
