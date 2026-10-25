import { CheckCircle2, Trash2, X } from "lucide-react";

interface BulkActionBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onMarkDone: () => void;
  onDelete: () => void;
  isProcessing: boolean;
}

export default function BulkActionBar({
  selectedCount,
  onClearSelection,
  onMarkDone,
  onDelete,
  isProcessing,
}: BulkActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-24 left-3 right-3 z-40 flex items-center justify-between gap-2 rounded-2xl border border-base-content/20 bg-base-300/90 px-3 py-2.5 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-200 sm:bottom-6 sm:left-1/2 sm:right-auto sm:w-max sm:-translate-x-1/2 sm:gap-3 sm:px-4">
      <div className="flex items-center gap-2 pr-2 border-r border-base-content/15">
        <span className="badge badge-primary font-bold text-xs">
          {selectedCount}
        </span>
        <span className="text-xs font-medium text-base-content/80">
          Selected
        </span>
        <button
          type="button"
          onClick={onClearSelection}
          disabled={isProcessing}
          className="btn btn-ghost btn-xs btn-circle text-base-content/50 hover:text-base-content"
          aria-label="Clear selection"
        >
          <X size={14} />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onMarkDone}
          disabled={isProcessing}
          aria-label="Mark selected tasks as done"
          className="btn btn-success btn-xs text-white rounded-xl gap-1.5 h-8 min-h-8 px-3"
        >
          {isProcessing ? (
            <span className="loading loading-spinner loading-xs" />
          ) : (
            <CheckCircle2 size={14} />
          )}
          <span className="hidden sm:inline">Mark Done Selected</span>
        </button>

        <button
          type="button"
          onClick={onDelete}
          disabled={isProcessing}
          aria-label="Delete selected tasks"
          className="btn btn-error btn-xs text-white rounded-xl gap-1.5 h-8 min-h-8 px-3"
        >
          {isProcessing ? (
            <span className="loading loading-spinner loading-xs" />
          ) : (
            <Trash2 size={14} />
          )}
          <span className="hidden sm:inline">Delete Selected</span>
        </button>
      </div>
    </div>
  );
}