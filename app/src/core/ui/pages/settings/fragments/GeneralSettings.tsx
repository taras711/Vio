import { ContentTemplate } from "@ui/primitives/ContentTemplate";
import { SettingsRow } from "@ui/primitives/SettingsRow";
import { Box, Switch, Select, MenuItem, } from "@mui/material";
import { useState } from "react";

export function GeneralSettings() {
    const [actualLang, setActualLang] = useState("en");
    type Lang = "en" | "cz";
    return <ContentTemplate>
        <h2 className="text-2xl font-semibold" style={{color: "#8c9ea5"}}>General Settings</h2>
        <Box>
            <SettingsRow
                label="Dark mode"
                description="Enable dark mode"
                children={<Switch />}
            />
            <SettingsRow
                label="Language"
                description="Select language"
                children={
                    <Select label="Language"  
                        value={actualLang}
                        onChange={(e) => {
                            setActualLang(e.target.value as Lang);
                        }}>
                            <MenuItem value="en">English</MenuItem>
                            <MenuItem value="cz">Czech</MenuItem>
                    </Select>
                }
            />
        </Box>
    </ContentTemplate>
}