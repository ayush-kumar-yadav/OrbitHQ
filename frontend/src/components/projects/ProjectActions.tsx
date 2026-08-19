import { Pencil, Archive, Trash2 } from "lucide-react";

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
    <div className="flex flex-wrap gap-2">
      <button
        onClick={onEdit}
        className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 text-xs font-medium text-[#AEB2BD] transition hover:border-white/[0.16] hover:bg-white/[0.06] hover:text-white"
      >
        <Pencil size={14} />
        Edit
      </button>

      <button
        onClick={onArchive}
        className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 text-xs font-medium text-[#AEB2BD] transition hover:border-[#F5A623]/30 hover:bg-[#F5A623]/10 hover:text-[#F5A623]"
      >
        <Archive size={14} />
        Archive
      </button>

      <button
        onClick={onDelete}
        className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 text-xs font-medium text-[#AEB2BD] transition hover:border-[#FF5C6C]/30 hover:bg-[#FF5C6C]/10 hover:text-[#FF6B78]"
      >
        <Trash2 size={14} />
        Delete
      </button>
    </div>
  );
}