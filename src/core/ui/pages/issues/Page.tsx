import { useParams } from "react-router-dom";
import { IssuesList } from "./IssuesList";
import { IssueDetail } from "./IssueDetail";
import { IssueEdit } from "./IssueEdit";

export function Component() {
  const { id, mode } = useParams();

  if (id && mode === "edit") return <IssueEdit id={id} />;
  if (id) return <IssueDetail id={id} />;
  return <IssuesList />;
}