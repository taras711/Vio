import { type IconName } from "@pages/management/iconMap";
export interface ManagementCategory {
  icon: IconName;
  id: string;
  label: string;
  children?: {
    icon: IconName;
    id: string;
    label: string;
  }[];
}