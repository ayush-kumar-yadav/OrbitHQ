import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";

type Props = {
  tasks: any[];
};

const STATUS_META = [
  { key: "TODO", label: "To do", color: "#8D919D" },
  { key: "IN_PROGRESS", label: "In progress", color: "#4C6FFF" },
  { key: "IN_REVIEW", label: "In review", color: "#F5A623" },
  { key: "DONE", label: "Done", color: "#2FD9C4" },
];

function ChartTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const entry = payload[0];

  return (
    <div className="rounded-lg border border-white/10 bg-[#0c0e14] px-3 py-2 text-xs shadow-xl">
      <p className="font-medium text-white">{entry.name}</p>
      <p className="text-[#8D919D]">{entry.value} tasks</p>
    </div>
  );
}

export default function TaskStatusChart({ tasks }: Props) {
  const data = STATUS_META.map((s) => ({
    name: s.label,
    value: tasks.filter((t) => t.status === s.key).length,
    color: s.color,
  }));

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#626775]">
        Breakdown
      </p>
      <h3 className="mt-1 font-display text-[15px] text-white">
        Task Status
      </h3>

      {total === 0 ? (
        <div className="flex flex-col items-center justify-center py-14 text-center">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.04]">
            <PieChartIcon size={18} className="text-[#4F5460]" />
          </div>
          <p className="text-sm text-[#8D919D]">No tasks yet.</p>
        </div>
      ) : (
        <div className="mt-2 flex items-center gap-6">
          <div className="relative h-[180px] w-[180px] shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  innerRadius={58}
                  outerRadius={80}
                  paddingAngle={data.filter((d) => d.value > 0).length > 1 ? 3 : 0}
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-semibold tracking-tight text-white">
                {total}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[#626775]">
                Total
              </span>
            </div>
          </div>

          <div className="flex-1 space-y-2.5">
            {data.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2.5">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="flex-1 text-xs text-[#8D919D]">
                  {entry.name}
                </span>
                <span className="text-xs font-medium text-white">
                  {entry.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}