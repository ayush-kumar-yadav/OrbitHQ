import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  FolderKanban,
  CalendarClock,
  User,
  Tag,
  Pencil,
  Trash2,
  X,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";

import TaskActivity from "../../components/tasks/TaskActivity";
import DashboardLayout from "../../layouts/DashboardLayout";
import ErrorState from "../../components/common/ErrorState";
import { useAuth } from "../../providers/AuthProvider";
import { useTask } from "../../hooks/tasks/useTask";
import { useUpdateTaskStatus } from "../../hooks/tasks/useUpdateTaskStatus";
import { useUpdateTask } from "../../hooks/tasks/useUpdateTask";
import { useDeleteTask } from "../../hooks/tasks/useDeleteTask";
import { useAssignTask } from "../../hooks/tasks/useAssignTask";
import { useMembers } from "../../hooks/organizations/useMembers";
import TaskComments from "../../components/tasks/TaskComments";

// Only these roles can edit/delete a task at all — mirrors the
// backend's authorize() rules on PUT/DELETE /tasks/:id exactly, so
// the buttons never appear for a role that would just get a 403.
const CAN_EDIT_ROLES = ["OWNER", "ADMIN", "MANAGER", "DEVELOPER"];
const CAN_DELETE_ROLES = ["OWNER", "ADMIN"];
// Mirrors the backend's authorize() rules on PATCH /tasks/:id/assign.
const CAN_ASSIGN_ROLES = ["OWNER", "ADMIN", "MANAGER"];

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
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data, isLoading, error, refetch, isRefetching } = useTask(id!);
  const updateStatus = useUpdateTaskStatus();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const assignTask = useAssignTask();
  const { data: membersData } = useMembers();

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [assigneeMenuOpen, setAssigneeMenuOpen] = useState(false);

  const canEdit = CAN_EDIT_ROLES.includes(user?.role ?? "");
  const canDelete = CAN_DELETE_ROLES.includes(user?.role ?? "");
  const canAssign = CAN_ASSIGN_ROLES.includes(user?.role ?? "");
  const members = membersData?.data ?? [];

  function startEditing(task: any) {
    setEditTitle(task.title);
    setEditDescription(task.description ?? "");
    setIsEditing(true);
  }

  async function handleSaveEdit(taskId: string) {
    if (!editTitle.trim()) {
      toast.error("Title can't be empty.");
      return;
    }

    try {
      await updateTask.mutateAsync({
        taskId,
        data: {
          title: editTitle.trim(),
          description: editDescription.trim(),
        },
      });

      toast.success("Task updated");
      setIsEditing(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "Couldn't update task.");
    }
  }

  async function handleAssign(taskId: string, assignee: string) {
    setAssigneeMenuOpen(false);

    try {
      await assignTask.mutateAsync({ taskId, assignee });
      toast.success("Task assigned");
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "Couldn't assign task.");
    }
  }

  async function handleStatusChange(taskId: string, status: string) {
    try {
      await updateStatus.mutateAsync({ taskId, status });
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "Couldn't update status.");
    }
  }

  async function handlePriorityChange(taskId: string, priority: string) {
    try {
      await updateTask.mutateAsync({ taskId, data: { priority } });
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "Couldn't update priority.");
    }
  }
  async function handleDelete(taskId: string, projectId?: string) {
    if (!window.confirm("Delete this task? This can't be undone.")) return;

    try {
      await deleteTask.mutateAsync(taskId);
      toast.success("Task deleted");
      navigate(projectId ? `/projects/${projectId}` : "/tasks");
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "Couldn't delete task.");
    }
  }

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
        <ErrorState
          title="Failed to load task."
          description="Please try again."
          onRetry={() => refetch()}
          isRetrying={isRefetching}
        />
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

            {(canEdit || canDelete) && (
              <div className="mb-4 flex items-center justify-end gap-2">
                {canEdit && !isEditing && (
                  <button
                    type="button"
                    onClick={() => startEditing(task)}
                    className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-[#AEB2BD] transition hover:border-white/[0.14] hover:text-white"
                  >
                    <Pencil size={12} />
                    Edit
                  </button>
                )}

                {canDelete && (
                  <button
                    type="button"
                    disabled={deleteTask.isPending}
                    onClick={() => handleDelete(task._id, task.projectId?._id)}
                    className="flex items-center gap-1.5 rounded-lg border border-[#FF5C6C]/20 bg-[#FF5C6C]/5 px-3 py-1.5 text-xs font-medium text-[#FF7B87] transition hover:bg-[#FF5C6C]/10 disabled:opacity-50"
                  >
                    <Trash2 size={12} />
                    {deleteTask.isPending ? "Deleting..." : "Delete"}
                  </button>
                )}
              </div>
            )}

            {isEditing ? (
              <div className="space-y-3">
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="orbit-input font-display text-xl text-white"
                  autoFocus
                />

                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Description (optional)"
                  rows={3}
                  className="orbit-input !h-auto resize-none py-3"
                />

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={updateTask.isPending}
                    onClick={() => handleSaveEdit(task._id)}
                    className="orbit-btn-solid h-9 px-4 text-xs"
                  >
                    {updateTask.isPending ? "Saving..." : "Save changes"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-medium text-[#8D919D] transition hover:text-white"
                  >
                    <X size={13} />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="font-display text-2xl leading-snug text-white sm:text-3xl">
                  {task.title}
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#8D919D]">
                  {task.description || "No description provided."}
                </p>
              </>
            )}

            {/* meta row */}
            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-[#8D919D]">
              {task.projectId?.name && (
                <span className="flex items-center gap-1.5">
                  <FolderKanban size={13} className="text-[#4F5460]" />
                  {task.projectId.name}
                </span>
              )}

              {canAssign ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setAssigneeMenuOpen((v) => !v)}
                    className="flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.03] px-2.5 py-1 transition hover:border-white/[0.14] hover:text-white"
                  >
                    <User size={13} className="text-[#4F5460]" />
                    {task.assignee?.name ?? "Unassigned"}
                    <ChevronDown size={12} className="text-[#4F5460]" />
                  </button>

                  {assigneeMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setAssigneeMenuOpen(false)}
                      />

                      <div className="absolute left-0 z-50 mt-1.5 w-52 overflow-hidden rounded-xl border border-white/[0.08] bg-[#10121A] py-1.5 shadow-xl">
                        {members.length === 0 && (
                          <p className="px-3.5 py-2 text-xs text-[#626775]">
                            No members yet
                          </p>
                        )}

                        {members.map((member: any) => (
                          <button
                            key={member.user._id}
                            type="button"
                            onClick={() =>
                              handleAssign(task._id, member.user._id)
                            }
                            disabled={assignTask.isPending}
                            className="flex w-full items-center justify-between px-3.5 py-2 text-left text-xs text-[#EDEEF2] transition hover:bg-white/[0.05] disabled:opacity-50"
                          >
                            {member.user.name}
                            {task.assignee?._id === member.user._id && (
                              <span className="h-1.5 w-1.5 rounded-full bg-[#4C6FFF]" />
                            )}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <span className="flex items-center gap-1.5">
                  <User size={13} className="text-[#4F5460]" />
                  {task.assignee?.name ?? "Unassigned"}
                </span>
              )}

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
                      handleStatusChange(task._id, opt.value)
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
                      handlePriorityChange(task._id, opt.value)
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