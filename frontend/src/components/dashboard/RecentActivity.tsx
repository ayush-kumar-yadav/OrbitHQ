import { Circle } from "lucide-react";
import { metaForAction } from "../../lib/activityMeta";
import { timeAgo } from "../../lib/time";

type Props = {
  activity: any[];
};

export default function RecentActivity({ activity }: Props) {
  if (activity.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.04]">
          <Circle size={18} className="text-[#4F5460]" />
        </div>
        <p className="text-sm text-[#8D919D]">
          Nothing's happened yet.
        </p>
        <p className="mt-1 text-xs text-[#4F5460]">
          Activity across your workspace will show up here.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* connecting line */}
      <div className="absolute bottom-1 left-[19px] top-1 w-px bg-white/[0.06]" />

      <div className="space-y-1">
        {activity.map((item: any) => {
          const meta = metaForAction(item.action);
          const Icon = meta.icon;

          return (
            <div
              key={item._id}
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
                {timeAgo(item.createdAt)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}