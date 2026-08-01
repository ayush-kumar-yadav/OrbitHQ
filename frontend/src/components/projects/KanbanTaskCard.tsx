import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { useNavigate } from "react-router-dom";

type Props = {
  task: any;
};

export default function KanbanTaskCard({
  task,
}: Props) {
  const navigate = useNavigate();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: task._id,
  });

  const style = {
    transform: CSS.Transform.toString(
      transform
    ),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() =>
        navigate(`/tasks/${task._id}`)
      }
      className="cursor-pointer rounded-lg border bg-white p-4 shadow-sm transition hover:shadow-md"
    >
      <h3 className="font-semibold">
        {task.title}
      </h3>

      <p className="mt-2 text-sm text-gray-500">
        {task.priority}
      </p>
    </div>
  );
}