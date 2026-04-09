import { MachineService } from "./MachineService";
import { MachineController } from "./MachineController";
import { createMachineRoutes } from "./machineRoutes";

export function createMachinesModule(deps: any) {
  const service = new MachineService(deps.db);
  const controller = new MachineController(service);

  const routes = createMachineRoutes(controller, deps.auth, deps.audit);

  return {
    name: "machines",
    routes,
    init() {
      console.log("Machines module initialized");
    }
  };
}