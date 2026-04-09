// core/ui/primitives/Card.tsx
import { Box } from "@mui/material";
import type { ReactNode } from "react";
import { ImageLoader } from "@core/ui/primitives/ImageLoader";

export function Card({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        backgroundColor: "#c0d4dd",
        borderRadius: 3,
        p: 3,
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      {children}
    </Box>
  );
}

export function UserCard({image, children, status }: { image?: string | undefined, children: ReactNode, status?: boolean }) {
  return (
    <Box
      sx={{
        position: "relative",
        backgroundColor: "#c0d5dd",
        minWidth: "300px",
        maxWidth: "450px",
        borderRadius: "15px",
        display: "flex",
        overflow: "hidden",
      }}
    >
      <AvatarTemp image={image} status={status} />
      <Box sx={{ backgroundColor: "#a0b2b9", padding: 3, flex: 1, color: "#475469" }}>
        {children}
      </Box>
    </Box>
  );
}

export function AvatarTemp({
  image,
  status,
}: {
  image?: string;
  status?: boolean;
}) {
  return (
    <ImageLoader
      src={image}
      width={150}
      height={"100%"}
      style={{ maxHeight: "200px" }}
      radius="50%"
      className={`card-logo ${status ? "online" : "offline"}`}
      
    />
  );
}
