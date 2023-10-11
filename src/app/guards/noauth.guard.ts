import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { UsuariosService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class NoauthGuard implements CanActivate {
  constructor( private usuariosService: UsuariosService,
    private router: Router) {}



  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot){

    return this.usuariosService.validarNoToken()
              .pipe(
                tap( resp => {//esto es que si no funciona esto nos devuelve al login
                  // console.log('Noauth Guard devuelve:',resp);
                  if (!resp){
                    window.location.assign('/explorar')
                    //this.router.navigateByUrl('/explorar');//aqui
                  }
                })
              );
  }
}
