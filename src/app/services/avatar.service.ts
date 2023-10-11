import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Tatuaje } from '../models/tatuaje.model';

@Injectable({
  providedIn: 'root'
})
export class AvatarService {

  constructor( private http: HttpClient) { }

  private event:any;

  cargarAvatar(uid:string){
    console.log("cargarAvatar()", uid);

    let obj = new HttpParams;
    obj = obj.append('id', uid);

    let cabeceras = new HttpHeaders({
      'x-token': this.token
    });

    return this.http.get(`${environment.base_url}/avatar/`, {headers: cabeceras, params: obj});
  }

  editarAvatar(uid:string, modelo:string, tatuajes:any,  piel:string){

  //   {
  //     "usuario": "644a453161a2fd6725e6e528",
  //     "modelo": "../../assets/humano/chicoo.glb",
  //     "piel": "#e9caae",
  //     "tatuajes": [],
  // }

    let datos = {
      usuario: uid,
      modelo: modelo,
      piel: piel,
      tatuajes: tatuajes
    }

    // datos.append('tatuajes', "");
    console.log("DATOS ACTUALIZAR AVATAR: ", datos);

    return this.http.put(`${environment.base_url}/avatar`, datos, this.cabeceras);
  }

  crearAvatar(uid:string){
    console.log("crearAvatar()")

    let body = {
      usuario: uid,
      modelo: "./assets/humano/chico.glb", // Por defecto, el modelo del hombre
      piel: "#e9caae", // Por defecto, el color blanco
      tatuajes: [],
    }

    return this.http.post(`${environment.base_url}/avatar/`, body, this.cabeceras);
  }

  get token(): string{
    return localStorage.getItem('token') || '';
  }

  get cabeceras(){
    return {
      headers: {
        'x-token': this.token
      }};
  }

}
