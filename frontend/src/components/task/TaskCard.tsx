import { FlagTriangleRight, Trash2 } from "lucide-react";
import type { ITask, TaskProps } from "../..";
import { useToggleTask } from "../../hooks/useToggleTask";
import { useDeleteTask } from "../../hooks/useDeleteTask";
import { useState } from "react";

export default function TaskCard({ tasks }: TaskProps) {
  const { toggleTask } = useToggleTask();
  const { deleteTask, isDeleting } = useDeleteTask();
  const [taskToDelete, setTaskToDelete] = useState<ITask | null>(null);

  const confirmDelete = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete.id, {
        onSuccess: () => setTaskToDelete(null),
      });
    }
  };
  const priorityBadgeStyles = {
    LOW: "badge badge-soft badge-success bg-success/20",
    MEDIUM: "badge badge-soft badge-warning bg-warning/20",
    HIGH: "badge badge-soft badge-error bg-error/20",
  };

  return (
    <>
      <ul className="card flex p-4 gap-2">
        {tasks?.map((task) => (
          <li
            key={task.id}
            className="card-body p-4 rounded-2xl flex-row border items-center border-base-content/30"
          >
            <input
              type="checkbox"
              className="checkbox bg-base-content/10 text-white checked:checkbox-success checked:bg-success"
              checked={task.isCompleted}
              onChange={() => toggleTask(task)}
            />
            <div className="w-full flex flex-col gap-2">
              <div className="flex justify-between">
                <h3
                  className={`card-title text-sm  ${
                    task.isCompleted
                      ? "line-through text-base-content/50"
                      : "text-base-content"
                  }`}
                >
                  {task.name}
                </h3>
                <span className="text-base-content/50">#{task.taskKey}</span>
              </div>
              {task.details && (
                <p className="line-clamp-2 text-base-content/80 text-xs">
                  {task.details}
                </p>
              )}
              <div className="flex gap-2">
                {task.priority !== "NONE" && (
                  <span
                    className={`${priorityBadgeStyles[task.priority]} badge-sm capitalize`}
                  >
                    <FlagTriangleRight fill="currentColor" size={12} />
                    {task.priority.toLowerCase()}
                  </span>
                )}
                {task.category && (
                  <span className="badge badge-outline badge-sm border-base-content/20">
                    {task.category}
                  </span>
                )}
                <div className="flex gap-2 ml-auto">
                  <button
                    onClick={() => setTaskToDelete(task)}
                    className="btn btn-ghost btn-xs text-base-content/40 hover:text-error p-1"
                    aria-label="Delete task"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {taskToDelete && (
        <dialog className="modal modal-open modal-bottom sm:modal-middle bg-black/50 backdrop-blur-xs">
          <div className="modal-box bg-base-100 border border-base-content/10 shadow-2xl p-6 rounded-3xl max-w-sm">
            <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center text-error mb-4">
              <Trash2 size={22} />
            </div>

            <h3 className="font-bold text-lg text-base-content mb-3">
              Delete this task?
            </h3>

            <div className="bg-base-300 rounded-xl p-3.5 flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-semibold text-base-content/90 truncate">
                {taskToDelete.name}
              </span>
              <span className="text-xs font-mono text-base-content/50 shrink-0">
                #{taskToDelete.taskKey}
              </span>
            </div>

            <p className="text-xs text-base-content/60 leading-relaxed mb-6">
              This task will be permanently deleted and cannot be recovered.
            </p>

            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                className="btn btn-md btn-outline border-base-content/20 hover:bg-base-200 text-base-content flex-1 rounded-xl text-xs font-semibold h-11 min-h-11"
                onClick={() => setTaskToDelete(null)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-md bg-error hover:bg-error/90 text-white border-0 flex-1 rounded-xl text-xs font-semibold h-11 min-h-11 gap-2 disabled:btn-disabled"
                onClick={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <span className="loading loading-xs"></span>
                ) : (
                  <>
                    <Trash2 size={16} />
                    <span>Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
}
