import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useGetTask } from "../../hooks/useGetTask";
import {
  sortTasks,
  type SortCriterion,
  type SortDirection,
} from "../../utils/sortTasks";
import BulkActionBar from "./BulkActionBar";
import TaskListContent from "./TaskListContent";
import TaskListToolbar from "./TaskListToolbar";
import { useBulkTaskActions } from "../../hooks/useBulkTaskActions";

type ViewMode = "card" | "list" | "table";
const VALID_MODES: ViewMode[] = ["card", "list", "table"];

interface TaskListProps {
  onBulkModeChange?: (isActive: boolean) => void;
}

export default function TaskList({ onBulkModeChange }: TaskListProps) {
  const { data: tasks = [], isLoading, isError, error } = useGetTask();
  const [savedMode, setSavedMode] = useLocalStorage<ViewMode>(
    "task_view_mode",
    "card",
  );
  const [sortCriterion, setSortCriterion] = useLocalStorage<SortCriterion>(
    "task_sort_criterion",
    "createdAt",
  );
  const [sortDirection, setSortDirection] = useLocalStorage<SortDirection>(
    "task_sort_direction",
    "desc",
  );

  const viewMode = VALID_MODES.includes(savedMode) ? savedMode : "card";
  const sortedTasks = sortTasks(tasks, sortCriterion, sortDirection);
  const bulkActions = useBulkTaskActions(tasks, sortedTasks);

  const handleToggleBulkMode = () => {
    const nextIsBulkMode = !bulkActions.isBulkMode;
    bulkActions.toggleBulkMode();
    onBulkModeChange?.(nextIsBulkMode);
  };

  return (
    <div className="flex min-h-80 flex-col pb-16">
      <TaskListToolbar
        viewMode={viewMode}
        onViewModeChange={setSavedMode}
        sortCriterion={sortCriterion}
        onSortCriterionChange={setSortCriterion}
        sortDirection={sortDirection}
        onSortDirectionChange={setSortDirection}
        isBulkMode={bulkActions.isBulkMode}
        isProcessingBulk={bulkActions.isProcessing}
        hasTasks={tasks.length > 0}
        onToggleBulkMode={handleToggleBulkMode}
      />

      <TaskListContent
        tasks={sortedTasks}
        viewMode={viewMode}
        isLoading={isLoading}
        isError={isError}
        errorMessage={error?.message}
        isBulkMode={bulkActions.isBulkMode}
        selectedIds={bulkActions.selectedIds}
        onToggleSelect={bulkActions.toggleSelection}
        onSelectAll={bulkActions.toggleVisibleSelection}
        isAllSelected={bulkActions.isAllVisibleSelected}
      />

      {bulkActions.isBulkMode && (
        <BulkActionBar
          selectedCount={bulkActions.selectedIds.length}
          onClearSelection={bulkActions.clearSelection}
          onMarkDone={bulkActions.markDone}
          onDelete={bulkActions.deleteSelected}
          isProcessing={bulkActions.isProcessing}
        />
      )}
    </div>
  );
}
