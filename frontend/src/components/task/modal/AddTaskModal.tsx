import {
  X,
  Flag,
  Tag,
  AlignLeft,
  Check,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { TaskPriority, type ICreateTask } from "../../..";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { taskApi } from "../../../services/taskApi";

export default NiceModal.create(() => {
  const modal = useModal();
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.NONE);
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const addTaskMutation = useMutation({
    mutationFn: (newTask: ICreateTask) => taskApi.addTask(newTask),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setSuccess(true);
      handleClose();
    },
    onError: (err: Error) => {
      setError(err.message || "Failed to create task. Please try again.");
    },
  });

  const handleClose = () => {
    setName("");
    setDetails("");
    setPriority(TaskPriority.NONE);
    setCategory("");
    setError("");
    modal.hide();
  };

  useEffect(() => {
    if (!error) return;

    const timer = setTimeout(() => {
      setError("");
    }, 7000);

    return () => clearTimeout(timer);
  }, [error]);

  useEffect(() => {
    if (!success) return;

    const timer = setTimeout(() => {
      setSuccess(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [success]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Task name is required");
      return;
    }

    if (trimmedName.length > 255) {
      setError("Task name must be less than 255 characters");
      return;
    }

    setError("");
    const payload: ICreateTask = {
      name: trimmedName,
      details: details.trim() || undefined,
      priority,
      category: category.trim() || undefined,
    };

    addTaskMutation.mutate(payload);
  };

  if (!modal.visible) {
    return success ? (
      <div className="toast toast-top toast-end z-[100]" role="status">
        <div className="alert alert-success shadow-lg">
          <CheckCircle2 size={20} />
          <span>Task created successfully.</span>
        </div>
      </div>
    ) : null;
  }

  return (
    <>
      <dialog className="modal modal-open modal-bottom sm:modal-middle bg-black/50 backdrop-blur-xs">
        <div className="modal-box bg-base-100 border border-base-content/10 shadow-2xl p-6">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-base-content/10">
            <h3 className="font-bold text-lg text-base-content flex items-center gap-2">
              Create New Task
            </h3>
            <button
              onClick={() => modal.hide()}
              type="button"
              className="btn btn-sm btn-circle btn-ghost text-base-content/60 hover:text-base-content"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-medium text-xs text-base-content/70">
                  Task Name <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="text"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Fix authentication bug"
                className="input input-bordered w-full focus:input-primary text-sm"
              />
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-medium text-xs text-base-content/70 flex items-center gap-1">
                  <AlignLeft size={14} /> Details (Optional)
                </span>
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Add extra context or notes..."
                className="textarea textarea-bordered h-24 w-full focus:textarea-primary text-sm resize-none"
              />
            </div>

            <div className="flex flex-col gap-4">
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
                  <option value={TaskPriority.LOW}>Low</option>
                  <option value={TaskPriority.MEDIUM}>Medium</option>
                  <option value={TaskPriority.HIGH}>High</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-medium text-xs text-base-content/70 flex items-center gap-1">
                    <Tag size={14} /> Category
                  </span>
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Work, Bug, Feature"
                  className="input input-bordered w-full focus:input-primary text-sm"
                />
              </div>
            </div>

            <div className="modal-action pt-4 border-t border-base-content/10 flex items-center justify-end gap-2">
              <button
                type="submit"
                className="btn btn-primary btn-sm text-white gap-1 min-w-20 disabled:cursor-not-allowed disabled:btn-disabled"
                disabled={addTaskMutation.isPending}
              >
                {addTaskMutation.isPending ? (
                  <span className="loading loading-xs"></span>
                ) : (
                  <>
                    <Check size={16} /> <span>Create Task</span>
                  </>
                )}
              </button>
            </div>
          </form>
          {error && (
            <div
              className="
      alert alert-error 
      flex items-center gap-3 
      bg-error/10 border border-error/20 text-error-content 
      p-2 mt-4 rounded-xl 
      animate-in fade-in slide-in-from-top-1 duration-200
    "
            >
              <AlertCircle className="text-error shrink-0 mt-0.5" size={20} />

              <div className="text-left">
                <span className="text-xs font-semibold text-error">
                  {error}
                </span>
              </div>
            </div>
          )}
        </div>
      </dialog>
    </>
  );
});
