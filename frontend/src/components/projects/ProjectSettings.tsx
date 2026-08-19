import { useState } from "react";
import { AlertTriangle } from "lucide-react";

import { useUpdateProject } from "../../hooks/projects/useUpdateProject";
import { useArchiveProject } from "../../hooks/projects/useArchiveProject";
import { useDeleteProject } from "../../hooks/projects/useDeleteProject";

type Props = {
  project: any;
};

export default function ProjectSettings({ project }: Props) {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description || "");

  const updateProject = useUpdateProject();
  const archiveProject = useArchiveProject();
  const deleteProject = useDeleteProject();

  return (
    <div className="space-y-5">

      <div className="rounded-2xl border border-white/[0.07] bg-[#10121A] p-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#626775]">
          General
        </p>
        <h2 className="mt-1 font-display text-[17px] text-white">
          Project Settings
        </h2>

        <div className="mt-5 space-y-4">
          <div>
            <label className="mb-2 block text-xs font-medium text-[#8D919D]">
              Project Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="orbit-input"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-[#8D919D]">
              Description
            </label>
            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="orbit-input !h-auto resize-none py-3"
            />
          </div>

          <button
            onClick={() =>
              updateProject.mutate({
                projectId: project._id,
                data: { name, description },
              })
            }
            disabled={updateProject.isPending}
            className="orbit-btn-solid"
          >
            {updateProject.isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Danger Zone — red is appropriate here, this is
          the one place on the page it should stick out. */}
      <div className="rounded-2xl border border-[#FF5C6C]/20 bg-[#FF5C6C]/[0.04] p-6">
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} className="text-[#FF6B78]" />
          <h2 className="font-display text-[17px] text-[#FF7B87]">
            Danger Zone
          </h2>
        </div>

        <p className="mt-2 text-sm text-[#FF9AA3]">
          These actions are irreversible. Please proceed carefully.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            onClick={() => {
              if (window.confirm("Archive this project?")) {
                archiveProject.mutate(project._id);
              }
            }}
            disabled={archiveProject.isPending}
            className="rounded-lg border border-[#F5A623]/30 bg-[#F5A623]/10 px-4 py-2 text-xs font-medium text-[#F5A623] transition hover:bg-[#F5A623]/20 disabled:opacity-50"
          >
            {archiveProject.isPending ? "Archiving..." : "Archive Project"}
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
            className="rounded-lg border border-[#FF5C6C]/30 bg-[#FF5C6C]/10 px-4 py-2 text-xs font-medium text-[#FF6B78] transition hover:bg-[#FF5C6C]/20 disabled:opacity-50"
          >
            {deleteProject.isPending ? "Deleting..." : "Delete Project"}
          </button>
        </div>
      </div>
    </div>
  );
}