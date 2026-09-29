import { api } from "./api";

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


