import { useMutation, useQueryClient } from "@tanstack/react-query";
import { taskApi } from "../services/taskApi";

export function useDeleteTask() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => taskApi.deleteTask(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  return {
    deleteTask: mutation.mutate,
    isDeleting: mutation.isPending,
  };
}