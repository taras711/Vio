import { useForm, Controller, useFormContext } from "react-hook-form";
import { Settings, X} from "lucide-react";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Typography,
  Grid,
  IconButton,
  Paper,
  Switch,
  FormControlLabel,
  FormGroup,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  Select,
  TableHead,
  TableRow,
  Divider,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useState } from "react";
import dayjs from "dayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import DeleteIcon from "@mui/icons-material/Delete";
import { ColorPickerField } from "@ui/primitives/ColorPickerField";
import useMediaQuery from "@mui/material/useMediaQuery";

import { type DataScope } from "@src/lib/hooks/useScopedData";
import { UserPicker } from "@ui/primitives/UserPicker";
import { LocationPicker } from "@ui/primitives/LocationPicker";
import { RRule } from "rrule"; //For parsing/generating recurrence rules, optional but useful for complex patterns


export interface User {
  id: string;
  name: string;
  email: string;
  position?: string;
  department?: string;
  avatarUrl?: string;
  fullName: string;
  avatar?: string;
  sectorId?: string;
  areaId?: string;
  role?: "user" | "admin" | "superAdmin";
}

export interface EventData {
  id: string;
  name: string;
  locationId: string;
  startTime: number;
  endTime: number;
  color: string;
  type: string;
  description?: string;

  feedbackEnabled: boolean; // ← TADY
}

export interface AttendeeInput {
  userId?: string;
  roleId?: string;
  sectorId?: string;
  locationId?: string;
  isOrganizer: boolean;
  required: boolean;
}

export interface EventFormProps {
  id?: string;
  eventId?: string;
  endpoint: string;
  onOpenSettings: () => void;
  user: User;
  organizerId: string | null;
  attendees: AttendeeInput[];
  areas: any[];
  sectors: any[];
  selectedArea: string | null;
  selectedSector: string | null;
  areaId: string | null;
  sectorId: string | null;
  scope: DataScope;
  isRecurring: boolean;
  repeatType: "daily" | "weekly" | "monthly";
  interval: number;
  selectedDays: string[];
  endType: "never" | "after" | "until";
  occurrenceCount: number;
  endDate: number | null;
  mappedUsers: any[];
  locations: any[];
  allDay: boolean | undefined;
  isPrivate: boolean | undefined;
  status: "scheduled" | "in-progress" | "cancelled" | "completed";
  onStatusChange: (status: "scheduled"  | "in-progress" | "cancelled" | "completed") => void;

  onOrganizerChange: (v: string) => void;
  onAttendeesChange: (v: AttendeeInput[]) => void;
  onAreaChange: (v: string) => void;
  onSectorChange: (v: string) => void;
  onSelectedAreaChange: (v: string) => void;
  onSelectedSectorChange: (v: string) => void;
  onScopeChange: (v: DataScope) => void;
  onRecurringChange: (v: boolean) => void;
  onRepeatTypeChange: (v: "daily" | "weekly" | "monthly") => void;
  onIntervalChange: (v: number) => void;
  toggleDay: (day: string) => void;
  onEndTypeChange: (v: "never" | "after" | "until") => void;
  onOccurrenceCountChange: (v: number) => void;
  onEndDateChange: (v: number | null) => void;
  onSubmit: (data: EventFormValues) => void;
  addAttendee: () => void;
  updateAttendee: <K extends keyof AttendeeInput>(
    index: number,
    field: K,
    value: AttendeeInput[K]
  ) => void;
  removeAttendee: (index: number) => void;
  closeDrawer: () => void;
  onAllDayChange: (v: boolean | undefined) => void;
  onIsPrivateChange: (v: boolean | undefined) => void;
  handleDelete: (id: string) => void;

}


export interface EventFormValues 
{
  id?: string;
  eventId?: string;
  name: string;
  locationId: string;
  startTime: number;
  endTime: number;
  color: string;
  type: string;
  description?: string;
  attendees?: AttendeeInput[];

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
  allDay?: boolean;
  isPrivate?: boolean;
  status?: "scheduled" | "in-progress" | "cancelled" | "completed";
  onStatusChange?: (status: "scheduled" | "in-progress" | "cancelled" | "completed") => void;
}

interface EventSettingsPanelProps {
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
  onChange: (field: keyof EventFormValues, value: boolean) => void;
  onClose: () => void;
}

export function EventForm(props: EventFormProps) {

  const [scope, setScope] = useState<DataScope>("visible");

  const isMobile = useMediaQuery("(max-width: 600px)");

  const { control, handleSubmit, register, watch, setValue } = useFormContext<EventFormValues>();
  
  if (!props.organizerId) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box component="form" onSubmit={handleSubmit(props.onSubmit)} sx={{ maxWidth: 900 }}>
      <Grid container spacing={2} sx={{ mb: 2, mt: 2 }}>
        {props.eventId && (
          <Grid item xs={12}>
              <Grid item xs={12} md={12}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Status</InputLabel>
                    <Select
                      value={props.status ?? "scheduled"}
                      label="Status"
                      onChange={(e) => props.onStatusChange(e.target.value as any)}
                    >
                      <MenuItem value="scheduled">Scheduled</MenuItem>
                      <MenuItem value="cancelled">Cancelled</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                    </Select>
                  </FormControl>
              </Grid>
          </Grid>
        )}
        <Grid item xs={12}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 1, mt: 1 }}>
            Choose scope
          </Typography>
          <IconButton sx={{ position: "absolute", top: 16, right: 16 }} onClick={props.closeDrawer}>
          <X size={20} />
        </IconButton>
        </Grid>
        <Grid item xs={4}>
          <Select
            label="Data source"
            value={props.scope}
            onChange={(e) => props.onScopeChange(e.target.value as DataScope)}

            fullWidth
          >
            <MenuItem value="visible">Visible</MenuItem>
            <MenuItem value="area" disabled={!props.user.areaId}>My Area ({props.user.areaId ?? "None"})</MenuItem>
            <MenuItem value="sector" disabled={!props.user.sectorId}>My Sector ({props.user.sectorId ?? "None"})</MenuItem>
            <MenuItem value="area-sector">Area → Sector</MenuItem>
            <MenuItem value="area-visibility" disabled={!props.user.areaId}>
              Area Alliance (Visibility)
            </MenuItem>

            <MenuItem value="area-sector-visibility" disabled={!props.user.areaId || !props.user.sectorId}>
              Area Alliance → Sector
            </MenuItem>
            <MenuItem value="select-area">Select Area…</MenuItem>
            <MenuItem value="select-sector">Select Sector…</MenuItem>
            {props.user.role === "superAdmin" && (
              <MenuItem value="all">All Areas (Corporate)</MenuItem>
            )}
          </Select>
        </Grid>
        <Grid item xs={4}>
          {(props.scope === "area-sector" || props.scope === "select-area" || props.scope === "area-visibility" || props.scope === "area-sector-visibility") && (
            <Grid item xs={12}>
              <Select
                label="Area"
                value={props.areaId || props.selectedArea}
                onChange={(e) => {
                  const val = String(e.target.value);
                  props.onSelectedAreaChange(val);
                  props.onAreaChange(val);
                }}
                fullWidth
              >
                {props.areas.map(a => (
                  <MenuItem key={a.id} value={a.id}>{a.name}</MenuItem>
                ))}
              </Select>
            </Grid>
          )}
        </Grid>
        <Grid item xs={4}>
          {(props.scope === "area-sector" || props.scope === "select-sector" || props.scope === "area-sector-visibility") && (
            <Grid item xs={12}>
              <Select
                label="Sector"
                value={props.sectorId || props.selectedSector}
                onChange={(e) => {
                  const val = String(e.target.value);
                  props.onSelectedSectorChange(val);
                  props.onSectorChange(val);
                }}
                fullWidth
              >
                {props.sectors.map(s => (
                  <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                ))}
              </Select>
            </Grid>
          )}
        </Grid>
      </Grid>
      <Divider sx={{ mb: 2 }} />
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={12}>
          <Typography variant="h6">
            Organizer
          </Typography>
        </Grid>
        <Grid item xs={12} md={10} >
          <UserPicker
            required
            currentUserName={props.user.name}
            value={props.organizerId || ""}
            label="Organizer"
            users={props.mappedUsers}
            onChange={(id) => props.onOrganizerChange(id)}
            isOrganizer={true}
            currentUserId={String(props.user.id)}
            
            excludedIds={[
              props.organizerId, // 🔥 FIX: organizátor je vždy zakázaný
              ...props.attendees
                .map(a => a.userId)
                .filter((id): id is string => typeof id === "string" && id.length > 0)
            ].filter(Boolean)}
            fullWidth={true}
          />
        </Grid>
      </Grid>
      <Divider sx={{ mb: 2 }} />
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Basic Info
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Event Name"
            fullWidth
            required
            {...register("name", { required: true })}
          />
        </Grid>

        <Grid item xs={12}>
          <LocationPicker
            value={watch("locationId") ?? null}
            onChange={(id) => setValue("locationId", id)}
            locations={props.locations ?? []}
            excludedIds={[]} // pokud chceš zakázat některé lokace
            label="Location"
          />
        </Grid>
      </Grid>
      <Divider sx={{ mb: 2 }} />
      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        Time
      </Typography>

      <Grid container spacing={2}  sx={{ mt: 4, mb: 2 }}>
        <Grid item xs={12} md={6}>
          <Controller
            name="startTime"
            control={control}
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Start Time"
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(newValue) => {
                    if (newValue && newValue.isValid()) {
                      const fixed = props.allDay
                        ? newValue.startOf("day").valueOf()
                        : newValue.valueOf(); // pokud chceš zachovat čas
                      field.onChange(fixed);
                    }
                  }}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="endTime"
            control={control}
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="End Time"
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(newValue) => {
                    if (newValue && newValue.isValid()) {
                      const fixed = props.allDay
                        ? newValue.endOf("day").valueOf()
                        : newValue.valueOf();
                      field.onChange(fixed);
                    }
                  }}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            )}
          />
        </Grid>
        <Grid item xs={4}>
          <FormControlLabel
            control={
              <Switch
                checked={props.isRecurring}
                onChange={(e) => props.onRecurringChange(e.target.checked)}
              />
            }
            label="Repeat"
          />
        </Grid>
        <Grid item xs={4}>
          <FormControlLabel
            control={
              <Switch
                checked={props.allDay}
                onChange={(e) => props.onAllDayChange(e.target.checked)}
              />
            }
            label="All-day"
          />
        </Grid>
        <Grid item xs={4}>
          <FormControlLabel
            control={
              <Switch
                checked={props.isPrivate}
                onChange={(e) => props.onIsPrivateChange(e.target.checked)}
              />
            }
            label="Private"
          />

        </Grid>
          {props.isRecurring && (
            <RecurrenceSection
              repeatType={props.repeatType}
              setRepeatType={props.onRepeatTypeChange}
              interval={props.interval}
              setInterval={props.onIntervalChange}
              selectedDays={props.selectedDays}
              toggleDay={props.toggleDay}
              endType={props.endType}
              setEndType={props.onEndTypeChange}
              occurrenceCount={props.occurrenceCount}
              setOccurrenceCount={props.onOccurrenceCountChange}
              endDate={props.endDate}
              setEndDate={props.onEndDateChange}
            />
          )}

          
        
      </Grid>
      <Divider sx={{ mb: 2 }} />
      <Typography variant="h6" sx={{ mb: 2 }}>
        Appearance
      </Typography>

      <Grid container spacing={2} sx={{ mt: 4, mb: 2 }}>
        <Grid item xs={12} md={10}>
          <TextField
            label="Type"
            select
            defaultValue="meeting"
            fullWidth
            {...register("type", { required: true })}
          >
            <MenuItem value="meeting">Meeting</MenuItem>
            <MenuItem value="shift">Shift</MenuItem>
            <MenuItem value="appointment">Appointment</MenuItem>
            <MenuItem value="event">Event</MenuItem>
            <MenuItem value="training">Training</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} md={2}>
          <Controller
            name="color"
            control={control}
            render={({ field }) => (
              <ColorPickerField
                label="Color"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </Grid>
      </Grid>
      <Divider sx={{ mb: 2 }} />
      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        Description
      </Typography>

      <TextField
        label="Description"
        fullWidth
        multiline
        rows={3}
        {...register("description")}
      />
<Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <IconButton onClick={props.onOpenSettings}>
                <Settings size={20} />
              </IconButton>
          }
            label="Advanced Settings"
          />
        </Grid>
      </Grid>
      <Divider sx={{ mb: 2 }} />

      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        Attendees
      </Typography>

{props.attendees.map((a, i) => {
  const excluded = [
    props.organizerId,
    ...props.attendees
      .filter((_, idx) => idx !== i)
      .map((x) => x.userId),
  ].filter(Boolean) as string[];

const attendeeExcludedIds = [
  props.organizerId,
  ...props.attendees
    .filter((_, idx) => idx !== i)
    .map(a => a.userId)
].filter(id => id != null);


  return (
    <Paper key={i} sx={{ p: 2, mb: 2 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={5}>
          <UserPicker
            value={a.userId}
            onChange={(id) => props.updateAttendee(i, "userId", id)}
            users={props.mappedUsers}
            currentUserId={props.user.id}
            isOrganizer={false}
            currentUserName={props.user.name}
            excludedIds={attendeeExcludedIds}
          />
        </Grid>

        <Grid item xs={12} md={5}>
          <TextField
            label="Required?"
            select
            fullWidth
            value={a.required ? "yes" : "no"}
            onChange={(e) =>
              props.updateAttendee(i, "required", e.target.value === "yes")
            }
          >
            <MenuItem value="yes">Required</MenuItem>
            <MenuItem value="no">Optional</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} md={2} sx={{ textAlign: "center" }}>
          <IconButton color="error" onClick={() => props.removeAttendee(i)}>
            <DeleteIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Paper>
  );
})}

      <Button variant="outlined" onClick={props.addAttendee} sx={{ mb: 3 }}>
        Add Attendee
      </Button>
      <Grid container spacing={2} sx={{ mt: 2, mb: 4 }}>
        <Grid item xs={12} md={props.eventId ? 6 : 12}>
          <Button variant="contained" type="submit" fullWidth>
            {props.eventId ? "Update Event" : "Create Event"}
          </Button>
        </Grid>
        {props.eventId && (
          <Grid item xs={12} md={6}>
            <Button
              color="error"
              variant="outlined"
              onClick={() => props.handleDelete(props.eventId!)}
              fullWidth
            >
              Delete Event
            </Button>
          </Grid>
          )}
      </Grid>
    </Box>
  );
}


function RecurrenceSection({
  repeatType,
  setRepeatType,
  interval,
  setInterval,
  selectedDays,
  toggleDay,
  endType,
  setEndType,
  occurrenceCount,
  setOccurrenceCount,
  endDate,
  setEndDate
}: {
  repeatType: ("daily" | "weekly" | "monthly");
  setRepeatType: (v: any) => void;
  interval: number;
  setInterval: (n: number) => void;
  selectedDays: string[];
  toggleDay: (d: string) => void;
  endType: "never" | "after" | "until";
  setEndType: (v: any) => void;
  occurrenceCount: number;
  setOccurrenceCount: (n: number) => void;
  endDate: number | null;
  setEndDate: (n: number | null) => void;
}) {
  return (
    <>
      <Grid item xs={12} md={8}>
        <TextField
          select
          label="Repeat"
          value={repeatType}
          onChange={(e) => setRepeatType(e.target.value)}
          fullWidth
        >
          <MenuItem value="daily">Daily</MenuItem>
          <MenuItem value="weekly">Weekly</MenuItem>
          <MenuItem value="monthly">Monthly</MenuItem>
        </TextField>
      </Grid>
      <Grid item xs={4} md={4}>
        <TextField
          label="Every"
          type="number"
          value={interval}
          onChange={(e) => setInterval(Number(e.target.value))}
          fullWidth
        />
      </Grid>
      {repeatType === "weekly" && (
        <Grid item xs={12} md={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <FormGroup row>
            {["MO","TU","WE","TH","FR","SA","SU"].map(day => (
              <FormControlLabel
                key={day}
                control={
                  <Checkbox
                    checked={selectedDays.includes(day)}
                    onChange={() => toggleDay(day)}
                  />
                }
                label={day}
              />
            ))}
          </FormGroup>
        </Grid>
      )}

      
      <Grid item xs={12}>
        <TextField
          select
          label="Ends"
          value={endType}
          onChange={(e) => setEndType(e.target.value)}
          fullWidth
        >
          <MenuItem value="never">Never</MenuItem>
          <MenuItem value="after">After X occurrences</MenuItem>
          <MenuItem value="until">Until date</MenuItem>
        </TextField>
      </Grid>

      {endType === "after" && (
        <Grid item xs={12}>
          <TextField
            label="Occurrences"
            type="number"
            value={occurrenceCount}
            onChange={(e) => setOccurrenceCount(Number(e.target.value))}
            fullWidth
          />
        </Grid>
      )}

      {endType === "until" && (
       <Grid item xs={12}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Until"
            value={endDate ? dayjs(endDate) : null}
            onChange={(newValue) => {
              if (newValue && newValue.isValid()) {
                setEndDate(newValue.valueOf());
              } else {
                setEndDate(null);
              }
            }}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        </LocalizationProvider>
      </Grid>

      )}
    </>
  );
}

function EventSettingsPanel({
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

        <Typography variant="body2" sx={{ opacity: 0.6, mt: 0.5 }}>
          When enabled, attendees and organizer can post reactions and comments.
        </Typography>
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




