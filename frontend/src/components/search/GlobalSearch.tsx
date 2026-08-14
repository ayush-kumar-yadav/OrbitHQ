import { useEffect, useState } from "react";
import {
  Search,
  X,
  FolderKanban,
  CheckSquare,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useGlobalSearch } from "../../hooks/search/useGlobalSearch";

export default function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const navigate = useNavigate();

  const { data, isLoading } =
    useGlobalSearch(query, open);

  useEffect(() => {
    function handleKeyboard(
      event: KeyboardEvent
    ) {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();
        setOpen(true);
      }

      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyboard
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyboard
      );
    };
  }, []);

  function closeSearch() {
    setOpen(false);
    setQuery("");
  }

  function openProject(id: string) {
    closeSearch();
    navigate(`/projects/${id}`);
  }

  function openTask(id: string) {
    closeSearch();
    navigate(`/tasks/${id}`);
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 transition hover:bg-slate-100"
      >
        <Search className="h-4 w-4" />

        <span>Search</span>

        <kbd className="rounded border bg-white px-1.5 py-0.5 text-[10px]">
          Ctrl K
        </kbd>
      </button>
    );
  }

  const projects = data?.projects ?? [];
  const tasks = data?.tasks ?? [];
  const members = data?.members ?? [];

  const hasResults =
    projects.length > 0 ||
    tasks.length > 0 ||
    members.length > 0;

  return (
    <>
      <div
        className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
        onClick={closeSearch}
      />

      <div className="fixed left-1/2 top-[15%] z-[101] w-full max-w-2xl -translate-x-1/2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center border-b px-5">
          <Search className="h-5 w-5 text-slate-400" />

          <input
            autoFocus
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            placeholder="Search projects, tasks, members..."
            className="flex-1 bg-transparent px-4 py-5 text-sm outline-none"
          />

          <button
            type="button"
            onClick={closeSearch}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[450px] overflow-y-auto">
          {query.trim().length < 2 ? (
            <div className="px-6 py-12 text-center">
              <Search className="mx-auto h-8 w-8 text-slate-300" />

              <p className="mt-3 text-sm font-medium">
                Search OrbitHQ
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Search projects, tasks, and members.
              </p>
            </div>
          ) : isLoading ? (
            <div className="space-y-3 p-5">
              <div className="h-14 animate-pulse rounded-lg bg-slate-100" />
              <div className="h-14 animate-pulse rounded-lg bg-slate-100" />
              <div className="h-14 animate-pulse rounded-lg bg-slate-100" />
            </div>
          ) : !hasResults ? (
            <div className="px-6 py-12 text-center">
              <Search className="mx-auto h-8 w-8 text-slate-300" />

              <p className="mt-3 text-sm font-medium">
                No results found
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Try another search term.
              </p>
            </div>
          ) : (
            <div>
              {/* PROJECTS */}
              {projects.length > 0 && (
                <div className="p-3">
                  <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Projects
                  </p>

                  {projects.map(
                    (project: any) => (
                      <button
                        key={project._id}
                        type="button"
                        onClick={() =>
                          openProject(
                            project._id
                          )
                        }
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left hover:bg-slate-50"
                      >
                        <FolderKanban className="h-4 w-4 text-blue-500" />

                        <div>
                          <p className="text-sm font-medium">
                            {project.name}
                          </p>

                          <p className="text-xs text-slate-400">
                            Project
                          </p>
                        </div>
                      </button>
                    )
                  )}
                </div>
              )}

              {/* TASKS */}
              {tasks.length > 0 && (
                <div className="border-t p-3">
                  <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Tasks
                  </p>

                  {tasks.map(
                    (task: any) => (
                      <button
                        key={task._id}
                        type="button"
                        onClick={() =>
                          openTask(task._id)
                        }
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left hover:bg-slate-50"
                      >
                        <CheckSquare className="h-4 w-4 text-emerald-500" />

                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {task.title}
                          </p>

                          <p className="text-xs text-slate-400">
                            Task
                          </p>
                        </div>
                      </button>
                    )
                  )}
                </div>
              )}

              {/* MEMBERS */}
              {members.length > 0 && (
                <div className="border-t p-3">
                  <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Members
                  </p>

                  {members
                    .slice(0, 5)
                    .map(
                      (member: any) => {
                        const user =
                          member.user ??
                          member;

                        return (
                          <div
                            key={
                              user._id
                            }
                            className="flex items-center gap-3 rounded-lg px-3 py-3"
                          >
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold">
                              {(
                                user.name ||
                                user.email ||
                                "U"
                              )
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div>
                              <p className="text-sm font-medium">
                                {user.name ||
                                  "Unknown user"}
                              </p>

                              <p className="text-xs text-slate-400">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        );
                      }
                    )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-between border-t bg-slate-50 px-5 py-3 text-xs text-slate-400">
          <span>ESC to close</span>
          <span>Ctrl + K</span>
        </div>
      </div>
    </>
  );
}