import { CalendarClock, CalendarCheck2 } from "lucide-react";

type Props = {
  tasks: any[];
};

function dueMeta(dueDate?: string) {
  if (!dueDate) {
    return { label: "No due date", tone: "text-[#4F5460]" };
  }

  const diffDays = Math.ceil(
    (new Date(dueDate).getTime() - Date.now()) / 86_400_000
  );

  if (diffDays < 0) {
    return { label: "Overdue", tone: "text-[#FF6B78]" };
  }
  if (diffDays === 0) {
    return { label: "Due today", tone: "text-[#F5A623]" };
  }
  if (diffDays <= 2) {
    return { label: `Due in ${diffDays}d`, tone: "text-[#F5A623]" };
  }

  return {
    label: new Date(dueDate).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
    tone: "text-[#8D919D]",
  };
}

export default function UpcomingDeadlines({ tasks }: Props) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.04]">
          <CalendarCheck2 size={18} className="text-[#4F5460]" />
        </div>
        <p className="text-sm text-[#8D919D]">
          You're all caught up.
        </p>
        <p className="mt-1 text-xs text-[#4F5460]">
          No upcoming deadlines right now.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {tasks.map((task: any) => {
        const meta = dueMeta(task.dueDate);

        return (
          <div
            key={task._id}
            className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition hover:bg-white/[0.03]"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] text-[#8D919D]">
              <CalendarClock size={16} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[#EDEEF2]">
                {task.title}
              </p>

              <p className="mt-0.5 truncate text-xs text-[#626775]">
                {task.projectId?.name ?? "No project"}
              </p>
            </div>

            <span className={`shrink-0 text-xs font-medium ${meta.tone}`}>
              {meta.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}