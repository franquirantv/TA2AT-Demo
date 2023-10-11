import { RouteInfo, RouteInfoAdmin } from '../../interfaces/sidebar.inteface';


export const ROUTES: RouteInfo[] = [
  
  {
    path: '/estudio/dashboard',
    title: 'Dashboard',
    icon: 'bi bi-speedometer2',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '/estudio/misdisenos',
    title: 'Mis diseños',
    icon: 'bi bi-images',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '/estudio/mensajes',
    title: 'Mensajes',
    icon: 'bi bi-envelope',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '/estudio/alert',
    title: 'Notificaciones',
    icon: 'bi bi-bell',
    class: '',
    extralink: false,
    submenu: []
  }  

];

export const ROUTES2: RouteInfoAdmin[] = [

  {
    path: '/admin/dashboard',
    title: 'Admin Dashboard',
    icon: 'bi bi-speedometer2',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '/admin/usuarios',
    title: 'Usuarios',
    icon: 'bi bi-people',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '/admin/alert',
    title: 'Notificaciones',
    icon: 'bi bi-bell',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '/admin/mensajes',
    title: 'Mensajes',
    icon: 'bi bi-envelope',
    class: '',
    extralink: false,
    submenu: []
  },

];
