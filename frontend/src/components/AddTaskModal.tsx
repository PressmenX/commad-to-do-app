import { X, Flag, Tag, AlignLeft, Check } from "lucide-react";
import { useState } from "react";
import { TaskPriority } from "..";
import NiceModal, { useModal } from "@ebay/nice-modal-react";

export default NiceModal.create(() => {
  const modal = useModal()
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.NONE);

  if (!modal.visible) return null;

  return (
    <dialog className="modal modal-open modal-bottom sm:modal-middle bg-black/50 backdrop-blur-xs">
      <div className="modal-box bg-base-100 border border-base-content/10 shadow-2xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-base-content/10">
          <h3 className="font-bold text-lg text-base-content flex items-center gap-2">
            <span>✨</span> Create New Task
          </h3>
          <button
            onClick={()=>modal.hide()}
            type="button"
            className="btn btn-sm btn-circle btn-ghost text-base-content/60 hover:text-base-content"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          {/* Task Name */}
          <div className="form-control">
            <label className="label py-1">
              <span className="label-text font-medium text-xs text-base-content/70">
                Task Name <span className="text-error">*</span>
              </span>
            </label>
            <input
              type="text"
              autoFocus
              placeholder="e.g. Fix authentication bug"
              className="input input-bordered w-full focus:input-primary text-sm"
            />
          </div>

          {/* Details */}
          <div className="form-control">
            <label className="label py-1">
              <span className="label-text font-medium text-xs text-base-content/70 flex items-center gap-1">
                <AlignLeft size={14} /> Details (Optional)
              </span>
            </label>
            <textarea
              placeholder="Add extra context or notes..."
              className="textarea textarea-bordered h-24 w-full focus:textarea-primary text-sm resize-none"
            ></textarea>
          </div>

          {/* Grid 2 Kolom: Priority & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Priority Select */}
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-medium text-xs text-base-content/70 flex items-center gap-1">
                  <Flag size={14} /> Priority
                </span>
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="select select-bordered w-full text-sm focus:select-primary"
              >
                <option value={TaskPriority.NONE}>None</option>
                <option value={TaskPriority.LOW}>Low 🟢</option>
                <option value={TaskPriority.MEDIUM}>Medium 🟡</option>
                <option value={TaskPriority.HIGH}>High 🔴</option>
              </select>
            </div>

            {/* Category Input */}
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-medium text-xs text-base-content/70 flex items-center gap-1">
                  <Tag size={14} /> Category
                </span>
              </label>
              <input
                type="text"
                placeholder="e.g. Work, Bug, Feature"
                className="input input-bordered w-full focus:input-primary text-sm"
              />
            </div>
          </div>

          {/* Actions / Footer */}
          <div className="modal-action pt-4 border-t border-base-content/10 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={()=>modal.hide()}
              className="btn btn-ghost btn-sm text-base-content/70"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-sm text-white gap-1"
            >
              <Check size={16} /> Save Task
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
})