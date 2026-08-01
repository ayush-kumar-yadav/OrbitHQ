import {
  CheckSquare,
  Users,
  MessageSquare,
  Activity,
} from "lucide-react";

type ProjectStatsProps = {
  tasks: number;
  members: number;
  comments: number;
  activity: number;
};

export default function ProjectStats({
  tasks,
  members,
  comments,
  activity,
}: ProjectStatsProps) {
  const stats = [
    {
      title: "Tasks",
      value: tasks,
      icon: CheckSquare,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Members",
      value: members,
      icon: Users,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Comments",
      value: comments,
      icon: MessageSquare,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      title: "Activity",
      value: activity,
      icon: Activity,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.bg}`}
            >
              <Icon className={`h-6 w-6 ${stat.color}`} />
            </div>

            <p className="mt-5 text-sm font-medium text-gray-500">
              {stat.title}
            </p>

            <h3 className="mt-1 text-3xl font-bold text-gray-900">
              {stat.value}
            </h3>
          </div>
        );
      })}
    </div>
  );
}