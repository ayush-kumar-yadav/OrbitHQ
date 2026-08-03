import DashboardLayout from "../../layouts/DashboardLayout";

import StatCard from "../../components/dashboard/StatCard";
import RecentActivity from "../../components/dashboard/RecentActivity";
import RecentProjects from "../../components/dashboard/RecentProjects";
import UpcomingDeadlines from "../../components/dashboard/UpcomingDeadlines";
import TaskStatusChart from "../../components/dashboard/TaskStatusChart";
import ProductivityChart from "../../components/dashboard/ProductivityChart";
import { useDashboard } from "../../hooks/dashboard/useDashboard";
import { useProjects } from "../../hooks/projects/useProjects";
import { useTasks } from "../../hooks/tasks/useTasks";

export default function DashboardPage() {
  const { data, isLoading, error } = useDashboard();
  const { data: projectsData } = useProjects();
  const { data: tasksData } = useTasks();

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

  const projects = projectsData?.data?.projects?.slice(0, 5) ?? [];

  const upcomingTasks =
    tasksData?.data?.tasks
      ?.filter((task: any) => task.dueDate)
      .sort(
        (a: any, b: any) =>
          new Date(a.dueDate).getTime() -
          new Date(b.dueDate).getTime()
      )
      .slice(0, 5) ?? [];

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
            value={dashboard?.stats?.totalProjects ?? 0}
            icon="📁"
          />

          <StatCard
            title="Tasks"
            value={dashboard?.stats?.totalTasks ?? 0}
            icon="📋"
          />

          <StatCard
            title="Completed"
            value={dashboard?.stats?.completedTasks ?? 0}
            icon="✅"
          />

          <StatCard
            title="Overdue"
            value={dashboard?.stats?.overdueTasks ?? 0}
            icon="⏰"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <RecentProjects projects={projects} />

          <UpcomingDeadlines tasks={upcomingTasks} />
        </div>

        <RecentActivity
          activity={dashboard?.recentActivity ?? []}
        />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
  <TaskStatusChart
    tasks={tasksData?.data.tasks ?? []}
  />

  <ProductivityChart
    tasks={tasksData?.data.tasks ?? []}
  />
</div>
    </DashboardLayout>
  );
}