import { useEffect, useState } from "react";
import type { LicenseInfo } from "../types/LicenseInfo";
import api from "../utils/api";

export function useLicenseInfo() {
  const [info, setInfo] = useState<LicenseInfo | null>(null);

  useEffect(() => {
    api.get("/license/info")
      .then((res) => setInfo(res.data))
      .catch((err) => console.error(err));
  }, []);

  return info;
}
