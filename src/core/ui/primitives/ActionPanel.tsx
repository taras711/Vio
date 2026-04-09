import { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { Search, ArrowDownUp, Filter } from "lucide-react";

interface ActionPanelProps {
  onChange: (data: {
    search: string;
    sort: string;
    filter: string;
    view: "grid" | "table";
  }) => void;
}

export function ActionPanel({ onChange }: ActionPanelProps) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [filter, setFilter] = useState("");
  const [view, setView] = useState<"grid" | "table">("grid");

  // 3 nezávislé anchor elementy
  const [searchAnchor, setSearchAnchor] = useState<null | HTMLElement>(null);
  const [sortAnchor, setSortAnchor] = useState<null | HTMLElement>(null);
  const [filterAnchor, setFilterAnchor] = useState<null | HTMLElement>(null);

  // 🔥 kdykoliv se něco změní → pošli to ven
  useEffect(() => {
    onChange({ search, sort, filter, view });
  }, [search, sort, filter, view]);

  const setSortOrder = (order: "asc" | "desc") => setSort(`${order}`);
  return (
    <Box
      sx={{
        display: "flex",
        gap: "10px",
        justifyContent: "end",
        padding: "15px 0",
        borderBottom: "1px solid #c4d8df",
      }}
    >
      {/* SEARCH */}
      <IconButton onClick={(e) => setSearchAnchor(e.currentTarget)}>
        <Search size={22} />
      </IconButton>

      <Menu
        anchorEl={searchAnchor}
        open={Boolean(searchAnchor)}
        onClose={() => setSearchAnchor(null)}
      >
        <MenuItem>
          <TextField
            size="small"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search…"
          />
        </MenuItem>
      </Menu>

      {/* SORT */}
      <IconButton onClick={(e) => setSortAnchor(e.currentTarget)}>
        <ArrowDownUp size={22} />
      </IconButton>

      <Menu
        anchorEl={sortAnchor}
        open={Boolean(sortAnchor)}
        onClose={() => setSortAnchor(null)}
      >
        <MenuItem onClick={() => setSortOrder("asc")}>Ascending</MenuItem>
        <MenuItem onClick={() => setSortOrder("desc")}>Descending</MenuItem>
      </Menu>

      {/* FILTER */}
      <IconButton onClick={(e) => setFilterAnchor(e.currentTarget)}>
        <Filter size={22} />
      </IconButton>

      <Menu
        anchorEl={filterAnchor}
        open={Boolean(filterAnchor)}
        onClose={() => setFilterAnchor(null)}
      >
        <MenuItem>
          <TextField
            size="small"
            placeholder="Filter value…"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </MenuItem>
      </Menu>

      {/* VIEW SWITCH */}
      <ToggleButtonGroup
        value={view}
        exclusive
        onChange={(e, v) => v && setView(v)}
        size="small"
        >
        <ToggleButton value="grid">Grid</ToggleButton>
        <ToggleButton value="table">Table</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}