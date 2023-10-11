import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; //esto
import { LoginComponent } from './login/login.component';
import { RecoveryComponent } from './recovery/recovery.component';
import { SignupComponent } from './signup/signup.component';
import { HttpClientModule } from '@angular/common/http';
import {ElementRef, Injectable, NgZone, OnDestroy} from '@angular/core';
import {MatStepperModule} from '@angular/material/stepper';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {CdkStepperModule} from '@angular/cdk/stepper';
import { AppComponent } from '../app.component';
import { RecoveryContraComponent } from './recovery-contra/recovery-contra.component';
import {MatIconModule} from '@angular/material/icon';
import { ShowHidePasswordDirective } from '../directivas/show-hide-password.directive';
import { SignupGoogleComponent } from './signup-google/signup-google.component';

//@Injectable({providedIn: 'root'})
@NgModule({
  declarations: [
    LoginComponent,
    RecoveryComponent,
    SignupComponent,
    ShowHidePasswordDirective,
    RecoveryContraComponent,
    SignupGoogleComponent,
    RecoveryContraComponent
  ],
  exports: [
    LoginComponent,
    RecoveryComponent,
    SignupComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,                //esto
    ReactiveFormsModule,         //esto
    HttpClientModule,     //esto para la api
    MatStepperModule,
    MatInputModule,
    MatButtonModule,
    CdkStepperModule,
    MatIconModule
  ],
  bootstrap: [AppComponent]
})
export class AuthModule { }
