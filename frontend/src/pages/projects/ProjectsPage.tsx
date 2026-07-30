import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useProjects } from "../../hooks/projects/useProjects";
import { useCreateProject } from "../../hooks/projects/useCreateProject";

export default function ProjectsPage() {
  const { data, isLoading, error } = useProjects();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const createProject = useCreateProject();

  console.log("Projects Data:", data);
  console.log("Projects Error:", error);

  async function handleCreateProject(
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
    } catch (err) {
      console.error("Create Project Error:", err);
    }
  }

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Projects</h1>

      {isLoading && (
        <p className="text-gray-500">Loading projects...</p>
      )}

      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-4">
          <p className="text-red-600 font-semibold">
            Something went wrong.
          </p>

          <pre className="mt-2 text-sm overflow-auto">
            {JSON.stringify(error, null, 2)}
          </pre>
        </div>
      )}

      {!isLoading && !error && (
        <>
          {data?.data.projects.length === 0 ? (
            <div className="mt-12 text-center">
              <h2 className="text-2xl font-semibold">
                No projects found
              </h2>

              <p className="mt-2 text-gray-500">
                Create your first project to get started.
              </p>

              <form
                onSubmit={handleCreateProject}
                className="mt-8 mx-auto flex max-w-md flex-col gap-4"
              >
                <input
                  type="text"
                  placeholder="Project Name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  className="rounded-lg border p-3"
                  required
                />

                <textarea
                  placeholder="Project Description"
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  className="rounded-lg border p-3"
                  rows={4}
                />

                <button
                  type="submit"
                  disabled={createProject.isPending}
                  className="rounded-lg bg-blue-600 p-3 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {createProject.isPending
                    ? "Creating..."
                    : "+ Create Project"}
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-4">
              {data.data.projects.map((project: any) => (
                <div
                  key={project._id}
                  className="rounded-xl border bg-white p-5 shadow-sm"
                >
                  <h2 className="text-xl font-semibold">
                    {project.name}
                  </h2>

                  <p className="mt-2 text-gray-600">
                    {project.description ||
                      "No description"}
                  </p>

                  <div className="mt-4 text-sm text-gray-500">
                    Status: {project.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
}