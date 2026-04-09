import { GeneralSettings, SubscriptionSettings, SecuritySettings, IntegrationsSettings, NotificationSettings } from "./index";
export default function SettingsContent({ active }: { active: string }) {
  switch (active) {
    case "general":
      return <GeneralSettings />;
    case "subscription":
      return <SubscriptionSettings />;
    case "security":
      return <SecuritySettings />;
    case "integrations":
      return <IntegrationsSettings />;
    case "notifications":
      return <NotificationSettings />;
    default:
      return null;
  }
}