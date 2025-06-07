/*
  Warnings:

  - You are about to drop the `SchoolSurvey` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "SchoolSurvey";

-- CreateTable
CREATE TABLE "SurveyEntry" (
    "id" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gender" TEXT NOT NULL,
    "ageRange" TEXT NOT NULL,
    "occupation" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "companySize" TEXT NOT NULL,
    "companyType" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "dailyWorkHours" DOUBLE PRECISION NOT NULL,
    "weeklyWorkDays" INTEGER NOT NULL,
    "overtimePay" TEXT NOT NULL,
    "punishmentForRefusal" TEXT NOT NULL,
    "longHoursIssues" TEXT,
    "discriminationReasons" TEXT,
    "violationsObserved" TEXT,
    "desiredChanges" TEXT,
    "story" TEXT,
    "safetyWord" TEXT NOT NULL,
    "reviewStatus" TEXT NOT NULL DEFAULT 'pending',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "reviewer" TEXT,
    "reviewComment" TEXT,
    "ip" TEXT NOT NULL,
    "userAgent" TEXT NOT NULL,

    CONSTRAINT "SurveyEntry_pkey" PRIMARY KEY ("id")
);
