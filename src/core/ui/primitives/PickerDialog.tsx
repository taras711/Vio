import { Box, Dialog, DialogTitle, DialogContent, Typography } from "@mui/material";
interface Props<T> {
  open: boolean;
  onClose: () => void;
  items: T[];
  getId: (item: T) => string;
  getPrimaryText: (item: T) => string;
  getSecondaryText?: (item: T) => string;
  onSelect: (id: string) => void;
  disableEnforceFocus?: boolean;
}
export function EntityPickerDialog<T>({
  open,
  onClose,
  items,
  getId,
  getPrimaryText,
  getSecondaryText,
  onSelect
}: Props<T>) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      keepMounted
      disableEnforceFocus
      disableAutoFocus
      disableRestoreFocus
    >
      <DialogTitle>
        Select <span style={{ opacity: 0.7 }}>({items.length || ""})</span>
      </DialogTitle>

      <DialogContent dividers>
        {items.length === 0 && (
          <Typography variant="body2" sx={{ opacity: 0.7, textAlign: "center" }}>
            No items found.
          </Typography>
        )}

        {items.map(i => (
          <Box
            sx={{
              p: 1.5,
              cursor: "pointer",
              borderBottom: "1px solid #eee",
              "&:hover": { backgroundColor: "action.hover" }
            }}
            key={getId(i)}
            onClick={() => {
              onSelect(getId(i));
              onClose();
            }}
          >
            <Typography>{getPrimaryText(i)}</Typography>

            {getSecondaryText && (
              <Typography variant="caption">
                {getSecondaryText(i)}
              </Typography>
            )}
          </Box>
        ))}
      </DialogContent>
    </Dialog>
  );
}
