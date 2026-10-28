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
    mutationKey: ["toggleTask"],
    mutationFn: ({ id, isCompleted }: ToggleTaskPayload) =>
      taskApi.updateTask(id, { isCompleted }),
    networkMode: "always",
    onMutate: async ({ id, isCompleted }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const previousTasks = queryClient.getQueryData<ITask[]>(["tasks"]);
      queryClient.setQueryData<ITask[]>(["tasks"], (old) =>
        old?.map((t) => (t.id === id ? { ...t, isCompleted } : t)),
      );
      return { previousTasks };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks"], context.previousTasks);
      }
    },
    onSettled: () => {
      if (queryClient.isMutating({ mutationKey: ["toggleTask"] }) === 1) {
        void queryClient.invalidateQueries({ queryKey: ["tasks"] });
      }
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
