export interface RouteMeta {
  titleKey: string;
  breadcrumbKey: string;
  path: string;
  permission?: string;
}

export interface RouteHandle {
  meta: RouteMeta;
}