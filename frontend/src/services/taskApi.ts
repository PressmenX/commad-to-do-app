import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const taskApi = {
  getTasks: async () => {
    return (await api.get("/task")).data;
  },

  addTask: async (payload: unknown) => {
    return (await api.post("/task", payload)).data;
  },

  updateTask: async (id: string, payload: unknown) => {
    return (await api.patch(`/task/${id}`, payload)).data;
  },

  deleteTask: async (id: string) => {
    return (await api.delete(`/task/${id}`)).data;
  },
};

export const authApi = {
  login: async (email: string, pass: string) => {
    return (await api.post("/auth/login", {
      email,
      password: pass,
    })).data;
  },
};
