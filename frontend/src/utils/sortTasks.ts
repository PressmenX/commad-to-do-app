import type { ITask } from "../index";

export type SortCriterion = "createdAt" | "updatedAt" | "priority" | "name";
export type SortDirection = "asc" | "desc";

const PRIORITY_ORDER: Record<string, number> = {
  NONE: 0,
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
};

export function sortTasks(
  tasks: ITask[],
  criterion: SortCriterion,
  direction: SortDirection,
): ITask[] {
  return [...tasks].sort((a, b) => {
    let result: number;

    switch (criterion) {
      case "priority": {
        const priorityA = PRIORITY_ORDER[a.priority] ?? 0;
        const priorityB = PRIORITY_ORDER[b.priority] ?? 0;
        result = priorityA - priorityB;
        break;
      }

      case "name": {
        result = a.name.localeCompare(b.name, "id", { sensitivity: "base" });
        break;
      }

      case "createdAt": {
        const timeA = new Date(a.createdAt).getTime();
        const timeB = new Date(b.createdAt).getTime();
        result = timeA - timeB;
        break;
      }

      case "updatedAt": {
        const timeA = new Date(a.updatedAt).getTime();
        const timeB = new Date(b.updatedAt).getTime();
        result = timeA - timeB;
        break;
      }

      default:
        result = 0;
    }

    if (result === 0 && criterion !== "createdAt") {
      result = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }

    // Balikkan hasil jika arah pengurutan adalah 'desc' (turun)
    return direction === "desc" ? -result : result;
  });
}