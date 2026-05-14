import { Box, IconButton, Typography } from "@mui/material";
import { ArrowLeft} from "lucide-react";
export function FragmentHeader({name, description, onBack}: {name: string, description?: string, onBack: () => void}) {
    return (
        <Box sx={{ display: "flex", mb: 1, alignItems: "center", position: "sticky", top: 0, zIndex: 1, backdropFilter: "blur(10px)" }}>
            <IconButton onClick={onBack} sx={{ mr: 1 }}>
                <ArrowLeft size={20} />
            </IconButton>
            <Typography variant="h6" sx={{ textOverflow: "ellipsis", display: "-webkit-box; -webkit-line-clamp: 2;-webkit-box-orient: vertical;", overflow: "hidden", maxWidth: "100%"  }}>
                {name} 
                {description && <Typography variant="body2" sx={{ opacity: 0.7 }}>{description}</Typography>}
            </Typography>
            
        </Box>
    )
}