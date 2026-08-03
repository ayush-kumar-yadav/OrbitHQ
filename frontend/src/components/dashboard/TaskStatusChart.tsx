import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Props = {
  tasks: any[];
};

const COLORS = [
  "#3B82F6",
  "#F59E0B",
  "#8B5CF6",
  "#10B981",
];

export default function TaskStatusChart({
  tasks,
}: Props) {
  const data = [
    {
      name: "TODO",
      value: tasks.filter(
        (t) => t.status === "TODO"
      ).length,
    },
    {
      name: "IN_PROGRESS",
      value: tasks.filter(
        (t) => t.status === "IN_PROGRESS"
      ).length,
    },
    {
      name: "IN_REVIEW",
      value: tasks.filter(
        (t) => t.status === "IN_REVIEW"
      ).length,
    },
    {
      name: "DONE",
      value: tasks.filter(
        (t) => t.status === "DONE"
      ).length,
    },
  ];

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-xl font-semibold">
        Task Status
      </h2>

      <ResponsiveContainer
        width="100%"
        height={300}
      >
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            outerRadius={100}
            label
          >
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={COLORS[index]}
              />
            ))}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}