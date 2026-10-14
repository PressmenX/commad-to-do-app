import { FlagTriangleRight } from "lucide-react";
import type { ITask, TaskProps } from "..";

export default function TaskItem({ tasks }: TaskProps) {
   const priorityFlagStyles = {
    LOW: "text-success",
    MEDIUM: "text-warning",
    HIGH: "text-error",
  };

  return (
    <ul className="flex flex-col mx-4 p-4 border border-base-content/20 rounded-2xl">
      {tasks.map((task: ITask) => (
        <li
          key={task.id}
          className="py-1 flex items-center justify-between gap-3 bg-base-100"
        >
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              className="checkbox checkbox-sm checked:checkbox-success text-white"
              checked={task.isCompleted}
              readOnly
            />
            <span
              className={`text-sm font-medium truncate ${
                task.isCompleted ? "line-through text-base-content/50" : ""
              }`}
            >
              {task.name}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {task.priority !== "NONE" && (
              <span
                className={`${priorityFlagStyles[task.priority]}`}
              >
                <FlagTriangleRight fill="currentColor" size={14} />
              </span>
            )}
            <span className="text-xs font-mono text-base-content/50">
              #{task.taskKey}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
