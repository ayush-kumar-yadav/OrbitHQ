import { useNavigate } from "react-router-dom";
import { ListTodo, ArrowUpRight } from "lucide-react";
import { useTasks } from "../../hooks/tasks/useTasks";

type Props = {
  projectId: string;
};

const STATUS_META: Record<string, { label: string; color: string }> = {
  TODO: { label: "To do", color: "#8D919D" },
  IN_PROGRESS: { label: "In progress", color: "#4C6FFF" },
  IN_REVIEW: { label: "In review", color: "#F5A623" },
  DONE: { label: "Done", color: "#2FD9C4" },
};

export default function TaskList({ projectId }: Props) {
  const navigate = useNavigate();
  const { data, isLoading, error, refetch, isRefetching } = useTasks(projectId);

  const tasks = data?.data?.tasks || [];

  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#626775]">
        Overview
      </p>
      <h2 className="mt-1 font-display text-[17px] text-white">
        Tasks
      </h2>

      {isLoading && (
        <div className="mt-5 space-y-2.5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-xl bg-white/[0.03]"
            />
          ))}
        </div>
      )}

      {error && (
        <div className="mt-5 flex items-center gap-3">
          <p className="text-sm text-[#FF7B87]">
            Failed to load tasks.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="text-xs font-medium text-[#8D919D] underline underline-offset-2 transition hover:text-white disabled:opacity-50"
          >
            {isRefetching ? "Retrying..." : "Retry"}
          </button>
        </div>
      )}

      {!isLoading && !error && tasks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.04]">
            <ListTodo size={18} className="text-[#4F5460]" />
          </div>
          <p className="text-sm text-[#8D919D]">No tasks yet.</p>
        </div>
      )}

      {!isLoading && tasks.length > 0 && (
        <div className="mt-4 space-y-1.5">
          {tasks.map((task: any) => {
            const status = STATUS_META[task.status] ?? STATUS_META.TODO;

            return (
              <div
                key={task._id}
                onClick={() => navigate(`/tasks/${task._id}`)}
                className="group flex cursor-pointer items-center gap-3 rounded-xl border border-transparent px-2 py-2.5 transition hover:border-white/[0.08] hover:bg-white/[0.03]"
              >
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: status.color }}
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[#EDEEF2]">
                    {task.title}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-[#626775]">
                    {task.description || "No description"}
                  </p>
                </div>

                <span
                  className="shrink-0 text-[11px] font-medium"
                  style={{ color: status.color }}
                >
                  {status.label}
                </span>

                <ArrowUpRight
                  size={14}
                  className="shrink-0 text-[#4F5460] opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100"
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}