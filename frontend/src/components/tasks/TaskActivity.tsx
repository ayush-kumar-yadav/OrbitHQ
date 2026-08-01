import { useTaskActivity } from "../../hooks/activity/useTaskActivity";

type Props = {
  taskId: string;
};

export default function TaskActivity({
  taskId,
}: Props) {
  const { data, isLoading, error } =
    useTaskActivity(taskId);

  if (isLoading)
    return <p>Loading activity...</p>;

  if (error)
    return (
      <p className="text-red-500">
        Failed to load activity.
      </p>
    );

  const activities = data?.data || [];

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-xl font-semibold">
        Activity
      </h2>

      {activities.length === 0 ? (
        <p className="text-gray-500">
          No activity yet.
        </p>
      ) : (
        <div className="space-y-4">
          {activities.map(
            (activity: any) => (
              <div
                key={activity._id}
                className="border-l-2 border-blue-500 pl-4"
              >
                <p className="font-medium">
                  {activity.action}
                </p>

                <p className="text-sm text-gray-500">
                  {new Date(
                    activity.createdAt
                  ).toLocaleString()}
                </p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}