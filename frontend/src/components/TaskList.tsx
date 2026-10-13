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
    <div>
      <h2 className="text-xl font-bold mt-14 mx-8">Task list</h2>
      <ul className="card flex p-4 gap-2">
        {tasks?.map(task =>  (
          <TaskItem task={task}/>
        ))}
      </ul>
    </div>
  );
}
