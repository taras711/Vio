import type { Router } from "express";

export interface ModuleDefinition {
  name: string;
  routes: Router;
  init?: () => Promise<void> | void;
  config?: Record<string, any>;
}