import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { LayoutGrid } from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import { useTasks } from "../../hooks/tasks/useTasks";
import { useMoveTask } from "../../hooks/tasks/useMoveTask";

import KanbanColumn from "../../components/kanban/KanbanColumn";
import KanbanCard from "../../components/kanban/KanbanCard";

const COLUMNS = [
  { id: "TODO", title: "To do", color: "#8D919D" },
  { id: "IN_PROGRESS", title: "In progress", color: "#4C6FFF" },
  { id: "IN_REVIEW", title: "In review", color: "#F5A623" },
  { id: "DONE", title: "Done", color: "#2FD9C4" },
];

export default function KanbanPage() {
  const { data, isLoading, error } = useTasks();
  const moveTask = useMoveTask();

  const [activeTask, setActiveTask] = useState<any>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    })
  );

  if (isLoading) {
    return (
      <DashboardLayout>
        <KanbanSkeleton />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[500px] items-center justify-center">
          <div className="rounded-2xl border border-[#FF5C6C]/20 bg-[#10121A] px-8 py-7 text-center">
            <p className="text-sm font-medium text-[#FF7B87]">
              Failed to load tasks.
            </p>
            <p className="mt-2 text-xs text-[#626775]">
              Please refresh the page and try again.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const tasks = data?.data.tasks || [];

  function tasksFor(status: string) {
    return tasks.filter((task: any) => task.status === status);
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveTask(event.active.data.current?.task ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as string;
    const currentStatus = active.data.current?.task?.status;

    if (!newStatus || newStatus === currentStatus) return;

    moveTask.mutate({ taskId, status: newStatus });
  }

  return (
    <DashboardLayout>
      <div className="mx-auto flex h-full max-w-[1600px] flex-col">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <section className="relative mb-6 shrink-0 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#10121A] px-6 py-7 sm:px-8">
          <div className="pointer-events-none absolute -right-24 -top-32 h-72 w-72 rounded-full bg-[#4C6FFF]/10 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#4C6FFF] shadow-[0_0_10px_rgba(76,111,255,0.8)]" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#626775]">
                  Task board
                </span>
              </div>

              <h1 className="font-display text-3xl tracking-tight text-white sm:text-4xl">
                Kanban Board
              </h1>

              <p className="mt-2 text-sm text-[#8D919D]">
                Drag tasks between columns to update their status.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#626775]">
              <LayoutGrid size={14} className="text-[#4F5460]" />
              {tasks.length} {tasks.length === 1 ? "task" : "tasks"} total
            </div>
          </div>
        </section>

        {/* ================================================= */}
        {/* BOARD */}
        {/* ================================================= */}

        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex flex-1 gap-4 overflow-x-auto pb-4">
            {COLUMNS.map((column) => (
              <KanbanColumn
                key={column.id}
                id={column.id}
                title={column.title}
                color={column.color}
                tasks={tasksFor(column.id)}
              />
            ))}
          </div>

          <DragOverlay>
            {activeTask ? <KanbanCard task={activeTask} dragging /> : null}
          </DragOverlay>
        </DndContext>

      </div>
    </DashboardLayout>
  );
}

/* ========================================================= */
/* LOADING */
/* ========================================================= */

function KanbanSkeleton() {
  return (
    <div className="mx-auto max-w-[1600px] animate-pulse space-y-6">
      <div className="h-36 rounded-2xl border border-white/[0.07] bg-[#10121A]" />

      <div className="flex gap-4">
        {[1, 2, 3, 4].map((col) => (
          <div key={col} className="min-w-[280px] flex-1 space-y-2.5">
            <div className="h-4 w-24 rounded bg-white/[0.06]" />
            <div className="h-24 rounded-xl border border-white/[0.05] bg-white/[0.02]" />
            <div className="h-24 rounded-xl border border-white/[0.05] bg-white/[0.02]" />
          </div>
        ))}
      </div>
    </div>
  );
}