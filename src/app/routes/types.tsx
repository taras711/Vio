export interface RouteMeta {
  titleKey: string;
  breadcrumbKey: string;
  path: string;
  permission?: string;
  modify?: { fn: (resource: any, key: string, value: string) => any };
}

export interface RouteHandle {
  meta: RouteMeta;
}