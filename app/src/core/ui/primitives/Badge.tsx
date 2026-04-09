// core/ui/primitives/Badge.tsx
import { Chip } from "@mui/material";

export function Badge({ status }: { status: "ok" | "warning" | "error" }) {
  const map = {
    ok: { label: "OK", color: "success" as const },
    warning: { label: "Servis", color: "warning" as const },
    error: { label: "Porucha", color: "error" as const },
  };
  const cfg = map[status];
  return <Chip label={cfg.label} color={cfg.color} size="small" />;
}