import { EventForm, type AttendeeInput, type EventFormValues} from "@pages/forms/add/EventForm";
import { useState } from "react";
import { Drawer, useMediaQuery } from "@mui/material";
import { useScopedData, type DataScope } from "@src/lib/hooks/useScopedData";
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
interface EventFormDrawerProps {
  open: boolean;
  eventId?: string | null;
  onClose: () => void;
  onOpenSettings: () => void;
  event?: EventFormValues | null;
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
  allDay?: boolean;
  isPrivate?: boolean;
  mappedUsers: any[];
  locations: any[];
  status?: "scheduled" | "in-progress" | "cancelled" | "completed";

  onStatusChange: (status: "scheduled" | "in-progress" | "cancelled" | "completed") => void;
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
  handleDelete: (id: string) => void;
  removeAttendee: (index: number) => void;
  onIsPrivateChange: (v: boolean | undefined) => void;
  onAllDayChange: (v: boolean | undefined) => void;
}

export function EventFormDrawer(props: EventFormDrawerProps) {
  const isMobile = useMediaQuery("(max-width: 600px)", { noSsr: true });

  
  return (
    <Drawer
      anchor="right"
      open={props.open}
      onClose={props.onClose}
      PaperProps={{
        sx: {
          width: isMobile ? "stretch" : 420,
          p: 3,
          backgroundColor: "#dfecf1"
        }
      }}
      ModalProps={{
        keepMounted: true,
        disableEnforceFocus: true,
        disableAutoFocus: true,
        disableRestoreFocus: true
      }}
    >
      <EventForm
        user={props.user as User}
        endpoint="/api/events"
        eventId={props.eventId || ""}
        onOpenSettings={props.onOpenSettings}
        organizerId={props.organizerId}
        attendees={props.attendees}
        areas={props.areas}
        sectors={props.sectors}
        selectedArea={props.selectedArea}
        selectedSector={props.selectedSector}
        areaId={props.areaId}
        sectorId={props.sectorId}
        scope={props.scope}
        isRecurring={props.isRecurring}
        repeatType={props.repeatType}
        interval={props.interval}
        selectedDays={props.selectedDays}
        endType={props.endType}
        occurrenceCount={props.occurrenceCount}
        endDate={props.endDate}
        allDay={props.allDay}
        isPrivate={props.isPrivate}
        onAllDayChange={props.onAllDayChange}
        onIsPrivateChange={props.onIsPrivateChange}
        mappedUsers={props.mappedUsers}
        locations={props.locations}
        onOrganizerChange={props.onOrganizerChange}
        onAttendeesChange={props.onAttendeesChange}
        onAreaChange={props.onAreaChange}
        onSectorChange={props.onSectorChange}
        onSelectedAreaChange={props.onSelectedAreaChange}
        onSelectedSectorChange={props.onSelectedSectorChange}
        onScopeChange={props.onScopeChange}
        onRecurringChange={props.onRecurringChange}
        onRepeatTypeChange={props.onRepeatTypeChange}
        onIntervalChange={props.onIntervalChange}
        toggleDay={props.toggleDay}
        onEndTypeChange={props.onEndTypeChange}
        onOccurrenceCountChange={props.onOccurrenceCountChange}
        onEndDateChange={props.onEndDateChange}
        onSubmit={props.onSubmit}
        addAttendee={props.addAttendee}
        updateAttendee={props.updateAttendee}
        removeAttendee={props.removeAttendee}
        closeDrawer={props.onClose}
        status={props.status ?? "scheduled"}
        onStatusChange={props.onStatusChange}
        handleDelete={props.handleDelete}
      />

    </Drawer>
  );
}
