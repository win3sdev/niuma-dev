import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const entries = await prisma.surveyEntry.findMany({
      where: {
        reviewStatus: 'approved',
      },
      orderBy: {
        submittedAt: 'desc',
      },
    });

    res.status(200).json(entries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load survey data' });
  }
}