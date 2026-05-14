import { Box, Switch, FormControlLabel, IconButton, Divider, Typography, Checkbox, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { X } from "lucide-react";

export type EventSettingsKeys =
  | "feedbackEnabled"
  | "notifyOrganizerOnFeedback"
  | "notifyAttendeesOnUpdate"
  | "notifyAttendeesBeforeStart"
  | "deliveryOrganizerFeedbackApp"
  | "deliveryOrganizerFeedbackEmail"
  | "deliveryAttendeesUpdateApp"
  | "deliveryAttendeesUpdateEmail"
  | "deliveryAttendeesBeforeStartApp"
  | "deliveryAttendeesBeforeStartEmail";

export interface EventFormValues {
  name: string;
  locationId: string;
  startTime: number;
  endTime: number;
  color: string;
  type: string;
  description?: string;
  feedbackEnabled: boolean;
  notifyOrganizerOnFeedback: boolean;
  notifyAttendeesOnUpdate: boolean;
  notifyAttendeesBeforeStart: boolean;
  deliveryOrganizerFeedbackApp: boolean;
  deliveryOrganizerFeedbackEmail: boolean;

  deliveryAttendeesUpdateApp: boolean;
  deliveryAttendeesUpdateEmail: boolean;

  deliveryAttendeesBeforeStartApp: boolean;
  deliveryAttendeesBeforeStartEmail: boolean;
  isRecurring: boolean;
}

export interface EventSettingsPanelProps {
  feedbackEnabled: boolean;
  notifyOrganizerOnFeedback: boolean;
  notifyAttendeesOnUpdate: boolean;
  notifyAttendeesBeforeStart: boolean;
  deliveryOrganizerFeedbackApp: boolean;
  deliveryOrganizerFeedbackEmail: boolean;

  deliveryAttendeesUpdateApp: boolean;
  deliveryAttendeesUpdateEmail: boolean;

  deliveryAttendeesBeforeStartApp: boolean;
  deliveryAttendeesBeforeStartEmail: boolean;
  onChange: (field: EventSettingsKeys, value: boolean) => void;
  onClose: () => void;
}

export function EventSettingsPanel({
  feedbackEnabled,
  notifyOrganizerOnFeedback,
  notifyAttendeesOnUpdate,
  notifyAttendeesBeforeStart,
  deliveryOrganizerFeedbackApp,
  deliveryOrganizerFeedbackEmail,
  deliveryAttendeesUpdateApp,
  deliveryAttendeesUpdateEmail,
  deliveryAttendeesBeforeStartEmail,
  deliveryAttendeesBeforeStartApp,
  onChange,
  onClose
}: EventSettingsPanelProps) {

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6">Event Settings</Typography>
        <IconButton onClick={onClose}>
          <X size={20} />
        </IconButton>
      </Box>

      {/* Reactions */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Reactions
        </Typography>

        <FormControlLabel
          control={
            <Switch
              checked={feedbackEnabled}
              onChange={(e) => onChange("feedbackEnabled", e.target.checked)}
            />
          }
          label="Allow reactions to this event"
        />
      </Box>

      {/* Notifications */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Notifications
        </Typography>

        <FormControlLabel
          control={
            <Switch
              checked={notifyOrganizerOnFeedback}
              onChange={(e) =>
                onChange("notifyOrganizerOnFeedback", e.target.checked)
              }
            />
          }
          label="Notify organizer about new reactions"
        />

        <FormControlLabel
          control={
            <Switch
              checked={notifyAttendeesOnUpdate}
              onChange={(e) =>
                onChange("notifyAttendeesOnUpdate", e.target.checked)
              }
            />
          }
          label="Notify attendees about event updates"
        />

        <FormControlLabel
          control={
            <Switch
              checked={notifyAttendeesBeforeStart}
              onChange={(e) =>
                onChange("notifyAttendeesBeforeStart", e.target.checked)
              }
            />
          }
          label="Notify attendees before event starts"
        />
      </Box>

      {/* Delivery Methods */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Notification Delivery
        </Typography>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Notification Trigger</TableCell>
              <TableCell align="center">App</TableCell>
              <TableCell align="center">Email</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            <TableRow>
              <TableCell>Organizer: New reactions</TableCell>
              <TableCell align="center">
                <Checkbox
                  checked={deliveryOrganizerFeedbackApp}
                  onChange={(e) =>
                    onChange("deliveryOrganizerFeedbackApp", e.target.checked)
                  }
                />
              </TableCell>
              <TableCell align="center">
                <Checkbox
                  checked={deliveryOrganizerFeedbackEmail}
                  onChange={(e) =>
                    onChange("deliveryOrganizerFeedbackEmail", e.target.checked)
                  }
                />
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Attendees: Event updates</TableCell>
              <TableCell align="center">
                <Checkbox
                  checked={deliveryAttendeesUpdateApp}
                  onChange={(e) =>
                    onChange("deliveryAttendeesUpdateApp", e.target.checked)
                  }
                />
              </TableCell>
              <TableCell align="center">
                <Checkbox
                  checked={deliveryAttendeesUpdateEmail}
                  onChange={(e) =>
                    onChange("deliveryAttendeesUpdateEmail", e.target.checked)
                  }
                />
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Attendees: Before event starts</TableCell>
              <TableCell align="center">
                <Checkbox
                  checked={deliveryAttendeesBeforeStartApp}
                  onChange={(e) =>
                    onChange("deliveryAttendeesBeforeStartApp", e.target.checked)
                  }
                />
              </TableCell>
              <TableCell align="center">
                <Checkbox
                  checked={deliveryAttendeesBeforeStartEmail}
                  onChange={(e) =>
                    onChange("deliveryAttendeesBeforeStartEmail", e.target.checked)
                  }
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Typography variant="body2" sx={{ opacity: 0.6, mt: 1 }}>
          Choose how each notification type should be delivered.
        </Typography>
      </Box>
    </Box>
  );
}


