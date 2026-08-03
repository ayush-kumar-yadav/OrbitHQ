import DashboardLayout from "../../layouts/DashboardLayout";

import StatCard from "../../components/dashboard/StatCard";
import RecentActivity from "../../components/dashboard/RecentActivity";

import { useDashboard } from "../../hooks/dashboard/useDashboard";

export default function DashboardPage() {
  const { data, isLoading, error } =
    useDashboard();

  if (isLoading) {
    return (
      <DashboardLayout>
        <p>Loading dashboard...</p>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <p className="text-red-500">
          Failed to load dashboard.
        </p>
      </DashboardLayout>
    );
  }

  const dashboard = data?.data;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold">
            Dashboard
          </h1>

          <p className="mt-2 text-gray-500">
            Welcome back 👋
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Projects"
            value={dashboard.stats.totalProjects}
            icon="📁"
          />

          <StatCard
            title="Tasks"
            value={dashboard.stats.totalTasks}
            icon="📋"
          />

          <StatCard
            title="Completed"
            value={dashboard.stats.completedTasks}
            icon="✅"
          />

          <StatCard
            title="Overdue"
            value={dashboard.stats.overdueTasks}
            icon="⏰"
          />
        </div>

        <RecentActivity
          activity={dashboard.recentActivity}
        />
      </div>
    </DashboardLayout>
  );
}