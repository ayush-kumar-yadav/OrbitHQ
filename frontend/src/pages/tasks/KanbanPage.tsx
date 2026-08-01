import DashboardLayout from "../../layouts/DashboardLayout";
import { useTasks } from "../../hooks/tasks/useTasks";

export default function KanbanPage() {
  const { data, isLoading, error } = useTasks();

  if (isLoading) {
    return (
      <DashboardLayout>
        <p>Loading Kanban...</p>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <p className="text-red-500">
          Failed to load tasks.
        </p>
      </DashboardLayout>
    );
  }

  const tasks = data?.data.tasks || [];

  const todoTasks = tasks.filter(
    (task: any) => task.status === "TODO"
  );

  const inProgressTasks = tasks.filter(
    (task: any) => task.status === "IN_PROGRESS"
  );

  const reviewTasks = tasks.filter(
    (task: any) => task.status === "IN_REVIEW"
  );

  const doneTasks = tasks.filter(
    (task: any) => task.status === "DONE"
  );

  return (
    <DashboardLayout>
      <h1 className="mb-8 text-4xl font-bold">
        Kanban Board
      </h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* TODO */}
        <div className="rounded-xl border bg-gray-50 p-4">
          <h2 className="mb-4 text-lg font-semibold">
            TODO ({todoTasks.length})
          </h2>

          <div className="space-y-3">
            {todoTasks.map((task: any) => (
              <div
                key={task._id}
                className="rounded-lg border bg-white p-4 shadow-sm"
              >
                <h3 className="font-semibold">
                  {task.title}
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  {task.priority}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* IN PROGRESS */}
        <div className="rounded-xl border bg-blue-50 p-4">
          <h2 className="mb-4 text-lg font-semibold">
            IN PROGRESS ({inProgressTasks.length})
          </h2>

          <div className="space-y-3">
            {inProgressTasks.map((task: any) => (
              <div
                key={task._id}
                className="rounded-lg border bg-white p-4 shadow-sm"
              >
                <h3 className="font-semibold">
                  {task.title}
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  {task.priority}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* IN REVIEW */}
        <div className="rounded-xl border bg-yellow-50 p-4">
          <h2 className="mb-4 text-lg font-semibold">
            IN REVIEW ({reviewTasks.length})
          </h2>

          <div className="space-y-3">
            {reviewTasks.map((task: any) => (
              <div
                key={task._id}
                className="rounded-lg border bg-white p-4 shadow-sm"
              >
                <h3 className="font-semibold">
                  {task.title}
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  {task.priority}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* DONE */}
        <div className="rounded-xl border bg-green-50 p-4">
          <h2 className="mb-4 text-lg font-semibold">
            DONE ({doneTasks.length})
          </h2>

          <div className="space-y-3">
            {doneTasks.map((task: any) => (
              <div
                key={task._id}
                className="rounded-lg border bg-white p-4 shadow-sm"
              >
                <h3 className="font-semibold">
                  {task.title}
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  {task.priority}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}