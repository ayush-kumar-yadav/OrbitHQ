import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutGrid, ListChecks } from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import ErrorState from "../../components/common/ErrorState";
import { useTasks } from "../../hooks/tasks/useTasks";
import TaskCard from "../../components/tasks/TaskCard";

const TABS = [
  { id: "ALL", label: "All" },
  { id: "TODO", label: "To do" },
  { id: "IN_PROGRESS", label: "In progress" },
  { id: "IN_REVIEW", label: "In review" },
  { id: "DONE", label: "Done" },
];

export default function TasksPage() {
  const { data, isLoading, error, refetch, isRefetching } = useTasks();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("ALL");

  const allTasks = data?.data.tasks || [];

  const tasks =
    activeTab === "ALL"
      ? allTasks
      : allTasks.filter((task: any) => task.status === activeTab);

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-[1600px] space-y-6">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <section className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#10121A] px-6 py-7 sm:px-8">
          <div className="pointer-events-none absolute -right-24 -top-32 h-72 w-72 rounded-full bg-[#4C6FFF]/10 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#4C6FFF] shadow-[0_0_10px_rgba(76,111,255,0.8)]" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#626775]">
                  Tasks
                </span>
              </div>

              <h1 className="font-display text-3xl tracking-tight text-white sm:text-4xl">
                All Tasks
              </h1>

              <p className="mt-2 text-sm text-[#8D919D]">
                Everything assigned across your workspace, in one list.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/tasks/kanban")}
              className="flex h-10 shrink-0 items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 text-sm font-medium text-[#EDEEF2] transition hover:border-white/[0.14] hover:bg-white/[0.05]"
            >
              <LayoutGrid size={15} />
              Kanban view
            </button>
          </div>
        </section>

        {/* ================================================= */}
        {/* TABS */}
        {/* ================================================= */}

        <div className="flex flex-wrap gap-1.5">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition ${
                activeTab === tab.id
                  ? "bg-[#4C6FFF]/15 text-[#7187FF]"
                  : "text-[#8D919D] hover:bg-white/[0.04] hover:text-[#EDEEF2]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ================================================= */}
        {/* CONTENT */}
        {/* ================================================= */}

        {isLoading ? (
          <TasksSkeleton />
        ) : error ? (
          <ErrorState
            title="Failed to load tasks."
            description="Please try again."
            onRetry={() => refetch()}
            isRetrying={isRefetching}
          />
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.07] bg-[#10121A] py-16 text-center">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.04]">
              <ListChecks size={18} className="text-[#4F5460]" />
            </div>
            <p className="text-sm text-[#8D919D]">
              {activeTab === "ALL"
                ? "No tasks found."
                : "No tasks in this status."}
            </p>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {tasks.map((task: any) => (
              <TaskCard
                key={task._id}
                task={task}
              />
            ))}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}

/* ========================================================= */
/* LOADING */
/* ========================================================= */

function TasksSkeleton() {
  return (
    <div className="grid animate-pulse gap-3 md:grid-cols-2 xl:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((card) => (
        <div
          key={card}
          className="h-28 rounded-xl border border-white/[0.05] bg-white/[0.02]"
        />
      ))}
    </div>
  );
}