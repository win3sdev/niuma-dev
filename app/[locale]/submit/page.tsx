"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import ReCAPTCHA from "react-google-recaptcha";
import { useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import regionData from "@/data/regionData";
import { useRouter } from "next/navigation";

export default function SubmitPage() {
  const router = useRouter();

  const mouseDataRef = useRef<string[]>([]);
  useEffect(() => {
    let lastTime = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastTime > 100) {
        mouseDataRef.current.push(`move:${e.clientX},${e.clientY},${now}`);
        lastTime = now;
      }
    };

    const handleClick = (e: MouseEvent) => {
      mouseDataRef.current.push(
        `click:${e.clientX},${e.clientY},${Date.now()}`
      );
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  const t = useTranslations("form");
  type FormData = {
    province: string;
    city: string;
    district: string;
    companyName: string;
    gender: string;
    ageRange: string;
    occupation: string;
    companySize: string;
    companyType: string;
    dailyWorkHours: string;
    weeklyWorkDays: string;
    overtimePay: string;
    negativeConsequence: string;
    longWorkIssues: string[];
    longWorkIssuesOtherText: string;
    violationsObserved: string[];
    violationsObservedOther: string;
    discriminationReasons: string[];
    discriminationReasonsOther: string;
    expectedChanges: string[];
    expectedChangesOther: string;
    story: string;
    mouseTrack: string;
    safetyWord: string;
  };

  const [formData, setFormData] = useState<FormData>({
    province: "",
    city: "",
    district: "",
    companyName: "",
    gender: "",
    ageRange: "",
    occupation: "",
    companySize: "",
    companyType: "",
    dailyWorkHours: "",
    weeklyWorkDays: "",
    overtimePay: "",
    negativeConsequence: "",
    longWorkIssues: [],
    longWorkIssuesOtherText: "",
    violationsObserved: [],
    violationsObservedOther: "",
    discriminationReasons: [],
    discriminationReasonsOther: "",
    expectedChanges: [],
    expectedChangesOther: "",
    story: "",
    mouseTrack: "",
    safetyWord: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setSubmitStatus("idle");

    if (!recaptchaToken) {
      toast.error("请先通过验证码验证", { position: "top-center" });
      return;
    }

    setIsSubmitting(true);
    const trackData = mouseDataRef.current.join(";");

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          mouseTrack: trackData,
          recaptchaToken,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus("success");
        toast.success(t("success"), { duration: 3000, position: "top-center" });

        setRecaptchaToken(null);
        recaptchaRef.current?.reset();

        setTimeout(() => {
          router.push("/");
        }, 1500);
        
      } else {
        setSubmitStatus("error");
        toast.error(t("error"), { duration: 3000, position: "top-center" });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
      toast.error(t("error"), { duration: 3000, position: "top-center" });
    } finally {
      setIsSubmitting(false);
    }
  };

  type FormChangeEvent =
    | React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    | { target: { name: string; value: string | string[] } };

  const handleChange = (e: FormChangeEvent) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token);
  };

  const [showOtherInput, setShowOtherInput] = useState(
    (formData.longWorkIssues as string[])?.includes("其他") ?? false
  );

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    let updatedValues = [...((formData.longWorkIssues || []) as string[])];
    if (checked) {
      updatedValues.push(value);
    } else {
      updatedValues = updatedValues.filter((v) => v !== value);
    }
    setShowOtherInput(updatedValues.includes("其他"));
    handleChange({
      target: { name: "longWorkIssues", value: updatedValues },
    });
  };

  // success
  const SuccessAnimation = () => (
    <div className="flex justify-center py-6">
      <svg
        className="w-16 h-16 text-green-500 animate-scaleIn"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path d="M20 6L9 17l-5-5" />
      </svg>
    </div>
  );

  // failed
  const ErrorAnimation = () => (
    <div className="flex justify-center py-6">
      <svg
        className="w-16 h-16 text-red-500 animate-scaleIn"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M15 9l-6 6M9 9l6 6" />
      </svg>
    </div>
  );

  return (
    <div className="max-w-[1800px] mx-auto px-4 py-12 space-y-16 text-base text-foreground">
      <div className="mb-8 text-center">
        {/* <h1 className="text-4xl font-bold"></h1> */}
        <h1 className="text-4xl font-bold">{t("title")}</h1>
        <p className="text-lg text-muted-foreground mt-2">{t("description")}</p>
      </div>

      <div className="mb-6 p-4 rounded-lg border bg-muted/30 dark:bg-muted/10 text-sm text-muted-foreground">
        <p>{t("card")}</p>
      </div>

      <div className="">
        <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
          {/* 第一部分 */}
          <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-neutral-900 rounded-lg shadow-md space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {t("section1.title")}
            </h2>
            <div className="mb-6 p-6 bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md">
              <p className="mt-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {t("section1.description1")}
              </p>
              <p className="mt-2 text-sm text-yellow-600 dark:text-yellow-400 font-semibold">
                {t("section1.description2")}
              </p>
            </div>

            {/* 地区选择（省/市/区县） */}
            <div>
              {/* 省份 */}
              <label className="block text-sm font-medium mb-1">
                {t("province.label")}
              </label>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                {t("province.description")}
              </p>
              <select
                id="province"
                name="province"
                value={formData.province}
                onChange={(e) => {
                  const selectedProvince = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    province: selectedProvince,
                    city: "",
                    district: "",
                  }));
                }}
                className="mb-2 w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              >
                <option value="" disabled hidden>
                  {t("province.placeholder")}
                </option>
                {Object.keys(regionData).map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>

              {/* 城市 */}
              <label className="block text-sm font-medium mb-1">
                {t("city.label")}
              </label>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                {t("city.description")}
              </p>
              <select
                id="city"
                name="city"
                value={formData.city}
                onChange={(e) => {
                  const selectedCity = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    city: selectedCity,
                    district: "",
                  }));
                }}
                disabled={!formData.province}
                className="text-neutral-800 dark:text-white mb-2 w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">{t("city.placeholder")}</option>
                {formData.province &&
                  Object.keys(regionData[formData.province] || {}).map(
                    (city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    )
                  )}
              </select>

              {/* 区县 */}
              <label className="block text-sm font-medium mb-1">
                {t("district.label")}
              </label>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                {t("district.description")}
              </p>
              <select
                id="district"
                name="district"
                value={formData.district}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    district: e.target.value,
                  }))
                }
                disabled={!formData.city}
                className="text-neutral-800 dark:text-white w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">{t("district.placeholder")}</option>
                {formData.province &&
                  formData.city &&
                  (regionData[formData.province]?.[formData.city] || []).map(
                    (district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    )
                  )}
              </select>
            </div>

            {/* 性别 */}
            <div>
              <label
                htmlFor="gender"
                className="block text-sm font-medium mb-1"
              >
                {t("gender.label")}
              </label>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                {t("gender.description")}
              </p>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="" disabled>
                  {t("gender.placeholder")}
                </option>
                <option value="男">{t("gender.options.male")}</option>
                <option value="女">{t("gender.options.female")}</option>
                <option value="其他性别/不愿透露">
                  {t("gender.options.other")}
                </option>
              </select>
            </div>

            {/* 年龄范围 */}
            <div>
              <label
                htmlFor="ageRange"
                className="block text-sm font-medium mb-1"
              >
                {t("ageRange.label")}
              </label>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                {t("ageRange.description")}
              </p>
              <select
                id="ageRange"
                name="ageRange"
                value={formData.ageRange}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="" disabled>
                  {t("ageRange.placeholder")}
                </option>
                <option value="18岁以下">
                  {t("ageRange.options.under18")}
                </option>
                <option value="18 - 24">{t("ageRange.options.18_24")}</option>
                <option value="25 - 34">{t("ageRange.options.25_34")}</option>
                <option value="35 - 54">{t("ageRange.options.35_54")}</option>
                <option value="55以上">{t("ageRange.options.55plus")}</option>
                <option value="不愿透露">
                  {t("ageRange.options.undisclosed")}
                </option>
              </select>
            </div>

            {/* 职业类别 */}
            <div>
              <label
                htmlFor="occupation"
                className="block text-sm font-medium mb-1"
              >
                {t("occupation.label")}
              </label>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                {t("occupation.description")}
              </p>
              <select
                id="occupation"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="" disabled>
                  {t("occupation.placeholder")}
                </option>
                <option value="外卖员/快递员">
                  {t("occupation.options.delivery")}
                </option>
                <option value="工人/体力劳动者（工厂、建筑工地等）">
                  {t("occupation.options.labor")}
                </option>
                <option value="网约车司机/代驾">
                  {t("occupation.options.ride")}
                </option>
                <option value="货运/卡车司机">
                  {t("occupation.options.truck")}
                </option>
                <option value="互联网相关从业者">
                  {t("occupation.options.tech")}
                </option>
                <option value="无编制公职人员（如辅警，企事业单位合同工，劳务派遣岗位，私立学校教师）">
                  {t("occupation.options.nonOfficial")}
                </option>
                <option value="有编制公职人员（包括政府/公务员/事业单位，教师，有编制公务员）">
                  {t("occupation.options.official")}
                </option>
                <option value="金融/银行/法律">
                  {t("occupation.options.finance")}
                </option>
                <option value="医药健康（医生、护士、药师、健康顾问等）">
                  {t("occupation.options.healthcare")}
                </option>
                <option value="教育/培训（如辅导班老师，学校教师请填公职人员）">
                  {t("occupation.options.education")}
                </option>
                <option value="服务业（中介/销售/保险/服务员/旅游业等）">
                  {t("occupation.options.service")}
                </option>
                <option value="自由职业（作家、摄影师、设计师）">
                  {t("occupation.options.freelancer")}
                </option>
                <option value="无法找到长期固定工作">
                  {t("occupation.options.unstable")}
                </option>
              </select>
            </div>

            {/* 公司名称 */}
            <div>
              <label
                htmlFor="companyName"
                className="block text-sm font-medium mb-1"
              >
                {t("companyName.label")}
              </label>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                {t("companyName.description")}
              </p>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder={t("companyName.placeholder")}
                className="text-neutral-800 dark:text-white w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* 公司规模 */}
            <div>
              <label
                htmlFor="companySize"
                className="block text-sm font-medium mb-1"
              >
                {t("companySize.label")}
              </label>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                {t("companySize.description")}
              </p>
              <select
                id="companySize"
                name="companySize"
                value={formData.companySize}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="" disabled>
                  {t("companySize.placeholder")}
                </option>
                <option value="小型（1 - 50人）">
                  {t("companySize.options.small")}
                </option>
                <option value="中型（51 - 500人）">
                  {t("companySize.options.medium")}
                </option>
                <option value="大型（501人以上）">
                  {t("companySize.options.large")}
                </option>
                <option value="无固定雇主（如平台工作者)">
                  {t("companySize.options.noEmployer")}
                </option>
              </select>
            </div>

            {/* 公司性质 */}
            <div>
              <label
                htmlFor="companyType"
                className="block text-sm font-medium mb-1"
              >
                {t("companyType.label")}
              </label>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                {t("companyType.description")}
              </p>
              <select
                id="companyType"
                name="companyType"
                value={formData.companyType}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="" disabled>
                  {t("companyType.placeholder")}
                </option>
                <option value="国企">
                  {t("companyType.options.stateOwned")}
                </option>
                <option value="外企">{t("companyType.options.foreign")}</option>
                <option value="私企">{t("companyType.options.private")}</option>
                <option value="平台/劳务派遣">
                  {t("companyType.options.platform")}
                </option>
                <option value="政府">
                  {t("companyType.options.government")}
                </option>
              </select>
            </div>
          </div>

          {/* 第二部分 */}
          <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-neutral-900 rounded-lg shadow-md space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {t("section2.title")}
            </h2>
            <div className="mb-6 p-6 bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md">
              <p className="mt-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {t("section2.description1")}
              </p>
              <p className="mt-2 text-sm text-yellow-600 dark:text-yellow-400 font-semibold">
                {t("section2.description2")}
              </p>
            </div>
            {/* 平均每日工作时长 */}
            <div>
              <label
                htmlFor="dailyWorkHours"
                className="block text-sm font-medium mb-1"
              >
                {t("dailyWorkHours.label")}
              </label>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                {t("dailyWorkHours.description")}
              </p>
              <select
                id="dailyWorkHours"
                name="dailyWorkHours"
                value={formData.dailyWorkHours}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="" disabled>
                  {t("dailyWorkHours.placeholder")}
                </option>
                <option value="小于等于 8 小时">
                  {t("dailyWorkHours.options.le8")}
                </option>
                <option value="8 - 12 小时">
                  {t("dailyWorkHours.options.8to12")}
                </option>
                <option value="大于等于 12 小时">
                  {t("dailyWorkHours.options.ge12")}
                </option>
                <option value="弹性/不定时">
                  {t("dailyWorkHours.options.flexible")}
                </option>
              </select>
            </div>

            {/* 平均每周工作天数 */}
            <div>
              <label
                htmlFor="weeklyWorkDays"
                className="block text-sm font-medium mb-1"
              >
                {t("weeklyWorkDays.label")}
              </label>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                {t("weeklyWorkDays.description")}
              </p>
              <select
                id="weeklyWorkDays"
                name="weeklyWorkDays"
                value={formData.weeklyWorkDays}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="" disabled>
                  {t("weeklyWorkDays.placeholder")}
                </option>
                <option value="五天或小于五天">
                  {t("weeklyWorkDays.options.fiveOrLess")}
                </option>
                <option value="六天">{t("weeklyWorkDays.options.six")}</option>
                <option value="七天">
                  {t("weeklyWorkDays.options.seven")}
                </option>
              </select>
            </div>

            {/* 加班报酬 */}
            <div>
              <label
                htmlFor="overtimePay"
                className="block text-sm font-medium mb-1"
              >
                {t("overtimePay.label")}
              </label>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                {t("overtimePay.description")}
              </p>
              <select
                id="overtimePay"
                name="overtimePay"
                value={formData.overtimePay}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="" disabled>
                  {t("overtimePay.placeholder")}
                </option>
                <option value="不加班">
                  {t("overtimePay.options.noOvertime")}
                </option>
                <option value="全额支付（1.5倍正常工资）">
                  {t("overtimePay.options.fullPay")}
                </option>
                <option value="部分支付（存在不足法定1.5倍工资）">
                  {t("overtimePay.options.partialPay")}
                </option>
                <option value="无偿加班">
                  {t("overtimePay.options.noPay")}
                </option>
                <option value="按件/按时计费">
                  {t("overtimePay.options.pieceRate")}
                </option>
              </select>
            </div>
          </div>

          {/* 第三部分 */}
          <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-neutral-900 rounded-lg shadow-md space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {t("section3.title")}
            </h2>
            <div className="mb-6 p-6 bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md">
              <p className="mt-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {t("section3.description1")}
              </p>
              <p className="mt-2 text-sm text-yellow-600 dark:text-yellow-400 font-semibold">
                {t("section3.description2")}
              </p>
            </div>
            {/* 是否因拒绝加班或质疑工作安排而面临负面后果 */}
            <div className="mb-6">
              <label
                htmlFor="negativeConsequence"
                className="block text-sm font-medium mb-1"
              >
                {t("negativeConsequence.label")}
              </label>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                {t("negativeConsequence.description")}
              </p>
              <select
                id="negativeConsequence"
                name="negativeConsequence"
                value={formData.negativeConsequence}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="" disabled>
                  {t("negativeConsequence.placeholder")}
                </option>
                <option value="是">
                  {t("negativeConsequence.options.yes")}
                </option>
                <option value="否">
                  {t("negativeConsequence.options.no")}
                </option>
                <option value="不确定">
                  {t("negativeConsequence.options.uncertain")}
                </option>
              </select>
            </div>

            {/* 您因「长时间工作」出现过哪些问题？ */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">
                {t("longWorkIssues.label")}
              </label>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                {t("longWorkIssues.description")}
              </p>
              <div className="space-y-2">
                {["health", "mental", "relationships"].map((key) => (
                  <div key={key} className="flex items-center">
                    <input
                      type="checkbox"
                      id={key}
                      value={t(`longWorkIssues.options.${key}`)}
                      checked={
                        formData.longWorkIssues?.includes(
                          t(`longWorkIssues.options.${key}`)
                        ) || false
                      }
                      onChange={handleCheckboxChange}
                      className="mr-2"
                    />
                    <label
                      htmlFor={key}
                      className="text-sm text-neutral-800 dark:text-neutral-200"
                    >
                      {t(`longWorkIssues.options.${key}`)}
                    </label>
                  </div>
                ))}

                {/* 其他选项 */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="other"
                    value={t("longWorkIssues.options.other")}
                    checked={
                      formData.longWorkIssues?.includes(
                        t("longWorkIssues.options.other")
                      ) || false
                    }
                    onChange={handleCheckboxChange}
                    className="mr-2"
                  />
                  <label
                    htmlFor="other"
                    className="text-sm text-neutral-800 dark:text-neutral-200"
                  >
                    {t("longWorkIssues.options.other")}
                  </label>
                  {showOtherInput && (
                    <input
                      type="text"
                      name="longWorkIssuesOtherText"
                      value={formData.longWorkIssuesOtherText || ""}
                      onChange={handleChange}
                      placeholder={t("longWorkIssues.otherPlaceholder")}
                      className="ml-4 flex-1 px-3 py-1 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* 遭受过哪些歧视 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                {t("discriminationReasons.label")}
              </label>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {t("discriminationReasons.description")}
              </p>

              <div className="space-y-2">
                {["gender", "age", "marriage", "identity"].map((key) => (
                  <div key={key} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`discriminationReasons-${key}`}
                      name="discriminationReasons"
                      value={t(`discriminationReasons.options.${key}`)}
                      checked={
                        formData.discriminationReasons?.includes(
                          t(`discriminationReasons.options.${key}`)
                        ) || false
                      }
                      onChange={(e) => {
                        const value = e.target.value;
                        const checked = e.target.checked;
                        const updated = checked
                          ? [...(formData.discriminationReasons || []), value]
                          : (formData.discriminationReasons || []).filter(
                              (v) => v !== value
                            );
                        handleChange({
                          target: {
                            name: "discriminationReasons",
                            value: updated,
                          },
                        });
                      }}
                      className="mr-2"
                    />
                    <label
                      htmlFor={`discriminationReasons-${key}`}
                      className="text-sm text-neutral-800 dark:text-neutral-200"
                    >
                      {t(`discriminationReasons.options.${key}`)}
                    </label>
                  </div>
                ))}

                {/* 其他选项 */}
                <div className="flex items-center flex-wrap gap-2">
                  <input
                    type="checkbox"
                    id="discriminationReasons-other"
                    name="discriminationReasons"
                    value={t("discriminationReasons.options.other")}
                    checked={
                      formData.discriminationReasons?.includes(
                        t("discriminationReasons.options.other")
                      ) || false
                    }
                    onChange={(e) => {
                      const checked = e.target.checked;
                      const updated = checked
                        ? [
                            ...(formData.discriminationReasons || []),
                            t("discriminationReasons.options.other"),
                          ]
                        : (formData.discriminationReasons || []).filter(
                            (v) =>
                              v !== t("discriminationReasons.options.other")
                          );
                      handleChange({
                        target: {
                          name: "discriminationReasons",
                          value: updated,
                        },
                      });
                    }}
                    className="mr-2"
                  />
                  <label
                    htmlFor="discriminationReasons-other"
                    className="text-sm text-neutral-800 dark:text-neutral-200"
                  >
                    {t("discriminationReasons.options.other")}
                  </label>
                  {formData.discriminationReasons?.includes(
                    t("discriminationReasons.options.other")
                  ) && (
                    <input
                      type="text"
                      name="discriminationReasonsOther"
                      value={formData.discriminationReasonsOther || ""}
                      onChange={handleChange}
                      placeholder={t("discriminationReasons.otherPlaceholder")}
                      className="flex-1 px-3 py-1 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* 您的企业是否存在以下「违法违规现象」？（可多选） */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                {t("violationsObserved.label")}
              </label>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {t("violationsObserved.description")}
              </p>

              <div className="space-y-2">
                {[
                  "performanceDeduction",
                  "noSocialInsurance",
                  "wageArrears",
                  "noLaborContract",
                  "belowMinimumWage",
                  "noCompensation",
                ].map((key) => (
                  <div key={key} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`violationsObserved-${key}`}
                      name="violationsObserved"
                      value={t(`violationsObserved.options.${key}`)}
                      checked={
                        formData.violationsObserved?.includes(
                          t(`violationsObserved.options.${key}`)
                        ) || false
                      }
                      onChange={(e) => {
                        const value = e.target.value;
                        const checked = e.target.checked;
                        const updated = checked
                          ? [...(formData.violationsObserved || []), value]
                          : (formData.violationsObserved || []).filter(
                              (v) => v !== value
                            );
                        handleChange({
                          target: {
                            name: "violationsObserved",
                            value: updated,
                          },
                        });
                      }}
                      className="mr-2"
                    />
                    <label
                      htmlFor={`violationsObserved-${key}`}
                      className="text-sm text-neutral-800 dark:text-neutral-200"
                    >
                      {t(`violationsObserved.options.${key}`)}
                    </label>
                  </div>
                ))}

                {/* 其他选项 */}
                <div className="flex items-center flex-wrap gap-2">
                  <input
                    type="checkbox"
                    id="violationsObserved-other"
                    name="violationsObserved"
                    value={t("violationsObserved.options.other")}
                    checked={
                      formData.violationsObserved?.includes(
                        t("violationsObserved.options.other")
                      ) || false
                    }
                    onChange={(e) => {
                      const checked = e.target.checked;
                      const updated = checked
                        ? [
                            ...(formData.violationsObserved || []),
                            t("violationsObserved.options.other"),
                          ]
                        : (formData.violationsObserved || []).filter(
                            (v) => v !== t("violationsObserved.options.other")
                          );
                      handleChange({
                        target: {
                          name: "violationsObserved",
                          value: updated,
                        },
                      });
                    }}
                    className="mr-2"
                  />
                  <label
                    htmlFor="violationsObserved-other"
                    className="text-sm text-neutral-800 dark:text-neutral-200"
                  >
                    {t("violationsObserved.options.other")}
                  </label>
                  {formData.violationsObserved?.includes(
                    t("violationsObserved.options.other")
                  ) && (
                    <input
                      type="text"
                      name="violationsObservedOther"
                      value={formData.violationsObservedOther || ""}
                      onChange={handleChange}
                      placeholder={t("violationsObserved.otherPlaceholder")}
                      className="flex-1 px-3 py-1 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* 您希望通过曝光您的公司/单位得到哪些改变？（可多选） */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                {t("expectedChanges.label")}
              </label>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {t("expectedChanges.description")}
              </p>

              <div className="space-y-2">
                {[
                  "shorterHours",
                  "overtimePay",
                  "moreRestDays",
                  "holdCompanyAccountable",
                ].map((key) => (
                  <div key={key} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`expectedChanges-${key}`}
                      name="expectedChanges"
                      value={t(`expectedChanges.options.${key}`)}
                      checked={
                        formData.expectedChanges?.includes(
                          t(`expectedChanges.options.${key}`)
                        ) || false
                      }
                      onChange={(e) => {
                        const value = e.target.value;
                        const checked = e.target.checked;
                        const updated = checked
                          ? [...(formData.expectedChanges || []), value]
                          : (formData.expectedChanges || []).filter(
                              (v) => v !== value
                            );
                        handleChange({
                          target: {
                            name: "expectedChanges",
                            value: updated,
                          },
                        });
                      }}
                      className="mr-2"
                    />
                    <label
                      htmlFor={`expectedChanges-${key}`}
                      className="text-sm text-neutral-800 dark:text-neutral-200"
                    >
                      {t(`expectedChanges.options.${key}`)}
                    </label>
                  </div>
                ))}

                {/* 其他选项 */}
                <div className="flex items-center flex-wrap gap-2">
                  <input
                    type="checkbox"
                    id="expectedChanges-other"
                    name="expectedChanges"
                    value={t("expectedChanges.options.other")}
                    checked={
                      formData.expectedChanges?.includes(
                        t("expectedChanges.options.other")
                      ) || false
                    }
                    onChange={(e) => {
                      const checked = e.target.checked;
                      const updated = checked
                        ? [
                            ...(formData.expectedChanges || []),
                            t("expectedChanges.options.other"),
                          ]
                        : (formData.expectedChanges || []).filter(
                            (v) => v !== t("expectedChanges.options.other")
                          );
                      handleChange({
                        target: {
                          name: "expectedChanges",
                          value: updated,
                        },
                      });
                    }}
                    className="mr-2"
                  />
                  <label
                    htmlFor="expectedChanges-other"
                    className="text-sm text-neutral-800 dark:text-neutral-200"
                  >
                    {t("expectedChanges.options.other")}
                  </label>
                  {formData.expectedChanges?.includes(
                    t("expectedChanges.options.other")
                  ) && (
                    <input
                      type="text"
                      name="expectedChangesOther"
                      value={formData.expectedChangesOther || ""}
                      onChange={handleChange}
                      placeholder={t("expectedChanges.otherPlaceholder")}
                      className="flex-1 px-3 py-1 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-neutral-900 rounded-lg shadow-md space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {t("section4.title")}
            </h2>
            <div className="mb-6 p-6 bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md">
              <p className="mt-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {t("section4.description1")}
              </p>
              <p className="mt-2 text-sm text-yellow-600 dark:text-yellow-400 font-semibold">
                {t("section4.description2")}
              </p>
            </div>
            {/* 安全词 */}
            <div>
              <label
                htmlFor="safetyWord"
                className="block text-sm font-medium mb-1"
              >
                {t("safaKeyword.label")}
              </label>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                {t("safaKeyword.description")}
              </p>
              <input
                type="text"
                id="safetyWord"
                name="safetyWord"
                value={formData.safetyWord}
                onChange={handleChange}
                placeholder={t("safaKeyword.placeholder")}
                className="text-neutral-800 dark:text-white w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* 评论 */}
            <div>
              <label htmlFor="story" className="block text-sm font-medium mb-1">
                {t("storyComments.label")}
              </label>
              <textarea
                id="story"
                name="story"
                value={formData.story}
                onChange={handleChange}
                placeholder={t("storyComments.placeholder")}
                rows={4}
                className="text-neutral-800 dark:text-white w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* reCAPTCHA 不做隐式状态 */}
          <div className="pt-4">
            <ReCAPTCHA
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
              ref={recaptchaRef}
              onChange={onRecaptchaChange}
            />
          </div>

          {/* 提交按钮 */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? t("submitting") : t("submit")}
            </button>
          </div>

          {/* 提交状态提示 */}
          {/* {submitStatus === "success" && (
            <p className="text-green-500 text-center">{t("success")}</p>
          )}
          {submitStatus === "error" && (
            <p className="text-red-500 text-center">{t("error")}</p>
          )} */}
          {/* 动画提示 */}
          {submitStatus === "success" && <SuccessAnimation />}
          {submitStatus === "error" && <ErrorAnimation />}
        </form>
      </div>
    </div>
  );
}
