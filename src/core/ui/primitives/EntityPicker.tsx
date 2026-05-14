import { useState, useMemo } from "react";
import {
  Box, TextField, IconButton, Tooltip, Paper, Typography
} from "@mui/material";

interface EntityPickerProps<T> {
  value: string | null;
  onChange: (id: string) => void;
  items: T[];
  label: string;
  icon: React.ReactNode;
    excludedIds?: string[];
    fullWidth?: boolean;
    required?: boolean;
  getId: (item: T) => string;
  getPrimaryText: (item: T) => string;
  getSecondaryText?: (item: T) => string | null;
  getSearchText: (item: T) => string;
  onOpenDialog: () => void;
}

export function EntityPicker<T>({
  value,
  onChange,
  items,
  label,
  icon,
  excludedIds,
  getId,
  getPrimaryText,
  getSecondaryText,
  getSearchText,
  onOpenDialog,
  fullWidth,
  required
}: EntityPickerProps<T>) {

  const [query, setQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const selected = items.find(i => getId(i) === value) || null;

    const filteredItems = useMemo(() => {
        return items.filter(i => !excludedIds?.includes(getId(i)));
    }, [items, excludedIds]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return filteredItems.filter(i =>
      getSearchText(i).toLowerCase().includes(q)
    );
  }, [query, filteredItems]);

    const filteredSearch = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return [];
        return filteredItems.filter(i =>
            getSearchText(i).toLowerCase().includes(q)
        );
    }, [query, filteredItems]);


  return (
    <Box sx={{ position: "relative" }}>
      <TextField
        required={required}
        sx={{ width: 1 }}
        label={label}
        value={isEditing ? query : selected ? getPrimaryText(selected) : ""}
        onFocus={() => setIsEditing(true)}
        onBlur={() => {
          setIsEditing(false);
          setQuery("");
        }}
        fullWidth={fullWidth}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={`Choose a ${label.toLowerCase()}`}
        InputProps={{
          endAdornment: (
            <Tooltip title={`Select ${label}`} placement="top-end">
              <IconButton onClick={onOpenDialog}>
                {icon}
              </IconButton>
            </Tooltip>
          ),
        }}
      />

      {isEditing && query.trim() !== "" && filteredSearch.length > 0 && (
        <Paper
          sx={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 10,
            maxHeight: 250,
            overflowY: "auto",
          }}
        >
          {filteredSearch.map((i) => (
            <Box
              key={getId(i)}
              sx={{
                p: 1.5,
                cursor: "pointer",
                "&:hover": { backgroundColor: "action.hover" },
              }}
              onMouseDown={() => {
                onChange(getId(i));
                setIsEditing(false);
                setQuery("");
              }}
            >
              <Typography>{getPrimaryText(i)}</Typography>
              {getSecondaryText && (
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  {getSecondaryText(i)}
                </Typography>
              )}
            </Box>
          ))}
        </Paper>
      )}
    </Box>
  );
}
