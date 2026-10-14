import { FlagTriangleRight } from "lucide-react";
import type { ITask, TaskProps } from "..";

export default function TaskItem({ tasks }: TaskProps) {
   const priorityFlagStyles = {
    LOW: "text-success",
    MEDIUM: "text-warning",
    HIGH: "text-error",
  };

  return (
    <ul className="flex flex-col mx-4 p-4 gap-2 border-2 border-base-300 shadow-md rounded-2xl">
      {tasks.map((task: ITask, index) => (
        <li
          key={task.id}
          className={`py-2 flex items-center justify-between gap-3 bg-base-100 border-base-content/15 ${index === tasks.length-1 ? "" : "border-b"}`}
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
