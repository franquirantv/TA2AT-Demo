import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { UsuariosService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    private http: HttpClient,
    private router: Router,//id
    private usuariosService: UsuariosService,
  ) { }

  sendMensaje( data: any) {
    return this.http.post(`${environment.base_url}/mensajes/`, data, this.cabeceras);
  }

  updateMensaje( data: any) {
    return this.http.put(`${environment.base_url}/mensajes/`, data, this.cabeceras);
  }

  getMensaje( uid: string) {
    if(!uid){ uid=''; }
    return this.http.get(`${environment.base_url}/mensajes/?uid=${uid}`, this.cabeceras);

  }

  getDatosUsuarios( usuarios: any){

    if (!usuarios) { usuarios=null}
    let obj = new HttpParams();
    //obj = obj.append('desde', desde);

    if(usuarios){
      obj = obj.append('nUsuarios', usuarios.length);
      for (let index = 0; index < usuarios.length; index++) {
        obj = obj.append(index.toString(),usuarios[index])
      }
    }
    // console.log('USUARIOS DESDE CHATSERVICE', obj);
    obj = obj.append('token', this.usuariosService.token);
    return this.http.get(`${environment.base_url}/usuarios/chat/`, {params: obj});
  }

  get cabeceras(){
    return {
      headers: {
        'x-token': this.token
      }};
  }

  get token(): string{
    return localStorage.getItem('token') || '';
  }
}
