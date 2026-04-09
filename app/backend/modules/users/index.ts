// backend/modules/users/index.ts
import { Router } from "express";
import { UserService } from "./UserService";
import { UserController } from "./UserController";
import { createUserRoutes } from "./userRoutes";

export function createUserModule(deps: any) {
  const service = new UserService(deps.db, deps.license);
  const controller = new UserController(service);
  const routes = createUserRoutes(controller, deps.auth);

  return {
    name: "users",
    routes,
    init() {
      console.log("Users module initialized");
    }
  };
}