import { useForm, Controller } from "react-hook-form";
import { Users } from "lucide-react";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Typography,
  Grid,
  IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Tooltip,
  Avatar,
  Paper,
} from "@mui/material";

import { useAuth } from "@src/auth/AuthContext";
import { useCallback, useEffect, useMemo, useState } from "react";
import { UsersService } from "@src/services/users";
import { usePageLoader } from "@ui/hooks/UsePageLoader";
import dayjs, { Dayjs } from "dayjs";

import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import DeleteIcon from "@mui/icons-material/Delete";
import { ColorPickerField } from "@ui/primitives/ColorPickerField";

export interface User {
  id: string;
  name: string;
  email: string;
  position?: string;
  department?: string;
  avatarUrl?: string;
  fullName: string;
  avatar?: string;
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
}

interface UserPickerProps {
  value: string | undefined;
  isOrganizer: boolean;
  currentUserId: string;
  currentUserName: string;
  onChange: (id: string) => void;
  users: User[];
  excludedIds?: string[];
}

function sanitizeAttendeesInState(
  list: AttendeeInput[],
  organizerId: string
): AttendeeInput[] {
  const seen = new Set<string>();

  return list.filter((attendee) => {
    const id = attendee.userId?.trim();

    if (!id) return true;
    if (id === organizerId) return false;

    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  }).map((attendee) => ({
    ...attendee,
    userId: attendee.userId?.trim() || attendee.userId,
  }));
}

function sanitizeAttendeesForSubmit(
  list: AttendeeInput[],
  organizerId: string
): AttendeeInput[] {
  const seen = new Set<string>();

  return list.reduce<AttendeeInput[]>((acc, attendee) => {
    const id = attendee.userId?.trim();

    if (!id) return acc;
    if (id === organizerId) return acc;
    if (seen.has(id)) return acc;

    seen.add(id);
    acc.push({
      ...attendee,
      userId: id,
    });

    return acc;
  }, []);
}

export function EventForm({ endpoint }: EventFormProps) {
  const { user } = useAuth()!;
  const [organizerId, setOrganizerId] = useState<string | null>(null);
  const [attendees, setAttendees] = useState<AttendeeInput[]>([]);

  const { control, handleSubmit, register } = useForm<EventFormValues>({
    defaultValues: {
      name: "",
      locationId: "",
      startTime: Date.now(),
      endTime: Date.now() + 3600000,
      color: "#2196f3",
      type: "meeting",
      description: "",
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

  const { data } = usePageLoader(loadUsers);
const users = useMemo(() => {
  const list = Array.isArray(data) ? data : [];

  if (!user) return list;

  const normalizedUserId = String(user.id);

  const exists = list.some((u) => u.id === normalizedUserId);

  if (exists) return list;

  return [
    ...list,
    {
      id: normalizedUserId, // 🔥 FIX
      name: user.name,
      email: user.email,
      fullName: user.name,
    },
  ];
}, [data, user]);

useEffect(() => {
  if (!organizerId) return;

  setAttendees((prev) =>
    prev.filter((a) => a.userId !== organizerId)
  );
}, [organizerId]);


useEffect(() => {
  if (!organizerId && user?.id) {
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
        <Grid item xs={12} md={6}>
          <Typography variant="h6">
            Organizer
          </Typography>
        </Grid>
        <Grid item xs={12} md={6} >
          <UserPicker
            currentUserName={user.name}
            value={organizerId}
            label={user.id === organizerId ? "You" : "Organizer"}
            users={users}
             onChange={(id) => {
                setOrganizerId(id);
              }}
            isOrganizer={true}
            currentUserId={user.id}
            excludedIds={attendees
            .map(a => a.userId)
            .filter((id): id is string => typeof id === "string" && id.length > 0)}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
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
          <TextField
            label="Location ID"
            fullWidth
            {...register("locationId", { required: true })}
          />
        </Grid>
      </Grid>

      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        Time
      </Typography>

      <Grid container spacing={2}>
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

      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        Appearance
      </Typography>

      <Grid container spacing={2}>
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
            users={users}
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
}

function UserPicker({ 
  value, onChange, 
  users, 
  excludedIds = [], 
  label = "User", 
  currentUserId,
  currentUserName,
  isOrganizer 
}: UserPickerProps) {
  const [query, setQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const selectedUser = users.find(u => u.id === value);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return users.filter((u) => {
      if (excludedIds.includes(u.id)) return false;
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
      );
    });
  }, [query, users, excludedIds]);
const formatUserName = (u: User) => {
  const uid = String(u.id);
  const cid = String(currentUserId);

  if (uid !== cid) {
    return {
      text: u.name,
      jsx: u.name,
    };
  }

  return {
    text: `${u.name} (You)`,
    jsx: (
      <>
        {u.name} <span style={{ opacity: 0.5 }}>(You)</span>
      </>
    ),
  };
};

  return (
    <Box sx={{ position: "relative" }}>
      <TextField
        sx={{ width: 1 }}
        label={label}
        value={isEditing ? query : selectedUser ? formatUserName(selectedUser).text : ""}
        onFocus={() => setIsEditing(true)}
        onBlur={() => {
          setIsEditing(false);
          setQuery("");
        }}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={`Choose a ${label.toLowerCase()}`.trim()}
        InputProps={{
          endAdornment: (
            <Tooltip title="Select User" placement="top-end">
              <IconButton onClick={() => setOpenModal(true)}>
                <Users size={18} />
              </IconButton>
            </Tooltip>
          ),
        }}
      />

      {isEditing && query.trim() !== "" && filtered.length > 0 && (
        <Paper
          sx={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 10,
            maxHeight: 250,
            overflowY: "auto",
          }}
        >
          {filtered.map((u) => (
            <Box
              key={u.id}
              sx={{
                p: 1.5,
                cursor: "pointer",
                "&:hover": { backgroundColor: "action.hover" },
              }}
              onMouseDown={() => {
                onChange(u.id);
                setIsEditing(false);
                setQuery("");
              }}
            >
              <Typography>{formatUserName(u).jsx}</Typography>
              <Typography variant="caption">{u.email}</Typography>
            </Box>
          ))}
        </Paper>
      )}

      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="sm">
        <DialogTitle>Select User</DialogTitle>
        <DialogContent dividers>
          {users
          .filter(u => !excludedIds.includes(u.id)).length === 0 && (
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              No users found.
            </Typography>
          )}
          {users
            .filter(u => !excludedIds.includes(u.id))
            .map(u => (
              <Box
                key={u.id}
                sx={{
                  p: 1.5,
                  cursor: "pointer",
                  borderBottom: "1px solid #eee",
                  "&:hover": { backgroundColor: "action.hover" },
                }}
                onClick={() => {
                  onChange(u.id);
                  setOpenModal(false);
                  setIsEditing(false);
                  setQuery("");
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar src={u?.avatar} sx={{ mr: 2 }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography>{formatUserName(u).jsx}</Typography>
                    <Typography variant="caption">{u.email}</Typography>
                  </Box>
                </Box>
              </Box>
            ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}


