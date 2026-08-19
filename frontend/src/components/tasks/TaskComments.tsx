import { useState } from "react";
import { Send, MessageSquare } from "lucide-react";

import { useComments } from "../../hooks/comments/useComments";
import { useCreateComment } from "../../hooks/comments/useCreateComment";
import { timeAgo } from "../../lib/time";

type Props = {
  taskId: string;
};

export default function TaskComments({ taskId }: Props) {
  const { data, isLoading, error } = useComments(taskId);
  const createComment = useCreateComment();

  const [content, setContent] = useState("");

  const comments = data?.data || [];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!content.trim()) return;

    createComment.mutate({
      taskId,
      content,
    });

    setContent("");
  }

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-[#10121A] p-6">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#626775]">
        Discussion
      </p>
      <h2 className="mt-1 font-display text-[17px] text-white">
        Comments
      </h2>

      <form onSubmit={handleSubmit} className="mt-5 flex gap-2.5">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment..."
          className="orbit-input flex-1"
        />

        <button
          type="submit"
          disabled={createComment.isPending || !content.trim()}
          className="orbit-btn-solid shrink-0 !px-4"
        >
          {createComment.isPending ? (
            "Sending..."
          ) : (
            <>
              Send <Send size={14} />
            </>
          )}
        </button>
      </form>

      {isLoading && (
        <div className="mt-5 space-y-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-xl bg-white/[0.03]"
            />
          ))}
        </div>
      )}

      {error && (
        <p className="mt-5 text-sm text-[#FF7B87]">
          Failed to load comments.
        </p>
      )}

      {!isLoading && !error && comments.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.04]">
            <MessageSquare size={18} className="text-[#4F5460]" />
          </div>
          <p className="text-sm text-[#8D919D]">No comments yet.</p>
          <p className="mt-1 text-xs text-[#4F5460]">
            Be the first to say something.
          </p>
        </div>
      )}

      {!isLoading && comments.length > 0 && (
        <div className="mt-5 space-y-3">
          {comments.map((comment: any) => {
            const name = comment.author?.name ?? "Unknown user";
            const initials = name
              .split(" ")
              .map((p: string) => p[0])
              .slice(0, 2)
              .join("")
              .toUpperCase();

            return (
              <div
                key={comment._id}
                className="flex gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#4C6FFF]/15 text-[11px] font-semibold text-[#7D94FF]">
                  {initials}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-[#EDEEF2]">
                      {name}
                    </p>
                    <span className="shrink-0 text-[11px] text-[#4F5460]">
                      {timeAgo(comment.createdAt)}
                    </span>
                  </div>

                  <p className="mt-1 text-sm leading-relaxed text-[#AEB2BD]">
                    {comment.content}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}