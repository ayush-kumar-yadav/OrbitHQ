import { Link } from "react-router-dom";

type Props = {
  projects: any[];
};

export default function RecentProjects({
  projects,
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-xl font-semibold">
        Recent Projects
      </h2>

      {projects.length === 0 ? (
        <p className="text-gray-500">
          No projects found.
        </p>
      ) : (
        <div className="space-y-4">
          {projects.map((project: any) => (
            <Link
              key={project._id}
              to={`/projects/${project._id}`}
              className="block rounded-lg border p-4 transition hover:border-blue-500"
            >
              <h3 className="font-semibold">
                {project.name}
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                {project.description ||
                  "No description"}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}