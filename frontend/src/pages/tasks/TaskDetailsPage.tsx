import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  FolderKanban,
  CalendarClock,
  User,
  Tag,
} from "lucide-react";

import TaskActivity from "../../components/tasks/TaskActivity";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useTask } from "../../hooks/tasks/useTask";
import { useUpdateTaskStatus } from "../../hooks/tasks/useUpdateTaskStatus";
import { useUpdateTask } from "../../hooks/tasks/useUpdateTask";
import TaskComments from "../../components/tasks/TaskComments";

const STATUS_OPTIONS = [
  { value: "TODO", label: "To do", color: "#8D919D" },
  { value: "IN_PROGRESS", label: "In progress", color: "#4C6FFF" },
  { value: "IN_REVIEW", label: "In review", color: "#F5A623" },
  { value: "DONE", label: "Done", color: "#2FD9C4" },
];

const PRIORITY_OPTIONS = [
  { value: "LOW", label: "Low", color: "#8D919D" },
  { value: "MEDIUM", label: "Medium", color: "#4C6FFF" },
  { value: "HIGH", label: "High", color: "#F5A623" },
  { value: "URGENT", label: "Urgent", color: "#FF5C6C" },
];

export default function TaskDetailsPage() {
  const { id } = useParams();

  const { data, isLoading, error } = useTask(id!);
  const updateStatus = useUpdateTaskStatus();
  const updateTask = useUpdateTask();

  if (isLoading) {
    return (
      <DashboardLayout>
        <TaskDetailsSkeleton />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[500px] items-center justify-center">
          <div className="rounded-2xl border border-[#FF5C6C]/20 bg-[#10121A] px-8 py-7 text-center">
            <p className="text-sm font-medium text-[#FF7B87]">
              Failed to load task.
            </p>
            <p className="mt-2 text-xs text-[#626775]">
              Please refresh the page and try again.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const task = data?.data;

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-[1100px] space-y-6">

        <Link
          to={task.projectId?._id ? `/projects/${task.projectId._id}` : "/tasks"}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#626775] transition hover:text-white"
        >
          <ArrowLeft size={13} />
          Back to {task.projectId?.name ?? "tasks"}
        </Link>

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <section className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#10121A] px-6 py-7 sm:px-8">
          <div className="pointer-events-none absolute -right-24 -top-32 h-72 w-72 rounded-full bg-[#4C6FFF]/10 blur-3xl" />

          <div className="relative">
            <h1 className="font-display text-2xl leading-snug text-white sm:text-3xl">
              {task.title}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#8D919D]">
              {task.description || "No description provided."}
            </p>

            {/* meta row */}
            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-[#8D919D]">
              {task.projectId?.name && (
                <span className="flex items-center gap-1.5">
                  <FolderKanban size={13} className="text-[#4F5460]" />
                  {task.projectId.name}
                </span>
              )}

              <span className="flex items-center gap-1.5">
                <User size={13} className="text-[#4F5460]" />
                {task.assignee?.name ?? "Unassigned"}
              </span>

              {task.dueDate && (
                <span className="flex items-center gap-1.5">
                  <CalendarClock size={13} className="text-[#4F5460]" />
                  {new Date(task.dueDate).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              )}

              {task.tags?.length > 0 && (
                <span className="flex flex-wrap items-center gap-1.5">
                  <Tag size={13} className="text-[#4F5460]" />
                  {task.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[11px] text-[#AEB2BD]"
                    >
                      {tag}
                    </span>
                  ))}
                </span>
              )}
            </div>
          </div>
        </section>

        {/* ================================================= */}
        {/* STATUS + PRIORITY */}
        {/* ================================================= */}

        <section className="grid gap-5 sm:grid-cols-2">

          <div className="rounded-2xl border border-white/[0.07] bg-[#10121A] p-5">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#626775]">
              Status
            </p>

            <div className="flex flex-wrap gap-1.5">
              {STATUS_OPTIONS.map((opt) => {
                const active = task.status === opt.value;

                return (
                  <button
                    key={opt.value}
                    type="button"
                    disabled={updateStatus.isPending}
                    onClick={() =>
                      updateStatus.mutate({
                        taskId: task._id,
                        status: opt.value,
                      })
                    }
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition disabled:opacity-50 ${
                      active
                        ? "border-white/20 bg-white/[0.08] text-white"
                        : "border-white/[0.06] text-[#8D919D] hover:border-white/[0.14] hover:text-white"
                    }`}
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: opt.color }}
                    />
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-[#10121A] p-5">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#626775]">
              Priority
            </p>

            <div className="flex flex-wrap gap-1.5">
              {PRIORITY_OPTIONS.map((opt) => {
                const active = task.priority === opt.value;

                return (
                  <button
                    key={opt.value}
                    type="button"
                    disabled={updateTask.isPending}
                    onClick={() =>
                      updateTask.mutate({
                        taskId: task._id,
                        data: { priority: opt.value },
                      })
                    }
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition disabled:opacity-50 ${
                      active
                        ? "border-white/20 bg-white/[0.08] text-white"
                        : "border-white/[0.06] text-[#8D919D] hover:border-white/[0.14] hover:text-white"
                    }`}
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: opt.color }}
                    />
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

        </section>

        <TaskComments taskId={task._id} />

        <TaskActivity taskId={task._id} />

      </div>
    </DashboardLayout>
  );
}

/* ========================================================= */
/* LOADING */
/* ========================================================= */

function TaskDetailsSkeleton() {
  return (
    <div className="mx-auto max-w-[1100px] animate-pulse space-y-6">
      <div className="h-4 w-32 rounded bg-white/[0.06]" />
      <div className="h-44 rounded-2xl border border-white/[0.07] bg-[#10121A]" />
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="h-24 rounded-2xl border border-white/[0.07] bg-[#10121A]" />
        <div className="h-24 rounded-2xl border border-white/[0.07] bg-[#10121A]" />
      </div>
      <div className="h-48 rounded-2xl border border-white/[0.07] bg-[#10121A]" />
      <div className="h-48 rounded-2xl border border-white/[0.07] bg-[#10121A]" />
    </div>
  );
}