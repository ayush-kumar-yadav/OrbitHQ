type Props = {
  activity: any[];
};

export default function RecentActivity({
  activity,
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-xl font-semibold">
        Recent Activity
      </h2>

      {activity.length === 0 ? (
        <p className="text-gray-500">
          No recent activity.
        </p>
      ) : (
        <div className="space-y-4">
          {activity.map((item: any) => (
            <div
              key={item._id}
              className="border-b pb-3 last:border-0"
            >
              <p className="font-medium">
                {item.action}
              </p>

              <p className="text-sm text-gray-500">
                {new Date(
                  item.createdAt
                ).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}