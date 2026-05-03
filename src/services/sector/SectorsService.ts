import api from "../../utils/api";

export const SectorsService = {
  list() {
    return api.get("/sectors");
  }
};
