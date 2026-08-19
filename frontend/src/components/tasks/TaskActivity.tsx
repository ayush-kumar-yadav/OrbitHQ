import { Circle } from "lucide-react";

import { useTaskActivity } from "../../hooks/activity/useTaskActivity";
import { metaForAction } from "../../lib/activityMeta";
import { timeAgo } from "../../lib/time";

type Props = {
  taskId: string;
};

export default function TaskActivity({ taskId }: Props) {
  const { data, isLoading, error } = useTaskActivity(taskId);

  const activities = data?.data || [];

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-[#10121A] p-6">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#626775]">
        History
      </p>
      <h2 className="mt-1 font-display text-[17px] text-white">
        Activity
      </h2>

      {isLoading && (
        <div className="mt-5 space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-10 animate-pulse rounded-xl bg-white/[0.03]"
            />
          ))}
        </div>
      )}

      {error && (
        <p className="mt-5 text-sm text-[#FF7B87]">
          Failed to load activity.
        </p>
      )}

      {!isLoading && !error && activities.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.04]">
            <Circle size={18} className="text-[#4F5460]" />
          </div>
          <p className="text-sm text-[#8D919D]">No activity yet.</p>
        </div>
      )}

      {!isLoading && activities.length > 0 && (
        <div className="relative mt-5">
          <div className="absolute bottom-1 left-[19px] top-1 w-px bg-white/[0.06]" />

          <div className="space-y-1">
            {activities.map((activity: any) => {
              const meta = metaForAction(activity.action);
              const Icon = meta.icon;

              return (
                <div
                  key={activity._id}
                  className="relative flex items-start gap-3 rounded-xl px-2 py-2.5 transition hover:bg-white/[0.03]"
                >
                  <div
                    className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${meta.tone}`}
                  >
                    <Icon size={15} strokeWidth={2} />
                  </div>

                  <div className="min-w-0 flex-1 pt-1.5">
                    <p className="text-sm font-medium text-[#EDEEF2]">
                      {meta.label}
                    </p>
                  </div>

                  <span className="shrink-0 pt-2 text-xs text-[#4F5460]">
                    {timeAgo(activity.createdAt)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}