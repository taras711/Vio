import { useParams } from "react-router-dom";
import { MachinesList } from "./MachinesList";
import { MachineDetail } from "./MachineDetail";
import { MachineEdit } from "./MachineEdit";

export function Component() {
  const { id, mode } = useParams();

  if (id && mode === "edit") return <MachineEdit id={id} />;
  if (id) return <MachineDetail id={id} />;
  return <MachinesList />;
}