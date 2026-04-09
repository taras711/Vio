export function MachinesManagement({ section }: { section?: string }) {
    switch (section) {
        case "administration":
            return <div>Machines administration</div>;
        case "maintenance":
            return <div>Machines maintenance</div>;
        default:
            return <div>Machines management</div>;
    }
}