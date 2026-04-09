// backend/core/modules/ModuleLoader.ts
import type { ModuleDefinition } from "./Module";

import type { LicenseService } from "../license/LicenseService";

export class ModuleLoader {
  constructor(private license: LicenseService) {}

  loadModules(allModules: any[], deps: any): ModuleDefinition[] {
    const allowed = this.license.getLicense().allowedModules;

    const loaded: ModuleDefinition[] = [];

    for (const mod of allModules) {
      if (!allowed.includes(mod.name)) {
        console.log(`⛔ Module "${mod.name}" is disabled by license`);
        continue;
      }

      try {
        const instance = mod.factory(deps);

        if (!instance || !instance.routes) {
          console.warn(`⚠ Module "${mod.name}" is missing required properties`);
          continue;
        }

        if (instance.init) {
          instance.init();
        }

        console.log(`✅ Module "${mod.name}" loaded`);
        loaded.push(instance);

      } catch (err) {
        console.error(`❌ Failed to load module "${mod.name}":`, err);
      }
    }

    return loaded;
  }
}