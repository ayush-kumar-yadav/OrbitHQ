import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Cell,
} from "recharts";
import { BarChart3 } from "lucide-react";

type Props = {
  tasks: any[];
};

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-white/10 bg-[#0c0e14] px-3 py-2 text-xs shadow-xl">
      <p className="font-medium text-white">{label}</p>
      <p className="text-[#8D919D]">
        {payload[0].value} {payload[0].value === 1 ? "task" : "tasks"} created
      </p>
    </div>
  );
}

export default function ProductivityChart({ tasks }: Props) {
  const week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Start of the current week (Sunday 00:00:00, local time).
  const now = new Date();
  const startOfWeek = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - now.getDay()
  );

  // Exclusive end: the following Sunday 00:00:00.
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 7);

  // Only tasks actually created in the current week count toward
  // "this week" — previously this filtered on nothing, so a task
  // from any past week landed in whichever weekday bucket matched
  // its createdAt, silently inflating the chart.
  const tasksThisWeek = tasks.filter((task) => {
    if (!task.createdAt) return false;
    const createdAt = new Date(task.createdAt);
    return createdAt >= startOfWeek && createdAt < endOfWeek;
  });

  const chartData = week.map((day, index) => ({
    day,
    tasks: tasksThisWeek.filter(
      (task) => new Date(task.createdAt).getDay() === index
    ).length,
  }));

  const total = chartData.reduce((sum, d) => sum + d.tasks, 0);
  const busiestIndex = chartData.reduce(
    (best, d, i) => (d.tasks > chartData[best].tasks ? i : best),
    0
  );

  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#626775]">
        This week
      </p>
      <h3 className="mt-1 font-display text-[15px] text-white">
        Weekly Productivity
      </h3>

      {total === 0 ? (
        <div className="flex flex-col items-center justify-center py-14 text-center">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.04]">
            <BarChart3 size={18} className="text-[#4F5460]" />
          </div>
          <p className="text-sm text-[#8D919D]">No activity this week.</p>
        </div>
      ) : (
        <div className="mt-4">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} barCategoryGap="32%">
              <defs>
                <linearGradient id="orbitBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#5C7CFF" />
                  <stop offset="100%" stopColor="#4C6FFF" />
                </linearGradient>
              </defs>

              <CartesianGrid
                vertical={false}
                stroke="rgba(255,255,255,0.06)"
              />

              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#626775", fontSize: 12 }}
              />

              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                width={24}
                tick={{ fill: "#626775", fontSize: 12 }}
              />

              <Tooltip
                content={<ChartTooltip />}
                cursor={{ fill: "rgba(255,255,255,0.03)" }}
              />

              <Bar dataKey="tasks" radius={[6, 6, 0, 0]} maxBarSize={36}>
                {chartData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={
                      index === busiestIndex
                        ? "url(#orbitBar)"
                        : "rgba(76,111,255,0.28)"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}