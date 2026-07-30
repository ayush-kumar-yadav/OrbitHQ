type ProjectsHeaderProps = {
  onCreateProject: () => void;
};

export default function ProjectsHeader({
  onCreateProject,
}: ProjectsHeaderProps) {
  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">
          Projects
        </h1>

        <p className="mt-1 text-gray-500">
          Manage all your projects in one place.
        </p>
      </div>

      <button
        onClick={onCreateProject}
        className="rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700 transition"
      >
        + New Project
      </button>
    </div>
  );
}