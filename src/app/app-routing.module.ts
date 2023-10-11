import { NgModule } from '@angular/core';
import { Routes, RouterModule} from '@angular/router';

import { AuthRoutingModule } from './auth/auth.routing';
import { PagesRoutingModule } from './pages/pages.routing';


const routes: Routes = [

  //  /login y /recovery  --> authroutingmodule
  //  /dashboard/*        --> pagesroutingmodule

  //Por defecto se cae en inicio.
  { path: '**', redirectTo: 'inicio'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    AuthRoutingModule,
    PagesRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
