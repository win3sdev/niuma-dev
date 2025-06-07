import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const raw = await prisma.surveyEntry.findMany({
      where: { reviewStatus: "approved" },
      select: { companyType: true },
    });

    const counter: Record<string, number> = {};
    for (const { companyType } of raw) {
      const key = companyType?.trim() || "未知";
      counter[key] = (counter[key] || 0) + 1;
    }

    const chartData = Object.entries(counter)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({
        name,
        value,
      }));
    res.status(200).json(chartData);
  } catch (error) {
    console.error("获取 companyType 数据失败", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
