import { useQuery } from "@tanstack/react-query";
import { taskApi } from "../services/taskApi";
import TaskItem from "./TaskItem";

export default function TaskList() {
  const getTasks = async () => {
    const res = await taskApi.getTasks()
    return res
  }

  const { data: tasks, isLoading, isError, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks,
  })

  return (
    <>
      <ul className="card flex p-4 gap-2">
        {tasks?.map(task =>  (
          <TaskItem task={task}/>
        ))}
      </ul>
    </>
  );
}
