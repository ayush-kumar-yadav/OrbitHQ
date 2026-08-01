import KanbanColumn from "./KanbanColumn";
import { useTasks } from "../../hooks/tasks/useTasks";
import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core";

import type { DragEndEvent } from "@dnd-kit/core";
import { useMoveTask } from "../../hooks/tasks/useMoveTask";
type Props = {
  projectId: string;
};

export default function ProjectBoard({
  projectId,
}: Props) {
  const { data, isLoading, error } =
    useTasks(projectId);

  if (isLoading) {
    return <p>Loading board...</p>;
  }

  if (error) {
    return (
      <p className="text-red-500">
        Failed to load board.
      </p>
    );
  }

  const tasks = data?.data.tasks || [];

  const moveTask = useMoveTask();
  const todoTasks = tasks.filter(
    (t: any) => t.status === "TODO"
  );

  const inProgressTasks = tasks.filter(
    (t: any) => t.status === "IN_PROGRESS"
  );

  const reviewTasks = tasks.filter(
    (t: any) => t.status === "IN_REVIEW"
  );

  const doneTasks = tasks.filter(
    (t: any) => t.status === "DONE"
  );
  function handleDragEnd(event: DragEndEvent) {
  const { active, over } = event;

  if (!over) return;

  const taskId = String(active.id);
  const newStatus = String(over.id);

  const task = tasks.find(
    (t: any) => t._id === taskId
  );

  if (!task) return;

  if (task.status === newStatus) return;

  moveTask.mutate({
    taskId,
    status: newStatus,
  });
}

  return (
  <DndContext
  collisionDetection={closestCenter}
  onDragEnd={handleDragEnd}
>
    <div className="grid gap-6 lg:grid-cols-4">
      <KanbanColumn
  id="TODO"
  title="TODO"
  tasks={todoTasks}
/>

<KanbanColumn
  id="IN_PROGRESS"
  title="IN PROGRESS"
  tasks={inProgressTasks}
/>

<KanbanColumn
  id="IN_REVIEW"
  title="IN REVIEW"
  tasks={reviewTasks}
/>

<KanbanColumn
  id="DONE"
  title="DONE"
  tasks={doneTasks}
/>
        </div>
  </DndContext>
  );
}