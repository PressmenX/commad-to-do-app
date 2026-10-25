import { api } from "./api";

export const authApi = {
  login: async (email: string, pass: string) => {
    return (await api.post("/auth/login", {
      email,
      password: pass,
    })).data;
  },
  register: async (payload: { name: string; email: string; password: string }) => {
    return (await api.post("/auth/register", payload)).data;
  },
  logout: async () => {
    return (await api.post("/auth/logout")).data;
  }
};