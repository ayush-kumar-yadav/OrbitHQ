import { useState } from "react";
import { useCreateProject } from "../../hooks/projects/useCreateProject";

type CreateProjectFormProps = {
  onClose: () => void;
};

export default function CreateProjectForm({
  onClose,
}: CreateProjectFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const createProject = useCreateProject();

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    try {
      await createProject.mutateAsync({
        name,
        description,
      });

      setName("");
      setDescription("");

      onClose();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 mx-auto flex max-w-md flex-col gap-4 rounded-xl border bg-white p-6 shadow-sm"
    >
      <h2 className="text-xl font-semibold">
        Create New Project
      </h2>

      <input
        type="text"
        placeholder="Project Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="rounded-lg border p-3"
        required
      />

      <textarea
        placeholder="Project Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="rounded-lg border p-3"
        rows={4}
      />

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border px-4 py-2 hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={createProject.isPending}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {createProject.isPending
            ? "Creating..."
            : "Create Project"}
        </button>
      </div>
    </form>
  );
}