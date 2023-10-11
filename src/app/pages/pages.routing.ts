import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { AuthGuard2 } from '../guards/auth2.guard';
import { CommonModule } from '@angular/common';

import { InicioComponent } from './inicio/inicio.component';
import { ExplorarComponent } from './explorar/explorar.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { PlanesComponent } from './planes/planes.component';
import { NgbdAlertBasicComponent } from './alert/alert.component';
import { MensajesComponent } from './mensajes/mensajes.component';
import { ContactoComponent } from './contacto/contacto.component';
import { MisdisenosComponent } from './misdisenos/misdisenos.component';
import { SubirdisenoComponent } from './subirdiseno/subirdiseno.component';
import { VerificacionCuentaComponent } from './verificacion-cuenta/verificacion-cuenta.component';
import { AvisoLegalComponent } from './aviso-legal/aviso-legal.component';
import { PrivacidadComponent } from './privacidad/privacidad.component';
import { PoliticaCookiesComponent } from './politica-cookies/politica-cookies.component';
import { ApiDocsComponent } from './api-docs/api-docs.component';
import { AdminComponent } from './admin/admin.component';
import { EstudioComponent } from './estudio/estudio.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { DisenoComponent } from './diseno/diseno.component';
import { DesignEstudioComponent } from './design-estudio/design-estudio.component';
import { OpendataComponent } from './opendata/opendata.component';
import { EditarPerfilComponent } from './editar-perfil/editar-perfil.component';


const routes: Routes = [
  { path: 'verificacion', component: VerificacionCuentaComponent, canActivate: [AuthGuard2], data: {rol: '*'}},
  { path: 'explorar', component: ExplorarComponent, canActivate: [AuthGuard2], data: {rol: '*'}},
  { path: 'planes', component: PlanesComponent, canActivate: [AuthGuard2], data: {rol: '*'}},
  { path: 'contacto', component: ContactoComponent, canActivate: [AuthGuard2], data: {rol: '*'}},
  { path: 'aviso-legal', component: AvisoLegalComponent, canActivate: [AuthGuard2], data: {rol: '*'}},
  { path: 'privacidad', component: PrivacidadComponent, canActivate: [AuthGuard2], data: {rol: '*'}},
  { path: 'api-docs', component: ApiDocsComponent, canActivate: [AuthGuard2], data: {rol: 'ROL_ADMIN'}},
  { path: 'politica-cookies', component: PoliticaCookiesComponent, canActivate: [AuthGuard2], data: {rol: '*'}},
  { path: 'opendata', component: OpendataComponent, canActivate: [AuthGuard2], data: {rol: '*'}},
  { path: 'editar-perfil', component: EditarPerfilComponent, canActivate: [AuthGuard2], data: {rol: '*'}},
  { path: 'admin', component: AdminComponent, data: {rol: 'ROL_ADMIN'},
  children: [
    {
      path: 'dashboard',
      loadChildren: () => import('../dashboard/dashboard.module').then(m => m.DashboardModule), data: {rol: 'ROL_ADMIN'},
    },
    {
      path: 'usuarios',
      component: UsuariosComponent, data: {rol: 'ROL_ADMIN'},
    },
    {
      path: 'alert',
      component: NgbdAlertBasicComponent, data: {rol: 'ROL_ADMIN'},
    },
    {
      path: 'mensajes',
      component: MensajesComponent, data: {rol: 'ROL_ADMIN'},
    },
    { path: 'usuarios/usuario/:uid', component: UsuarioComponent, canActivate: [ AuthGuard ], data: {
      rol: 'ROL_ADMIN'}
    },
    { path: '**', redirectTo: 'dashboard'}
  ]},
  { path: 'estudio', component: EstudioComponent, data: {rol: 'ROL_ESTUDIO'},
  children: [
    {
      path: 'dashboard',
      loadChildren: () => import('../dashboard/dashboard.module').then(m => m.DashboardModule), data: {rol: 'ROL_ESTUDIO'},
    },
    {
      path: 'misdisenos',
      component: MisdisenosComponent, data: {rol: 'ROL_ESTUDIO'},
    },
    {
      path: 'alert',
      component: NgbdAlertBasicComponent, data: {rol: 'ROL_ESTUDIO'},
    },
    {
      path: 'subirdiseno',
      component: SubirdisenoComponent, data: {rol: 'ROL_ESTUDIO'},
    },
    {
      path: 'mensajes',
      component: MensajesComponent, data: {rol: 'ROL_ESTUDIO'},
    },
    { path: 'misdisenos/diseno/:uid',
      component: DisenoComponent, data: {rol: 'ROL_ESTUDIO'}
    },
    { path: 'misdisenos/design-estudio/:uid',
      component: DesignEstudioComponent, data: {rol: 'ROL_ESTUDIO'}
    },
    { path: '**', redirectTo: 'dashboard'}
  ]},
  { path: '**', component: InicioComponent, canActivate: [AuthGuard2], data: {rol: '*'},
    children: [
    { path: '**', redirectTo: 'inicio'}
  ]},

];




@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ],
  exports: [RouterModule]
})
export class PagesRoutingModule { }

