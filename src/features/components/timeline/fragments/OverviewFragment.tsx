
import { Box, Typography, Chip, IconButton, Tooltip, AvatarGroup, Avatar, Divider, TextField, Button } from "@mui/material";
import { Close } from "@mui/icons-material";
import { ChevronLeft, ChevronRight, Icon, MessageCircleMore, Paperclip, CalendarArrowUp  } from "lucide-react";
import dayjs, { Dayjs } from "dayjs";
import type { FragmentMap, FragmentName, FragmentState, ChatMessage, EventDetail } from "../../../../../shared/types";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { CustomRangeDay } from "@ui/primitives/CustomRangeDay";
import { formatDateTime } from "@src/utils/dateUtils";
import RoomIcon from "@mui/icons-material/Room";
import { useEventDetail } from "../EventDetailContext";
import { useNavigate } from "react-router-dom";

export function OverviewFragment({
  openFragment
}: {
  openFragment: (name: FragmentName, props?: any) => void;
}) {
    const { event, setDetailEvent } = useEventDetail();

    const onClose = () => setDetailEvent(null);
    if(!event) return null;
    function getEventProgress(start: number, end: number): number {
        const now = Date.now();
        if (now <= start) return 0;
        if (now >= end) return 100;
        return Math.round(((now - start) / (end - start)) * 100);
    }
    return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        p: 2,
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Box>
        <Typography variant="h6" fontWeight={600}
        sx={{
            textDecoration: event.status === "cancelled" ? "line-through" : "none",
            color: event.status === "cancelled" ? "#000000b8" : "inherit",
            opacity: event.status === "cancelled" ? 0.5 : 1,
            // three dots for long titles
            WebkitLineClamp: 1,
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            textOverflow: "ellipsis",
            overflow: "hidden",
            cursor: "pointer",
        }}
        >
          {event.title}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.7, fontStyle: "italic", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "pre-line", textTransform: "capitalize" }}>
          {event.type}
        </Typography></Box>
        <IconButton onClick={onClose} sx={{ maxHeight: "fit-content" }}>
          <Close />
        </IconButton>
      </Box>

      {/* Status */}
      <Chip
        label={event.status}
        color={
          event.status === "cancelled"
            ? "error"
            : event.status === "completed"
            ? "success"
            : event.status === "in-progress"
            ? "warning"
            : "default"
        }
        //progress inside chip for in-progress events
        sx={{
            mb: 2,
            position: "relative",
            overflow: "hidden",
            color: "#fff",
            backgroundColor:
            event.status === "cancelled"
                ? "#b71c1c"
                : event.status === "completed"
                ? "#2e7d32"
                : event.status === "in-progress"
                ? "#f9a825"
                : "#1976d2",

            "&::before": event.status === "in-progress"
            ? {
                content: '""',
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: `${getEventProgress(event.start, event.end ?? event.start)}%`,
                backgroundColor: "rgba(255,255,255,0.25)",
                transition: "width 0.3s ease",
                }
            : {},
        }}
      />

      {/* Mini calendar */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <StaticDatePicker
            displayStaticWrapperAs="desktop"
            value={dayjs(event.start)}
            readOnly
            renderDay={(day, selectedDates, DayComponentProps) =>
                CustomRangeDay(
                    day,
                    selectedDates as Dayjs[],
                    DayComponentProps,
                    dayjs(event.start),
                    dayjs(event.end))
                }
                onChange={() => {}}
                renderInput={(params) => <TextField {...params} sx={{ display: "none" }} />}
        />
        </LocalizationProvider>
        <Divider sx={{ my: 2 }} />
      {/* Exact times */}
      <Typography variant="body2" sx={{ mb: 1 }}>
        Start: {formatDateTime(event.start)}
      </Typography>

      <Typography variant="body2" sx={{ mb: 2 }}>
        End: {formatDateTime(event.end ?? event.start)}
      </Typography>

      {/* Location */}
      {event?.location && (
        <Typography variant="body2" sx={{ mb: 2 }}>
          <RoomIcon fontSize="small" sx={{ mr: 1 }} color="action" />
          {event.location?.name}
        </Typography>
      )}
        <Divider />
      {/* Attendees */}
      {event.attendees.length > 0 && (
        <Box sx={{ display: "flex", mb: 2, alignItems: "center", mt: 2}}>
        <Box sx={{  width: "100%",display: "flex", mb: 2, alignItems: "center"}}>
            
            <Tooltip title={event?.organizer?.name + " (organizer)"} >
                <Avatar src={event?.organizer?.avatar ?? ""} sx={{ mr:1 }}/>
            </Tooltip>
            <AvatarGroup max={4}>
                {event.attendees.map((attendee) => (
                    <Tooltip key={attendee.id} title={`${attendee.name} (${attendee?.required ? "required" : "optional"})`}>
                        <Avatar key={attendee.id} src={attendee?.avatar ?? ""} />
                    </Tooltip>
                ))}
            </AvatarGroup>
            <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-end", ml: 1 }}>
                <IconButton onClick={() => openFragment("attendees")}>
                    <ChevronRight />
                </IconButton>
            </Box>
        </Box>
        
        </Box>
      )}

        {/* Description */}
      {event.description && (
        <Typography variant="body2" sx={{ mb: 2, whiteSpace: "pre-wrap" }}>
          {event.description}
        </Typography>
      )}
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <IconButton onClick={() => openFragment("chat")}>
        <MessageCircleMore />
      </IconButton>
      <IconButton onClick={() => openFragment("files")}>
        <Paperclip />
      </IconButton>
      <IconButton onClick={() => openFragment("comments")}>
        <CalendarArrowUp />
      </IconButton>
    </Box>
    </Box>
  );

}