type TaskPriority = "NONE" | "LOW" | "MEDIUM" | "HIGH";

const createTaskData = (
  name: string,
  details?: string,
  priority: TaskPriority = "NONE",
  category?: string,
) => ({
  name,
  details,
  priority,
  category,
});

export const mockNewTask = createTaskData(
    "Setup Vite & React Tailwind",
    "Konfigurasi DaisyUI v5 di index.css",
    "HIGH",
  )