import api from "../../utils/api";

export const eventService = {
  getAll: () => api.get("/events").then(r => r.data),
  getOne: (id: string) => api.get(`/events/${id}`).then(r => r.data),
  create: (data: any) => api.post("/events", data).then(r => r.data),
  update: (id: string, data: any) => api.put(`/events/${id}`, data).then(r => r.data),
  remove: (id: string) => api.delete(`/events/${id}`).then(r => r.data),
};
