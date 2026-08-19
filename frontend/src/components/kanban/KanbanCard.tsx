import { useDraggable } from "@dnd-kit/core";
import { CalendarClock, GripVertical } from "lucide-react";

type Props = {
  task: any;
  dragging?: boolean;
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

export default function KanbanCard({ task, dragging }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: task._id, data: { task } });

  const priority = PRIORITY_META[task.priority] ?? PRIORITY_META.LOW;
  const due = dueLabel(task.dueDate);

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group rounded-xl border border-white/[0.07] bg-[#10121A] p-3.5 transition ${
        isDragging ? "opacity-30" : "hover:border-white/[0.14] hover:bg-[#12151E]"
      } ${dragging ? "rotate-2 shadow-2xl shadow-black/40" : ""}`}
    >
      <div className="flex items-start gap-2">
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 shrink-0 cursor-grab touch-none text-[#3A3E48] opacity-0 transition group-hover:opacity-100 active:cursor-grabbing"
          aria-label="Drag task"
        >
          <GripVertical size={14} />
        </button>

        <p className="min-w-0 flex-1 text-sm font-medium leading-snug text-[#EDEEF2]">
          {task.title}
        </p>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 pl-[22px]">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ${priority.tone}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${priority.dot}`} />
          {priority.label}
        </span>

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