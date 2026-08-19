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
  const { data, isLoading, error } = useTasks(projectId);
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
      <div className="rounded-2xl border border-[#FF5C6C]/20 bg-[#10121A] px-8 py-7 text-center">
        <p className="text-sm font-medium text-[#FF7B87]">
          Failed to load board.
        </p>
      </div>
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