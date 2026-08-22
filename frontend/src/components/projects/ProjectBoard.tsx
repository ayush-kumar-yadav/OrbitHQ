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

import { useTasks } from "../../hooks/tasks/useTasks";
import { useMoveTask } from "../../hooks/tasks/useMoveTask";
import { toast } from "sonner";
import ErrorState from "../common/ErrorState";

import KanbanColumn from "../kanban/KanbanColumn";
import KanbanCard from "../kanban/KanbanCard";

type Props = {
  projectId: string;
};

const COLUMNS = [
  { id: "TODO", title: "To do", color: "#8D919D" },
  { id: "IN_PROGRESS", title: "In progress", color: "#4C6FFF" },
  { id: "IN_REVIEW", title: "In review", color: "#F5A623" },
  { id: "DONE", title: "Done", color: "#2FD9C4" },
];

export default function ProjectBoard({ projectId }: Props) {
  const { data, isLoading, error, refetch, isRefetching } = useTasks(projectId);
  const moveTask = useMoveTask();

  const [activeTask, setActiveTask] = useState<any>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    })
  );

  if (isLoading) {
    return (
      <div className="flex gap-4">
        {[1, 2, 3, 4].map((col) => (
          <div key={col} className="min-w-[280px] flex-1 space-y-2.5">
            <div className="h-4 w-24 animate-pulse rounded bg-white/[0.06]" />
            <div className="h-24 animate-pulse rounded-xl border border-white/[0.05] bg-white/[0.02]" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load board."
        description="Please try again."
        onRetry={() => refetch()}
        isRetrying={isRefetching}
        className=""
      />
    );
  }

  const tasks = data?.data.tasks || [];

  function tasksFor(status: string) {
    return tasks.filter((task: any) => task.status === status);
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveTask(event.active.data.current?.task ?? null);
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as string;
    const currentStatus = active.data.current?.task?.status;

    if (!newStatus || newStatus === currentStatus) return;

    try {
      await moveTask.mutateAsync({ taskId, status: newStatus });
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "Couldn't move task.");
    }
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-2">
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
  );
}