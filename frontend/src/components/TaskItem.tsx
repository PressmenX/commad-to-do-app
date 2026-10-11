import type { ITask } from "..";

interface TaskItemProps {
  task: ITask;
}

export default function TaskItem({ task }: TaskItemProps) {
  return (
    <li key={task.id}className="card-body rounded-2xl flex-row border border-base-content/30">
      <input type="checkbox" className="checkbox checked:checkbox-success" checked={task.isCompleted}/>
      <h3 className="card-title text-sm">{task.name}</h3>
    </li>
  );
}
