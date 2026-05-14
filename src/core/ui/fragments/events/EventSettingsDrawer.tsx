import { Drawer, useMediaQuery, Box } from "@mui/material";
import { EventSettingsPanel, type EventFormValues, type EventSettingsPanelProps, type EventSettingsKeys} from "./EventSettingsPanel";

type EventSettingsValues = Omit<EventSettingsPanelProps, "onChange" | "onClose">;

interface EventSettingsDrawerProps {
  open: boolean;
  onClose: () => void;
  values: EventSettingsValues;
  onChange: (field: EventSettingsKeys, value: boolean) => void;
  isRecurring?: boolean;
}

export function EventSettingsDrawer({
  open,
  onClose,
  values,
  onChange,
  isRecurring
}: EventSettingsDrawerProps) {
  const isMobile = useMediaQuery("(max-width: 600px)");

  return (
    <Drawer
      variant="temporary"
      anchor="right"
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true,
        disableEnforceFocus: true
      }}
      PaperProps={{
        sx: {
          width: isMobile ? "stretch" : 370,
          p: 3,
          backgroundColor: "#dfecf1"
        }
      }}
    >
      <EventSettingsPanel
        {...values}
        onChange={onChange}
        onClose={onClose}
      />
    </Drawer>
  );
}
