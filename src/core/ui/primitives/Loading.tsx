import { Backdrop, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
export function Loading({ timeout = 10000 }) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), timeout);
        return () => clearTimeout(timer);
    }, [timeout]);

    return loading ? (
        <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
            open
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    ) : null;
}
