import type { FragmentState, FragmentName, EventDetail } from "../../../../../shared/types";
import { Box, AvatarGroup, Avatar, Tooltip, Typography, Card, CardContent, CardMedia } from "@mui/material";
import noImage from "@assets/no-avatar.png";
import { FragmentHeader } from "@ui/primitives/FragmentHeader";
import { useEventDetail } from "../EventDetailContext";
export function AttendeesFragment({
  openFragment
}: {
  openFragment: (name: FragmentName, props?: any) => void;
}) {
    const { event } = useEventDetail();

//   const { event }: { event: EventDetail } = params;
    if(!event) return null;
    const organizer = event.organizer;
    const others = event.attendees.filter(a => a.id !== organizer?.id);

  return (
    <>
        <FragmentHeader
            name={`Attendees (${event.attendees.length})`}
            description={`${event.type}: ${event?.title}`}
            onBack={() => openFragment("overview")}
        />
            <Box sx={{ p: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, opacity: 0.7 }}>
                Organizátor
            </Typography>

            <Card sx={{ display: "flex", alignItems: "center", p: 2, bgcolor: "#e8f4ff" }}>
                <CardMedia
                component="img"
                image={organizer?.avatar || noImage}
                alt={organizer?.name}
                sx={{ width: 70, height: 70, borderRadius: "50%" }}
                />

                <Box sx={{ ml: 2 }}>
                <Typography variant="body1" fontWeight={600}>
                    {organizer?.name}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    Organizátor události
                </Typography>
                </Box>
            </Card>
            </Box>
            <Box sx={{ p: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, opacity: 0.7 }}>
                    Účastníci
                </Typography>

                <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                    {others.map(attendee => (
                    <Card
                        key={attendee.id}
                        sx={{
                        m: 1,
                        width: "calc(50% - 16px)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center"
                        }}
                    >
                        <CardMedia
                            component="img"
                            image={attendee.avatar || noImage}
                            alt={attendee.name}
                            sx={{ width: "100%", height: 100 }}
                        />

                        <CardContent
                            sx={{
                                width: "100%",
                                textAlign: "center",
                                bgcolor: "#dfecf1"
                            }}
                            >
                            <Typography variant="body2">{attendee.name}</Typography>
                        </CardContent>
                    </Card>
                    ))}
                </Box>
                </Box>

    </>
  )
}