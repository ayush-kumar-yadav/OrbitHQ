import { useNavigate } from "react-router-dom";
import { CalendarClock } from "lucide-react";

type Props = {
  task: any;
};

const STATUS_META: Record<string, { label: string; tone: string; dot: string }> = {
  TODO: {
    label: "To do",
    tone: "bg-white/[0.06] text-[#8D919D]",
    dot: "bg-[#8D919D]",
  },
  IN_PROGRESS: {
    label: "In progress",
    tone: "bg-[#4C6FFF]/10 text-[#7187FF]",
    dot: "bg-[#4C6FFF]",
  },
  IN_REVIEW: {
    label: "In review",
    tone: "bg-[#F5A623]/10 text-[#F5A623]",
    dot: "bg-[#F5A623]",
  },
  DONE: {
    label: "Done",
    tone: "bg-[#2FD9C4]/10 text-[#2FD9C4]",
    dot: "bg-[#2FD9C4]",
  },
};

const PRIORITY_META: Record<string, { label: string; tone: string; dot: string }> = {
  LOW: {
    label: "Low",
    tone: "bg-white/[0.06] text-[#8D919D]",
    dot: "bg-[#8D919D]",
  },
  MEDIUM: {
    label: "Medium",
    tone: "bg-[#4C6FFF]/10 text-[#7187FF]",
    dot: "bg-[#4C6FFF]",
  },
  HIGH: {
    label: "High",
    tone: "bg-[#F5A623]/10 text-[#F5A623]",
    dot: "bg-[#F5A623]",
  },
  URGENT: {
    label: "Urgent",
    tone: "bg-[#FF5C6C]/10 text-[#FF6B78]",
    dot: "bg-[#FF5C6C]",
  },
};

function dueLabel(dueDate?: string) {
  if (!dueDate) return null;

  const diffDays = Math.ceil(
    (new Date(dueDate).getTime() - Date.now()) / 86_400_000
  );

  if (diffDays < 0) return { text: "Overdue", tone: "text-[#FF6B78]" };
  if (diffDays === 0) return { text: "Due today", tone: "text-[#F5A623]" };
  if (diffDays <= 2) return { text: `${diffDays}d left`, tone: "text-[#F5A623]" };

  return {
    text: new Date(dueDate).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
    tone: "text-[#626775]",
  };
}

export default function TaskCard({ task }: Props) {
  const navigate = useNavigate();

  const status = STATUS_META[task.status] ?? STATUS_META.TODO;
  const priority = PRIORITY_META[task.priority] ?? PRIORITY_META.LOW;
  const due = dueLabel(task.dueDate);

  return (
    <div
      onClick={() => navigate(`/tasks/${task._id}`)}
      className="group cursor-pointer rounded-xl border border-white/[0.07] bg-[#10121A] p-4 transition hover:border-white/[0.14] hover:bg-[#12151E]"
    >
      <h2 className="text-sm font-medium leading-snug text-[#EDEEF2]">
        {task.title}
      </h2>

      <p className="mt-1.5 line-clamp-2 text-xs text-[#8D919D]">
        {task.description || "No description"}
      </p>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ${status.tone}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
            {status.label}
          </span>

          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ${priority.tone}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${priority.dot}`} />
            {priority.label}
          </span>
        </div>

        {due && (
          <span className={`flex items-center gap-1 text-[11px] font-medium ${due.tone}`}>
            <CalendarClock size={12} />
            {due.text}
          </span>
        )}
      </div>
    </div>
  );
}