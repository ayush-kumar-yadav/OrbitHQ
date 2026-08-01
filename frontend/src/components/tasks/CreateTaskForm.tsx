import { useState } from "react";
import { useCreateTask } from "../../hooks/tasks/useCreateTask";

type Props = {
  projectId: string;
};

export default function CreateTaskForm({
  projectId,
}: Props) {
  const createTask = useCreateTask();

  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    try {
      await createTask.mutateAsync({
        title,
        description,
        projectId,
      });

      setTitle("");
      setDescription("");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-xl font-semibold">
        Create Task
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          className="w-full rounded-lg border p-3"
          required
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          rows={4}
          className="w-full rounded-lg border p-3"
        />

        <button
          type="submit"
          disabled={createTask.isPending}
          className="rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {createTask.isPending
            ? "Creating..."
            : "Create Task"}
        </button>
      </form>
    </div>
  );
}