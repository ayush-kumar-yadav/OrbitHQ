import { useDroppable } from "@dnd-kit/core";
import { Inbox } from "lucide-react";
import KanbanCard from "./KanbanCard";

type Props = {
  id: string;
  title: string;
  color: string;
  tasks: any[];
};

export default function KanbanColumn({ id, title, color, tasks }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className="flex min-w-[280px] flex-1 flex-col">
      <div className="mb-3 flex items-center gap-2 px-1">
        <span
          className="h-2 w-2 shrink-0 rounded-full"
          style={{ backgroundColor: color }}
        />
        <h2 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#AEB2BD]">
          {title}
        </h2>
        <span className="ml-auto rounded-full bg-white/[0.06] px-2 py-0.5 text-[11px] font-medium text-[#8D919D]">
          {tasks.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={`flex flex-1 flex-col gap-2.5 rounded-2xl border p-2.5 transition-colors ${
          isOver
            ? "border-white/[0.18] bg-white/[0.03]"
            : "border-white/[0.05] bg-white/[0.015]"
        }`}
        style={{ minHeight: 140 }}
      >
        {tasks.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 py-10 text-center">
            <Inbox size={18} className="text-[#3A3E48]" />
            <p className="text-xs text-[#4F5460]">No tasks here</p>
          </div>
        ) : (
          tasks.map((task) => <KanbanCard key={task._id} task={task} />)
        )}
      </div>
    </div>
  );
}