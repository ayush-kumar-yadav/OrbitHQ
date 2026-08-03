import { useParams } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useProject } from "../../hooks/projects/useProject";
import MembersTab from "../../components/organization/MembersTab";
import ProjectStats from "../../components/projects/ProjectStats";
import ProjectActions from "../../components/projects/ProjectActions";
import CreateTaskForm from "../../components/tasks/CreateTaskForm";
import TaskList from "../../components/tasks/TaskList";
import { useState } from "react";
import ProjectTabs from "../../components/projects/ProjectTabs";
import ProjectBoard from "../../components/projects/ProjectBoard";
import ProjectSettings from "../../components/projects/ProjectSettings";

export default function ProjectDetailsPage() {
  const { id } = useParams();

  const { data, isLoading, error } = useProject(id!);
  const [activeTab, setActiveTab] =
  useState("Overview");

  if (isLoading) {
    return (
      <DashboardLayout>
        <p>Loading project...</p>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <p className="text-red-500">Failed to load project.</p>
      </DashboardLayout>
    );
  }

  const project = data?.data;

  if (!project) {
    return (
      <DashboardLayout>
        <p>Project not found.</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <ProjectTabs
  activeTab={activeTab}
  setActiveTab={setActiveTab}
/>
      <div className="space-y-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-4xl font-bold">{project.name}</h1>

            <p className="mt-3 text-gray-600">
              {project.description || "No description"}
            </p>

            <div className="mt-4 flex gap-3">
              <span className="rounded-full bg-green-100 px-3 py-1 text-green-700">
                {project.status}
              </span>
            </div>
          </div>

          <ProjectActions
            onEdit={() => console.log("Edit")}
            onArchive={() => console.log("Archive")}
            onDelete={() => console.log("Delete")}
          />
        </div>

        <hr />

 {activeTab === "Overview" && (
  <>
    <ProjectStats
      tasks={0}
      members={1}
      comments={0}
      activity={0}
    />

    <div className="mt-8 grid gap-6 lg:grid-cols-2">
      <CreateTaskForm projectId={project._id} />
      <TaskList projectId={project._id} />
    </div>
  </>
)}

{activeTab === "Board" && (
  <ProjectBoard projectId={project._id} />
)}

{activeTab === "Activity" && (
  <div className="rounded-xl border bg-white p-8 shadow-sm">
    <h2 className="text-2xl font-bold">
      Project Activity
    </h2>

    <p className="mt-3 text-gray-500">
      Activity timeline will appear here once project-wide
      activity aggregation is implemented.
    </p>
  </div>
)}

{activeTab === "Members" && (
  <MembersTab />
)}

{activeTab === "Settings" && (
  <ProjectSettings
    project={project}
  />
)}

      </div> {/* <-- This was missing */}

    </DashboardLayout>
  );
}