// Sidebar route metadata
export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    extralink: boolean;
    submenu: RouteInfo[];
  }

  export interface RouteInfoAdmin {
    path: string;
    title: string;
    icon: string;
    class: string;
    extralink: boolean;
    submenu: RouteInfo[];
  }
/*
interface sidebarSubItem {
    titulo: string;
    icono: string;
    url: string;
}


export interface sidebarItem {
    titulo: string;
    icono: string;
    sub: boolean;
    class?: string;
    url?: string;
    subMenu?: sidebarSubItem[];
}*/
