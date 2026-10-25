import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { Trash2 } from "lucide-react";
import type { ITask } from "../../..";

export interface ConfirmDeleteModalProps {
  tasksToDelete: ITask[];
  onConfirm: () => Promise<void>;
}

export default NiceModal.create(({ tasksToDelete, onConfirm }: ConfirmDeleteModalProps) => {
  const modal = useModal();
  const count = tasksToDelete.length;

  if (!modal.visible || count === 0) return null;

  const handleConfirm = async () => {
    await onConfirm();
    modal.hide();
  };

  return (
    <dialog className="modal modal-open modal-bottom sm:modal-middle bg-black/50 backdrop-blur-xs z-100">
      <div className="modal-box bg-base-100 border border-base-content/10 shadow-2xl p-6 rounded-3xl max-w-sm">
        <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center text-error mb-4">
          <Trash2 size={22} />
        </div>

        <h3 className="font-bold text-lg text-base-content mb-3">
          {count === 1 ? "Delete this task?" : `Delete ${count} tasks?`}
        </h3>

        <div className="bg-base-300 rounded-xl p-3.5 flex flex-col gap-2 mb-3 max-h-36 overflow-y-auto">
          {count === 1 ? (
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-base-content/90 truncate">
                {tasksToDelete[0].name}
              </span>
              <span className="text-xs font-mono text-base-content/50 shrink-0">
                #{tasksToDelete[0].taskKey}
              </span>
            </div>
          ) : (
            <p className="text-xs font-semibold text-base-content/80">
              {count} selected tasks will be permanently removed.
            </p>
          )}
        </div>

        <p className="text-xs text-base-content/60 leading-relaxed mb-6">
          This action cannot be undone. These tasks will be permanently deleted from the server.
        </p>

        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            className="btn btn-md btn-outline border-base-content/20 hover:bg-base-200 text-base-content flex-1 rounded-xl text-xs font-semibold h-11 min-h-11"
            onClick={() => modal.hide()}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-md bg-error hover:bg-error/90 text-white border-0 flex-1 rounded-xl text-xs font-semibold h-11 min-h-11 gap-2"
            onClick={handleConfirm}
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </dialog>
  );
});