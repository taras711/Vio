import { List } from "@mui/material";

export function setList({ array }: { array: any[] }) {
    return (
        <List className="list" disablePadding>
            {array.map((item) => item)}
        </List>
    );
}
