import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { usePageLoader } from "@ui/hooks/UsePageLoader";
import { Loading } from "@core/ui/primitives/Loading";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { UsersService } from "@src/services/users";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import noAvatar from "@assets/no-avatar.png";
import { UserCard } from "@ui/primitives/Card";
import type { UserRow } from "@src/types/users";
import { ActionPanel } from "@ui/primitives/ActionPanel";

export function Component() {
  return <UsersPage />;
}

export default function UsersPage() {
  const [rows, setRows] = useState<UserRow[]>([]);
  
  const [view, setView] = useState<"grid" | "table">("grid");
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sort, setSort] = useState(""); 
  const [filter, setFilter] = useState("");

const { data, loading, error } = usePageLoader(async () => {
  const res = await UsersService.list();
  return res.data.map((u: any) => ({

      ...u,
      id: String(u.id),
    }));
  });


    if (loading) return <Loading />;
  if (error) return <div>Error loading users.</div>;


  const columns: GridColDef<UserRow>[] = [
    { field: "id", headerName: "ID", width: 200 },
    { field: "email", headerName: "Email", width: 250 },
    { field: "role", headerName: "Role", width: 150 },
    {
      field: "actions",
      headerName: "",
      width: 150,
      sortable: false,
      renderCell: (params: GridRenderCellParams<UserRow>) => (
        <button
          className="text-blue-600 underline"
          onClick={() => navigate(`/users/${params.row.id}`)}
        >
          Detail
        </button>
      )
    }
  ];
const filtered = data!
  .filter((u: UserRow) => u.name.toLowerCase().includes(search.toLowerCase()))
  .filter((u: UserRow) => (filter ? u.role.includes(filter) : true))
  .sort((a: UserRow, b: UserRow) =>
    sort === "asc"
      ? a.name.localeCompare(b.name)
      : sort === "desc"
      ? b.name.localeCompare(a.name)
      : 0
  );

return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Users</h1>

        
      </div>

      {/* 🔥 ActionPanel ovládá filtraci */}
      <ActionPanel
        onChange={({ search, sort, filter, view }) => {
          setSearch(search);
          setSort(sort);
          setFilter(filter);
          setView(view);
        }}
      />

      {/* 🔥 obsah reaguje na ActionPanel */}
      {view === "grid" && <UsersGrid data={filtered} />}
      {view === "table" && (
        <div style={{ height: "80vh", width: "100%" }}>
          <DataGrid
            rows={filtered}
            columns={columns}
            getRowId={(row) => row.id}
            pageSizeOptions={[10, 25, 50]}
          />
        </div>
      )}
    </div>
  );

}

function UsersGrid({ data }: { data: UserRow[] }) {
  const navigate = useNavigate();
  return (
    <div className="grid-layout" style={{ padding: "20px 10px" }}>
    {data.map((u) => (
     <UserCard image={u.avatarUrl ?? noAvatar} key={u.id} status={u.isActive ? true : undefined} >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>{u.name}</Typography>
        <Typography variant="body2" sx={{ opacity: 0.7 }}>{u.email}</Typography>
        
        <div className="mt-3 text-sm" style={{ flex: 1 }}>
          <Typography variant="body2"><strong>Role:</strong> {u.role}</Typography>
          <Typography variant="body2"><strong>Sector:</strong> {u.sector ?? "-"}</Typography>
          <Typography variant="body2"><strong>Team:</strong> {u.sector ?? "-"}</Typography>
        </div>
        <Box sx={{ display: 'flex'}}>
          <Button size="small" onClick={() => navigate(`/users/${u.id}`)}>Detail</Button>
          <Button size="small" onClick={() => navigate(`/users/${u.id}/admin`)}>superadmin</Button>
        </Box>
      </UserCard>
    ))}
    </div>)
}