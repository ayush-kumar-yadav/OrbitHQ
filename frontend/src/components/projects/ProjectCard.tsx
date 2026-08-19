import { useNavigate } from "react-router-dom";
import { FolderKanban, ArrowUpRight } from "lucide-react";

type ProjectCardProps = {
  project: {
    _id: string;
    name: string;
    description?: string;
    status: string;
  };
};

const STATUS_META: Record<string, { label: string; color: string }> = {
  ACTIVE: { label: "Active", color: "#2FD9C4" },
  ARCHIVED: { label: "Archived", color: "#8D919D" },
};

export default function ProjectCard({
  project,
}: ProjectCardProps) {
  const navigate = useNavigate();
  const status = STATUS_META[project.status] ?? STATUS_META.ACTIVE;

  return (
    <div
      onClick={() => navigate(`/projects/${project._id}`)}
      className="group cursor-pointer rounded-2xl border border-white/[0.07] bg-[#10121A] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/[0.14] hover:bg-[#12151E]"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4C6FFF]/10 text-[#7187FF]">
          <FolderKanban size={18} />
        </div>

        <ArrowUpRight
          size={16}
          className="text-[#4F5460] opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100"
        />
      </div>

      <h2 className="mt-4 truncate text-[15px] font-semibold text-white">
        {project.name}
      </h2>

      <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-[#8D919D]">
        {project.description || "No description"}
      </p>

      <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium"
          style={{
            backgroundColor: `${status.color}1A`,
            color: status.color,
          }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: status.color }}
          />
          {status.label}
        </span>

        <span className="text-xs font-medium text-[#626775] transition group-hover:text-[#4C6FFF]">
          View project
        </span>
      </div>
    </div>
  );
}