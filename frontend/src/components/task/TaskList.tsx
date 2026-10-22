import TaskCard from "./TaskCard";
import { FileQuestion, List, Rows3, Table, XCircle } from "lucide-react";
import { useState } from "react";
import TaskItem from "./TaskItem";
import TaskTable from "./TaskTable";
import { useGetTask } from "../../hooks/useGetTask";

type ViewMode = "card" | "list" | "table";

export default function TaskList() {
  const {
    data: tasks = [],
    isLoading,
    isError,
    error,
  } = useGetTask();

  const [currentViewMode, setViewMode] = useState<ViewMode>("card");

  return (
    <div className="flex min-h-80 flex-col">
      <div className="flex items-center justify-between gap-4 p-4 mb-4  border-b border-base-content/20">
        <h2 className="text-xl font-bold tracking-tight text-base-content">
          Task list
        </h2>

        <div className="join bg-base-200 p-0.5 rounded-lg border border-base-content/20">
          <button
            onClick={() => setViewMode("card")}
            className={`btn btn-xs join-item gap-1 ${
              currentViewMode === "card"
                ? "btn-primary text-white"
                : "btn-ghost text-base-content/70 hover:text-base-content"
            }`}
            aria-label="Card view"
          >
            <Rows3 size={14} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`btn btn-xs join-item gap-1 ${
              currentViewMode === "list"
                ? "btn-primary text-white"
                : "btn-ghost text-base-content/70 hover:text-base-content"
            }`}
            aria-label="List view"
          >
            <List size={14} />
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`btn btn-xs join-item gap-1 ${
              currentViewMode === "table"
                ? "btn-primary text-white"
                : "btn-ghost text-base-content/70 hover:text-base-content"
            }`}
            aria-label="Table view"
          >
            <Table size={14} />
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="flex flex-1 flex-col items-center justify-center pointer-events-none p-8 gap-3 text-base-content/60">
          <div className="bg-base-200 p-3 rounded-full flex items-center justify-center">
            <span className="loading loading-spinner loading-xl text-primary"></span>
          </div>
          <p className="text-sm font-medium">Loading tasks...</p>
        </div>
      )}

      {isError && (
        <div className="flex flex-1 flex-col items-center justify-center pointer-events-none p-8 gap-3 text-error">
          <div className="bg-error/10 p-3 rounded-full">
            <XCircle size={32} strokeWidth={1.5} />
          </div>
          <div className="flex flex-col items-center text-center gap-1">
            <p className="text-lg font-semibold">Failed to load tasks</p>
            <p className="text-sm opacity-80 max-w-xs">
              {error?.message ||
                "An unexpected error occurred. Please try again later."}
            </p>
          </div>
        </div>
      )}

      {!isLoading && !isError && tasks?.length === 0 && (
        <div className="flex text-base-content/60 flex-1 flex-col items-center justify-center pointer-events-none p-8 gap-2">
          <div className="bg-base-200 p-3 rounded-full">
            <FileQuestion size={32} strokeWidth={1.5} />
          </div>
          <p className="text-lg font-medium text-center">No tasks found</p>
          <p className="text-sm text-base-content/40 text-center max-w-xs">
            You don't have any tasks right now. Create a new task to get
            started!
          </p>
        </div>
      )}

      {!isLoading && !isError && tasks.length > 0 && (
        <div>
          {currentViewMode === "card" && <TaskCard tasks={tasks} />}

          {currentViewMode === "list" && <TaskItem tasks={tasks} />}

          {currentViewMode === "table" && <TaskTable tasks={tasks} />}
        </div>
      )}
    </div>
  );
}
