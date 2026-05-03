import { useForm, Controller } from "react-hook-form";
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
  Checkbox,
  Table,
  TableBody,
  TableCell,
  Select,
  TableHead,
  TableRow,
  Divider
} from "@mui/material";
import { useAuth } from "@src/auth/AuthContext";
import { useCallback, useEffect, useMemo, useState } from "react";
import { UsersService } from "@src/services/users";
import { usePageLoader } from "@ui/hooks/UsePageLoader";
import dayjs, { Dayjs } from "dayjs";
import { Drawer } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import DeleteIcon from "@mui/icons-material/Delete";
import { ColorPickerField } from "@ui/primitives/ColorPickerField";
import useMediaQuery from "@mui/material/useMediaQuery";

import { useScopedData, type DataScope } from "@src/lib/hooks/useScopedData";
import { mapAttendeeToUser } from "@src/utils/mapAttendeeToUser";
import { AreasService } from "@src/services/area/AreasService";
import { SectorsService } from "@src/services/sector/SectorsService";
import { UserPicker } from "@ui/primitives/UserPicker";
import { LocationPicker } from "@ui/primitives/LocationPicker";

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
  endpoint: string;
}

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

export function EventForm({ endpoint }: EventFormProps) {
  const { user } = useAuth()!;
  
  const [organizerId, setOrganizerId] = useState<string | undefined>(undefined);

  const [attendees, setAttendees] = useState<AttendeeInput[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const [areas, setAreas] = useState<any[]>([]);
  const [sectors, setSectors] = useState<any[]>([]);

  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);

  const [areaId, setAreaId] = useState<string | null>(null);
  const [sectorId, setSectorId] = useState<string | null>(null);

  const [scope, setScope] = useState<DataScope>("visible");

  const isMobile = useMediaQuery("(max-width: 600px)");

  useEffect(() => {
    if (user?.role) {
      setScope(user.role === "superAdmin" ? "all" : "visible");
    }
  }, [user?.role]);

  const resolvedAreaId =
    scope === "area" ? user.areaId :
    scope === "select-area" ? selectedArea :
    scope === "area-sector" ? selectedArea :
    null;

  const resolvedSectorId =
    scope === "sector" ? user.sectorId :
    scope === "select-sector" ? selectedSector :
    scope === "area-sector" ? selectedSector :
    null;

  const { locations: _locations, attendees: candidateAttendees, loading: _loading } = useScopedData(
    scope,
    resolvedAreaId,
    resolvedSectorId
  );

  const mappedUsers = useMemo(() => {
    return (candidateAttendees ?? []).map(a => ({
      ...mapAttendeeToUser(a),
      id: String(a.id),
    }));
  }, [candidateAttendees]);


  const { control, handleSubmit, register, watch, setValue } = useForm<EventFormValues>({
    defaultValues: {
      name: "",
      locationId: "",
      startTime: Date.now(),
      endTime: Date.now() + 3600000,
      color: "#2196f3",
      type: "meeting",
      description: "",
      feedbackEnabled: true,
      notifyOrganizerOnFeedback: true,
      notifyAttendeesOnUpdate: true,
      notifyAttendeesBeforeStart: false,
      deliveryOrganizerFeedbackApp: true,
      deliveryOrganizerFeedbackEmail: false,

      deliveryAttendeesUpdateApp: true,
      deliveryAttendeesUpdateEmail: false,

      deliveryAttendeesBeforeStartApp: true,
      deliveryAttendeesBeforeStartEmail: false,
    },
  });

  const loadUsers = useCallback(async () => {
    const res = await UsersService.list();
    const arr = Array.isArray(res.data) ? res.data : [];

    return arr.map((u: any) => ({
      id: String(u.id),
      name: u.name,
      email: u.email,
      position: u.position ?? "",
      department: u.department ?? "",
      avatarUrl: u.avatarUrl ?? "",
      fullName: u.name,
    }));
  }, []);

  useEffect(() => {
    if (!organizerId) return;

    setAttendees((prev) =>
      prev.filter((a) => a.userId !== organizerId)
    );
  }, [organizerId]);

  useEffect(() => {
    const load = async () => {
      try {
        const a = await AreasService.list();
        const s = await SectorsService.list();

        console.log("AREAS:", a.data);
        console.log("SECTORS:", s.data);

        setAreas(Array.isArray(a.data) ? a.data : []);
        setSectors(Array.isArray(s.data) ? s.data : []);
      } catch (err) {
        console.error("LOAD ERROR:", err);
      }
    };

    load();
  }, []);

  useEffect(() => {
    if (user?.id && organizerId === undefined) {
      setOrganizerId(String(user.id));
    }
  }, [user?.id, organizerId]);

  const addAttendee = () => {
    setAttendees((prev) => [
      ...prev,
      { userId: "", isOrganizer: false, required: true },
    ]);
  };

  const updateAttendee = <K extends keyof AttendeeInput>(
    index: number,
    field: K,
    value: AttendeeInput[K]
  ) => {
    setAttendees((prev) => {
      const id = String(value);

      if (id === String(organizerId)) return prev;
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const removeAttendee = (index: number) => {
    setAttendees((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: EventFormValues) => {
    const seen = new Set<string>();

    const cleanAttendees = attendees.filter((a) => {
      if (!a.userId) return false;
      if (a.userId === organizerId) return false;
      if (seen.has(a.userId)) return false;

      seen.add(a.userId);
      return true;
    });

    const payload = {
      ...data,
      organizerId,
      attendees: cleanAttendees,
    };

    await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  };

  if (!organizerId) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ maxWidth: 900 }}>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 1, mt: 1 }}>
            Choose scope
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Select
            label="Data source"
            value={scope}
            onChange={(e) => setScope(e.target.value as DataScope)}
            fullWidth
          >
            <MenuItem value="visible">Visible</MenuItem>
            <MenuItem value="area" disabled={!user.areaId}>My Area ({user.areaId ?? "None"})</MenuItem>
            <MenuItem value="sector" disabled={!user.sectorId}>My Sector ({user.sectorId ?? "None"})</MenuItem>
            <MenuItem value="area-sector">Area → Sector</MenuItem>
            <MenuItem value="select-area">Select Area…</MenuItem>
            <MenuItem value="select-sector">Select Sector…</MenuItem>
            {user.role === "superAdmin" && (
              <MenuItem value="all">All Areas (Corporate)</MenuItem>
            )}
          </Select>
        </Grid>
        <Grid item xs={4}>
          {(scope === "area-sector" || scope === "select-area") && (
            <Grid item xs={12}>
              <Select
                label="Area"
                value={selectedArea}
                onChange={(e) => {
                  const val = String(e.target.value);
                  setSelectedArea(val);
                  setAreaId(val);
                }}
                fullWidth
              >
                {areas.map(a => (
                  <MenuItem key={a.id} value={a.id}>{a.name}</MenuItem>
                ))}
              </Select>
            </Grid>
          )}
        </Grid>
        <Grid item xs={4}>
          {(scope === "area-sector" || scope === "select-sector") && (
            <Grid item xs={12}>
              <Select
                label="Sector"
                value={selectedSector}
                onChange={(e) => {
                  const val = String(e.target.value);
                  setSelectedSector(val);
                  setSectorId(val);
                }}
                fullWidth
              >
                {sectors.map(s => (
                  <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                ))}
              </Select>
            </Grid>
          )}
        </Grid>
      </Grid>
      <Divider sx={{ mb: 2 }} />
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={2}>
          <Typography variant="h6">
            Organizer
          </Typography>
        </Grid>
        <Grid item xs={12} md={10} >
          <UserPicker
            currentUserName={user.name}
            value={organizerId}
            label="Organizer"
            users={mappedUsers}
            onChange={(id) => setOrganizerId(id)}
            isOrganizer={true}
            currentUserId={String(user.id)}
            
            excludedIds={[
              organizerId, // 🔥 FIX: organizátor je vždy zakázaný
              ...attendees
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
            locations={_locations ?? []}
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
                      field.onChange(newValue.valueOf());
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
                      field.onChange(newValue.valueOf());
                    }
                  }}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            )}
          />
        </Grid>
      </Grid>
      <Divider sx={{ mb: 2 }} />
      <Typography variant="h6" sx={{ mb: 2 }}>
        Appearance
      </Typography>

      <Grid container spacing={2} sx={{ mt: 4, mb: 2 }}>
        <Grid item xs={12} md={9}>
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
        <Grid item xs={12} md={1}>
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
              <IconButton onClick={() => setSettingsOpen(true)}>
                <Settings size={20} />
              </IconButton>
          }
            label="Advanced Settings"
          />
        </Grid>
      </Grid>
      <Divider sx={{ mb: 2 }} />
      <Grid container spacing={2} sx={{ mt: 2 }}>
          <Drawer
              variant="temporary"
              anchor="right"
              open={settingsOpen}
              onClose={() => setSettingsOpen(false)}
              PaperProps={{ sx: { width: isMobile ? "auto" : 370, p: 3, backgroundColor: "#dfecf1" } }}
            >
              <EventSettingsPanel
                feedbackEnabled={watch("feedbackEnabled")}
                notifyOrganizerOnFeedback={watch("notifyOrganizerOnFeedback")}
                notifyAttendeesOnUpdate={watch("notifyAttendeesOnUpdate")}
                notifyAttendeesBeforeStart={watch("notifyAttendeesBeforeStart")}
                deliveryOrganizerFeedbackApp={watch("deliveryOrganizerFeedbackApp")}
                deliveryOrganizerFeedbackEmail={watch("deliveryOrganizerFeedbackEmail")}
                deliveryAttendeesUpdateApp={watch("deliveryAttendeesUpdateApp")}
                deliveryAttendeesUpdateEmail={watch("deliveryAttendeesUpdateEmail")}
                deliveryAttendeesBeforeStartApp={watch("deliveryAttendeesBeforeStartApp")}
                deliveryAttendeesBeforeStartEmail={watch("deliveryAttendeesBeforeStartEmail")}
                onChange={(field, value) =>
                  setValue(field as keyof EventFormValues, value)
                }
                onClose={() => setSettingsOpen(false)}
              />
            </Drawer>

      </Grid>
      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        Attendees
      </Typography>

{attendees.map((a, i) => {
  const excluded = [
    organizerId,
    ...attendees
      .filter((_, idx) => idx !== i)
      .map((x) => x.userId),
  ].filter(Boolean) as string[];

const attendeeExcludedIds = [
  organizerId,
  ...attendees
    .filter((_, idx) => idx !== i)
    .map(a => a.userId)
].filter(id => id != null);


  return (
    <Paper key={i} sx={{ p: 2, mb: 2 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={4}>
          <UserPicker
            value={a.userId}
            onChange={(id) => updateAttendee(i, "userId", id)}
            users={mappedUsers}
            currentUserId={user.id}
            isOrganizer={false}
            currentUserName={user.name}
            excludedIds={attendeeExcludedIds}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            label="Required?"
            select
            fullWidth
            value={a.required ? "yes" : "no"}
            onChange={(e) =>
              updateAttendee(i, "required", e.target.value === "yes")
            }
          >
            <MenuItem value="yes">Required</MenuItem>
            <MenuItem value="no">Optional</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} md={2}>
          <IconButton color="error" onClick={() => removeAttendee(i)}>
            <DeleteIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Paper>
  );
})}

      <Button variant="outlined" onClick={addAttendee} sx={{ mb: 3 }}>
        Add Attendee
      </Button>

      <Button variant="contained" type="submit" fullWidth>
        Create Event
      </Button>
    </Box>
  );
}

interface UserPickerProps {
  value: string | undefined; // vždy string (prázdný = nic)
  onChange: (id: string) => void;
  users: User[];
  excludedIds?: string[];
  label?: string;
  fullwidth?: boolean;
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




