import { useParams } from "react-router-dom";
import TaskActivity from "../../components/tasks/TaskActivity";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useTask } from "../../hooks/tasks/useTask";
import { useUpdateTaskStatus } from "../../hooks/tasks/useUpdateTaskStatus";
import { useUpdateTask } from "../../hooks/tasks/useUpdateTask";
import TaskComments from "../../components/tasks/TaskComments";

export default function TaskDetailsPage() {
  const { id } = useParams();

  const { data, isLoading, error } = useTask(id!);
  const updateStatus = useUpdateTaskStatus();
  const updateTask = useUpdateTask();
  if (isLoading) {
    return (
      <DashboardLayout>
        <p>Loading task...</p>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <p className="text-red-500">
          Failed to load task.
        </p>
      </DashboardLayout>
    );
  }

  const task = data?.data;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold">
            {task.title}
          </h1>

          <p className="mt-3 text-gray-600">
            {task.description || "No description"}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Status
            </p>

            <select
  value={task.status}
  onChange={(e) =>
    updateStatus.mutate({
      taskId: task._id,
      status: e.target.value,
    })
  }
  className="mt-2 w-full rounded-lg border p-2"
>
  <option value="TODO">TODO</option>
  <option value="IN_PROGRESS">
    IN PROGRESS
  </option>
  <option value="IN_REVIEW">
    IN REVIEW
  </option>
  <option value="DONE">DONE</option>
</select>
          </div>

          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Priority
            </p>

            <select
  value={task.priority}
  onChange={(e) =>
    updateTask.mutate({
      taskId: task._id,
      data: {
        priority: e.target.value,
      },
    })
  }
  className="mt-2 w-full rounded-lg border p-2"
>
  <option value="LOW">LOW</option>
  <option value="MEDIUM">MEDIUM</option>
  <option value="HIGH">HIGH</option>
  <option value="URGENT">URGENT</option>
</select>
          </div>

          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Due Date
            </p>

            <p className="mt-2 text-xl font-semibold">
              {task.dueDate
                ? new Date(task.dueDate).toLocaleDateString()
                : "No due date"}
            </p>
          </div>
        </div>
        <div className="mt-8">
  <TaskComments taskId={task._id} />
</div>

<div className="mt-8">
  <TaskActivity taskId={task._id} />
</div>
      </div>
    </DashboardLayout>
  );
}