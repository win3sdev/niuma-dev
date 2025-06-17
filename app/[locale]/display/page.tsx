"use client";

import { useEffect, useState, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Download,
  Settings,
  Eye,
  ChevronUp,
  ChevronDown,
  Building2,
  Briefcase,
  Layers,
  Users,
  Info,
} from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";

const allFields = [
  {
    key: "companyName",
    label: "公司名称",
    maxWidth: "200px",
    filterType: "input",
  },
  {
    key: "companySize",
    label: "公司规模",
    maxWidth: "100px",
    filterType: "select",
  },
  {
    key: "companyType",
    label: "公司性质",
    maxWidth: "120px",
    filterType: "select",
  },
  { key: "gender", label: "性别", maxWidth: "80px", filterType: "select" },
  {
    key: "ageRange",
    label: "年龄范围",
    maxWidth: "100px",
    filterType: "select",
  },
  { key: "occupation", label: "职业", maxWidth: "100px", filterType: "select" },
  { key: "province", label: "省份", maxWidth: "100px", filterType: "select" },
  { key: "city", label: "城市", maxWidth: "100px", filterType: "input" },
  {
    key: "dailyWorkHours",
    label: "平均每天工作时长",
    maxWidth: "200px",
    filterType: "select",
  },
  {
    key: "weeklyWorkDays",
    label: "平均每周工作天数",
    maxWidth: "200px",
    filterType: "select",
  },
  {
    key: "overtimePay",
    label: "加班报酬",
    maxWidth: "100px",
    filterType: "select",
  },
  {
    key: "negativeConsequence",
    label: "因拒绝加班或质疑工作安排而面临负面后果",
    maxWidth: "300px",
    filterType: "select",
  },
  {
    key: "longWorkIssues",
    label: "长时间工作问题",
    maxWidth: "200px",
    filterType: "select",
  },
  {
    key: "discriminationReasons",
    label: "职场歧视原因",
    maxWidth: "200px",
    filterType: "select",
  },
  {
    key: "violationsObserved",
    label: "观察到的违规现象",
    maxWidth: "200px",
    filterType: "select",
  },
  {
    key: "expectedChanges",
    label: "期望的改变",
    maxWidth: "200px",
    filterType: "select",
  },
  { key: "story", label: "评论", maxWidth: "300px", filterType: "input" },
];

function getPaginationRange(
  current: number,
  total: number
): (number | string)[] {
  const delta = 1; // current 前后展示几页
  const range: (number | string)[] = [];
  const left = Math.max(2, current - delta);
  const right = Math.min(total - 1, current + delta);

  range.push(1);

  if (left > 2) {
    range.push("...");
  }

  for (let i = left; i <= right; i++) {
    range.push(i);
  }

  if (right < total - 1) {
    range.push("...");
  }

  if (total > 1) {
    range.push(total);
  }

  return range;
}

const getRandomColor = (() => {
  const colorCache: Record<string, string> = {};
  const colors = [
    "#fde68a",
    "#a5f3fc",
    "#c4b5fd",
    "#fca5a5",
    "#6ee7b7",
    "#fcd34d",
    "#fbcfe8",
    "#bfdbfe",
    "#ddd6fe",
    "#fecaca",
  ];

  return (text: string) => {
    if (colorCache[text]) return colorCache[text];
    const color = colors[Math.floor(Math.random() * colors.length)];
    colorCache[text] = color;
    return color;
  };
})();

const renderColoredTags = (value: any) => {
  const values = Array.isArray(value) ? value : [value];
  return (
    <div className="flex flex-wrap gap-1">
      {values.map((item: string, idx: number) => (
        <span
          key={idx}
          className="px-2 py-0.5 rounded text-xs text-black"
          style={{ backgroundColor: getRandomColor(item) }}
        >
          {item}
        </span>
      ))}
    </div>
  );
};

const fieldOptions: Record<string, string[]> = {
  gender: ["男", "女", "其他性别/不愿透露"],
  ageRange: [
    "18岁以下",
    "18 - 24",
    "25 - 34",
    "35 - 54",
    "55 以上",
    "不愿透露",
  ],
  occupation: [
    "外卖员/快递员",
    "工人/体力劳动者（工厂、建筑工地等）",
    "网约车司机/代驾",
    "货运/卡车司机",
    "互联网相关从业者",
    "无编制公职人员（如辅警，企事业单位合同工，劳务派遣岗位，私立学校教师）",
    "有编制公职人员（包括政府/公务员/事业单位，教师，有编制公务员）",
    "金融/银行/法律",
    "医药健康（医生、护士、药师、健康顾问等）",
    "教育/培训（如辅导班老师，学校教师请填公职人员）",
    "服务业（中介/销售/保险/服务员/旅游业等）",
    "自由职业（作家、摄影师、设计师）",
    "无法找到长期固定工作",
  ],
  companySize: [
    "小型（1 - 50人）",
    "中型（51 - 500人）",
    "大型（501 人以上）",
    "无固定雇主（如平台工作者）",
  ],
  companyType: [
    "私企",
    "国企",
    "外企",
    "平台/劳务派遣（如美团、滴滴）",
    "政府",
    "中外合资",
  ],
  province: [
    "北京市",
    "天津市",
    "河北省",
    "山西省",
    "内蒙古自治区",
    "辽宁省",
    "吉林省",
    "黑龙江省",
    "上海市",
    "江苏省",
    "浙江省",
    "安徽省",
    "福建省",
    "江西省",
    "山东省",
    "河南省",
    "湖北省",
    "湖南省",
    "广东省",
    "广西壮族自治区",
    "海南省",
    "重庆市",
    "四川省",
    "贵州省",
    "云南省",
    "西藏自治区",
    "陕西省",
    "甘肃省",
    "青海省",
    "宁夏回族自治区",
    "新疆维吾尔自治区",
    "香港特别行政区",
    "澳门特别行政区",
  ],
  // city: ["北京", "上海", "广州"],
  // district: ["朝阳区", "黄浦区", "天河区"],
  longWorkIssues: [
    "身体健康（如腰痛、视力下降）",
    "心理压力（如抑郁、焦虑、失眠）",
    "人际或家庭关系紧张",
  ],
  discriminationReasons: [
    "性别",
    "年龄",
    "生育/婚姻状态",
    "身份（如地域、学历、民族、性向等）",
  ],
  violationsObserved: [
    "胡乱扣除绩效",
    "不缴纳五险一金或社保",
    "拖欠工资",
    "不签订劳动合同",
    "低于法定最低工资",
    "开除不给补偿",
  ],
  expectedChanges: [
    "缩短工时（反996）",
    "支付加班费",
    "增加休息日",
    "追究企业责任",
  ],
  story: ["故事分享"],
  overtimePay: [
    "不加班",
    "全额支付（1.5倍正常工资）",
    "部分支付（存在不足法定1.5倍工资）",
    "无偿加班",
    "按件/按时计费",
  ],
  weeklyWorkDays: ["五天或小于五天", "六天", "七天"],
  dailyWorkHours: [
    "小于等于 8 小时",
    "8 - 12 小时",
    "大于等于 12 小时",
    "弹性/不定时",
  ],
};

export default function SurveyTablePage() {
  const t = useTranslations("display");
  const [openDialogIndex, setOpenDialogIndex] = useState<number | null>(null);
  const [data, setData] = useState<any[]>([]);

  const [visibleFields, setVisibleFields] = useState(
    allFields.map((f) => f.key)
  );
  const [tempFilters, setTempFilters] = useState<Record<string, string>>({});
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [detailRow, setDetailRow] = useState<any | null>(null);

  useEffect(() => {
    axios.get("/api/survey").then((res) => {
      const processed = res.data.map((entry: any) => ({
        ...entry,
        longWorkIssues: parseJson(entry.longWorkIssues),
        discriminationReasons: parseJson(entry.discriminationReasons),
        violationsObserved: parseJson(entry.violationsObserved),
        expectedChanges: parseJson(entry.expectedChanges),
      }));
      setData(processed);
    });
  }, []);

  const parseJson = (val: string | null) => {
    try {
      const parsed = JSON.parse(val || "[]");
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return [];
    }
  };

  const toggleField = (key: string) => {
    setVisibleFields((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const filteredData = data.filter((row) =>
    visibleFields.every((key) => {
      const value = Array.isArray(row[key]) ? row[key].join(", ") : row[key];
      return value
        ?.toString()
        .toLowerCase()
        .includes((filters[key] || "").toLowerCase());
    })
  );

  const downloadCSV = () => {
    // console.log(data.length);

    // CSV表头
    const headers = visibleFields.map(
      (key) => allFields.find((f) => f.key === key)?.label
    );

    // CSV内容每一行
    const rows = data.map((row) =>
      visibleFields.map((key) => {
        const val = row[key];
        return Array.isArray(val) ? val.join(" | ") : val || "";
      })
    );

    const csvContent = [headers, ...rows]
      .map((r) => r.map((v) => `"${v}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "survey_data.csv";

    a.click();
    URL.revokeObjectURL(url);
  };

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const itemsPerPage = 25;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);
  const [jumpPageInput, setJumpPageInput] = useState("");

  const headerRef = useRef<HTMLTableSectionElement>(null);
  const [headerHeight, setHeaderHeight] = useState(72); // 默认值

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.clientHeight);
    }
  }, []);

  // 移动端搜索

  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  return (
    <div className="w-full ">
      {paginatedData.length > 0 ? (
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 overflow-x-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">{t("table.title")}</h1>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  {t("table.settings.button")}
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-lg bg-white dark:bg-zinc-900 shadow-lg rounded-lg">
                <DialogTitle className="text-lg font-semibold">
                  {t("table.settings.title")}
                </DialogTitle>

                <div className="text-sm text-muted-foreground mb-4">
                  {t("table.settings.description")}
                </div>

                <div className="max-h-64 overflow-y-auto border rounded-md p-4 bg-muted/20 flex flex-col gap-3">
                  {allFields.map((field) => (
                    <label
                      key={field.key}
                      className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary transition"
                    >
                      <Checkbox
                        checked={visibleFields.includes(field.key)}
                        onCheckedChange={() => toggleField(field.key)}
                        id={`field-${field.key}`}
                      />
                      <label htmlFor={`field-${field.key}`}>
                        {field.label}
                      </label>
                    </label>
                  ))}
                </div>

                <div className="mt-6 flex justify-end gap-2">
                  <Button
                    variant="secondary"
                    onClick={downloadCSV}
                    className="flex items-center px-4 py-2 rounded-md shadow-md transform transition transform-gpu 
               hover:bg-gray-100 dark:hover:bg-gray-700 
               hover:shadow-lg dark:hover:shadow-gray-900 
               hover:-translate-y-0.5 
               active:bg-gray-200 dark:active:bg-gray-600 
               active:shadow-md dark:active:shadow-gray-800"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {t("table.settings.download")}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* 移动端 */}
          {isMobile ? (
            <>
              {/* 搜索栏区域 */}
              <div className="space-y-2 mb-4">
                {/* 公司名称搜索框 */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 w-full">
                    <Input
                      type="text"
                      placeholder={t("search.placeholder")}
                      value={tempFilters.companyName || ""}
                      onChange={(e) =>
                        setTempFilters((prev) => ({
                          ...prev,
                          companyName: e.target.value,
                        }))
                      }
                      className="flex-1 px-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Button
                      onClick={() => {
                        setFilters(tempFilters);
                        setShowAdvancedSearch(false);
                      }}
                      className="px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 whitespace-nowrap"
                    >
                      {t("search.btn")}
                    </Button>
                  </div>
                </div>

                {/* 展开详细搜索按钮 */}
                <div className="w-full flex justify-center mb-4">
                  <Button
                    variant="ghost"
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
                    onClick={() => setShowAdvancedSearch((prev) => !prev)}
                  >
                    {showAdvancedSearch ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        {t("search.chevronUp")}
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        {t("search.chevronDown")}
                      </>
                    )}
                  </Button>
                </div>

                {/* 详细搜索区域 */}
                {showAdvancedSearch && (
                  <div className="w-full bg-muted/30 dark:bg-muted/20 rounded-xl p-4 border border-muted space-y-4 mb-4 shadow-sm">
                    {visibleFields
                      .filter((key) => key !== "companyName")
                      .map((key) => {
                        const field = allFields.find((f) => f.key === key);
                        return (
                          <div key={key} className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-muted-foreground">
                              {t(`table.fields.${key}`)}
                            </label>
                            {field?.filterType === "input" ? (
                              <Input
                                type="text"
                                // placeholder={t("table.searchPlaceholder", {
                                //   field: t(`table.fields.${key}`),
                                // })}
                                value={tempFilters[key] || ""}
                                onChange={(e) =>
                                  setTempFilters((prev) => ({
                                    ...prev,
                                    [key]: e.target.value,
                                  }))
                                }
                              />
                            ) : (
                              <select
                                value={tempFilters[key] || ""}
                                onChange={(e) =>
                                  setTempFilters((prev) => ({
                                    ...prev,
                                    [key]: e.target.value,
                                  }))
                                }
                                className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">{t("table.all")}</option>
                                {(fieldOptions[key] || []).map((option) => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </select>
                            )}
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>

              <div className="w-full grid gap-4">
                {paginatedData.map((row, i) => (
                  <div
                    key={i}
                    className="border rounded-2xl p-4 bg-card shadow-md space-y-3 transition hover:shadow-lg"
                  >
                    {/* 顶部信息：公司名 + 省份 */}
                    <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                      <Building2 className="w-5 h-5 text-blue-600 shrink-0" />
                      <span
                        className="truncate max-w-[180px] sm:max-w-[240px] md:max-w-[320px]"
                        title={row.companyName}
                      >
                        {row.companyName}
                      </span>
                      <span className="text-sm text-muted-foreground whitespace-nowrap">
                        （
                        {row.province ? (
                          row.province
                        ) : (
                          <em className="italic text-gray-400">未填写</em>
                        )}
                        ）
                      </span>
                    </div>

                    {/* 公司规模 */}
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{row.companySize || "未填写"}</span>
                    </div>

                    {/* 公司类型 */}
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Layers className="w-4 h-4" />
                      <span>{row.companyType || "未填写"}</span>
                    </div>
                    {/* 职业信息 */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Briefcase className="w-4 h-4" />
                      <span>{row.occupation}</span>
                    </div>

                    {/* 详情按钮 */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="mt-2">
                          <Eye className="w-4 h-4 mr-1" />
                          {t("table.viewDetail")}
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="max-h-[90vh] overflow-y-auto p-4 bg-white dark:bg-zinc-900 shadow-lg rounded-xl">
                        <DialogClose className="absolute top-4 right-4 text-muted-foreground hover:text-foreground" />
                        <DialogTitle className="text-lg font-semibold mb-4 pr-8 flex items-center gap-2">
                          <Info className="w-5 h-5 text-blue-500" />
                          {t("detail.title")}
                        </DialogTitle>

                        <div className="space-y-3 pt-2">
                          {visibleFields.map((key) => (
                            <div
                              key={key}
                              className="flex items-start gap-2 text-sm"
                            >
                              <strong className="w-32 shrink-0 text-muted-foreground">
                                {t(`table.fields.${key}`)}:
                              </strong>
                              <span className="break-words text-foreground">
                                {Array.isArray(row[key])
                                  ? row[key].join(", ")
                                  : row[key] || "—"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="relative w-full overflow-hidden">
              {/* 可滚动表格区域 */}
              <ScrollArea className="w-full overflow-x-auto pr-[120px]">
                {" "}
                {/* 为右侧操作栏预留空间 */}
                <div className="min-w-[1200px]">
                  <table className="min-w-full table-fixed border-collapse text-sm">
                    <thead ref={headerRef}>
                      {/* 表头第一行 */}
                      <tr className="bg-muted text-muted-foreground border-b">
                        {visibleFields.map((key) => {
                          const field = allFields.find((f) => f.key === key);
                          return (
                            <th
                              key={key}
                              className="px-4 py-2 text-left font-semibold truncate"
                              style={{
                                maxWidth: field?.maxWidth,
                                width: field?.maxWidth,
                              }}
                            >
                              {t(`table.fields.${key}`)}
                            </th>
                          );
                        })}
                      </tr>

                      {/* 筛选输入行 */}
                      <tr className="border-b bg-background truncate">
                        {visibleFields.map((key) => {
                          const field = allFields.find((f) => f.key === key);
                          return (
                            <th
                              key={key}
                              className="px-4 py-2"
                              style={{
                                maxWidth: field?.maxWidth,
                                width: field?.maxWidth,
                              }}
                            >
                              {field?.filterType === "input" ? (
                                <input
                                  type="text"
                                  value={tempFilters[key] || ""}
                                  onChange={(e) =>
                                    setTempFilters((prev) => ({
                                      ...prev,
                                      [key]: e.target.value,
                                    }))
                                  }
                                  placeholder={t("table.filterPlaceholder")}
                                  className="w-full px-4 py-2 rounded-lg border bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              ) : (
                                <select
                                  value={tempFilters[key] || ""}
                                  onChange={(e) =>
                                    setTempFilters((prev) => ({
                                      ...prev,
                                      [key]: e.target.value,
                                    }))
                                  }
                                  className="w-full px-4 py-2 rounded-lg border bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  <option value="">{t("table.all")}</option>
                                  {(fieldOptions[key] || []).map((option) => (
                                    <option key={option} value={option}>
                                      {option}
                                    </option>
                                  ))}
                                </select>
                              )}
                            </th>
                          );
                        })}
                      </tr>
                    </thead>

                    <tbody>
                      {paginatedData.length === 0 ? (
                        <tr>
                          <td
                            colSpan={visibleFields.length}
                            className="text-center text-sm text-muted-foreground py-6"
                          >
                            {t("table.empty")}
                          </td>
                        </tr>
                      ) : (
                        paginatedData.map((row, i) => (
                          <tr
                            key={i}
                            className="cursor-pointer h-[50px] border-b transition-all duration-200 ease-in-out hover:bg-muted/60 dark:hover:bg-muted/40"
                          >
                            {visibleFields.map((key) => {
                              const field = allFields.find(
                                (f) => f.key === key
                              );
                              return (
                                <td
                                  key={key}
                                  className="px-4 py-2 whitespace-nowrap"
                                  style={{ maxWidth: field?.maxWidth }}
                                >
                                  <div className="truncate">
                                    {Array.isArray(row[key])
                                      ? row[key].join(", ")
                                      : row[key]}
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </ScrollArea>

              {/* 右侧固定操作栏 */}
              <div
                className="absolute right-0 w-[120px] bg-background border-l z-50"
                style={{ top: "90px" }}
              >
                {paginatedData.map((row, i) => (
                  <div
                    key={i}
                    className="h-[50px] flex items-center justify-center border-b hover:bg-muted/50 transition-colors bg-white dark:bg-zinc-900"
                  >
                    <Button
                      size="sm"
                      variant="link"
                      onClick={() => setDetailRow(row)}
                      className="flex items-center"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      {t("table.viewDetail")}
                    </Button>
                  </div>
                ))}
              </div>

              {/* 筛选栏右侧按钮与“操作”标题 */}
              <div
                className="absolute right-0 w-[120px] bg-background border-l flex flex-col p-0 bg-white dark:bg-zinc-900"
                style={{ height: `97px`, top: "-8px" }} // 表头 + 筛选行总高度
              >
                {/* 对齐表头 */}
                <div className="flex items-center justify-center border-b h-[44.5px]">
                  <span className="font-semibold text-sm mt-2">
                    {t("table.actions")}
                  </span>
                </div>

                {/* 对齐筛选行 */}
                <div className="flex items-center justify-center h-[44.5px]">
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white dark:bg-blue-500 dark:hover:bg-blue-600 dark:active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-md transition-colors duration-200 mt-2"
                    onClick={() => setFilters(tempFilters)}
                  >
                    {t("table.confirm")}
                  </Button>
                </div>
              </div>

              {/* 弹窗详情 */}
              {detailRow && (
                <Dialog
                  open={!!detailRow}
                  onOpenChange={() => setDetailRow(null)}
                >
                  <DialogContent className="max-h-[90vh] overflow-y-auto p-4 bg-white dark:bg-zinc-900 shadow-lg rounded-lg">
                    <DialogTitle className="text-lg font-semibold mb-4">
                      {t("detail.title")}
                    </DialogTitle>
                    {visibleFields.map((key) => (
                      <div key={key} className="mb-2">
                        <strong className="inline-block w-32 text-muted-foreground">
                          {t(`table.fields.${key}`)}:
                        </strong>
                        {Array.isArray(detailRow[key])
                          ? detailRow[key].join(", ")
                          : detailRow[key]}
                      </div>
                    ))}
                  </DialogContent>
                </Dialog>
              )}
            </div>
          )}
          <div className="flex justify-center items-center gap-4 pt-4 flex-wrap">
            {/* 上一页按钮 */}
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              {t("pagination.prev")}
            </Button>

            {/* 当前页 / 总页数显示 */}
            <div className="text-sm text-muted-foreground">
              {t("pagination.pageIndicator", {
                currentPage,
                totalPages,
              })}
            </div>

            {/* 下一页按钮 */}
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              {t("pagination.next")}
            </Button>

            {/* 跳转页功能 */}
            <div className="flex items-center gap-1 ml-4">
              <Input
                type="number"
                min={1}
                max={totalPages}
                value={jumpPageInput}
                onChange={(e) => setJumpPageInput(e.target.value)}
                placeholder={t("pagination.jumpPlaceholder")}
                className="w-20 h-8"
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  const pageNum = parseInt(jumpPageInput);
                  if (
                    !isNaN(pageNum) &&
                    pageNum >= 1 &&
                    pageNum <= totalPages
                  ) {
                    setCurrentPage(pageNum);
                  }
                }}
              >
                {t("pagination.jump")}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex flex-col items-center justify-center min-h-[300px] w-full text-muted-foreground text-sm px-4"
        >
          <div className="relative flex items-center justify-center mb-4">
            <div className="absolute w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            <div className="w-4 h-4 bg-primary rounded-full" />
          </div>
          <p className="text-center text-base font-medium">{t("loading")}</p>
        </motion.div>
      )}
    </div>
  );
}
