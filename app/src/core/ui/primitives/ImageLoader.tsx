import { useEffect, useState } from "react";
import { Box } from "@mui/material";

interface ImageLoaderProps {
  src?: string;
  alt?: string;
  radius?: number | string;
  width?: number | string;
  height?: number | string;
  fallback?: React.ReactNode;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string | undefined;
}

export function ImageLoader({
  src,
  alt,
  className,
  radius = "50%",
  width = 150,
  height = 150,
  style,
  fallback,
  children,
}: ImageLoaderProps) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!src) return;

    const img = new Image();
    img.src = src;
    img.onload = () => setLoaded(true);
    img.onerror = () => setLoaded(false);
  }, [src]);

  if (!loaded) {
    return (
      fallback || (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 150,
            height: 150,
          }}
        >
            <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
        </Box>
      )
    );
  }

  return (
    <Box
        className={className}
        style={style}
      sx={{
        width,
        height,
        borderRadius: radius,
        backgroundImage: `url(${src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      aria-label={alt}
    >
      {children}
    </Box>
  );
}