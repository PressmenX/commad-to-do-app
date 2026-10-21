import { FlagTriangleRight, Trash2 } from "lucide-react";
import type { ITask, TaskProps } from "../..";
import { useToggleTask } from "../../hooks/useToggleTask";
import { useState } from "react";
import { useDeleteTask } from "../../hooks/useDeleteTask";

export default function TaskItem({ tasks }: TaskProps) {
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
  const priorityFlagStyles = {
    LOW: "text-success",
    MEDIUM: "text-warning",
    HIGH: "text-error",
  };

  return (
    <>
      <ul className="flex flex-col mx-4 p-4 gap-2 border-2 border-base-300 shadow-md rounded-2xl">
        {tasks.map((task: ITask, index) => (
          <li
            key={task.id}
            className={`py-2 flex items-center justify-between gap-3 bg-base-100 border-base-content/15 ${index === tasks.length - 1 ? "" : "border-b"}`}
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                className="checkbox checkbox-sm checked:checkbox-success text-white"
                checked={task.isCompleted}
                onChange={() => toggleTask(task)}
              />
              <span
                className={`text-sm font-medium max-w-40 truncate ${
                  task.isCompleted ? "line-through text-base-content/50" : ""
                }`}
              >
                {task.name}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {task.priority !== "NONE" && (
                <span className={`${priorityFlagStyles[task.priority]}`}>
                  <FlagTriangleRight fill="currentColor" size={14} />
                </span>
              )}
              <span className="text-xs font-mono text-base-content/50">
                #{task.taskKey}
              </span>

              <button
                onClick={() => setTaskToDelete(task)}
                className="btn btn-ghost btn-xs text-base-content/40 hover:text-error p-1"
                aria-label="Delete task"
              >
                <Trash2 size={16} />
              </button>
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
