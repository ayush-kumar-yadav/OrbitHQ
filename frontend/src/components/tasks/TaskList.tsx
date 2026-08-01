import { useTasks } from "../../hooks/tasks/useTasks";
import { useNavigate } from "react-router-dom";

type Props = {
  projectId: string;
};

export default function TaskList({
  projectId,
}: Props) {
    const navigate = useNavigate();
  const { data, isLoading, error } =
    useTasks(projectId);

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        Loading tasks...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border bg-white p-6 shadow-sm text-red-500">
        Failed to load tasks.
      </div>
    );
  }

  const tasks = data?.data?.tasks || [];

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-xl font-semibold">
        Tasks
      </h2>

      {tasks.length === 0 ? (
        <p className="text-gray-500">
          No tasks yet.
        </p>
      ) : (
        <div className="space-y-3">
          {tasks.map((task: any) => (
            <div
  key={task._id}
  onClick={() => navigate(`/tasks/${task._id}`)}
  className="cursor-pointer rounded-lg border p-4 transition hover:border-blue-500 hover:bg-blue-50"
>
              <h3 className="font-semibold">
                {task.title}
              </h3>

              <p className="mt-1 text-sm text-gray-600">
                {task.description ||
                  "No description"}
              </p>

              <div className="mt-3 text-sm text-gray-500">
                Status: {task.status}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}