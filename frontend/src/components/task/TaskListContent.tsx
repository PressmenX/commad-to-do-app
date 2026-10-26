import { FileQuestion, XCircle } from "lucide-react";
import type { ITask } from "../../index";
import TaskCard from "./views/TaskCard";
import TaskItem from "./views/TaskItem";
import TaskTable from "./views/TaskTable";

type ViewMode = "card" | "list" | "table";

interface TaskListContentProps {
  tasks: ITask[];
  viewMode: ViewMode;
  isLoading: boolean;
  isError: boolean;
  isOffline: boolean;
  errorMessage?: string;
  isBulkMode: boolean;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  isAllSelected: boolean;
}

export default function TaskListContent({
  tasks,
  viewMode,
  isLoading,
  isError,
  isOffline,
  errorMessage,
  isBulkMode,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  isAllSelected,
}: TaskListContentProps) {
  if (isOffline) {
    if (tasks.length === 0) return <OfflineState />;
  } else {
    if (isLoading) return <LoadingState />;
    if (isError) return <ErrorState message={errorMessage} />;
  }
  if (tasks.length === 0) return <EmptyState />;

  const taskViewProps = {
    tasks,
    isBulkMode,
    selectedIds,
    onToggleSelect,
  };

  switch (viewMode) {
    case "card":
      return <TaskCard {...taskViewProps} />;
    case "list":
      return <TaskItem {...taskViewProps} />;
    case "table":
      return (
        <TaskTable
          {...taskViewProps}
          onSelectAll={onSelectAll}
          isAllSelected={isAllSelected}
        />
      );
  }
}

function OfflineState() {
  return (
    <div
      className="flex flex-1 flex-col items-center justify-center p-8 text-center text-base-content/60"
      role="status"
    >
      <p className="text-lg font-semibold">Sedang offline</p>
      <p className="mt-1 max-w-xs text-sm">
        Task belum tersedia tanpa koneksi. Daftar akan dimuat saat internet
        kembali.
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center pointer-events-none p-8 gap-3 text-base-content/60">
      <div className="bg-base-200 p-3 rounded-full flex items-center justify-center">
        <span className="loading loading-spinner loading-xl text-primary" />
      </div>
      <p className="text-sm font-medium">Loading tasks...</p>
    </div>
  );
}

function ErrorState({ message }: { message?: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center pointer-events-none p-8 gap-3 text-error">
      <div className="bg-error/10 p-3 rounded-full">
        <XCircle size={32} strokeWidth={1.5} />
      </div>
      <div className="flex flex-col items-center text-center gap-1">
        <p className="text-lg font-semibold">Failed to load tasks</p>
        <p className="text-sm opacity-80 max-w-xs">
          {message || "An unexpected error occurred. Please try again later."}
        </p>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex text-base-content/60 flex-1 flex-col items-center justify-center pointer-events-none p-8 gap-2">
      <div className="bg-base-200 p-3 rounded-full">
        <FileQuestion size={32} strokeWidth={1.5} />
      </div>
      <p className="text-lg font-medium text-center">No tasks found</p>
      <p className="text-sm text-base-content/40 text-center max-w-xs">
        You don't have any tasks right now. Create a new task to get started!
      </p>
    </div>
  );
}
