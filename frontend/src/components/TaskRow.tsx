import type { ITask, TaskProps } from "..";

export default function TaskRow({ tasks }: TaskProps) {
  const priorityStyles = {
    LOW: "text-success",
    MEDIUM: "text-warning",
    HIGH: "text-error",
  };

  return (
    <div className="overflow-x-auto border border-base-content/20 rounded-xl">
      <table className="table table-sm w-full">
        <thead>
          <tr>
            <th className="w-10">
              <input type="checkbox" className="checkbox checkbox-sm" />
            </th>
            <th className="whitespace-nowrap">Key</th>
            <th className="min-w-45 w-[30%]">Task Name</th>
            <th className="min-w-555%]">Details</th>
            <th className="whitespace-nowrap">Priority</th>
            <th className="whitespace-nowrap">Category</th>
            <th className="whitespace-nowrap">Status</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task: ITask) => (
            <tr key={task.id} className="hover">
              <td>
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm checked:checkbox-success"
                  checked={task.isCompleted}
                  readOnly
                />
              </td>
              <td className="font-mono text-xs whitespace-nowrap">#{task.taskKey}</td>
              <td className="min-w-45 w-[30%] align-top">
                <div
                  className={`font-medium wrap-break-word ${task.isCompleted ? "line-through text-base-content/50" : ""}`}
                >
                  {task.name}
                </div>
              </td>
              <td className="min-w-555%] align-top">
                <p
                  className={`max-w-65 text-xs text-base-content/60 line-clamp-3 wrap-break-word ${task.isCompleted ? "text-base-content/40" : ""}`}
                >
                  {task.details || "–"}
                </p>
              </td>
              <td className="whitespace-nowrap">
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
              <td className="whitespace-nowrap">
                {task.category ? <span>{task.category}</span> : <span>–</span>}
              </td>
              <td className="whitespace-nowrap">
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
    </div>
  );
}