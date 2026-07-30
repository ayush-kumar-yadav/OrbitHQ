import { useState } from "react";

import DashboardLayout from "../../layouts/DashboardLayout";
import { useProjects } from "../../hooks/projects/useProjects";

import ProjectsHeader from "../../components/projects/ProjectsHeader";
import CreateProjectForm from "../../components/projects/CreateProjectForm";
import ProjectGrid from "../../components/projects/ProjectGrid";
import EmptyProjects from "../../components/projects/EmptyProjects";

export default function ProjectsPage() {
  const { data, isLoading, error } = useProjects();

  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <DashboardLayout>
      <ProjectsHeader
        onCreateProject={() => setShowCreateForm(true)}
      />

      {showCreateForm && (
        <CreateProjectForm
          onClose={() => setShowCreateForm(false)}
        />
      )}

      {isLoading && (
        <p className="text-gray-500">
          Loading projects...
        </p>
      )}

      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-4">
          <p className="font-semibold text-red-600">
            Something went wrong.
          </p>
        </div>
      )}

      {!isLoading && !error && (
        data?.data.projects.length === 0 ? (
          <EmptyProjects />
        ) : (
          <ProjectGrid
            projects={data.data.projects}
          />
        )
      )}
    </DashboardLayout>
  );
}