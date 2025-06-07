"use client";

import { useEffect, useState, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CustomDialog from "@/components/ui/CustomDialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Info } from "lucide-react";
import { Download, Settings, Eye } from "lucide-react";
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

  range.push(1); // always show first

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
    range.push(total); // always show last
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
  province: ["北京", "上海", "广东"],
  city: ["北京", "上海", "广州"],
  district: ["朝阳区", "黄浦区", "天河区"],
  longWorkIssues: ["加班严重", "任务繁重", "节奏快"],
  discriminationReasons: ["性别", "年龄", "学历"],
  violationsObserved: ["克扣工资", "不签合同"],
  expectedChanges: ["提高福利", "减轻压力"],
  story: ["有趣经历", "辛酸往事"],
};

export default function SurveyTablePage() {
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
    const headers = visibleFields.map(
      (key) => allFields.find((f) => f.key === key)?.label
    );
    const rows = paginatedData.map((row) =>
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
  return (
    <div className="w-full ">
      {paginatedData.length > 0 ? (
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 overflow-x-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">数据展示表</h1>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  表格设置
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-lg bg-white dark:bg-zinc-900 shadow-lg rounded-lg">
                <DialogTitle className="text-lg font-semibold">
                  表格字段设置
                </DialogTitle>

                <div className="text-sm text-muted-foreground mb-4">
                  请选择你希望在表格中显示的字段。
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
                      {/* <span htmlFor={`field-${field.key}`}>{field.label}</span> */}
                      <label htmlFor={`field-${field.key}`}>{field.label}</label>
                    </label>
                  ))}
                </div>

                <div className="mt-6 flex justify-end gap-2">
                  <Button variant="secondary" onClick={downloadCSV}>
                    <Download className="w-4 h-4 mr-2" />
                    下载数据
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {isMobile ? (
            <div className="wfull grid gap-4">
              {paginatedData.map((row, i) => (
                <div
                  key={i}
                  className="border rounded-lg p-4 bg-card shadow-sm space-y-2"
                >
                  <div className="font-semibold">
                    {row.companyName}（{row.province}）
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {row.occupation}
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="link">
                        <Eye className="w-4 h-4 mr-1" /> 查看详情
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="max-h-[90vh] overflow-y-auto p-4 bg-white dark:bg-zinc-900 shadow-lg rounded-lg">
                      {/* 关闭按钮，固定在右上角 */}
                      <DialogClose className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"></DialogClose>

                      {/* 标题 */}
                      <DialogTitle className="text-lg font-semibold mb-4 pr-8">
                        详细内容
                      </DialogTitle>

                      {/* 内容 */}
                      <div className="space-y-2 pt-2">
                        {visibleFields.map((key) => (
                          <div key={key} className="flex">
                            <strong className="inline-block w-32 shrink-0 text-muted-foreground">
                              {allFields.find((f) => f.key === key)?.label}:
                            </strong>
                            <span className="break-words">
                              {Array.isArray(row[key])
                                ? row[key].join(", ")
                                : row[key]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              ))}
            </div>
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
                              className="px-4 py-2 text-left font-semibold whitespace-nowrap"
                              style={{
                                maxWidth: field?.maxWidth,
                                width: field?.maxWidth,
                              }}
                            >
                              {field?.label}
                            </th>
                          );
                        })}
                      </tr>

                      {/* 筛选输入行 */}
                      <tr className="border-b bg-background">
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
                                  placeholder="请输入关键词"
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
                                  <option value="">全部</option>
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
                      {paginatedData.map((row, i) => (
                        <tr
                          key={i}
                          className="h-[50px] border-b hover:bg-muted/50 transition-colors"
                        >
                          {visibleFields.map((key) => {
                            const field = allFields.find((f) => f.key === key);
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
                      ))}
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
                      查看详情
                    </Button>
                  </div>
                ))}
              </div>

              {/* 筛选栏右侧按钮与“操作”标题 */}
              <div
                className="absolute right-0 w-[120px] bg-background border-l flex flex-col p-0 bg-white dark:bg-zinc-900"
                style={{ height: `97px`, top: "-8px"}} // 表头 + 筛选行总高度
              >
                {/* 对齐表头 */}
                <div className="flex items-center justify-center border-b h-[44.5px]">
                  <span className="font-semibold text-sm mt-2">操作</span>
                </div>

                {/* 对齐筛选行 */}
                <div className="flex items-center justify-center h-[44.5px]">
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white dark:bg-blue-500 dark:hover:bg-blue-600 dark:active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-md transition-colors duration-200 mt-2"
                    onClick={() => setFilters(tempFilters)}
                  >
                    确认
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
                      详情信息
                    </DialogTitle>
                    {visibleFields.map((key) => (
                      <div key={key} className="mb-2">
                        <strong className="inline-block w-32">
                          {allFields.find((f) => f.key === key)?.label}:
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
              上一页
            </Button>

            {/* 当前页 / 总页数显示 */}
            <div className="text-sm text-muted-foreground">
              第 <span className="font-medium text-primary">{currentPage}</span>{" "}
              页 / 共{" "}
              <span className="font-medium text-primary">{totalPages}</span> 页
            </div>

            {/* 下一页按钮 */}
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              下一页
            </Button>

            {/* 跳转页功能 */}
            <div className="flex items-center gap-1 ml-4">
              <Input
                type="number"
                min={1}
                max={totalPages}
                value={jumpPageInput}
                onChange={(e) => setJumpPageInput(e.target.value)}
                placeholder="页码"
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
                跳转
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
          <p className="text-center text-base font-medium">
            正在加载数据，请稍候...
          </p>
        </motion.div>
      )}
    </div>
  );
}
