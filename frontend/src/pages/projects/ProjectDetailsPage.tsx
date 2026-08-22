import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import DashboardLayout from "../../layouts/DashboardLayout";
import ErrorState from "../../components/common/ErrorState";
import { useProject } from "../../hooks/projects/useProject";
import { useArchiveProject } from "../../hooks/projects/useArchiveProject";
import { useDeleteProject } from "../../hooks/projects/useDeleteProject";
import { useTasks } from "../../hooks/tasks/useTasks";
import { useMembers } from "../../hooks/organizations/useMembers";

import MembersTab from "../../components/organization/MembersTab";
import ProjectStats from "../../components/projects/ProjectStats";
import ProjectActions from "../../components/projects/ProjectActions";
import CreateTaskForm from "../../components/tasks/CreateTaskForm";
import TaskList from "../../components/tasks/TaskList";
import ProjectTabs from "../../components/projects/ProjectTabs";
import ProjectBoard from "../../components/projects/ProjectBoard";
import ProjectSettings from "../../components/projects/ProjectSettings";

const STATUS_META: Record<string, { label: string; color: string }> = {
  ACTIVE: { label: "Active", color: "#2FD9C4" },
  ARCHIVED: { label: "Archived", color: "#8D919D" },
};

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error, refetch, isRefetching } = useProject(id!);
  const [activeTab, setActiveTab] = useState("Overview");

  const archiveProject = useArchiveProject();
  const deleteProject = useDeleteProject();

  async function handleArchive(projectId: string) {
    if (!window.confirm("Archive this project? It will be hidden from your active projects list.")) {
      return;
    }

    try {
      await archiveProject.mutateAsync(projectId);
      toast.success("Project archived");
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "Couldn't archive project.");
    }
  }

  async function handleDelete(projectId: string) {
    if (!window.confirm("This action cannot be undone.\n\nDelete this project permanently?")) {
      return;
    }

    try {
      await deleteProject.mutateAsync(projectId);
      toast.success("Project deleted");
      navigate("/projects");
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "Couldn't delete project.");
    }
  }

  // Real counts for the Overview stat cards. Tasks are scoped to this
  // project; members reflect the organization (OrbitHQ doesn't have
  // per-project membership yet, so this is the most accurate number
  // currently available). Comments/Activity totals would need a new
  // aggregate backend endpoint (there's currently only per-task
  // comment/activity lookups) — left at 0 until that exists, matching
  // the "Coming soon" state already shown on the Activity tab below.
  const { data: tasksData } = useTasks(id);
  const { data: membersData } = useMembers();

  const taskCount = tasksData?.data?.tasks?.length ?? 0;
  const memberCount = membersData?.data?.length ?? 0;

  if (isLoading) {
    return (
      <DashboardLayout>
        <ProjectDetailsSkeleton />
      </DashboardLayout>
    );
  }

  if (error || !data?.data) {
    return (
      <DashboardLayout>
        <ErrorState
          title={error ? "Failed to load project." : "Project not found."}
          description={
            error
              ? "Please try again."
              : "It may have been deleted or you don't have access."
          }
          onRetry={error ? () => refetch() : undefined}
          isRetrying={isRefetching}
        />
      </DashboardLayout>
    );
  }

  const project = data.data;
  const status = STATUS_META[project.status] ?? STATUS_META.ACTIVE;

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-[1600px] space-y-6">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <section className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#10121A] px-6 py-7 sm:px-8">
          <div className="pointer-events-none absolute -right-24 -top-32 h-72 w-72 rounded-full bg-[#4C6FFF]/10 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-display text-2xl leading-snug text-white sm:text-3xl">
                  {project.name}
                </h1>

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
              </div>

              <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#8D919D]">
                {project.description || "No description"}
              </p>
            </div>

            <ProjectActions
              onEdit={() => setActiveTab("Settings")}
              onArchive={() => handleArchive(project._id)}
              onDelete={() => handleDelete(project._id)}
              isArchiving={archiveProject.isPending}
              isDeleting={deleteProject.isPending}
            />
          </div>

          <div className="relative mt-6 border-t border-white/[0.06] pt-1">
            <ProjectTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
        </section>

        {/* ================================================= */}
        {/* TAB CONTENT */}
        {/* ================================================= */}

        {activeTab === "Overview" && (
          <>
            <ProjectStats
              tasks={taskCount}
              members={memberCount}
              comments={0}
              activity={0}
            />

            <div className="grid gap-5 xl:grid-cols-2">
              <div className="rounded-2xl border border-white/[0.07] bg-[#10121A] p-5">
                <CreateTaskForm projectId={project._id} />
              </div>
              <div className="rounded-2xl border border-white/[0.07] bg-[#10121A] p-5">
                <TaskList projectId={project._id} />
              </div>
            </div>
          </>
        )}

        {activeTab === "Board" && <ProjectBoard projectId={project._id} />}

        {activeTab === "Activity" && (
          <div className="rounded-2xl border border-white/[0.07] bg-[#10121A] p-8 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#626775]">
              Coming soon
            </p>
            <h2 className="mt-1 font-display text-[17px] text-white">
              Project Activity
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-[#8D919D]">
              Activity timeline will appear here once project-wide activity
              aggregation is implemented.
            </p>
          </div>
        )}

        {activeTab === "Members" && (
          <div className="rounded-2xl border border-white/[0.07] bg-[#10121A] p-5">
            <MembersTab />
          </div>
        )}

        {activeTab === "Settings" && <ProjectSettings project={project} />}

      </div>
    </DashboardLayout>
  );
}

/* ========================================================= */
/* LOADING */
/* ========================================================= */

function ProjectDetailsSkeleton() {
  return (
    <div className="mx-auto max-w-[1600px] animate-pulse space-y-6">
      <div className="h-40 rounded-2xl border border-white/[0.07] bg-[#10121A]" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 rounded-2xl border border-white/[0.07] bg-[#10121A]" />
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <div className="h-64 rounded-2xl border border-white/[0.07] bg-[#10121A]" />
        <div className="h-64 rounded-2xl border border-white/[0.07] bg-[#10121A]" />
      </div>
    </div>
  );
}