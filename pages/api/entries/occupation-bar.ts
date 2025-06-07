import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 查询审核通过的条目，只选 occupation 字段
    const raw = await prisma.surveyEntry.findMany({
      where: { reviewStatus: "approved" },
      select: { occupation: true },
    });

    // 统计各职业出现次数
    const counter: Record<string, number> = {};
    for (const { occupation } of raw) {
      const key = occupation?.trim() || "未知";
      counter[key] = (counter[key] || 0) + 1;
    }

    // 按数量降序排序，限制只显示前15个
    const sortedData = Object.entries(counter)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 25)
      .map(([name, value]) => ({ name, value }));

    res.status(200).json(sortedData);
  } catch (error) {
    console.error("获取 occupation 数据失败", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
