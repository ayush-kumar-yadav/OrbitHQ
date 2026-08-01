console.log("TaskComments rendered");
import { useState } from "react";

import { useComments } from "../../hooks/comments/useComments";
import { useCreateComment } from "../../hooks/comments/useCreateComment";

type Props = {
  taskId: string;
};

export default function TaskComments({
  taskId,
}: Props) {
  const { data, isLoading, error } = useComments(taskId);
  console.log({
  taskId,
  data,
  isLoading,
  error,
});
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
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-2xl font-bold">
        Comments
      </h2>

      <form
        onSubmit={handleSubmit}
        className="mb-6 flex gap-3"
      >
        <input
          type="text"
          value={content}
          onChange={(e) =>
            setContent(e.target.value)
          }
          placeholder="Write a comment..."
          className="flex-1 rounded-lg border p-3"
        />

        <button
          type="submit"
          disabled={createComment.isPending}
          className="rounded-lg bg-blue-600 px-5 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {createComment.isPending
            ? "Sending..."
            : "Send"}
        </button>
      </form>

      {isLoading && (
        <p className="text-gray-500">
          Loading comments...
        </p>
      )}

      {error && (
        <p className="text-red-500">
          Failed to load comments.
        </p>
      )}

      {!isLoading && comments.length === 0 && (
        <p className="text-gray-500">
          No comments yet.
        </p>
      )}

      <div className="space-y-4">
        {comments.map((comment: any) => (
          <div
            key={comment._id}
            className="rounded-lg border bg-gray-50 p-4"
          >
            <p className="font-semibold">
              {comment.author?.name ??
                "Unknown User"}
            </p>

            <p className="mt-2 text-gray-700">
              {comment.content}
            </p>

            <p className="mt-2 text-xs text-gray-500">
              {new Date(
                comment.createdAt
              ).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}