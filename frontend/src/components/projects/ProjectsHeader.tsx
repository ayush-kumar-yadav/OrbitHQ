import { Plus } from "lucide-react";

type ProjectsHeaderProps = {
  onCreateProject: () => void;
};

export default function ProjectsHeader({
  onCreateProject,
}: ProjectsHeaderProps) {
  return (
    <section className="relative mb-6 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#10121A] px-6 py-7 sm:px-8">
      <div className="pointer-events-none absolute -right-24 -top-32 h-72 w-72 rounded-full bg-[#4C6FFF]/10 blur-3xl" />

      <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#4C6FFF] shadow-[0_0_10px_rgba(76,111,255,0.8)]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#626775]">
              Workspace
            </span>
          </div>

          <h1 className="font-display text-3xl tracking-tight text-white sm:text-4xl">
            Projects
          </h1>

          <p className="mt-2 text-sm text-[#8D919D]">
            Manage all your projects in one place.
          </p>
        </div>

        <button
          onClick={onCreateProject}
          className="orbit-btn-solid shrink-0"
        >
          <Plus size={15} />
          New Project
        </button>
      </div>
    </section>
  );
}