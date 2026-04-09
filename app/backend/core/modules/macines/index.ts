import { Router } from "express";
import { requirePermission } from "../../../api/middleware/permissions";

export function createMachinesModule({ db }: any) {
  const router = Router();

  router.get(
    "/",
    requirePermission("machines.read"),
    async (req, res) => {
      const rows = await db.find("machines", {});
      res.json(rows);
    }
  );

  router.post(
    "/",
    requirePermission("machines.create"),
    async (req, res) => {
      const machine = await db.insert("machines", req.body);
      res.json(machine);
    }
  );

  return {
    name: "machines",
    routes: router
  };
}