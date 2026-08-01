import {
  Pencil,
  Archive,
  Trash2,
} from "lucide-react";

type ProjectActionsProps = {
  onEdit: () => void;
  onArchive: () => void;
  onDelete: () => void;
};

export default function ProjectActions({
  onEdit,
  onArchive,
  onDelete,
}: ProjectActionsProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={onEdit}
        className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-blue-700 transition hover:bg-blue-100"
      >
        <Pencil size={18} />
        Edit
      </button>

      <button
        onClick={onArchive}
        className="flex items-center gap-2 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-2 text-yellow-700 transition hover:bg-yellow-100"
      >
        <Archive size={18} />
        Archive
      </button>

      <button
        onClick={onDelete}
        className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-red-700 transition hover:bg-red-100"
      >
        <Trash2 size={18} />
        Delete
      </button>
    </div>
  );
}