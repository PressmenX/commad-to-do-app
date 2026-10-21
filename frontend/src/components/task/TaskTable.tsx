import { useState } from "react";
import type { ITask, TaskProps } from "../..";
import { useDeleteTask } from "../../hooks/useDeleteTask";
import { useToggleTask } from "../../hooks/useToggleTask";
import { Trash2 } from "lucide-react";

export default function TaskTable({ tasks }: TaskProps) {
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

  const priorityStyles = {
    LOW: "text-success",
    MEDIUM: "text-warning",
    HIGH: "text-error",
  };

  return (
    <div className="mx-2 overflow-x-auto rounded-xl border border-base-300 bg-base-100 shadow-sm">
      <table className="table table-sm w-max min-w-full table-fixed border-separate border-spacing-0">
        <colgroup>
          <col className="w-[clamp(2rem,4vw,4rem)]" />
          <col className="w-[clamp(4rem,6vw,6rem)]" />
          <col className="w-[clamp(4rem,6vw,6rem)]" />
          <col className="w-[clamp(10rem,20vw,24rem)]" />
          <col className="w-[clamp(16rem,26vw,40rem)]" />
          <col className="w-[clamp(3rem,7vw,8rem)]" />
          <col className="w-[clamp(3rem,9vw,10rem)]" />
          <col className="w-[clamp(3rem,6vw,7rem)]" />
        </colgroup>
        <thead>
          <tr>
            <th className="w-12 border border-base-300 bg-base-200 px-3 py-2">
              <input type="checkbox" className="checkbox checkbox-sm" />
            </th>
            <th className="whitespace-nowrap border border-base-300 bg-base-200 px-3 py-2">
              Action
            </th>
            <th className="whitespace-nowrap border border-base-300 bg-base-200 px-3 py-2">
              Key
            </th>
            <th className="border border-base-300 bg-base-200 px-3 py-2">
              Task Name
            </th>
            <th className="border border-base-300 bg-base-200 px-3 py-2">
              Details
            </th>
            <th className="whitespace-nowrap border border-base-300 bg-base-200 px-3 py-2">
              Priority
            </th>
            <th className="whitespace-nowrap border border-base-300 bg-base-200 px-3 py-2">
              Category
            </th>
            <th className="whitespace-nowrap border border-base-300 bg-base-200 px-3 py-2">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task: ITask) => (
            <tr key={task.id} className="hover">
              <td className="border border-base-300 px-3 py-2 align-middle">
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm checked:checkbox-success text-white"
                  checked={task.isCompleted}
                  onChange={() => toggleTask(task)}
                />
              </td>
              <td className="border border-base-300 px-3 py-2 align-middle">
                <button
                  onClick={() => setTaskToDelete(task)}
                  className="btn btn-ghost btn-xs text-base-content/40 hover:text-error p-1"
                  aria-label="Delete task"
                >
                  <Trash2 size={16} />
                </button>
              </td>
              <td className="border border-base-300 px-3 py-2 align-middle font-mono text-xs text-base-content/50 whitespace-nowrap">
                #{task.taskKey}
              </td>
              <td className="border border-base-300 px-3 py-2 align-top">
                <div
                  className={`font-medium wrap-break-word ${task.isCompleted ? "line-through text-base-content/50" : ""}`}
                >
                  {task.name}
                </div>
              </td>
              <td className="border border-base-300 px-3 py-2 align-top">
                <p
                  className={`text-xs text-base-content/60 line-clamp-3 wrap-break-word ${task.isCompleted ? "text-base-content/40" : ""}`}
                >
                  {task.details || "–"}
                </p>
              </td>
              <td className="border border-base-300 px-3 py-2 align-middle whitespace-nowrap">
                {task.priority !== "NONE" ? (
                  <span
                    className={`${priorityStyles[task.priority]} font-bold`}
                  >
                    {task.priority}
                  </span>
                ) : (
                  <span>–</span>
                )}
              </td>
              <td className="border border-base-300 px-3 py-2 align-middle whitespace-nowrap">
                {task.category ? <span>{task.category}</span> : <span>–</span>}
              </td>
              <td className="border border-base-300 px-3 py-2 align-middle whitespace-nowrap">
                <span
                  className={`badge badge-sm ${task.isCompleted ? "badge-success" : "text-base-content/50 bg-base-content/15"}`}
                >
                  {task.isCompleted ? "Done" : "Pending"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
    </div>
  );
}
