import TaskCard from "./TaskCard";
import {
  FileQuestion,
  List,
  Rows3,
  Table,
  XCircle,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import TaskItem from "./TaskItem";
import TaskTable from "./TaskTable";
import { useGetTask } from "../../hooks/useGetTask";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import {
  sortTasks,
  type SortCriterion,
  type SortDirection,
} from "../../utils/sortTasks";
import { useAuth } from "../../context/AuthContext";

type ViewMode = "card" | "list" | "table";
const VALID_MODES: ViewMode[] = ["card", "list", "table"];

export default function TaskList() {
  const { data: tasks = [], isLoading, isError, error } = useGetTask();
  const { isLoggedIn } = useAuth();

  const [savedMode, setViewMode] = useLocalStorage<ViewMode>(
    "task_view_mode",
    "card",
  );
  const currentViewMode = VALID_MODES.includes(savedMode) ? savedMode : "card";

  const [sortCriterion, setSortCriterion] = useLocalStorage<SortCriterion>(
    "task_sort_criterion",
    "createdAt",
  );
  const [sortDirection, setSortDirection] = useLocalStorage<SortDirection>(
    "task_sort_direction",
    "desc",
  );
  const sortedTasks = sortTasks(tasks, sortCriterion, sortDirection);

  const toggleDirection = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <div className="flex min-h-80 flex-col">
      <div className="flex flex-col items-center gap-4 justify-between py-2 mx-4">
        <h2 className="text-sm font-bold text-base-content/60 uppercase tracking-wider">
          To Do List
        </h2>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-base-200 p-1 rounded-md border border-base-content/20">
            <select
              value={sortCriterion}
              onChange={(e) =>
                setSortCriterion(e.target.value as SortCriterion)
              }
              className="select select-ghost select-xs text-xs font-medium focus:outline-none"
              aria-label="Sort By"
            >
              <option value="createdAt">Created</option>
              <option value="updatedAt">Updated</option>
              <option value="priority">Priority</option>
              <option value="name">Alphabet</option>
            </select>

            <button
              onClick={toggleDirection}
              className="btn btn-xs btn-primary p-1 shadow-none text-white/70 hover:text-white"
              title={
                sortDirection === "asc" ? "Ascending Order" : "Descending Order"
              }
              aria-label="Change Sequence Direction"
            >
              {sortDirection === "asc" ? (
                <ArrowUp size={14} strokeWidth={3} />
              ) : (
                <ArrowDown size={14} strokeWidth={3} />
              )}
            </button>
          </div>

          <div className="join bg-base-200 p-1 rounded-md border border-base-content/20">
            <button
              onClick={() => setViewMode("card")}
              className={`btn btn-xs join-item gap-1 shadow-none ${
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
              className={`btn btn-xs join-item gap-1 shadow-none ${
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
              className={`btn btn-xs join-item gap-1 shadow-none ${
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
          {currentViewMode === "card" && <TaskCard tasks={sortedTasks} />}
          {currentViewMode === "list" && <TaskItem tasks={sortedTasks} />}
          {currentViewMode === "table" && <TaskTable tasks={sortedTasks} />}
        </div>
      )}
    </div>
  );
}
