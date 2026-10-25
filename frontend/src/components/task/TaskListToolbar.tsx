import {
  ArrowDown,
  ArrowUp,
  List,
  Rows3,
  Table,
  Trash2,
  X,
} from "lucide-react";
import type { SortCriterion, SortDirection } from "../../utils/sortTasks";

type ViewMode = "card" | "list" | "table";

interface TaskListToolbarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  sortCriterion: SortCriterion;
  onSortCriterionChange: (criterion: SortCriterion) => void;
  sortDirection: SortDirection;
  onSortDirectionChange: (update: (current: SortDirection) => SortDirection) => void;
  isBulkMode: boolean;
  isProcessingBulk: boolean;
  hasTasks: boolean;
  onToggleBulkMode: () => void;
}

export default function TaskListToolbar({
  viewMode,
  onViewModeChange,
  sortCriterion,
  onSortCriterionChange,
  sortDirection,
  onSortDirectionChange,
  isBulkMode,
  isProcessingBulk,
  hasTasks,
  onToggleBulkMode,
}: TaskListToolbarProps) {
  return (
    <div className="flex flex-col flex-wrap items-center justify-between gap-4 py-2 mx-4">
      <h2 className="text-sm font-bold text-base-content/60 uppercase tracking-wider">
        To Do List
      </h2>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 bg-base-200 p-0.5 rounded-lg border border-base-content/20">
          <select
            value={sortCriterion}
            onChange={(event) =>
              onSortCriterionChange(event.target.value as SortCriterion)
            }
            className="select select-ghost select-xs text-xs font-medium focus:outline-none"
            aria-label="Sort By"
          >
            <option value="createdAt">Created</option>
            <option value="updatedAt">Updated</option>
            <option value="priority">Priority</option>
            <option value="name">Alphabet (Name)</option>
          </select>

          <button
            type="button"
            onClick={() =>
              onSortDirectionChange((current) =>
                current === "asc" ? "desc" : "asc",
              )
            }
            className="btn btn-xs btn-ghost p-1 text-base-content/70 hover:text-base-content"
            aria-label="Change Sequence Direction"
          >
            {sortDirection === "asc" ? (
              <ArrowUp size={14} />
            ) : (
              <ArrowDown size={14} />
            )}
          </button>
        </div>

        <div className="join bg-base-200 p-0.5 rounded-lg border border-base-content/20">
          <ViewModeButton
            mode="card"
            currentMode={viewMode}
            onClick={onViewModeChange}
            label="Card view"
          >
            <Rows3 size={14} />
          </ViewModeButton>
          <ViewModeButton
            mode="list"
            currentMode={viewMode}
            onClick={onViewModeChange}
            label="List view"
          >
            <List size={14} />
          </ViewModeButton>
          <ViewModeButton
            mode="table"
            currentMode={viewMode}
            onClick={onViewModeChange}
            label="Table view"
          >
            <Table size={14} />
          </ViewModeButton>
        </div>

        <button
          type="button"
          onClick={onToggleBulkMode}
          disabled={isProcessingBulk || !hasTasks}
          aria-label={isBulkMode ? "Exit bulk mode" : "Enter bulk mode"}
          aria-pressed={isBulkMode}
          className={`btn btn-xs gap-1 ${
            isBulkMode
              ? "btn-error text-white"
              : "btn-ghost border border-base-content/20 text-base-content/70 hover:text-base-content"
          }`}
        >
          {isBulkMode ? <X size={14} /> : <Trash2 size={14} />}
        </button>
      </div>
    </div>
  );
}

interface ViewModeButtonProps {
  mode: ViewMode;
  currentMode: ViewMode;
  onClick: (mode: ViewMode) => void;
  label: string;
  children: React.ReactNode;
}

function ViewModeButton({
  mode,
  currentMode,
  onClick,
  label,
  children,
}: ViewModeButtonProps) {
  const isActive = currentMode === mode;

  return (
    <button
      type="button"
      onClick={() => onClick(mode)}
      aria-label={label}
      aria-pressed={isActive}
      className={`btn btn-xs join-item gap-1 ${
        isActive
          ? "btn-primary text-white"
          : "btn-ghost text-base-content/70 hover:text-base-content"
      }`}
    >
      {children}
    </button>
  );
}
