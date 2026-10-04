import type { ICreateTask } from "..";
import { api } from "./api";

export const taskApi = {
  getTasks: async () => {
    return (await api.get("/task")).data;
  },

  addTask: async (payload: ICreateTask) => {
    return (await api.post("/task", payload)).data;
  },

  updateTask: async (id: string, payload: ICreateTask) => {
    return (await api.patch(`/task/${id}`, payload)).data;
  },

  deleteTask: async (id: string) => {
    return (await api.delete(`/task/${id}`)).data;
  },
};


