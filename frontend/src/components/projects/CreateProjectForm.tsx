import { useState } from "react";
import { X } from "lucide-react";
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
      className="orbit-reveal mb-6 mx-auto flex max-w-md flex-col gap-4 rounded-2xl border border-white/[0.07] bg-[#10121A] p-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-display text-[17px] text-white">
          Create New Project
        </h2>

        <button
          type="button"
          onClick={onClose}
          className="text-[#626775] transition hover:text-white"
        >
          <X size={16} />
        </button>
      </div>

      <input
        type="text"
        placeholder="Project name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="orbit-input"
        required
      />

      <textarea
        placeholder="Project description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
        className="orbit-input !h-auto resize-none py-3"
      />

      <div className="flex justify-end gap-2.5">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-white/[0.08] px-4 py-2 text-xs font-medium text-[#AEB2BD] transition hover:border-white/[0.16] hover:text-white"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={createProject.isPending || !name.trim()}
          className="orbit-btn-solid !px-4 !py-2"
        >
          {createProject.isPending
            ? "Creating..."
            : "Create Project"}
        </button>
      </div>
    </form>
  );
}