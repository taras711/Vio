// src/core/services/users/UsersService.ts
import api from "../utils/api";
import { useLicenseInfo } from "@src/auth/License";
export interface UsersStats {
  total: number;
  active: number;
  deactivated: number;
  logins24h: number;
  mfaEnabled: number;
  maxUsers: number;
  licenseStatus: string;
}

export const UsersService = {
  async getStats(): Promise<UsersStats> {
    const usersRes = await api.get("/users");
    const users = usersRes.data;

    const total = users.length;
    const active = users.filter((u: any) => u.isActive).length;
    const deactivated = total - active;

    return {
      total,
      active,
      deactivated,
      logins24h: 0,
      mfaEnabled: 0,
      maxUsers: 0,        // doplníme v komponentě
      licenseStatus: "",  // doplníme v komponentě
    };
  }
};
