export function SystemManagement({ section }: { section?: string }) {
    switch (section) {
        case "permissions-matrix":
            return <div>System permissions matrix</div>;
        case "role-management":
            return <div>System role management</div>;
        case "audit":
            return <div>System audit</div>;
        case "license-manager":
            return <div>System license manager</div>;
        case "api-keys":
            return <div>System api keys</div>;
        default:
            return <div>System management</div>;
    }
}