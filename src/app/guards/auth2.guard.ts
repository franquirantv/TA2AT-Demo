import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { UsuariosService } from '../services/usuario.service';
import {} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard2 implements CanActivate {

  constructor( private usuariosService: UsuariosService,
    private router: Router) {}



  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot){

    return this.usuariosService.validarExplorar();
  }
}
