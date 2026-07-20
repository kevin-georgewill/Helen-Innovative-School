import { api } from "./client";

export const instructorsApi = {
  me: async () => {
    const { data } = await api.get("/instructors/me");
    return data.data;
  },

  getAll: async () => {
    const { data } = await api.get("/instructors");
    return data.data;
  },
};