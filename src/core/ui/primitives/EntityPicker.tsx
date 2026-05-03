import { useState, useMemo } from "react";
import {
  Box, TextField, IconButton, Tooltip, Paper,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography
} from "@mui/material";

interface EntityPickerProps<T> {
  value: string | null;
  onChange: (id: string) => void;
  items: T[];
  label: string;
  icon: React.ReactNode;
    excludedIds?: string[];
    fullWidth?: boolean;
  getId: (item: T) => string;
  getPrimaryText: (item: T) => string;
  getSecondaryText?: (item: T) => string | null;
  getSearchText: (item: T) => string;
  
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
  fullWidth
}: EntityPickerProps<T>) {

  const [query, setQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [openModal, setOpenModal] = useState(false);

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
              <IconButton onClick={() => setOpenModal(true)}>
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

      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="sm">
        <DialogTitle>Select {label}</DialogTitle>
        <DialogContent dividers>
          {filteredItems.length === 0 && (
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              No {label.toLowerCase()} found.
            </Typography>
          )}

          {filteredItems.map(i => (
            <Box
              key={getId(i)}
              sx={{
                p: 1.5,
                cursor: "pointer",
                borderBottom: "1px solid #eee",
                "&:hover": { backgroundColor: "action.hover" },
              }}
              onClick={() => {
                onChange(getId(i));
                setOpenModal(false);
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
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
