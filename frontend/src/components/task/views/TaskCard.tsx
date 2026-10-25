import { FlagTriangleRight, Trash2 } from "lucide-react";
import type { ITask, TaskProps } from "../../..";
import { useToggleTask } from "../../../hooks/useToggleTask";
import { useDeleteTask } from "../../../hooks/useDeleteTask";
import NiceModal from "@ebay/nice-modal-react";
import ConfirmDeleteModal from "../modal/ConfirmDeleteModal";
export default function TaskCard({
  tasks,
  isBulkMode = false,
  selectedIds = [],
  onToggleSelect,
}: TaskProps) {
  const { toggleTask } = useToggleTask();
  const { deleteTask } = useDeleteTask();

  const handleSingleDelete = (task: ITask) => {
    void NiceModal.show(ConfirmDeleteModal, {
      tasksToDelete: [task],
      onConfirm: async () => {
        await deleteTask(task.id);
      },
    });
  };
  const priorityBadgeStyles = {
    LOW: "badge badge-soft badge-success bg-success/20",
    MEDIUM: "badge badge-soft badge-warning bg-warning/20",
    HIGH: "badge badge-soft badge-error bg-error/20",
  };

 return (
    <ul className="card flex p-4 gap-2">
      {tasks?.map((task) => {
        const isSelected = isBulkMode && selectedIds.includes(task.id);
        return (
          <li
            key={task.id}
            className={`card-body p-4 rounded-2xl flex-row border items-center transition-colors ${
              isSelected
                ? "border-primary bg-primary/5"
                : "border-base-content/30"
            }`}
          >
            <input
              type="checkbox"
              aria-label={
                isBulkMode
                  ? `Pilih task ${task.name}`
                  : `Tandai selesai ${task.name}`
              }
              className={`checkbox ${
                isBulkMode
                  ? "checkbox-primary checkbox-sm rounded-md"
                  : "bg-base-content/10 text-white checked:checkbox-success checked:bg-success"
              }`}
              checked={
                isBulkMode ? selectedIds.includes(task.id) : task.isCompleted
              }
              onChange={() =>
                isBulkMode ? onToggleSelect?.(task.id) : toggleTask(task)
              }
            />

            <div className="w-full flex flex-col gap-2">
              <div className="flex justify-between">
                <h3
                  className={`card-title text-sm ${
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
                    onClick={() => handleSingleDelete(task)}
                    className="btn btn-ghost btn-xs text-base-content/40 hover:text-error p-1"
                    aria-label="Delete task"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
