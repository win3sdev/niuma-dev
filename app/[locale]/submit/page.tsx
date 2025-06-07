"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import ReCAPTCHA from "react-google-recaptcha";
import { useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import regionData from "@/data/regionData"; // 地区数据

export default function SubmitPage() {
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
    longWorkIssues: string[]; // ✅ 明确 string[]
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
  // const [formData, setFormData] = useState({
  //   province: "",
  //   city: "",
  //   district: "",
  //   companyName: "", // 公司名称
  //   gender: "", // 性别
  //   ageRange: "", //年龄范围
  //   occupation: "", // 职业类别
  //   companySize: "", // 公司规模
  //   companyType: "", // 公司性质
  //   dailyWorkHours: "", // 平均每日工作时长
  //   weeklyWorkDays: "", // 平均每周工作时长
  //   overtimePay: "", // 加班报酬
  //   negativeConsequence: "", // 是否因拒绝加班或质疑工作安排而面临负面后果
  //   longWorkIssues: [], // 因「长时间工作」出现过哪些问题
  //   longWorkIssuesOtherText: "",
  //   violationsObserved: [], // 违法违规现象
  //   violationsObservedOther: "",
  //   discriminationReasons: [], // 歧视
  //   discriminationReasonsOther: "",
  //   expectedChanges: [], // 哪些改变
  //   expectedChangesOther: "",
  //   story: "", // 故事评论
  //   mouseTrack: "",
  //   safetyWord: "", //安全词
  // });

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
    setSubmitStatus("idle");

    setIsSubmitting(true);
    const trackData = mouseDataRef.current.join(";");

    setSubmitStatus("success");
    // console.log(formData);

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          mouseTrack: trackData,
        }),
      });

      const result = await response.json();
      // console.log(result);
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
      toast.error(t("error"), { duration: 3000, position: "top-center" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // const handleChange = (
  //   e: React.ChangeEvent<
  //     HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  //   >
  // ) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({ ...prev, [name]: value }));
  // };

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

  return (
    <div className="max-w-[1800px] mx-auto px-4 py-12 space-y-16 text-base text-foreground">
      <div className="mb-8 text-center">
        {/* <h1 className="text-4xl font-bold">{t("title")}</h1> */}
        <h1 className="text-4xl font-bold">「牛马.ICU」 超时工作黑名单</h1>
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
              一、基本信息
            </h2>
            <div className="mb-6 p-6 bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md">
              <p className="mt-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                我们会在以下问题询问关于您的基本信息。
              </p>
              <p className="mt-2 text-sm text-yellow-600 dark:text-yellow-400 font-semibold">
                ⚠️ 对于敏感或者容易暴露您身份的问题，您可以选择不透露
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
                性别
              </label>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                请选择您的性别。
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
                  请选择
                </option>
                <option value="男">男</option>
                <option value="女">女</option>
                <option value="其他性别/不愿透露">其他性别/不愿透露</option>
              </select>
            </div>

            {/* 年龄范围 */}
            <div>
              <label
                htmlFor="ageRange"
                className="block text-sm font-medium mb-1"
              >
                年龄范围
              </label>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                请选择您的年龄段。
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
                  请选择
                </option>
                <option value="18岁以下">18岁以下</option>
                <option value="18 - 24">18 - 24</option>
                <option value="25 - 34">25 - 34</option>
                <option value="35 - 54">35 - 54</option>
                <option value="55以上">55以上</option>
                <option value="不愿透露">不愿透露</option>
              </select>
            </div>

            {/* 职业类别 */}
            <div>
              <label
                htmlFor="occupation"
                className="block text-sm font-medium mb-1"
              >
                职业类别
              </label>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                请选择您的职业类别。
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
                  请选择
                </option>
                <option value="外卖员/快递员">外卖员/快递员</option>
                <option value="工人/体力劳动者">
                  工人/体力劳动者（工厂、建筑工地等）
                </option>
                <option value="网约车司机/代驾">网约车司机/代驾</option>
                <option value="货运/卡车司机">货运/卡车司机</option>
              </select>
            </div>

            {/* 公司名称 */}
            <div>
              <label
                htmlFor="companyName"
                className="block text-sm font-medium mb-1"
              >
                公司名称
              </label>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                请填写您所在公司的名称。
              </p>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="例如：字节跳动"
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
                公司规模
              </label>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                请选择您所在公司的人员规模。
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
                  请选择
                </option>
                <option value="小型（1 - 50人）">小型（1 - 50人）</option>
                <option value="中型（51 - 500人）">中型（51 - 500人）</option>
                <option value="大型（501人以上）">大型（501人以上）</option>
                <option value="无固定雇主（如平台工作者）">
                  无固定雇主（如平台工作者）
                </option>
              </select>
            </div>

            {/* 公司性质 */}
            <div>
              <label
                htmlFor="companyType"
                className="block text-sm font-medium mb-1"
              >
                公司性质
              </label>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                请选择您所在公司的性质。
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
                  请选择
                </option>
                <option value="国企">国企</option>
                <option value="外企">外企</option>
                <option value="私企">私企</option>
                <option value="平台/劳务派遣">平台/劳务派遣</option>
                <option value="政府">政府</option>
              </select>
            </div>
          </div>

          {/* 第二部分 */}
          <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-neutral-900 rounded-lg shadow-md space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              二、工作现状
            </h2>
            <div className="mb-6 p-6 bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md">
              <p className="mt-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                我们会在以下问题中询问关于您的工作现状
              </p>
              <p className="mt-2 text-sm text-yellow-600 dark:text-yellow-400 font-semibold">
                ⚠️ 对于敏感或者容易暴露您身份的问题，您可以选择不透露
              </p>
            </div>
            {/* 平均每日工作时长 */}
            <div>
              <label
                htmlFor="dailyWorkHours"
                className="block text-sm font-medium mb-1"
              >
                平均每日工作时长
              </label>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                请选择您通常每天的工作时长。
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
                  请选择
                </option>
                <option value="小于等于 8 小时">小于等于 8 小时</option>
                <option value="8 - 12 小时">8 - 12 小时</option>
                <option value="大于等于 12 小时">大于等于 12 小时</option>
                <option value="弹性/不定时">弹性/不定时</option>
              </select>
            </div>

            {/* 平均每周工作天数 */}
            <div>
              <label
                htmlFor="weeklyWorkDays"
                className="block text-sm font-medium mb-1"
              >
                平均每周工作天数
              </label>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                您通常每周工作几天？
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
                  请选择
                </option>
                <option value="五天或小于五天">五天或小于五天</option>
                <option value="六天">六天</option>
                <option value="七天">七天</option>
              </select>
            </div>

            {/* 加班报酬 */}
            <div>
              <label
                htmlFor="overtimePay"
                className="block text-sm font-medium mb-1"
              >
                如果您需要加班，是否有加班报酬？
              </label>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                可根据实际情况选择加班补偿方式。
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
                  请选择
                </option>
                <option value="不加班">不加班</option>
                <option value="全额支付（1.5倍正常工资）">
                  全额支付（1.5倍正常工资）
                </option>
                <option value="部分支付（存在不足法定1.5倍工资）">
                  部分支付（存在不足法定1.5倍工资）
                </option>
                <option value="无偿加班">无偿加班</option>
                <option value="按件/按时计费">按件/按时计费</option>
              </select>
            </div>
          </div>

          {/* 第三部分 */}
          <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-neutral-900 rounded-lg shadow-md space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              三、超时工作的影响与诉求
            </h2>
            <div className="mb-6 p-6 bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md">
              <p className="mt-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                我们会在以下问题中询问关于您超时工作的影响与您的诉求
              </p>
              <p className="mt-2 text-sm text-yellow-600 dark:text-yellow-400 font-semibold">
                ⚠️
                以下问题均为「选填」，您可以选择跳过并直接提交，对于敏感或者容易暴露您身份的问题，您可以选择不透露
              </p>
            </div>
            {/* 是否因拒绝加班或质疑工作安排而面临负面后果 */}
            <div className="mb-6">
              <label
                htmlFor="negativeConsequence"
                className="block text-sm font-medium mb-1"
              >
                是否因拒绝加班或质疑工作安排而面临负面后果？
              </label>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                如考核任务压力、批评、降薪、解雇威胁等。
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
                  请选择
                </option>
                <option value="是">是</option>
                <option value="否">否</option>
                <option value="不确定">不确定</option>
              </select>
            </div>

            {/* 您因「长时间工作」出现过哪些问题？ */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">
                您因「长时间工作」出现过哪些问题？（可多选）
              </label>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                可选择多个选项，或补充填写其他问题。
              </p>
              <div className="space-y-2">
                {[
                  "身体健康（如腰痛、视力下降）",
                  "心理压力（如抑郁、焦虑、失眠）",
                  "人际或家庭关系紧张",
                ].map((option) => (
                  <div key={option} className="flex items-center">
                    <input
                      type="checkbox"
                      id={option}
                      value={option}
                      checked={
                        formData.longWorkIssues?.includes(option) || false
                      }
                      onChange={handleCheckboxChange}
                      className="mr-2"
                    />
                    <label
                      htmlFor={option}
                      className="text-sm text-neutral-800 dark:text-neutral-200"
                    >
                      {option}
                    </label>
                  </div>
                ))}

                {/* 其他 Option */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="longWorkIssuesOther"
                    value="其他"
                    checked={formData.longWorkIssues?.includes("其他") || false}
                    onChange={handleCheckboxChange}
                    className="mr-2"
                  />
                  <label
                    htmlFor="longWorkIssuesOther"
                    className="text-sm text-neutral-800 dark:text-neutral-200"
                  >
                    其他
                  </label>
                  {showOtherInput && (
                    <input
                      type="text"
                      name="longWorkIssuesOtherText"
                      value={formData.longWorkIssuesOtherText || ""}
                      onChange={handleChange}
                      placeholder="请输入其他问题"
                      className="ml-4 flex-1 px-3 py-1 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* 遭受过哪些歧视 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                遭受过哪些歧视？（可多选）
              </label>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                勾选您认为存在的问题，可多选
              </p>

              <div className="space-y-2">
                {[
                  "性别",
                  "年龄",
                  "生育/婚姻",
                  "身份（如地域、学历、民族、性向等）",
                ].map((option) => (
                  <div key={option} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`discriminationReasons-${option}`}
                      name="discriminationReasons"
                      value={option}
                      checked={
                        formData.discriminationReasons?.includes(option) ||
                        false
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
                      htmlFor={`discriminationReasons-${option}`}
                      className="text-sm text-neutral-800 dark:text-neutral-200"
                    >
                      {option}
                    </label>
                  </div>
                ))}

                {/* 其他选项 */}
                <div className="flex items-center flex-wrap gap-2">
                  <input
                    type="checkbox"
                    id="discriminationReasons-other"
                    name="discriminationReasons"
                    value="其他"
                    checked={
                      formData.discriminationReasons?.includes("其他") || false
                    }
                    onChange={(e) => {
                      const checked = e.target.checked;
                      const updated = checked
                        ? [...(formData.discriminationReasons || []), "其他"]
                        : (formData.discriminationReasons || []).filter(
                            (v) => v !== "其他"
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
                    其他
                  </label>
                  {formData.discriminationReasons?.includes("其他") && (
                    <input
                      type="text"
                      name="discriminationReasonsOther"
                      value={formData.discriminationReasonsOther || ""}
                      onChange={handleChange}
                      placeholder="请补充其他说明"
                      className="flex-1 px-3 py-1 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* 您的企业是否存在以下「违法违规现象」 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                您的企业是否存在以下「违法违规现象」？（可多选）
              </label>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                勾选您认为存在的问题，可多选
              </p>

              <div className="space-y-2">
                {[
                  "胡乱扣除绩效",
                  "不缴纳五险一金或社保",
                  "拖欠工资",
                  "不签订劳动合同",
                  "低于法定最低工资",
                  "开除不给补偿",
                ].map((option) => (
                  <div key={option} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`violationsObserved-${option}`}
                      name="violationsObserved"
                      value={option}
                      checked={
                        formData.violationsObserved?.includes(option) || false
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
                      htmlFor={`violationsObserved-${option}`}
                      className="text-sm text-neutral-800 dark:text-neutral-200"
                    >
                      {option}
                    </label>
                  </div>
                ))}

                {/* 其他选项 */}
                <div className="flex items-center flex-wrap gap-2">
                  <input
                    type="checkbox"
                    id="violationsObserved-other"
                    name="violationsObserved"
                    value="其他"
                    checked={
                      formData.violationsObserved?.includes("其他") || false
                    }
                    onChange={(e) => {
                      const checked = e.target.checked;
                      const updated = checked
                        ? [...(formData.violationsObserved || []), "其他"]
                        : (formData.violationsObserved || []).filter(
                            (v) => v !== "其他"
                          );
                      handleChange({
                        target: { name: "violationsObserved", value: updated },
                      });
                    }}
                    className="mr-2"
                  />
                  <label
                    htmlFor="violationsObserved-other"
                    className="text-sm text-neutral-800 dark:text-neutral-200"
                  >
                    其他
                  </label>
                  {formData.violationsObserved?.includes("其他") && (
                    <input
                      type="text"
                      name="violationsObservedOther"
                      value={formData.violationsObservedOther || ""}
                      onChange={handleChange}
                      placeholder="请补充其他说明"
                      className="flex-1 px-3 py-1 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* 您希望通过曝光您的公司/单位得到哪些改变 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                您希望通过曝光您的公司/单位得到哪些改变？（可多选）
              </label>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                可选择多个选项，或补充填写其他问题。
              </p>

              <div className="space-y-2">
                {[
                  "缩短工时（反996）",
                  "支付加班费",
                  "增加休息日",
                  "追究企业责任",
                ].map((option) => (
                  <div key={option} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`expectedChanges-${option}`}
                      name="expectedChanges"
                      value={option}
                      checked={
                        formData.expectedChanges?.includes(option) || false
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
                      htmlFor={`expectedChanges-${option}`}
                      className="text-sm text-neutral-800 dark:text-neutral-200"
                    >
                      {option}
                    </label>
                  </div>
                ))}

                {/* 其他选项 */}
                <div className="flex items-center flex-wrap gap-2">
                  <input
                    type="checkbox"
                    id="expectedChanges-other"
                    name="expectedChanges"
                    value="其他"
                    checked={
                      formData.expectedChanges?.includes("其他") || false
                    }
                    onChange={(e) => {
                      const checked = e.target.checked;
                      const updated = checked
                        ? [...(formData.expectedChanges || []), "其他"]
                        : (formData.expectedChanges || []).filter(
                            (v) => v !== "其他"
                          );
                      handleChange({
                        target: { name: "expectedChanges", value: updated },
                      });
                    }}
                    className="mr-2"
                  />
                  <label
                    htmlFor="expectedChanges-other"
                    className="text-sm text-neutral-800 dark:text-neutral-200"
                  >
                    其他
                  </label>
                  {formData.expectedChanges?.includes("其他") && (
                    <input
                      type="text"
                      name="expectedChangesOther"
                      value={formData.expectedChangesOther || ""}
                      onChange={handleChange}
                      placeholder="请补充其他说明"
                      className="flex-1 px-3 py-1 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-neutral-900 rounded-lg shadow-md space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              四、安全词与故事分享
            </h2>
            <div className="mb-6 p-6 bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md">
              <p className="mt-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                我们会在以下问题中询问关于您超时工作的影响与您的诉求
              </p>
              <p className="mt-2 text-sm text-yellow-600 dark:text-yellow-400 font-semibold">
                ⚠️ 对于敏感或者容易暴露您身份的问题，您可以选择不透露
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
                您可以在这里填写一个安全词，作为未来可能删除问卷的密码。
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

            {/* 学生的评论 */}
            <div>
              <label
                htmlFor="storyComments"
                className="block text-sm font-medium mb-1"
              >
                评论、经历与故事（我们会选取一些评论单独发布）
              </label>
              {/* <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
              {t("studentComments.description")}
            </p> */}
              <textarea
                id="story"
                name="story"
                value={formData.story}
                onChange={handleChange}
                placeholder="请输入您的评论"
                rows={4}
                className="text-neutral-800 dark:text-white w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* reCAPTCHA 不做隐式状态 */}
          {/* <div className="pt-4">
            <ReCAPTCHA
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
              ref={recaptchaRef}
              onChange={onRecaptchaChange}
            />
          </div> */}

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
          {submitStatus === "success" && (
            <p className="text-green-500 text-center">{t("success")}</p>
          )}
          {submitStatus === "error" && (
            <p className="text-red-500 text-center">{t("error")}</p>
          )}
        </form>
      </div>
    </div>
  );
}
