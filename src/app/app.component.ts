import { AfterViewInit, Component, OnDestroy, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import {UsuariosService} from './services/usuario.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { faSave, faMessage, faBell, faUser, faFilter, faMagnifyingGlass, faNewspaper, faCheckCircle, faBrain, faCheck, faTimes, faWarning } from '@fortawesome/free-solid-svg-icons';
import { UploadsService } from './services/uploads.service';
import { NgcCookieConsentService, NgcInitializationErrorEvent, NgcInitializingEvent, NgcNoCookieLawEvent, NgcStatusChangeEvent } from 'ngx-cookieconsent';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnDestroy, AfterViewInit{
  //keep refs to subscriptions to be able to unsubscribe later
  private popupOpenSubscription!: Subscription;
  private popupCloseSubscription!: Subscription;
  private initializingSubscription!: Subscription;
  private initializedSubscription!: Subscription;
  private initializationErrorSubscription!: Subscription;
  private statusChangeSubscription!: Subscription;
  private revokeChoiceSubscription!: Subscription;
  private noCookieLawSubscription!: Subscription;

  showChatModal = false;


  constructor( private cd: ChangeDetectorRef,
               private usuarioService: UsuariosService,
               private uploadService: UploadsService,
               private fb: FormBuilder,
               private router: Router,
               private cookieService: NgcCookieConsentService,
               private translateService:TranslateService,) { }

  ngAfterViewInit(): void {
    /*------------Cookies junto a su traduccion*/
    //this.translateService.addLangs(['es', 'en']);
    this.translateService.setDefaultLang('es');
    const browserLang = this.translateService.getBrowserLang();
    //this.translateService.use('browserLang : 'en');
    //this.translateService.use('es');
    this.translateService.use(browserLang.match(/es|en/) ? browserLang : 'es');

    // subscribe to cookieconsent observables to react to main events
    this.popupOpenSubscription = this.cookieService.popupOpen$.subscribe(
      () => {
        // you can use this.cookieService.getConfig() to do stuff...

      });

    this.popupCloseSubscription = this.cookieService.popupClose$.subscribe(
      () => {
        // you can use this.cookieService.getConfig() to do stuff...
      });

    this.initializingSubscription = this.cookieService.initializing$.subscribe(
      (event: NgcInitializingEvent) => {
        // the cookieconsent is initilializing... Not yet safe to call methods like `NgcCookieConsentService.hasAnswered()`
        console.log(`initializing: ${JSON.stringify(event)}`);
      });

    this.initializedSubscription = this.cookieService.initialized$.subscribe(
      () => {
        // the cookieconsent has been successfully initialized.
        // It's now safe to use methods on NgcCookieConsentService that require it, like `hasAnswered()` for eg...
        console.log(`initialized: ${JSON.stringify(event)}`);
      });

    this.initializationErrorSubscription = this.cookieService.initializationError$.subscribe(
      (event: NgcInitializationErrorEvent) => {
        // the cookieconsent has failed to initialize...
        console.log(`initializationError: ${JSON.stringify(event.error?.message)}`);
      });

    this.statusChangeSubscription = this.cookieService.statusChange$.subscribe(
      (event: NgcStatusChangeEvent) => {
        // you can use this.cookieService.getConfig() to do stuff...
        localStorage.setItem('cookiesAceptadas', 'true');
      });

    this.revokeChoiceSubscription = this.cookieService.revokeChoice$.subscribe(
      () => {
        // you can use this.cookieService.getConfig() to do stuff...
        localStorage.setItem('cookiesAceptadas', 'true');
      });

      this.noCookieLawSubscription = this.cookieService.noCookieLaw$.subscribe(
      (event: NgcNoCookieLawEvent) => {
        // you can use this.cookieService.getConfig() to do stuff...
        localStorage.setItem('cookiesAceptadas', 'true');
      });

      this.translateService.setTranslation('es', {
        cookieheader: 'hello {{value}}'
      });

      this.translateService//
      .get(['cookie.header', 'cookie.message', 'cookie.dismiss', 'cookie.allow', 'cookie.deny', 'cookie.link', 'cookie.policy'])
      .subscribe(data => {

        this.cookieService.getConfig().content = this.cookieService.getConfig().content || {} ;
        // Override default messages with the translated ones
        this.cookieService.getConfig().content.header = data['cookie.header'];
        this.cookieService.getConfig().content.message = data['cookie.message'];
        this.cookieService.getConfig().content.dismiss = data['cookie.dismiss'];
        this.cookieService.getConfig().content.allow = data['cookie.allow'];
        this.cookieService.getConfig().content.deny = data['cookie.deny'];
        this.cookieService.getConfig().content.link = data['cookie.link'];
        this.cookieService.getConfig().content.policy = data['cookie.policy'];

        this.cookieService.destroy(); // remove previous cookie bar (with default messages)
        if(localStorage.getItem('cookiesAceptadas') == null)
          this.cookieService.init(this.cookieService.getConfig()); // update config with translated messages
      });
      /*------------FIN Cookies junto a su traduccion*/
  }


  mostrarAjustes: boolean= false;

  actualizarAjustes(valor: any){
    // console.log('actualizar ajustes: ', valor);
    this.mostrarAjustes = valor;
    this.cd.detectChanges();
  }

  isAdminEstudioRoute() {
    return !(this.router.url.includes('/admin') || this.router.url.includes('/estudio') || this.router.url.includes('/api-docs'));
  }

  isAdminEstudioRouteFooter() {
    return !(this.router.url.includes('/admin') || this.router.url.includes('/estudio') || this.router.url.includes('/api-docs') || this.router.url.includes('/explorar') );
  }
  ngOnDestroy() {
    // unsubscribe to cookieconsent observables to prevent memory leaks
    this.popupOpenSubscription.unsubscribe();
    this.popupCloseSubscription.unsubscribe();
    this.initializingSubscription.unsubscribe();
    this.initializedSubscription.unsubscribe();
    this.initializationErrorSubscription.unsubscribe();
    this.statusChangeSubscription.unsubscribe();
    this.revokeChoiceSubscription.unsubscribe();
    this.noCookieLawSubscription.unsubscribe();
  }

}


