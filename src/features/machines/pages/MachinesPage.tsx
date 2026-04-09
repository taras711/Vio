
import { PageHeader } from "@core/ui/layout/PageHeader";
import { Card } from "@core/ui/primitives/Card";
import { Badge } from "@core/ui/primitives/Badge";
import { Grid, Box, Button, Typography } from "@mui/material";

const MOCK_MACHINES: Array<{ id: number; name: string; description: string; status: "ok" | "warning" | "error" }> = [
  { id: 1, name: "Stroj A", description: "Popis stroje A", status: "ok" },
  { id: 2, name: "Stroj B", description: "Popis stroje B", status: "warning" },
  { id: 3, name: "Stroj C", description: "Popis stroje C", status: "error" },
];

export function MachinesPage() {
  return (
    <>
      <PageHeader
        title="Stroje"
        subtitle="Přehled všech strojů ve výrobě"
        actions={<Button variant="contained">Přidat stroj</Button>}
      />

      <Grid container spacing={3}>
        {MOCK_MACHINES.map((m) => (
          <Grid item xs={12} sm={6} md={4} key={m.id}>
            <Card>
              <Typography variant="h6" fontWeight={600}>
                {m.name}
              </Typography>

              <Typography variant="body2" color="text.secondary" mt={1}>
                {m.description}
              </Typography>
              <Box mt={2}>
                <Badge status={m.status} />
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}