import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; //esto
import { LoginComponent } from './login/login.component';
import { RecoveryComponent } from './recovery/recovery.component';
import { SignupComponent } from './signup/signup.component';
import { HttpClientModule } from '@angular/common/http';
import { SocialLoginModule, SocialAuthServiceConfig, GoogleLoginProvider} from '@abacritt/angularx-social-login';
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
    SocialLoginModule,//TODO ver este problema
    MatStepperModule,
    MatInputModule,
    MatButtonModule,
    CdkStepperModule,
    MatIconModule
  ], providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '696702337111-2n67ff8jcore3vnr75t24ql12jv8r236.apps.googleusercontent.com',{
                oneTapEnabled: false, // <===== onetap de google quitado
              }
            )
          },
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent]
})
export class AuthModule { }
