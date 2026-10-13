import { Flag } from "lucide-react";
import type { ITask } from "..";

interface TaskItemProps {
  task: ITask;
}

export default function TaskItem({ task }: TaskItemProps) {
  const priorityBadgeStyles = {
    LOW: "badge badge-soft badge-success bg-success/20",
    MEDIUM: "badge badge-soft badge-warning bg-warning/20",
    HIGH: "badge badge-soft badge-error bg-error/20",
  };

  return (
    <li
      key={task.id}
      className="card-body p-4 rounded-2xl flex-row border items-center border-base-content/30"
    >
      <input
        type="checkbox"
        className="checkbox bg-base-content/10 text-white checked:checkbox-success checked:bg-success"
        checked={task.isCompleted}
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
        <p className="line-clamp-2 text-base-content/80 text-xs">
          {task.details}
        </p>
        <div className="flex gap-2">
          {task.priority !== "NONE" && (
            <span className={`${priorityBadgeStyles[task.priority]} badge-sm capitalize`}>
               <Flag fill="currentColor" size={14}/>{task.priority.toLowerCase()}
            </span>
          )}
          {task.category && (
            <span className="badge badge-outline badge-sm border-base-content/20">
              {task.category}
            </span>
          )}
        </div>
      </div>
    </li>
  );
}
