import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from "recharts";

type Props = {
  tasks: any[];
};

export default function ProductivityChart({
  tasks,
}: Props) {
  const week = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ];

  const chartData = week.map((day, index) => ({
    day,
    tasks: tasks.filter((task) => {
      if (!task.createdAt) return false;

      return (
        new Date(task.createdAt).getDay() ===
        index
      );
    }).length,
  }));

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-xl font-semibold">
        Weekly Productivity
      </h2>

      <ResponsiveContainer
        width="100%"
        height={300}
      >
        <BarChart data={chartData}>
          <XAxis dataKey="day" />

          <YAxis />

          <Tooltip />

          <Bar dataKey="tasks" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}