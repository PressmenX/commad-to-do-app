import type { ICreateTask, ITask } from "..";
import { api } from "./api";

export const taskApi = {
  getTasks: async () => {
    return (await api.get("/task")).data.result as ITask[];
  },

  addTask: async (payload: ICreateTask) => {
    return (await api.post("/task", payload)).data;
  },

  updateTask: async (id: string, payload: Partial<ICreateTask>) => {
    return (await api.patch(`/task/${id}`, payload)).data;
  },
  deleteTask: async (id: string) => {
    return (await api.delete(`/task/${id}`)).data;
  },
};
