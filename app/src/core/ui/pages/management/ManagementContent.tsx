// src/core/ui/pages/management/ManagementContent.tsx
import { UsersManagement, MachinesManagement, SystemManagement, PluginsManagement } from "./index";
export default function ManagementContent({
  active,
  subActive
}: {
  active?: string;
  subActive?: string;
}) {
  switch (active) {
    case "users":
      return <UsersManagement section={subActive} />;

    case "system":
      return <SystemManagement section={subActive} />;

    case "plugins":
      return <PluginsManagement />;

    case "machines":
      return <MachinesManagement section={subActive} />;

    default:
      return null;
  }
}