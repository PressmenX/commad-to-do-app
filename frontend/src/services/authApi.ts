import { api } from "./api";

export const authApi = {
  login: async (email: string, pass: string) => {
    return (await api.post("/auth/login", {
      email,
      password: pass,
    })).data;
  },
};