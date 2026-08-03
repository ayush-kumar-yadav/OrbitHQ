type Props = {
  tasks: any[];
};

export default function UpcomingDeadlines({
  tasks,
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-xl font-semibold">
        Upcoming Deadlines
      </h2>

      {tasks.length === 0 ? (
        <p className="text-gray-500">
          No upcoming deadlines.
        </p>
      ) : (
        <div className="space-y-4">
          {tasks.map((task: any) => (
            <div
              key={task._id}
              className="border-b pb-3 last:border-0"
            >
              <p className="font-medium">
                {task.title}
              </p>

              <p className="text-sm text-gray-500">
                {task.projectId?.name}
              </p>

              <p className="text-sm text-blue-600">
                {task.dueDate
                  ? new Date(
                      task.dueDate
                    ).toLocaleDateString()
                  : "No due date"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}