export const pages = {
    dashboard: {
    path: "/dashboard",
    titleKey: "dashboard.title",
    breadcrumbKey: "dashboard.breadcrumb",
    modulePath: "/dashboard",
    },
  machines: {
    path: "/machines",
    titleKey: "machines.title",
    breadcrumbKey: "machines.breadcrumb",
    modulePath: "/machines",
  },
  issues: {
    path: "/issues",
    titleKey: "issues.title",
    breadcrumbKey: "issues.breadcrumb",
    modulePath: "/issues",
  },
  new: {
    path: "/new",
    titleKey: "new.title",
    breadcrumbKey: "new.breadcrumb",
    modulePath: "/new",
  },
  reports: {
    path: "/reports",
    titleKey: "reports.title",
    breadcrumbKey: "reports.breadcrumb",
    modulePath: "/reports",
  },
  settings: {
    path: "/settings",
    titleKey: "settings.title",
    breadcrumbKey: "settings.breadcrumb",
    modulePath: "/settings",
  },
  users: {
    path: "/users",              // URL
    titleKey: "users.title",
    breadcrumbKey: "users.breadcrumb",
    permission: "users.view",
    modulePath: "/users",        // FS cesta
  },
  userDetail: {
    path: "/users/:id",          // URL
    titleKey: "userDetail.title",
    breadcrumbKey: "userDetail.breadcrumb",
    permission: "users.view",
    modulePath: "/userDetail",   // FS cesta
  },
  userAdminTools: {
    path: "/users/:id/admin",
    titleKey: "userAdminTools.title",
    breadcrumbKey: "userAdminTools.breadcrumb",
    permission: "users.superadmin",
    modulePath: "/userAdminTools",
  },
  management: {
    path: "/management",
    titleKey: "management.title",
    breadcrumbKey: "management.breadcrumb",
    modulePath: "/management",
  },


};