import DashboardLayout from "../../layouts/DashboardLayout";
import { useTasks } from "../../hooks/tasks/useTasks";
import TaskCard from "../../components/tasks/TaskCard";

export default function TasksPage() {
  const { data, isLoading, error } = useTasks();

  if (isLoading) {
    return (
      <DashboardLayout>
        <p>Loading tasks...</p>
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

  return (
    <DashboardLayout>
      <h1 className="mb-8 text-4xl font-bold">
        All Tasks
      </h1>

      {tasks.length === 0 ? (
        <div className="rounded-xl border bg-white p-8 text-center">
          <p className="text-gray-500">
            No tasks found.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {tasks.map((task: any) => (
            <TaskCard
              key={task._id}
              task={task}
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}