import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import checkInputSecurity from "input-chars-guard";
// import { isIpBlacklisted } from "@/lib/blacklist";
import { isSuspiciousMouseTrack } from "@/utils/humanCheck";
const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, error: "Method Not Allowed" });
  }

  try {
    const data = req.body;

    // API健康检查
    if (data.test) {
      return res.status(200).json({ success: true, alive: true });
    }

    const { mouseTrack, ...formData } = data;



    const forwarded = req.headers["x-forwarded-for"];
    const ip =
      typeof forwarded === "string"
        ? forwarded.split(",")[0]
        : req.socket.remoteAddress || "";

    const userAgent = req.headers["user-agent"] || "";

    // UA检查
    const isValidUserAgent =
      typeof userAgent === "string" &&
      userAgent.length > 0 &&
      /(Mozilla|Chrome|Safari|Firefox|Edge|Opera)/i.test(userAgent);

    if (!isValidUserAgent) {
      return res.status(400).json({
        success: false,
        error: "非法的 User-Agent，禁止提交。",
      });
    }



    const surveyData = {
      ...formData,
      longWorkIssues: JSON.stringify(formData.longWorkIssues),
      violationsObserved: JSON.stringify(formData.violationsObserved),
      discriminationReasons: JSON.stringify(formData.discriminationReasons),
      expectedChanges: JSON.stringify(formData.expectedChanges),
      safetyKeyword: formData.safetyKeyword, // 字符串无需转换
      reviewStatus: "pending",
      reviewComment: null,
      ip: ip,
      userAgent: userAgent,
    };

    const result = await prisma.surveyEntry.create({
      data: surveyData,
    });
    // console.log(result)
    return res.status(200).json({ success: true, data: result });

    // console.log(surveyData);
    // const check_info = checkInputSecurity(surveyData);
    // if (check_info["isSafe"]) {
    //   const result = await prisma.schoolSurvey.create({
    //     data: surveyData,
    //   });
    //   return res.status(200).json({ success: true, data: result });
    // } else {
    //   return res
    //     .status(500)
    //     .json({ success: false, error: "Failed to submit survey" });
    // }
  } catch (error) {
    console.error("Error submitting survey:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to submit survey" });
  }
}
