import { RotateCw } from "lucide-react";

type Props = {
  title?: string;
  description?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
  className?: string;
};

export default function ErrorState({
  title = "Something went wrong.",
  description = "Please try again.",
  onRetry,
  isRetrying = false,
  className = "flex min-h-[300px] items-center justify-center",
}: Props) {
  return (
    <div className={className}>
      <div className="rounded-2xl border border-[#FF5C6C]/20 bg-[#10121A] px-8 py-7 text-center">
        <p className="text-sm font-medium text-[#FF7B87]">{title}</p>

        <p className="mt-2 text-xs text-[#626775]">{description}</p>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            disabled={isRetrying}
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3.5 py-1.5 text-xs font-medium text-[#EDEEF2] transition hover:border-white/[0.14] hover:bg-white/[0.05] disabled:opacity-50"
          >
            <RotateCw
              size={12}
              className={isRetrying ? "animate-spin" : ""}
            />
            {isRetrying ? "Retrying..." : "Retry"}
          </button>
        )}
      </div>
    </div>
  );
}