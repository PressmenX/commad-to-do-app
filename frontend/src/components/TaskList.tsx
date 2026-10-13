import { useQuery } from "@tanstack/react-query";
import { taskApi } from "../services/taskApi";
import TaskCard from "./TaskCard";
import { FileQuestion, XCircle } from "lucide-react";

export default function TaskList() {
  const getTasks = async () => {
    const res = await taskApi.getTasks();
    return res;
  };

  const {
    data: tasks,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  return (
    <div className="flex min-h-80 flex-col">
      <h2 className="text-xl font-bold mt-14 mx-8">Task list</h2>

      {isLoading && (
        <div className="flex flex-1 flex-col items-center justify-center pointer-events-none p-8 gap-3 text-base-content/60">
          <div className="bg-base-200 p-3 rounded-full flex items-center justify-center">
            <span className="loading loading-spinner loading-xl text-primary"></span>
          </div>
          <p className="text-sm font-medium">Loading tasks...</p>
        </div>
      )}

      {isError && (
        <div className="flex flex-1 flex-col items-center justify-center pointer-events-none p-8 gap-3 text-error">
          <div className="bg-error/10 p-3 rounded-full">
            <XCircle size={32} strokeWidth={1.5} />
          </div>
          <div className="flex flex-col items-center text-center gap-1">
            <p className="text-lg font-semibold">Failed to load tasks</p>
            <p className="text-sm opacity-80 max-w-xs">
              {error?.message ||
                "An unexpected error occurred. Please try again later."}
            </p>
          </div>
        </div>
      )}

      {!isLoading && !isError && tasks?.length === 0 && (
        <div className="flex text-base-content/60 flex-1 flex-col items-center justify-center pointer-events-none p-8 gap-2">
          <div className="bg-base-200 p-3 rounded-full">
            <FileQuestion size={32} strokeWidth={1.5} />
          </div>
          <p className="text-lg font-medium text-center">No tasks found</p>
          <p className="text-sm text-base-content/40 text-center max-w-xs">
            You don't have any tasks right now. Create a new task to get
            started!
          </p>
        </div>
      )}

      {!isLoading && !isError && (
        <ul className="card flex p-4 gap-2">
          {tasks?.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </ul>
      )}
    </div>
  );
}
