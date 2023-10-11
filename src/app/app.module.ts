import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

/*import { NgbModule } from '@ng-bootstrap/ng-bootstrap';*/

import { SpinnerComponent } from './commons/spinner.component';

import { AuthModule } from './auth/auth.module';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
/*import { OAuthModule } from 'angular-oauth2-oidc'*/
import { AppComponent } from './app.component';
import { FooterComponent } from './commons/footer/footer.component';

import { NavbarComponent } from './commons/navbar/navbar.component';
import { PagesModule } from './pages/pages.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule,HttpClient } from '@angular/common/http';
import { AvisoLegalComponent } from './pages/aviso-legal/aviso-legal.component';
import { ClickOutsideDirective } from './clickOutside.directive';
import { PaginationComponent } from './components/pagination/pagination.component';
import { MatRipple } from '@angular/material/core';

import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

import {NgcCookieConsentModule, NgcCookieConsentConfig} from 'ngx-cookieconsent';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { environment } from './../environments/environment.prod';
import { ShowHidePasswordDirective } from './directivas/show-hide-password.directive';
import { AjustesCuentaComponent } from './commons/ajustes-cuenta/ajustes-cuenta.component';
import { BadgeComponent } from './components/badge/badge.component';
import { MensajesComponent } from './pages/mensajes/mensajes.component';
import { ChatComponent } from './commons/chat/chat.component';
import { ValoracionComponent } from './commons/valoracion/valoracion.component';

import { registerLocaleData } from '@angular/common';
import localeES from "@angular/common/locales/es";

import { ImageCropperModule } from 'ngx-image-cropper';
import { LazyLoadImageModule } from "ng-lazyload-image";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

//Para los formatDate que se utilicen
registerLocaleData(localeES, "es");

const cookieConfig: NgcCookieConsentConfig = {
  cookie: {
    domain: `${environment.base_url}`,
  },

  palette: {
    popup: {
      background: '#343a40',
      text: '#ffffff',
      link: '#ffffff',
    },
    button: {
      background: '#D4AF37',
      text: '#000000',
      border: '#f9ae05',
    }
  },
  position: 'bottom-left',
  theme: 'classic',
  type: 'opt-out',
  layout: 'my-custom-layout',
  layouts: {
    "my-custom-layout": '{{messagelink}}{{compliance}}'
  },
  elements:{
    messagelink: `
    <span id="cookieconsent:desc" class="cc-message" style="text-align:justify">{{message}}
    <p><a aria-label="Aprender más sobre las cookies" tabindex="0" class="cc-link" href="{{cookiePolicyHref}}" target="_blank" rel="noopener">{{cookiePolicyLink}}</a>,
      <a aria-label="Aprender más sobre la política de privacidad" tabindex="0" class="cc-link" href="{{privacyPolicyHref}}" target="_blank" rel="noopener">{{privacyPolicyLink}}</a>
     y
      <a aria-label="Aprender más sobre nuestros términos y servicios" tabindex="0" class="cc-link" href="{{tosHref}}" target="_blank" rel="noopener">{{tosLink}}</a>
   </p> </span>
    `,
  },
  content:{
    message: 'By using our site, you acknowledge that you have read and understand our ',

    cookiePolicyLink: 'Política de Cookies',
    cookiePolicyHref: '/politica-cookies',

    privacyPolicyLink: 'Política de privacidad',
    privacyPolicyHref: '/privacidad',

    tosLink: 'Términos y condiciones',
    tosHref: '/aviso-legal',
  }
};

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    NavbarComponent,
    SpinnerComponent,
    AvisoLegalComponent,
    ClickOutsideDirective,
    //ShowHidePasswordDirective,
    AjustesCuentaComponent,
    MensajesComponent,
    ChatComponent,
    ValoracionComponent

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
   /* OAuthModule.forRoot(),*/
    AppRoutingModule,
    AuthModule,
    /*NgbModule,*/
    PagesModule,
    FormsModule,                //esto
    ReactiveFormsModule,
    FontAwesomeModule,
    MatIconModule,
    MatButtonModule,
    NgcCookieConsentModule.forRoot(cookieConfig),
    TranslateModule.forRoot(),
    TranslateModule.forRoot({ defaultLanguage: 'es'}),
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
    }),
    ImageCropperModule,
    LazyLoadImageModule
  ],
  bootstrap: [AppComponent]
})



export class AppModule {

 }
