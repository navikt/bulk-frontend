import { NextApiRequest, NextApiResponse } from "next";

const isready = (_req: NextApiRequest, res: NextApiResponse) => {
    return res.status(200).end("Ready")
}

export default isready;