import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RecoveryComponent } from './recovery/recovery.component';
import { SignupComponent } from './signup/signup.component';
import { NoauthGuard } from '../guards/noauth.guard';
import { RecoveryContraComponent } from './recovery-contra/recovery-contra.component';
import { SignupGoogleComponent } from './signup-google/signup-google.component';

const routes: Routes = [

  //Si despues de poner login o recovery pones otra cosa tipo /login/loquesea/, lo de al lado se quita.
  { path: 'login', component: LoginComponent, canActivate: [NoauthGuard]},
  { path: 'recovery', component: RecoveryComponent, canActivate: [NoauthGuard]},
  { path: 'recovery-contra', component: RecoveryContraComponent, canActivate: [NoauthGuard]},
  { path: 'signup', component: SignupComponent, canActivate: [NoauthGuard]},
  //path: 'signup-google/:email/:firstName/:lastName/:name/:photoUrl
  { path: 'signup-google', component: SignupGoogleComponent, canActivate: [NoauthGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
