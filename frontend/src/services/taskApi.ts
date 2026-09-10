import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const taskApi = {
  getTasks: () => {
    return api.get("/task");
  },

  addTask: (payload: unknown) => {
    return api.post("/task", payload);
  },

  updateTask: (id: string, payload: unknown) => {
    return api.patch(`/task/${id}`, payload);
  },

  deleteTask: (id: string) => {
    return api.delete(`/task/${id}`);
  },
};
