import { useQuery } from "@tanstack/react-query";
import { taskApi } from "../services/taskApi";

export function useGetTask() {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: taskApi.getTasks,
  });
}
