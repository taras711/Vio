import { useState, useMemo, useEffect } from "react";
import { Box, Paper } from "@mui/material";
import { Calendar, momentLocalizer } from "react-big-calendar"; // npm install react-big-calendar
import moment from "moment"; // npm install moment
import { useAuth } from "@src/auth/AuthContext";

import { EventFormDrawer } from "./EventFormDrawer";
import { EventSettingsDrawer } from "@ui/fragments/events/EventSettingsDrawer";

import "react-big-calendar/lib/css/react-big-calendar.css";
import type { AttendeeInput, EventFormValues } from "../forms/add/EventForm";
import { FormProvider, useForm } from "react-hook-form";
import { mapAttendeeToUser } from "@src/utils/mapAttendeeToUser";
import { useScopedData, type DataScope } from "@src/lib/hooks/useScopedData";
import dayjs, { Dayjs } from "dayjs";
import { AreasService } from "@src/services/area/AreasService";
import { SectorsService } from "@src/services/sector/SectorsService";
import type { EventSettingsKeys } from "../../fragments/events/EventSettingsPanel";
import api from "@src/utils/api";
import { useActionFeedback } from "@hooks/ActionFeedback";

const localizer = momentLocalizer(moment);

export function CalendarPage() {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState<EventFormValues | null>(null);
    const { user } = useAuth()!;
    
    const [organizerId, setOrganizerId] = useState<string | null>(null);

    const [attendees, setAttendees] = useState<AttendeeInput[]>([]);

    const [areas, setAreas] = useState<any[]>([]);
    const [sectors, setSectors] = useState<any[]>([]);

    const [selectedArea, setSelectedArea] = useState<string | null>(null);
    const [selectedSector, setSelectedSector] = useState<string | null>(null);

    const [areaId, setAreaId] = useState<string | null>(null);
    const [sectorId, setSectorId] = useState<string | null>(null);
    // Recurrence state
    const [isRecurring, setIsRecurring] = useState(false);
    const [repeatType, setRepeatType] = useState<"daily" | "weekly" | "monthly">("weekly");
    const [interval, setInterval] = useState(1);
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [endType, setEndType] = useState<"never" | "after" | "until">("never");
    const [occurrenceCount, setOccurrenceCount] = useState<number>(1);
    const [endDate, setEndDate] = useState<number | null>(null);

    const [eventFormOpen, setEventFormOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const { success, error } = useActionFeedback();



    const formMethods = useForm<EventFormValues>({
        defaultValues: selectedEvent ?? {}
    });

    const [scope, setScope] = useState<DataScope>("visible");

    useEffect(() => {
        if (user?.role) {
        setScope(user.role === "superAdmin" ? "all" : "visible");
        }
    }, [user?.role]);
    
    const resolvedAreaId =
        scope === "area" ? user.areaId :
        scope === "select-area" ? selectedArea :
        scope === "area-sector" ? selectedArea :
        scope === "area-visibility" ? selectedArea :
        scope === "area-sector-visibility" ? selectedArea :
        null;
    
    const resolvedSectorId =
        scope === "sector" ? user.sectorId :
        scope === "select-sector" ? selectedSector :
        scope === "area-sector" ? selectedSector :
        scope === "area-sector-visibility" ? selectedSector :
        scope === "select-area-sector" ? selectedSector :
        null;
    
    const { locations: _locations, attendees: candidateAttendees, loading: _loading } = useScopedData(
        scope,
        resolvedAreaId,
        resolvedSectorId
    );

    const loadEvents = async () => {
        const res = await api.get("/events");
        const raw = res.data;

        const mapped = raw.map((e: any) => ({
            id: e.id,
            title: e.name,
            start: new Date(e.startTime),
            end: new Date(e.endTime),
            allDay: !!e.allDay,
            isPrivate: !!e.isPrivate,
            color: e.color,
            type: e.type,
            raw: e
        }));


        setEvents(mapped);
    };

    useEffect(() => {
        loadEvents();
    }, []);
    
    const mappedUsers = useMemo(() => {
        return (candidateAttendees ?? []).map(a => ({
        ...mapAttendeeToUser(a),
        id: String(a.id),
        }));
    }, [candidateAttendees]);

    useEffect(() => {
        if (selectedEvent) {
            formMethods.reset(selectedEvent);
        }
    }, [selectedEvent]);

    useEffect(() => {
        if (!organizerId) {
            console.warn("No organizerId set, skipping attendee filter");
            return;
        }

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
        if (user?.id) {
            setOrganizerId(String(user.id));
        }
    }, [user?.id]);

    useEffect(() => {
        if (user?.id && organizerId === undefined) {
            setOrganizerId(String(user.id));
        }
    }, [user?.id, organizerId]);

    useEffect(() => {
        if (isRecurring) {
            setRepeatType("weekly");
        }
    }, [isRecurring]);

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

    function toggleDay(day: string) {
        setSelectedDays(prev =>
            prev.includes(day)
            ? prev.filter(d => d !== day)
            : [...prev, day]
        );
    }

    const removeAttendee = (index: number) => {
    setAttendees((prev) => prev.filter((_, i) => i !== index));
    };

    function computeStatus(start: number, end: number, dbStatus: string) {
        const now = Date.now();

        // ruční override
        if (dbStatus === "cancelled") return "cancelled";

        // ruční override
        if (dbStatus === "completed") return "completed";

        // automatika
        if (now < start) return "scheduled";
        if (now >= start && now <= end) return "in-progress";
        if (now > end) return "completed";

        return "scheduled";
    }


const onSubmit = async (data: EventFormValues) => {
  const seen = new Set<string>();
  let recurrenceRule = null;

  // --- CLEAN ATTENDEES ---
  const cleanAttendees = attendees.filter((a) => {
    if (!a.userId) return false;
    if (a.userId === organizerId) return false;
    if (seen.has(a.userId)) return false;
    seen.add(a.userId);
    return true;
  });

  // --- RECURRENCE ---
  if (isRecurring) {
    const parts: string[] = [];
    parts.push(`FREQ=${repeatType.toUpperCase()}`);
    if (interval > 1) parts.push(`INTERVAL=${interval}`);
    if (repeatType === "weekly" && selectedDays.length > 0)
      parts.push(`BYDAY=${selectedDays.join(",")}`);
    if (endType === "after") {
      parts.push(`COUNT=${occurrenceCount}`);
    } else if (endType === "until") {
      parts.push(`UNTIL=${dayjs(endDate).format("YYYYMMDD[T]HHmmss[Z]")}`);
    }
    recurrenceRule = parts.join(";");
  }

  // --- PAYLOAD ---
  const payload = {
    ...data,
    organizerId,
    isRecurring,
    recurrenceRule,
    recurrenceEnd: endType === "until" ? endDate : null,
    recurrenceCount: endType === "after" ? occurrenceCount : null,
    allDay: selectedEvent?.allDay ?? false,
    isPrivate: selectedEvent?.isPrivate ?? false,
    status: selectedEvent?.status ?? "scheduled"
  };

  const { attendees: _ignored, ...eventPayload } = payload;

  let eventId = selectedEvent?.id;

  // --- CREATE ---
  if (!eventId) {
    const res = await api.post("/events", eventPayload);
    eventId = res.data.id;

    for (const a of cleanAttendees) {
      await api.post(`/events/${eventId}/attendees`, a);
    }
  }

  // --- UPDATE ---
  else {
    await api.put(`/events/${eventId}`, eventPayload);

    await api.delete(`/events/${eventId}/attendees`);

    for (const a of cleanAttendees) {
      await api.post(`/events/${eventId}/attendees`, a);
    }
  }

  await loadEvents();
  setEventFormOpen(false);
};




  // --- Handlers ---
  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    setSelectedEvent(null); // ← KLÍČOVÉ

    setAttendees([]); // ← nový event = žádní attendees
    setSelectedEvent({
    startTime: dayjs(start).startOf("day").valueOf(),
    endTime: dayjs(end).endOf("day").valueOf(),
      name: "",
      locationId: "",
      color: "#2196f3",
      type: "meeting",
      feedbackEnabled: false,
      notifyOrganizerOnFeedback: false,
      notifyAttendeesOnUpdate: false,
      notifyAttendeesBeforeStart: false,
      deliveryOrganizerFeedbackApp: false,
      deliveryOrganizerFeedbackEmail: false,
      deliveryAttendeesUpdateApp: false,
      deliveryAttendeesUpdateEmail: false,
      deliveryAttendeesBeforeStartApp: false,
      deliveryAttendeesBeforeStartEmail: false,
      isRecurring: false
    });

    setEventFormOpen(true);
  };

    const handleAllDayChange = (v: boolean | undefined) => {
        setSelectedEvent(prev =>
            prev ? { ...prev, allDay: !!v } : prev
        );
    };

    const handleIsPrivateChange = (v: boolean | undefined) => {
        setSelectedEvent(prev =>
            prev ? { ...prev, isPrivate: !!v } : prev
        );
    };

    const handleSelectEvent = async (event: any) => {
        try {
        const raw = event.raw;

        // 1) načíst attendees
        const res = await api.get(`/events/${raw.id}/attendees`);
        const attendees = res.data;

        const dynamicStatus = computeStatus(raw.startTime, raw.endTime, raw.status);

        // 2) nastavit kompletní event
        setSelectedEvent({
            ...raw,
            attendees,
            status: dynamicStatus // ← přidáme status pro zobrazení v EventForm
        });

        setAttendees(attendees); // pokud používáš externí state
        setOrganizerId(String(raw.organizerId));
        // 3) až teď otevřít drawer
        setEventFormOpen(true);
        } catch (err) {
            console.error("Load event details error:", err);
            error("Failed to load event details");
        }
    };

    const handleDeleteEvent = async (eventId: string) => {
        try {
            await api.delete(`/events/${eventId}`);
            await loadEvents();
            success("Event deleted successfully");
            setEventFormOpen(false);
        } catch (err) {
            console.error("DELETE EVENT ERROR:", err);
            error("Failed to delete event");
        }
    };

    const handleStatusChange = (status: "scheduled" | "in-progress" | "cancelled" | "completed") => {
        setSelectedEvent(prev =>
            prev ? { ...prev, status } : prev
        );
    };

     const handleSettingsChange = (field: EventSettingsKeys, value: boolean) => {
        setSelectedEvent(prev =>
            prev ? { ...prev, [field]: value } : prev
        );
    };

    return (
    <FormProvider {...formMethods}>
        <Paper sx={{ height: "100vh", p: 2 }}>
        <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            selectable
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            style={{ height: "100%" }}
            eventPropGetter={(event) => {
                const status = event.raw?.status;
                if (status === "scheduled") {
                    return {
                        style: {
                            borderLeft: "5px solid #2196f3",
                            backgroundColor: `${event.color} !important`,
                            borderColor: event?.color ?? "#c1e3ff",
                            color: "#fff"
                        }
                    };
                }
                if (status === "cancelled") {
                    return {
                        style: {
                            backgroundColor: event.color,
                            color: "#fff",
                            textDecoration: "line-through",
                            opacity: 0.5,
                            borderLeft: "5px solid #d32f2f",
                            borderColor: event?.color ?? "#505d68",
                        }
                    };
                }

                if (status === "in-progress") {
                    return {
                        style: {
                            borderLeft: "5px solid #ff9800",
                            backgroundColor: event.color,
                            color: "#fff"
                        }
                    };
                }

                if (status === "completed") {
                    return {
                        style: {
                            borderLeft: "5px solid #29dd32",
                            backgroundColor: event.color,
                            color: "#fff"
                        }
                    };
                }

                return {
                    style: {
                        
                        borderColor: event?.color ?? "#c1e3ff",
                        backgroundColor: event.color,
                        color: "#fff"
                    }
                }
            }}
        />

        <EventFormDrawer
        user={user!}
        eventId={selectedEvent?.id ?? null}
        open={eventFormOpen}
        onClose={() => setEventFormOpen(false)}
        event={selectedEvent}
        organizerId={organizerId}
        attendees={attendees}
        areas={areas}
        sectors={sectors}
        selectedArea={selectedArea}
        selectedSector={selectedSector}
        areaId={areaId}
        sectorId={sectorId}
        scope={scope}
        isRecurring={isRecurring}
        repeatType={repeatType}
        interval={interval}
        selectedDays={selectedDays}
        endType={endType}
        occurrenceCount={occurrenceCount}
        endDate={endDate}
        mappedUsers={mappedUsers}
        locations={_locations ?? []}
        status={selectedEvent?.status}
        onStatusChange={handleStatusChange}
        addAttendee={addAttendee}
        updateAttendee={updateAttendee}
        removeAttendee={removeAttendee}
        allDay={selectedEvent?.allDay ?? false}
        isPrivate={selectedEvent?.isPrivate ?? false}
        onAllDayChange={handleAllDayChange}
        onIsPrivateChange={handleIsPrivateChange}
        onOrganizerChange={setOrganizerId}
        onAttendeesChange={setAttendees}
        onAreaChange={setAreaId}
        onSectorChange={setSectorId}
        onSelectedAreaChange={setSelectedArea}
        onSelectedSectorChange={setSelectedSector}
        onScopeChange={setScope}
        onRecurringChange={setIsRecurring}
        onRepeatTypeChange={setRepeatType}
        onIntervalChange={setInterval}
        toggleDay={toggleDay}
        onEndTypeChange={setEndType}
        onOccurrenceCountChange={setOccurrenceCount}
        onEndDateChange={setEndDate}
        onSubmit={onSubmit}
        handleDelete={handleDeleteEvent}
        onOpenSettings={() => {
            setEventFormOpen(false);
            setSettingsOpen(true);
        }}
        />


        <EventSettingsDrawer
            values={{
            feedbackEnabled: selectedEvent?.feedbackEnabled ?? false,
            notifyOrganizerOnFeedback: selectedEvent?.notifyOrganizerOnFeedback ?? false,
            notifyAttendeesOnUpdate: selectedEvent?.notifyAttendeesOnUpdate ?? false,
            notifyAttendeesBeforeStart: selectedEvent?.notifyAttendeesBeforeStart ?? false,
            deliveryOrganizerFeedbackApp: selectedEvent?.deliveryOrganizerFeedbackApp ?? false,
            deliveryOrganizerFeedbackEmail: selectedEvent?.deliveryOrganizerFeedbackEmail ?? false,
            deliveryAttendeesUpdateApp: selectedEvent?.deliveryAttendeesUpdateApp ?? false,
            deliveryAttendeesUpdateEmail: selectedEvent?.deliveryAttendeesUpdateEmail ?? false,
            deliveryAttendeesBeforeStartApp: selectedEvent?.deliveryAttendeesBeforeStartApp ?? false,
            deliveryAttendeesBeforeStartEmail: selectedEvent?.deliveryAttendeesBeforeStartEmail ?? false,
            }}
            onChange={handleSettingsChange}

            open={settingsOpen}
            onClose={() => {
            setSettingsOpen(false);
            setEventFormOpen(true);
            }}
            isRecurring={selectedEvent?.isRecurring}
        />
        </Paper>
    </FormProvider>
    );

}
