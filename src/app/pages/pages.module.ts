import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { InicioComponent } from './inicio/inicio.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { MisdisenosComponent } from './misdisenos/misdisenos.component';
import { SubirdisenoComponent } from './subirdiseno/subirdiseno.component';
import { ExplorarComponent } from './explorar/explorar.component';
import { PlanesComponent } from './planes/planes.component';
import { SidebarDashboardComponent } from '../commons/sidebar-dashboard/sidebar-dashboard.component';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { VerificacionCuentaComponent } from './verificacion-cuenta/verificacion-cuenta.component';
import { PrivacidadComponent } from './privacidad/privacidad.component';
import { PoliticaCookiesComponent } from './politica-cookies/politica-cookies.component';
import { ApiDocsComponent } from './api-docs/api-docs.component';
import { AdminComponent } from './admin/admin.component';
import { EstudioComponent } from './estudio/estudio.component';
import { SidebarAdminComponent } from '../commons/sidebar-admin/sidebar-admin.component';
import { PaginationComponent } from '../components/pagination/pagination.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbdAlertBasicComponent } from './alert/alert.component';
import { DisenoComponent } from './diseno/diseno.component'
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown'
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';


import {MatTabsModule} from '@angular/material/tabs';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { ContactoComponent } from './contacto/contacto.component';
import { BadgeComponent } from '../components/badge/badge.component';
import { DesignEstudioComponent } from './design-estudio/design-estudio.component';
import { OpendataComponent } from './opendata/opendata.component';

import { DndDirective } from '../directivas/dnd.directive';

import { EditarImagenComponent } from "../components/editar-imagen/editar-imagen.component";
import { ImageCropperModule } from 'ngx-image-cropper';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ModalControlesComponent } from './explorar/modal-controles/modal-controles.component';
import { MatDialogModule} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import { EditarPerfilComponent } from './editar-perfil/editar-perfil.component';
import { LazyLoadImageModule } from 'ng-lazyload-image';

@NgModule({
  declarations: [

    InicioComponent,
    UsuariosComponent,
    ExplorarComponent,
    PlanesComponent,
    SidebarDashboardComponent,
    SidebarAdminComponent,
    VerificacionCuentaComponent,
    PrivacidadComponent,
    PoliticaCookiesComponent,
    ApiDocsComponent,
    AdminComponent,
    EstudioComponent,
    PaginationComponent,
    UsuariosComponent,
    UsuarioComponent,
    NgbdAlertBasicComponent,
    MisdisenosComponent,
    SubirdisenoComponent,
    DisenoComponent,
    ContactoComponent,
    BadgeComponent,
    DesignEstudioComponent,
    OpendataComponent,
    DndDirective,
    EditarImagenComponent,
    ModalControlesComponent,
    EditarPerfilComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatInputModule,
    FontAwesomeModule,
    MatChipsModule,
    MatAutocompleteModule,
    NgMultiSelectDropDownModule.forRoot(),
    MatButtonModule,
    ImageCropperModule,
    MatFormFieldModule,
    MatStepperModule,
    MatDialogModule,
    MatSelectModule,
    LazyLoadImageModule
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class PagesModule { }
