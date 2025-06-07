import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const raw = await prisma.surveyEntry.findMany({
      where: { reviewStatus: "approved" },
      select: { overtimePay: true },
    });

    const counter: Record<string, number> = {};
    for (const { overtimePay } of raw) {
      const key = overtimePay?.trim() || "未知";
      counter[key] = (counter[key] || 0) + 1;
    }

    const chartData = Object.entries(counter)
      .sort((a, b) => b[1] - a[1]) // 按数量从高到低排序
      .slice(0, 3)
      .map(([name, value]) => ({ name, value }));

    res.status(200).json(chartData);
  } catch (error) {
    console.error("获取 overtimePay 数据失败", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
