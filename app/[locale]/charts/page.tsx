"use client";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  Cell,
  Legend,
  BarChart,
  XAxis,
  Bar,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";
import { TooltipProps } from "recharts";

const COLORS = [
  "#5F7379",
  "#8C9D9A",
  "#BDBDA3",
  "#A2A69A",
  "#7B8B8F",
  "#D9CAB3",
  "#748C8A",
];

type ChartData = { name: string; value: number };

const CustomizedTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-md border bg-popover text-popover-foreground shadow-md px-3 py-2 text-sm">
      <div className="font-semibold">{label}</div>
      <div>{payload[0].value} 人</div>
    </div>
  );
};

function ChartCard({ title, data }: { title: string; data: ChartData[] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="rounded-2xl shadow-md p-2 bg-card text-foreground w-full">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="w-full h-[400px]">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#f0f4f8",
                borderRadius: 8,
                border: "none",
                boxShadow: "0 2px 8px rgba(75, 108, 140, 0.2)",
              }}
              itemStyle={{ color: "#4B6C8C" }}
            />
            <Legend
              verticalAlign="bottom"
              height={60}
              wrapperStyle={{ fontSize: 12, color: "#4B6C8C" }}
              content={({ payload }) => {
                if (!payload) return null;
                return (
                  <ul className="flex flex-wrap justify-center gap-4 p-0 m-0 list-none">
                    {payload.map((entry, index) => {
                      const p = entry.payload as
                        | { name?: string; value?: number }
                        | undefined;
                      if (!p) return null;
                      const count = typeof p.value === "number" ? p.value : 0;
                      const percent = total ? (count / total) * 100 : 0;
                      const label = p.name ?? "未知";
                      return (
                        <li
                          key={`legend-${index}`}
                          className="flex items-center space-x-2"
                        >
                          <span
                            className="w-4 h-4 rounded-sm"
                            style={{ backgroundColor: entry.color }}
                          />
                          <span>
                            {label} ({percent.toFixed(0)}%)
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function ChartsPage() {
  const t = useTranslations("charts");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [dailyWorkData, setDailyWorkData] = useState<ChartData[]>([]);
  const [weeklyWorkData, setWeeklyWorkData] = useState<ChartData[]>([]);
  const [companySizeData, setCompanySizeData] = useState<ChartData[]>([]);
  const [companyTypeData, setCompanyTypeData] = useState<ChartData[]>([]);
  const [provinceData, setProvinceData] = useState<ChartData[]>([]);
  const [overtimePayData, setOvertimePayData] = useState<ChartData[]>([]);
  const [negativeConsequenceData, setNegativeConsequenceData] = useState<
    ChartData[]
  >([]);
  const [genderData, setGenderData] = useState<ChartData[]>([]);
  const [ageRangeData, setAgeRangeData] = useState<ChartData[]>([]);
  const [occupationData, setOccupationData] = useState<ChartData[]>([]);

  const primaryBarColor = "#8C9D9A";
  const hoverBarColor = "#7B8B8F";

  const minBarWidthPerItem = 60;

  const chartDynamicWidth = Math.max(
    occupationData.length * minBarWidthPerItem,
    600
  );

  useEffect(() => {
    fetch("/api/entries/work-hours-pie")
      .then((res) => res.json())
      .then(setDailyWorkData);

    fetch("/api/entries/work-days-pie")
      .then((res) => res.json())
      .then(setWeeklyWorkData);

    fetch("/api/entries/company-size-pie")
      .then((res) => res.json())
      .then(setCompanySizeData);
    fetch("/api/entries/company-type-pie")
      .then((res) => res.json())
      .then(setCompanyTypeData);
    fetch("/api/entries/province-bar")
      .then((res) => res.json())
      .then(setProvinceData);
    fetch("/api/entries/overtime-pay-pie")
      .then((res) => res.json())
      .then(setOvertimePayData);
    fetch("/api/entries/negative-consequence-pie")
      .then((res) => res.json())
      .then(setNegativeConsequenceData);
    fetch("/api/entries/gender-pie")
      .then((res) => res.json())
      .then(setGenderData);
    fetch("/api/entries/age-range-pie")
      .then((res) => res.json())
      .then(setAgeRangeData);
    fetch("/api/entries/occupation-bar")
      .then((res) => res.json())
      .then(setOccupationData);
  }, []);

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[1800px] mx-auto">
      <ChartCard title={t("dailyWorkData")} data={dailyWorkData} />
      <ChartCard title={t("weeklyWorkData")} data={weeklyWorkData} />
      <ChartCard title={t("companySizeData")} data={companySizeData} />
      <ChartCard title={t("companyTypeData")} data={companyTypeData} />
      <div className="rounded-2xl shadow-md p-6 bg-card text-foreground col-span-1 md:col-span-2">
        <h2 className="text-xl font-semibold mb-1">{t("provinceBar.title")}</h2>
        <p className="text-sm text-muted-foreground mb-4">
          {t("provinceBar.desc")}
        </p>
        <div className="w-full h-[400px] min-w-[320px] overflow-x-auto pb-4">
          <ResponsiveContainer width={chartDynamicWidth} height="100%">
            <BarChart
              data={provinceData}
              margin={{ top: 10, right: 30, left: 0, bottom: 50 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e0e0e0"
                vertical={false}
              />{" "}
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                interval={0}
                height={60}
                tick={{ fontSize: 12, fill: "currentColor" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                label={{
                  value: "人数",
                  angle: -90,
                  position: "insideLeft",
                  offset: 10,
                  fill: "currentColor",
                  fontSize: 12,
                }}
                tick={{ fontSize: 12, fill: "currentColor" }}
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={CustomizedTooltip}
                wrapperStyle={{ outline: "none" }}
                cursor={{ fill: "rgba(189, 189, 163, 0.1)" }}
              />
              <Bar
                dataKey="value"
                radius={[5, 5, 0, 0]}
                animationDuration={800}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {provinceData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      index === activeIndex ? hoverBarColor : primaryBarColor
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <ChartCard title={t("overtimePayData")} data={overtimePayData} />
      <ChartCard
        title={t("negativeConsequenceData")}
        data={negativeConsequenceData}
      />
      <ChartCard title={t("genderData")} data={genderData} />
      <ChartCard title={t("ageRangeData")} data={ageRangeData} />
      <div className="rounded-2xl shadow-md p-6 bg-card text-foreground col-span-1 md:col-span-2 mb-6">
        <h2 className="text-xl font-semibold mb-2">
          {t("occupationBar.title")}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {t("occupationBar.desc")}
        </p>

        <div className="w-full h-[400px] min-w-[320px] overflow-x-auto pb-4">
          <ResponsiveContainer width={chartDynamicWidth} height="100%">
            <BarChart
              data={occupationData}
              margin={{ top: 10, right: 30, left: 0, bottom: 60 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e0e0e0"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                interval={0}
                height={60}
                tick={{ fontSize: 12, fill: "currentColor" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                label={{
                  value: "人数",
                  angle: -90,
                  position: "insideLeft",
                  offset: 10,
                  fill: "currentColor",
                  fontSize: 12,
                }}
                tick={{ fontSize: 12, fill: "currentColor" }}
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={CustomizedTooltip}
                wrapperStyle={{ outline: "none" }}
                cursor={{ fill: "rgba(189, 189, 163, 0.1)" }}
              />
              <Bar
                dataKey="value"
                radius={[4, 4, 0, 0]}
                animationDuration={800}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {occupationData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      index === activeIndex ? hoverBarColor : primaryBarColor
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
