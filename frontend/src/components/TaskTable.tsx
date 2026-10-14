import type { ITask, TaskProps } from "..";

export default function TaskTable({ tasks }: TaskProps) {
  const priorityStyles = {
    LOW: "text-success",
    MEDIUM: "text-warning",
    HIGH: "text-error",
  };

  return (
    <div className="mx-2 overflow-x-auto rounded-xl border border-base-300 bg-base-100 shadow-sm">
      <table className="table table-sm w-full border-separate border-spacing-0">
        <thead>
          <tr>
            <th className="w-10 border border-base-300 bg-base-200 px-3 py-2">
              <input type="checkbox" className="checkbox checkbox-sm" />
            </th>
            <th className="whitespace-nowrap border border-base-300 bg-base-200 px-3 py-2">Key</th>
            <th className="min-w-450%] border border-base-300 bg-base-200 px-3 py-2">Task Name</th>
            <th className="min-w-55 w-[35%] border border-base-300 bg-base-200 px-3 py-2">Details</th>
            <th className="whitespace-nowrap border border-base-300 bg-base-200 px-3 py-2">Priority</th>
            <th className="whitespace-nowrap border border-base-300 bg-base-200 px-3 py-2">Category</th>
            <th className="whitespace-nowrap border border-base-300 bg-base-200 px-3 py-2">Status</th>
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
                  readOnly
                />
              </td>
              <td className="border border-base-300 px-3 py-2 align-middle font-mono text-xs whitespace-nowrap">
                #{task.taskKey}
              </td>
              <td className="min-w-450%] border border-base-300 px-3 py-2 align-top">
                <div
                  className={`font-medium wrap-break-word ${task.isCompleted ? "line-through text-base-content/50" : ""}`}
                >
                  {task.name}
                </div>
              </td>
              <td className="min-w-555%] border border-base-300 px-3 py-2 align-top">
                <p
                  className={`max-w-65 text-xs text-base-content/60 line-clamp-3 wrap-break-word ${task.isCompleted ? "text-base-content/40" : ""}`}
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
    </div>
  );
}
