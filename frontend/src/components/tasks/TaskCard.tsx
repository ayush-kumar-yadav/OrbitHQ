import { useNavigate } from "react-router-dom";

type Props = {
  task: any;
};

export default function TaskCard({ task }: Props) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/tasks/${task._id}`)}
      className="cursor-pointer rounded-xl border bg-white p-5 shadow-sm transition hover:border-blue-500 hover:shadow-md"
    >
      <h2 className="text-lg font-semibold">
        {task.title}
      </h2>

      <p className="mt-2 text-sm text-gray-600">
        {task.description || "No description"}
      </p>

      <div className="mt-4 flex justify-between text-sm">
        <span>{task.status}</span>
        <span>{task.priority}</span>
      </div>
    </div>
  );
}