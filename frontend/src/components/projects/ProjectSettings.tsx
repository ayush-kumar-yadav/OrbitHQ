import { useState } from "react";

import { useUpdateProject } from "../../hooks/projects/useUpdateProject";
import { useArchiveProject } from "../../hooks/projects/useArchiveProject";
import { useDeleteProject } from "../../hooks/projects/useDeleteProject";

type Props = {
  project: any;
};

export default function ProjectSettings({
  project,
}: Props) {
  const [name, setName] = useState(project.name);

  const [description, setDescription] =
    useState(project.description || "");

  const updateProject =
    useUpdateProject();

  const archiveProject =
    useArchiveProject();

  const deleteProject =
    useDeleteProject();

  return (
  <div className="space-y-8">
    {/* Project Settings */}
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-2xl font-bold">
        Project Settings
      </h2>

      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Project Name
          </label>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Description
          </label>

          <textarea
            rows={5}
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            className="w-full rounded-lg border p-3"
          />
        </div>

        <button
          onClick={() =>
            updateProject.mutate({
              projectId: project._id,
              data: {
                name,
                description,
              },
            })
          }
          disabled={updateProject.isPending}
          className="rounded-lg bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {updateProject.isPending
            ? "Saving..."
            : "Save Changes"}
        </button>
      </div>
    </div>

    {/* Danger Zone */}
    <div className="rounded-xl border border-red-300 bg-red-50 p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-red-700">
        Danger Zone
      </h2>

      <p className="mt-2 text-sm text-red-600">
        These actions are irreversible. Please proceed
        carefully.
      </p>

      <div className="mt-6 flex flex-wrap gap-4">
        <button
          onClick={() => {
            if (
              window.confirm(
                "Archive this project?"
              )
            ) {
              archiveProject.mutate(project._id);
            }
          }}
          disabled={archiveProject.isPending}
          className="rounded-lg bg-yellow-500 px-5 py-3 text-white transition hover:bg-yellow-600 disabled:opacity-50"
        >
          {archiveProject.isPending
            ? "Archiving..."
            : "Archive Project"}
        </button>

        <button
          onClick={() => {
            if (
              window.confirm(
                "This action cannot be undone.\n\nDelete this project permanently?"
              )
            ) {
              deleteProject.mutate(project._id);
            }
          }}
          disabled={deleteProject.isPending}
          className="rounded-lg bg-red-600 px-5 py-3 text-white transition hover:bg-red-700 disabled:opacity-50"
        >
          {deleteProject.isPending
            ? "Deleting..."
            : "Delete Project"}
        </button>
      </div>
    </div>
  </div>
);
}