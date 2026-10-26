import { useMutation, useQueryClient } from "@tanstack/react-query";
import { taskApi } from "../services/taskApi";

export function useDeleteTask() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => taskApi.deleteTask(id),
    networkMode: "always",
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  return {
    deleteTask: mutation.mutate,
    deleteTaskAsync: mutation.mutateAsync,
    isDeleting: mutation.isPending,
  };
}