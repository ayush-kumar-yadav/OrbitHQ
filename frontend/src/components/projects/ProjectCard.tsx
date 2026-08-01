import { useNavigate } from "react-router-dom";


type ProjectCardProps = {
  project: {
    _id: string;
    name: string;
    description?: string;
    status: string;
  };
};

export default function ProjectCard({
  project,
}: ProjectCardProps) {
  const navigate = useNavigate();
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md">
      <h2 className="text-xl font-semibold">
        {project.name}
      </h2>

      <p className="mt-2 text-gray-600">
        {project.description || "No description"}
      </p>

      <div className="mt-4 flex items-center justify-between">
        <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
          {project.status}
        </span>

        <button
  onClick={() => navigate(`/projects/${project._id}`)}
  className="text-blue-600 hover:underline"
>
  View →
</button>
      </div>
    </div>
  );
}