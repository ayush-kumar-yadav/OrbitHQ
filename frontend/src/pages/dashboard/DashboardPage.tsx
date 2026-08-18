import {
  FolderKanban,
  ListTodo,
  CheckCircle2,
  Clock3,
  ArrowUpRight,
} from "lucide-react";

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
        <DashboardSkeleton />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[500px] items-center justify-center">
          <div className="rounded-2xl border border-[#FF5C6C]/20 bg-[#10121A] px-8 py-7 text-center">
            <p className="text-sm font-medium text-[#FF7B87]">
              Failed to load dashboard.
            </p>

            <p className="mt-2 text-xs text-[#626775]">
              Please refresh the page and try again.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const dashboard = data?.data;

  const projects =
    projectsData?.data?.projects?.slice(0, 5) ?? [];

  const upcomingTasks =
    tasksData?.data?.tasks
      ?.filter((task: any) => task.dueDate)
      .sort(
        (a: any, b: any) =>
          new Date(a.dueDate).getTime() -
          new Date(b.dueDate).getTime()
      )
      .slice(0, 5) ?? [];

  const tasks = tasksData?.data?.tasks ?? [];

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-[1600px] space-y-7">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <section className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#10121A] px-6 py-7 sm:px-8">

          {/* subtle orbit glow */}
          <div className="pointer-events-none absolute -right-24 -top-32 h-72 w-72 rounded-full bg-[#4C6FFF]/10 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#4C6FFF] shadow-[0_0_10px_rgba(76,111,255,0.8)]" />

                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#626775]">
                  Workspace overview
                </span>
              </div>

              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Dashboard
              </h1>

              <p className="mt-2 text-sm text-[#8D919D]">
                Here's what's happening across your workspace.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#626775]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#2FD9C4]" />
              Workspace active
            </div>
          </div>
        </section>

        {/* ================================================= */}
        {/* STAT CARDS */}
        {/* ================================================= */}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <DashboardStat
            title="Projects"
            value={dashboard?.stats?.totalProjects ?? 0}
            icon={<FolderKanban size={18} />}
            iconClass="bg-[#4C6FFF]/10 text-[#7187FF]"
            href="/projects"
          />

          <DashboardStat
            title="Total tasks"
            value={dashboard?.stats?.totalTasks ?? 0}
            icon={<ListTodo size={18} />}
            iconClass="bg-[#2FD9C4]/10 text-[#2FD9C4]"
            href="/tasks"
          />

          <DashboardStat
            title="Completed"
            value={dashboard?.stats?.completedTasks ?? 0}
            icon={<CheckCircle2 size={18} />}
            iconClass="bg-[#2FD9C4]/10 text-[#2FD9C4]"
          />

          <DashboardStat
            title="Overdue"
            value={dashboard?.stats?.overdueTasks ?? 0}
            icon={<Clock3 size={18} />}
            iconClass="bg-[#FF5C6C]/10 text-[#FF6B78]"
          />

        </section>

        {/* ================================================= */}
        {/* PROJECTS + DEADLINES */}
        {/* ================================================= */}

        <section className="grid gap-5 xl:grid-cols-2">

          <DashboardPanel>
            <RecentProjects projects={projects} />
          </DashboardPanel>

          <DashboardPanel>
            <UpcomingDeadlines tasks={upcomingTasks} />
          </DashboardPanel>

        </section>

        {/* ================================================= */}
        {/* CHARTS */}
        {/* ================================================= */}

        <section>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#626775]">
                Performance
              </p>

              <h2 className="mt-1 text-lg font-semibold text-white">
                Productivity
              </h2>
            </div>

            <span className="text-xs text-[#626775]">
              Current workspace
            </span>
          </div>

          <div className="grid gap-5 xl:grid-cols-2">

            <DashboardPanel>
              <TaskStatusChart tasks={tasks} />
            </DashboardPanel>

            <DashboardPanel>
              <ProductivityChart tasks={tasks} />
            </DashboardPanel>

          </div>
        </section>

        {/* ================================================= */}
        {/* ACTIVITY */}
        {/* ================================================= */}

        <DashboardPanel>
          <div className="mb-5 flex items-center justify-between">

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#626775]">
                Workspace events
              </p>

              <h2 className="mt-1 text-lg font-semibold text-white">
                Recent activity
              </h2>
            </div>

            <ArrowUpRight
              size={17}
              className="text-[#626775]"
            />

          </div>

          <RecentActivity
            activity={dashboard?.recentActivity ?? []}
          />
        </DashboardPanel>

      </div>
    </DashboardLayout>
  );
}

/* ========================================================= */
/* DASHBOARD STAT */
/* ========================================================= */

type DashboardStatProps = {
  title: string;
  value: number;
  icon: React.ReactNode;
  iconClass: string;
  href?: string;
};

function DashboardStat({
  title,
  value,
  icon,
  iconClass,
  href,
}: DashboardStatProps) {
  return (
    <div
      className="
        group relative overflow-hidden
        rounded-2xl
        border border-white/[0.07]
        bg-[#10121A]
        p-5
        transition-all duration-200
        hover:-translate-y-0.5
        hover:border-white/[0.12]
        hover:bg-[#12151E]
      "
    >
      <div className="flex items-start justify-between">

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>

        {href && (
          <a
            href={href}
            className="text-[#4F5460] transition hover:text-white"
          >
            <ArrowUpRight size={16} />
          </a>
        )}

      </div>

      <div className="mt-6">

        <p className="text-xs font-medium text-[#626775]">
          {title}
        </p>

        <p className="mt-1 text-3xl font-semibold tracking-tight text-white">
          {value}
        </p>

      </div>

      {/* bottom glow */}
      <div className="absolute -bottom-10 -right-10 h-24 w-24 rounded-full bg-[#4C6FFF]/5 blur-2xl transition group-hover:bg-[#4C6FFF]/10" />
    </div>
  );
}

/* ========================================================= */
/* PANEL */
/* ========================================================= */

function DashboardPanel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#10121A] p-5 transition hover:border-white/[0.1]">
      {children}
    </div>
  );
}

/* ========================================================= */
/* LOADING */
/* ========================================================= */

function DashboardSkeleton() {
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-[1600px] animate-pulse space-y-7">

        <div className="h-36 rounded-2xl border border-white/[0.07] bg-[#10121A]" />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-36 rounded-2xl border border-white/[0.07] bg-[#10121A]"
            />
          ))}
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <div className="h-72 rounded-2xl border border-white/[0.07] bg-[#10121A]" />
          <div className="h-72 rounded-2xl border border-white/[0.07] bg-[#10121A]" />
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <div className="h-80 rounded-2xl border border-white/[0.07] bg-[#10121A]" />
          <div className="h-80 rounded-2xl border border-white/[0.07] bg-[#10121A]" />
        </div>

      </div>
    </DashboardLayout>
  );
}