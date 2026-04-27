// src/app/routes/router.tsx
import { createBrowserRouter } from "react-router-dom";
import { PageLayout } from "@ui/layout/PageLayout";
import { pages } from "./registry";
import { ProtectedRoute } from "./ProtectedRoute";
import { Component as LoginPage } from "@pages/login/Page";
import { SetupWizard } from "@features/setup/SetupWizard";
import { PublicRoute } from "./PublicRoute";
import { SetupRoute } from "./SetupRoute";
import { RouteErrorPage } from "./RouteErrorPage";

const pageModules = import.meta.glob("/src/core/ui/pages/**/Page.tsx", { eager: false });

console.log("PAGES FROM REGISTRY:", pages);

export const router = createBrowserRouter([
  // PUBLIC ROUTES
  {
    path: "/login",
    element: (
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
    ),
    errorElement: <RouteErrorPage />,   // 🔥 TADY
  },
  {
    path: "/setup",
    element: (
        <SetupRoute>
          <SetupWizard />
        </SetupRoute>
    ),
    errorElement: <RouteErrorPage />,   // 🔥 TADY
  },


  // PROTECTED ROUTES
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <PageLayout />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorPage />,
children: [

{
  path: "new/:type",
  lazy: async () => {
    const mod = await import("@pages/new/CreatePage");
    return { Component: mod.Component };
  },
  handle: {
    meta: {
      path: "/new/:type",
      titleKey: "addCreate.title",
      breadcrumbKey: "addCreate.breadcrumb",
    }
  }
},
  ...Object.values(pages).map((p) => {
    const modulePath = `/src/core/ui/pages${p.modulePath}/Page.tsx`;

    const lazyLoader = async () => {
      const mod = (await pageModules[modulePath]()) as {
        Component: React.ComponentType;
      };
      return { Component: mod.Component };
    };

    if (p.path === "/dashboard") {
      return {
        index: true,
        lazy: lazyLoader,
        handle: { meta: p },
        errorElement: <RouteErrorPage />,
      };
    }

    return {
      path: p.path.replace(/^\//, ""),
      lazy: lazyLoader,
      handle: { meta: p },
      errorElement: <RouteErrorPage />,
    };
  }),
]

  },
]);
