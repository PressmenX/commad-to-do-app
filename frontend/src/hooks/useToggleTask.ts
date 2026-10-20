import { useMutation, useQueryClient } from "@tanstack/react-query";
import { taskApi } from "../services/taskApi";
import type { ITask } from "..";

interface ToggleTaskPayload {
  id: string;
  isCompleted: boolean;
}

export function useToggleTask() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, isCompleted }: ToggleTaskPayload) =>
      taskApi.updateTask(id, { isCompleted }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const toggleTask = (task: ITask) => {
    mutation.mutate({
      id: task.id,
      isCompleted: !task.isCompleted,
    });
  };

  return {
    toggleTask,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}
