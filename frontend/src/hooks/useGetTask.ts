import { useQuery } from "@tanstack/react-query";
import { taskApi } from "../services/taskApi";
import { useAuth } from "../context/AuthContext";

export function useGetTask() {
  const { isLoggedIn } = useAuth();
  
  return useQuery({
    queryKey: ["tasks"],
    queryFn: taskApi.getTasks,
    enabled: isLoggedIn, 
    retry: false,
  });
}