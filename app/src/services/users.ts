import api from "../utils/api";
import type { Session } from "../types/users";
export const UsersService = {
  list() {
    return api.get("/users");
  },
  get(id: string) {
    return api.get(`/users/${id}`);
  },
  create(data: any) {
    return api.post("/users", data);
  },
  update(id: string, data: any) {
    return api.put(`/users/${id}`, data);
  },
  delete(id: string) {
    return api.delete(`/users/${id}`);
  },
  updatePermissions(id: string, permissions: string[]) {
  return api.post(`/users/${id}/permissions`, { permissions });
},

updateRole(id: string, role: string) {
  return api.post(`/users/${id}/role`, { role });
},

resetPassword(id: string) {
  return api.post(`/users/${id}/reset-password`);
},

deactivate(id: string) {
  return api.post(`/users/${id}/deactivate`);
},

activate(id: string) {
  return api.post(`/users/${id}/activate`);
},

getSessions(id: string) {
  return api.get<Session[]>(`/users/${id}/sessions`);
},

killSessions(id: string) {
  return api.post(`/users/${id}/sessions/kill`);
},
};