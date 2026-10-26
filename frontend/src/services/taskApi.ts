import type { ICreateTask, ITask } from "..";
import { api } from "./api";

export function notifyOfflineTaskAction() {
  window.dispatchEvent(new Event("app:offline-action"));
}

function requireOnlineForMutation() {
  if (navigator.onLine) return;

  notifyOfflineTaskAction();
  throw new Error("Koneksi internet diperlukan. Aksi tidak dilakukan.");
}

export const taskApi = {
  getTasks: async () => {
    return (await api.get("/task")).data.result as ITask[];
  },

  addTask: async (payload: ICreateTask) => {
    requireOnlineForMutation();
    return (await api.post("/task", payload)).data;
  },

  updateTask: async (id: string, payload: Partial<ICreateTask>) => {
    requireOnlineForMutation();
    return (await api.patch(`/task/${id}`, payload)).data;
  },
  deleteTask: async (id: string) => {
    requireOnlineForMutation();
    return (await api.delete(`/task/${id}`)).data;
  },
};
