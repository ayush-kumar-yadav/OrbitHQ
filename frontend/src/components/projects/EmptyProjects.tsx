import { FolderPlus } from "lucide-react";

export default function EmptyProjects() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.07] bg-[#10121A] py-16 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.04]">
        <FolderPlus size={20} className="text-[#4F5460]" />
      </div>

      <h2 className="font-display text-[19px] text-white">
        No projects found
      </h2>

      <p className="mt-2 text-sm text-[#8D919D]">
        Create your first project to get started.
      </p>
    </div>
  );
}