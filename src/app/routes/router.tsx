// src/app/routes/router.tsx
import { createBrowserRouter } from "react-router-dom";
import { PageLayout } from "@ui/layout/PageLayout";
import { pages } from "./registry";
import type { RouteHandle } from "./types";
import { ProtectedRoute } from "./ProtectedRoute";
import { Component as LoginPage } from "@pages/login/Page";
import { SetupWizard } from "@features/setup/SetupWizard";
import { PublicRoute } from "./PublicRoute";
import { SetupRoute } from "./SetupRoute";

const pageModules = import.meta.glob("/src/core/ui/pages/**/Page.tsx", { eager: false });

console.log("PAGES FROM REGISTRY:", pages);

export const router = createBrowserRouter([
  // PUBLIC ROUTES
  {
    path: "/login",
    element: <PublicRoute><LoginPage /></PublicRoute>,
  },
  {
    path: "/setup",
    element: <SetupRoute><SetupWizard /></SetupRoute>,
  },

  // PROTECTED ROUTES
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <PageLayout />
      </ProtectedRoute>
    ),
    children: [
      ...Object.values(pages).map((p) => {
        const modulePath = `/src/core/ui/pages${p.modulePath}/Page.tsx`;

        const lazyLoader = async () => {
          const mod = (await pageModules[modulePath]()) as {
            Component: React.ComponentType;
          };

          // 🔥 DŮLEŽITÉ: používáme pojmenovaný export `Component`, ne `default`
          return { Component: mod.Component };
        };

        if (p.path === "/dashboard") {
          return {
            index: true,
            lazy: lazyLoader,
            handle: { meta: p } as RouteHandle,
          };
        }

        return {
          path: p.path.replace(/^\//, ""),
          lazy: lazyLoader,
          handle: { meta: p } as RouteHandle,
        };
      }),
    ],
  },
]);