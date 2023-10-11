import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, Subscription, tap } from 'rxjs';
import { UsuariosService } from '../services/usuario.service';
import {} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  public explorar = false;
  private subscription: Subscription;

  constructor( private usuariosService: UsuariosService,
    private router: Router) {}

  // canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
  //   console.log("AAAAAA")
  //   return new Observable<boolean>(observer => {

  //   this.subscription = this.usuariosService.validarToken()
  //     .pipe(
  //       tap( resp => {
  //         console.log('Guard devuelve:',resp);
  //         if (!resp){
  //           console.log('Guard devuelve falso')
  //           //si devuelve falso significa que el token no es bueno y nos devuelve al login
  //           this.router.navigateByUrl('/login');
  //         }

  //         // Si la ruta no es para el rol del token, reenviamos a ruta base de rol del token
  //         console.log("next.data['rol'] ", next.data['rol']);
  //         console.log('usuarioService rol: ', this.usuariosService.rol);
  //         console.log(next.data['rol'] !== '*' && this.usuariosService.rol !== next.data['rol'])
  //         if ((next.data['rol'] !== '*') && (this.usuariosService.rol !== next.data['rol'])) {
  //           console.log('Guard devuelve falso por rol')
  //           switch (this.usuariosService.rol) {
  //             case 'ROL_ADMIN':
  //               console.log('ROL_ADMIN');
  //               this.router.navigateByUrl('/admin/dashboard');
  //               break;
  //             case 'ROL_USUARIO':
  //               window.location.assign('/explorar')
  //               //this.router.navigateByUrl('/explorar');
  //               this.explorar = true;
  //               if(this.explorar)
  //               window.location.reload();
  //               break;
  //             case 'ROL_ESTUDIO':
  //               console.log('ROL_ESTUDIO');
  //               this.router.navigateByUrl('/estudio/dashboard');
  //               break;
  //           }
  //         }
  //       })
  //     ).subscribe(); // Suscripción vacía para activar el observable

  //     return () => {
  //       if (this.subscription)
  //         this.subscription.unsubscribe();
  //     };

  //   });

  // }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.subscription = this.usuariosService.validarToken().pipe(
        tap((resp) => {
          if (!resp) {
            this.router.navigateByUrl('/login');
            observer.next(false); // Emit false when user is not authenticated
          } else {
            // Check if the user has the required role
            const requiredRole = next.data['rol'];
            if (requiredRole !== '*' && this.usuariosService.rol !== requiredRole) {
              switch (this.usuariosService.rol) {
                case 'ROL_ADMIN':
                  this.router.navigateByUrl('/admin/dashboard');
                  break;
                case 'ROL_USUARIO':
                  window.location.assign('/explorar')
                  //this.router.navigateByUrl('/explorar');
                  this.explorar = true;
                  if(this.explorar)
                  window.location.reload();
                  break;
                case 'ROL_ESTUDIO':
                  this.router.navigateByUrl('/estudio/dashboard');
                  break;
              }
              observer.next(false); // Emit false when user does not have required role
            } else {
              observer.next(true); // Emit true when user is authenticated and has required role
            }
          }
          observer.complete(); // Complete the observable
        })
      ).subscribe(); // Empty subscription to activate the observable

      return () => {
        if (this.subscription)
          this.subscription.unsubscribe();
      };
    });
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe(); // Cancela la suscripción al destruir el guardia
    }
  }
}
