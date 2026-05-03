import api from "../../utils/api";

export const AreasService = {
  list() {
    return api.get("/areas");
  },

  getBySector(sectorId: string) {
    return api.get(`/areas/by-sector/${sectorId}`);
  }
};
