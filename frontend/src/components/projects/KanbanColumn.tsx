import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import KanbanTaskCard from "./KanbanTaskCard";
import { useDroppable } from "@dnd-kit/core";

type Props = {
  id: string;
  title: string;
  tasks: any[];
};

export default function KanbanColumn({
  id,
  title,
  tasks,
}: Props) {
  const { setNodeRef } = useDroppable({
  id,
});
  return (
    <div className="flex min-h-[600px] flex-col rounded-xl border bg-gray-50 p-4 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {title}
        </h2>

        <span className="rounded-full bg-gray-200 px-3 py-1 text-sm font-medium text-gray-700">
          {tasks.length}
        </span>
      </div>

      <SortableContext
        id={id}
        items={tasks.map((task) => task._id)}
        strategy={verticalListSortingStrategy}
      >
        <div
  ref={setNodeRef}
  className="flex flex-1 flex-col gap-3 rounded-lg transition-all"
>
          {tasks.length === 0 ? (
            <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-sm text-gray-400">
              Drop tasks here
            </div>
          ) : (
            tasks.map((task) => (
              <KanbanTaskCard
                key={task._id}
                task={task}
              />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  );
}