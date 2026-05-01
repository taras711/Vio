import { useState } from "react";
import { Popover, Box, Typography } from "@mui/material";
import { PaintBucket } from "lucide-react"

export interface ColorPickerFieldProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
  size?: number; // velikost barevného čtverečku
}

export function ColorPickerField({
  value,
  onChange,
  size = 54,
}: ColorPickerFieldProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const open = Boolean(anchorEl);

  return (
    <Box style={{ position: "relative", maxWidth: size }}>

      <Box
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{
            position: "relative",
          width: size,
          height: size,
          borderRadius: 1,
          border: "1px solid #ccc",
          cursor: "pointer",
          backgroundColor: value,
          transition: "0.2s ease"
        }}
      />

        <PaintBucket
            size={30}
            style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "white",
            opacity: 0.8,
            pointerEvents: "none",
            }}
        />

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Box sx={{ p: 2 }}>
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{
              width: 60,
              height: 40,
              border: "none",
              padding: 0,
              cursor: "pointer",
              background: "transparent",
            }}
          />
        </Box>
      </Popover>
    </Box>
  );
}
