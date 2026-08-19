import { Link } from "react-router-dom";
import { FolderKanban, ArrowUpRight, FolderOpen } from "lucide-react";

type Props = {
  projects: any[];
};

export default function RecentProjects({ projects }: Props) {
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.04]">
          <FolderOpen size={18} className="text-[#4F5460]" />
        </div>
        <p className="text-sm text-[#8D919D]">
          No projects yet.
        </p>
        <p className="mt-1 text-xs text-[#4F5460]">
          Create one to start organizing work.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {projects.map((project: any) => (
        <Link
          key={project._id}
          to={`/projects/${project._id}`}
          className="group flex items-center gap-3 rounded-xl border border-transparent px-2 py-2.5 transition hover:border-white/[0.08] hover:bg-white/[0.03]"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#4C6FFF]/10 text-[#7187FF]">
            <FolderKanban size={17} />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-medium text-[#EDEEF2]">
              {project.name}
            </h3>

            <p className="mt-0.5 truncate text-xs text-[#626775]">
              {project.description || "No description"}
            </p>
          </div>

          <ArrowUpRight
            size={15}
            className="shrink-0 text-[#4F5460] opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100"
          />
        </Link>
      ))}
    </div>
  );
}