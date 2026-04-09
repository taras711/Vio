import {ContentTemplate} from "@ui/primitives/ContentTemplate";
import { SettingsRow } from "@ui/primitives/SettingsRow";
import { useLicenseInfo } from "@auth/License";
import { Box, TextField, Divider, InputAdornment, IconButton } from "@mui/material";
import { Save } from "@mui/icons-material";
export function SubscriptionSettings() {
    const license = useLicenseInfo();
    return <ContentTemplate>
        <h2 className="text-2xl font-semibold" style={{color: "#8c9ea5"}}>Subscription</h2>
        <Box>
            <SettingsRow
                label="License type"
                description="The type of license you have"
                children={<p style={{textTransform:"uppercase"}}>{license?.type || "Trial"}</p>}
            />
            <SettingsRow
                label="Expires at"
                description="The date your license expires"
                children={<p>{formatExpiry(license?.expiresAt || "")}</p>}
            />
            <SettingsRow
                label="Max users"
                description="The maximum number of users your license allows"
                children={<p>{license?.maxUsers || "-"}</p>}
            />
            <SettingsRow
                label="Status"
                description="The status of your license"
                children={<p>{license?.status ? "Active" : "Inactive"}</p>}
            />
            <SettingsRow
                label="Customer ID"
                description="The ID of your customer"
                children={<p>{license?.customerId || "-"}</p>}
            />

           
            <Divider variant="middle" style={{margin: "20px 0px"}}/>
            <SettingsRow
                label="License key"
                description="The key used to activate your license"
                children={
                    <TextField
                        value={license?.shortCode || ""}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton edge="end" aria-label="save">
                                        <Save />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                }
            />
        </Box>
    </ContentTemplate>;
}

export function formatExpiry(expiresAt: string) {
  const exp = new Date(expiresAt).getTime();
  const now = Date.now();
  const diff = exp - now;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const absDays = Math.abs(days);

  const years = Math.floor(absDays / 365);
  const months = Math.floor((absDays % 365) / 30);
  const daysLeft = absDays % 30;

  // --- EXPIRED ---
  if (diff < 0) {
    if (absDays === 0) return "Expired today";
    if (absDays === 1) return "Expired yesterday";

    if (years > 0) return `${years} years ${months} months ago`;
    if (months > 0) return `${months} months ${daysLeft} days ago`;

    return `${absDays} days ago`;
  }

  // --- FUTURE ---
  if (days === 0) return "Expires today";
  if (days === 1) return "Expires tomorrow";

  if (years > 0) return `${years} years ${months} months`;
  if (months > 0) return `${months} months ${daysLeft} days`;

  return `${days} days`;
}
