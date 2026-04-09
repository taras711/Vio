import { useEffect, useState } from "react";
import type { LicenseInfo } from "../types/LicenseInfo";
export function useLicenseInfo() {
  const [info, setInfo] = useState<LicenseInfo | null>(null);

  useEffect(() => {
    fetch("/api/license/info", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((r) => r.json())
      .then((data: LicenseInfo) => setInfo(data));
  }, []);

  return info;
}