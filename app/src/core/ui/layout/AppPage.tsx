// src/core/ui/layout/AppPage.tsx
import { PageHeaderPanel } from "./PageHeaderPanel";

export function AppPage({
  title,
  subtitle: _subtitle,
  actions: _actions,
  breadcrumbs,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  breadcrumbs?: string[];
  children: React.ReactNode;
}) {
  return (
    <>
      <PageHeaderPanel title={title} breadcrumbs={breadcrumbs} />
      {children}
    </>
  );
}