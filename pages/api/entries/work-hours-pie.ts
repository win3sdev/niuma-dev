import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const entries = await prisma.surveyEntry.findMany({
      select: { dailyWorkHours: true },
      where: { reviewStatus: "approved" },
    });

    const counts: Record<string, number> = {};

    entries.forEach(({ dailyWorkHours }) => {
      const value = dailyWorkHours?.trim();
      if (!value) return;
      counts[value] = (counts[value] || 0) + 1;
    });

    const result = Object.entries(counts).map(([name, value]) => ({
      name,
      value,
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error("work-hours-pie API error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
