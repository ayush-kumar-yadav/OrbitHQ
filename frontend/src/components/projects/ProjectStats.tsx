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
      tone: "bg-[#4C6FFF]/10 text-[#7187FF]",
    },
    {
      title: "Members",
      value: members,
      icon: Users,
      tone: "bg-[#2FD9C4]/10 text-[#2FD9C4]",
    },
    {
      title: "Comments",
      value: comments,
      icon: MessageSquare,
      tone: "bg-[#F5A623]/10 text-[#F5A623]",
    },
    {
      title: "Activity",
      value: activity,
      icon: Activity,
      tone: "bg-white/[0.06] text-[#8D919D]",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="group rounded-2xl border border-white/[0.07] bg-[#10121A] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/[0.12]"
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.tone}`}
            >
              <Icon size={18} />
            </div>

            <p className="mt-5 text-xs font-medium text-[#626775]">
              {stat.title}
            </p>

            <h3 className="mt-1 text-3xl font-semibold tracking-tight text-white">
              {stat.value}
            </h3>
          </div>
        );
      })}
    </div>
  );
}