import {
  useEffect,
  useRef,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  Search,
  Folder,
  CheckSquare,
  User,
  MessageSquare,
  X,
  Loader2,
} from "lucide-react";

import {
  useGlobalSearch,
} from "../../hooks/search/useGlobalSearch";

import type {
  GlobalSearchResult,
} from "../../api/search.api";


function ResultIcon({
  type,
}: {
  type: GlobalSearchResult["type"];
}) {
  switch (type) {
    case "PROJECT":
      return (
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#4C6FFF]/10 text-[#4C6FFF]">
          <Folder size={16} />
        </div>
      );

    case "TASK":
      return (
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2FD9C4]/10 text-[#2FD9C4]">
          <CheckSquare size={16} />
        </div>
      );

    case "USER":
      return (
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F5A623]/10 text-[#F5A623]">
          <User size={16} />
        </div>
      );

    case "COMMENT":
      return (
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
          <MessageSquare size={16} />
        </div>
      );
  }
}


function ResultGroup({
  title,
  results,
  selectedIndex,
  startIndex,
  onSelect,
}: {
  title: string;
  results: GlobalSearchResult[];
  selectedIndex: number;
  startIndex: number;
  onSelect: (result: GlobalSearchResult) => void;
}) {
  if (!results.length) {
    return null;
  }

  return (
    <div className="mb-3">
      <div className="px-3 pb-2 pt-2 text-[10px] font-semibold uppercase tracking-wider text-[#626775]">
        {title}
      </div>

      {results.map((result, index) => {
        const absoluteIndex =
          startIndex + index;

        const selected =
          absoluteIndex === selectedIndex;

        return (
          <button
            key={`${result.type}-${result.id}`}
            type="button"
            onClick={() => onSelect(result)}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
              selected
                ? "bg-white/[0.07]"
                : "hover:bg-white/[0.04]"
            }`}
          >
            <ResultIcon
              type={result.type}
            />

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">
                {result.title}
              </p>

              {(result.subtitle ||
                result.description) && (
                <p className="mt-0.5 truncate text-[11px] text-[#626775]">
                  {result.subtitle ??
                    result.description}
                </p>
              )}
            </div>

            <span className="shrink-0 text-[10px] text-[#626775]">
              {result.type.toLowerCase()}
            </span>
          </button>
        );
      })}
    </div>
  );
}


export default function GlobalSearch() {
  const navigate = useNavigate();

  const [open, setOpen] =
    useState(false);

  const [query, setQuery] =
    useState("");

  const [selectedIndex, setSelectedIndex] =
    useState(0);

  const inputRef =
    useRef<HTMLInputElement>(null);

  const {
    data,
    loading,
    error,
  } = useGlobalSearch(
    query,
    open
  );


  /*
   * Ctrl + K
   */

  useEffect(() => {
    function handleShortcut(
      event: KeyboardEvent
    ) {
      if (
        (event.ctrlKey ||
          event.metaKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();

        setOpen(true);

        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      }

      if (
        event.key === "Escape"
      ) {
        closeSearch();
      }
    }

    window.addEventListener(
      "keydown",
      handleShortcut
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleShortcut
      );
    };
  }, []);


  /*
   * Flatten backend groups
   */

  const results =
    data?.results ?? [];

  const projectResults =
    data?.groups.projects ?? [];

  const taskResults =
    data?.groups.tasks ?? [];

  const userResults =
    data?.groups.users ?? [];

  const commentResults =
    data?.groups.comments ?? [];


  /*
   * Keyboard navigation
   */

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (
      event.key === "ArrowDown"
    ) {
      event.preventDefault();

      setSelectedIndex(
        (current) =>
          Math.min(
            current + 1,
            Math.max(
              results.length - 1,
              0
            )
          )
      );
    }

    if (
      event.key === "ArrowUp"
    ) {
      event.preventDefault();

      setSelectedIndex(
        (current) =>
          Math.max(
            current - 1,
            0
          )
      );
    }

    if (
      event.key === "Enter" &&
      results[selectedIndex]
    ) {
      openResult(
        results[selectedIndex]
      );
    }
  }


  function openResult(
    result: GlobalSearchResult
  ) {
    navigate(result.url);
    closeSearch();
  }


  function closeSearch() {
    setOpen(false);
    setQuery("");
    setSelectedIndex(0);
  }


  function openSearch() {
    setOpen(true);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }


  /*
   * Calculate group offsets
   */

  const projectStart = 0;

  const taskStart =
    projectResults.length;

  const userStart =
    taskStart +
    taskResults.length;

  const commentStart =
    userStart +
    userResults.length;


  return (
    <>
      {/* Search trigger */}

      <button
        type="button"
        onClick={openSearch}
        className="flex h-9 w-[230px] items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 text-left transition hover:border-white/[0.14] hover:bg-white/[0.05]"
      >
        <Search
          size={15}
          className="text-[#626775]"
        />

        <span className="flex-1 text-xs text-[#626775]">
          Search anything...
        </span>

        <span className="rounded-md border border-white/[0.08] px-1.5 py-0.5 text-[9px] text-[#626775]">
          Ctrl K
        </span>
      </button>


      {/* Search modal */}

      {open && (
        <div className="fixed inset-0 z-[100]">

          {/* Backdrop */}

          <button
            type="button"
            aria-label="Close search"
            onClick={closeSearch}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />


          {/* Modal */}

          <div className="relative mx-auto mt-[12vh] w-[calc(100%-32px)] max-w-2xl overflow-hidden rounded-2xl border border-white/[0.1] bg-[#10121A] shadow-2xl shadow-black/50">

            {/* Input */}

            <div className="flex h-16 items-center border-b border-white/[0.07] px-5">

              <Search
                size={20}
                className="mr-3 text-[#626775]"
              />

              <input
                ref={inputRef}
                value={query}
                onChange={(event) => {
                  setQuery(
                    event.target.value
                  );
                  setSelectedIndex(0);
                }}
                onKeyDown={
                  handleKeyDown
                }
                placeholder="Search projects, tasks, people, comments..."
                className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[#555A68]"
              />

              {loading && (
                <Loader2
                  size={17}
                  className="mr-2 animate-spin text-[#4C6FFF]"
                />
              )}

              <button
                type="button"
                onClick={closeSearch}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-[#626775] hover:bg-white/[0.06] hover:text-white"
              >
                <X size={15} />
              </button>

            </div>


            {/* Results */}

            <div className="max-h-[55vh] overflow-y-auto p-2">

              {!query.trim() && (
                <div className="px-4 py-12 text-center">

                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#4C6FFF]/10 text-[#4C6FFF]">
                    <Search size={21} />
                  </div>

                  <p className="mt-4 text-sm font-medium text-white">
                    Search your workspace
                  </p>

                  <p className="mt-1 text-xs text-[#626775]">
                    Find projects, tasks,
                    people and comments.
                  </p>

                </div>
              )}


              {query.trim() &&
                !loading &&
                error && (
                  <div className="px-4 py-12 text-center">
                    <p className="text-sm text-red-400">
                      {error}
                    </p>
                  </div>
                )}


              {query.trim() &&
                !loading &&
                !error &&
                results.length === 0 && (
                  <div className="px-4 py-12 text-center">

                    <p className="text-sm font-medium text-white">
                      No results found
                    </p>

                    <p className="mt-1 text-xs text-[#626775]">
                      Try another search.
                    </p>

                  </div>
                )}


              {!error &&
                projectResults.length > 0 && (
                  <ResultGroup
                    title="Projects"
                    results={
                      projectResults
                    }
                    selectedIndex={
                      selectedIndex
                    }
                    startIndex={
                      projectStart
                    }
                    onSelect={
                      openResult
                    }
                  />
                )}


              {!error &&
                taskResults.length > 0 && (
                  <ResultGroup
                    title="Tasks"
                    results={taskResults}
                    selectedIndex={
                      selectedIndex
                    }
                    startIndex={
                      taskStart
                    }
                    onSelect={
                      openResult
                    }
                  />
                )}


              {!error &&
                userResults.length > 0 && (
                  <ResultGroup
                    title="People"
                    results={userResults}
                    selectedIndex={
                      selectedIndex
                    }
                    startIndex={
                      userStart
                    }
                    onSelect={
                      openResult
                    }
                  />
                )}


              {!error &&
                commentResults.length > 0 && (
                  <ResultGroup
                    title="Comments"
                    results={
                      commentResults
                    }
                    selectedIndex={
                      selectedIndex
                    }
                    startIndex={
                      commentStart
                    }
                    onSelect={
                      openResult
                    }
                  />
                )}

            </div>


            {/* Footer */}

            <div className="flex items-center justify-between border-t border-white/[0.07] px-5 py-3">

              <div className="flex items-center gap-4 text-[10px] text-[#555A68]">

                <span>
                  <kbd className="mr-1 rounded border border-white/[0.08] px-1.5 py-0.5">
                    ↑
                  </kbd>

                  <kbd className="rounded border border-white/[0.08] px-1.5 py-0.5">
                    ↓
                  </kbd>

                  Navigate
                </span>

                <span>
                  <kbd className="mr-1 rounded border border-white/[0.08] px-1.5 py-0.5">
                    Enter
                  </kbd>

                  Open
                </span>

                <span>
                  <kbd className="rounded border border-white/[0.08] px-1.5 py-0.5">
                    Esc
                  </kbd>

                  Close
                </span>

              </div>

              <span className="text-[10px] text-[#555A68]">
                {data
                  ? `${data.total} results`
                  : "OrbitHQ Search"}
              </span>

            </div>

          </div>
        </div>
      )}
    </>
  );
}