import { Flag } from "lucide-react";
import type { ITask, TaskProps } from "..";

export default function TaskItem({ tasks }: TaskProps) {
  return (
    <ul className="flex flex-col gap-2">
      {tasks.map((task: ITask) => (
        <li
          key={task.id}
          className="p-3 rounded-xl border border-base-content/20 flex items-center justify-between gap-3 bg-base-100"
        >
          <div className="flex items-center gap-3 min-w-0">
            <input
              type="checkbox"
              className="checkbox checkbox-sm checked:checkbox-success"
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
                className={`badge-sm capitalize ${
                  task.priority === "LOW"
                    ? "badge-success"
                    : task.priority === "MEDIUM"
                      ? "badge-warning"
                      : "badge-error"
                }`}
              >
                <Flag fill="currentColor" size={14} />
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
