import { useState } from "react";

import DashboardLayout from "../../layouts/DashboardLayout";
import ErrorState from "../../components/common/ErrorState";
import { useProjects } from "../../hooks/projects/useProjects";

import ProjectsHeader from "../../components/projects/ProjectsHeader";
import CreateProjectForm from "../../components/projects/CreateProjectForm";
import ProjectGrid from "../../components/projects/ProjectGrid";
import EmptyProjects from "../../components/projects/EmptyProjects";

export default function ProjectsPage() {
  const { data, isLoading, error, refetch, isRefetching } = useProjects();

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
          <ErrorState
            title="Failed to load projects."
            description="Please try again."
            onRetry={() => refetch()}
            isRetrying={isRefetching}
            className=""
          />
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