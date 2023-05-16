// src/pages/api/test.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({ message: "API is working!" });
};
