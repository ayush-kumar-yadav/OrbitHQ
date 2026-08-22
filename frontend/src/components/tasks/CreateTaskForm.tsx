import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useCreateTask } from "../../hooks/tasks/useCreateTask";

type Props = {
  projectId: string;
};

export default function CreateTaskForm({ projectId }: Props) {
  const createTask = useCreateTask();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      await createTask.mutateAsync({
        title,
        description,
        projectId,
      });

      toast.success("Task created");

      setTitle("");
      setDescription("");
    } catch (err: any) {
      // Previously this only logged to the console — a failed
      // request (bad permissions, validation, network issue) looked
      // identical to nothing happening at all.
      toast.error(
        err.response?.data?.message ?? "Couldn't create task."
      );
    }
  }

  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#626775]">
        New
      </p>
      <h2 className="mt-1 font-display text-[17px] text-white">
        Create Task
      </h2>

      <form onSubmit={handleSubmit} className="mt-5 space-y-3">
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="orbit-input"
          required
        />

        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="orbit-input !h-auto resize-none py-3"
        />

        <button
          type="submit"
          disabled={createTask.isPending || !title.trim()}
          className="orbit-btn-solid w-full"
        >
          {createTask.isPending ? (
            "Creating..."
          ) : (
            <>
              <Plus size={15} /> Create Task
            </>
          )}
        </button>
      </form>
    </div>
  );
}