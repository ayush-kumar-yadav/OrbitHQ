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
      <div className="mx-auto max-w-[1600px]">

        <ProjectsHeader
          onCreateProject={() => setShowCreateForm(true)}
        />

        {showCreateForm && (
          <CreateProjectForm
            onClose={() => setShowCreateForm(false)}
          />
        )}

        {isLoading && <ProjectsSkeleton />}

        {error && (
          <div className="rounded-2xl border border-[#FF5C6C]/20 bg-[#10121A] px-8 py-7 text-center">
            <p className="text-sm font-medium text-[#FF7B87]">
              Failed to load projects.
            </p>
            <p className="mt-2 text-xs text-[#626775]">
              Please refresh the page and try again.
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
      </div>
    </DashboardLayout>
  );
}

function ProjectsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="h-40 animate-pulse rounded-2xl border border-white/[0.07] bg-[#10121A]"
        />
      ))}
    </div>
  );
}