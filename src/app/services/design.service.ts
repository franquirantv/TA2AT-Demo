import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { environment } from 'src/environments/environment';
import { UsuariosService } from '../services/usuario.service';
import { error } from 'jquery';
import { catchError, tap, map, of, Observable, throwError } from 'rxjs';
import { disenyoform } from '../interfaces/disenyo-form.interface';
import { Usuario } from '../models/usuario.model';
import { Design } from '../models/design.model';
import { UploadsService } from './uploads.service';

@Injectable({
  providedIn: 'root'
})
export class DesignService {

  private selectedDesign: Design = new Design("",false,"",null,"",null,null,[],[],"","",[],"");

  constructor( private http: HttpClient, private router: Router, private usuarioService: UsuariosService, private uploadsService:UploadsService) {

  }

  cargarDesign( desde: number, textoBusqueda?: string, uid?: string, did?: string, filtros?: any ): Observable<object> {
    console.log('ENTRO EN CARGAR DESIGN');
    if (!desde) { desde = 0;}
    if (!textoBusqueda) {textoBusqueda = '';}
    if (!uid) { uid = ''}
    if (!did) { did = ''}
    let obj = new HttpParams();
    obj = obj.append('desde', desde);
    obj = obj.append('texto', textoBusqueda);
    obj = obj.append('uid', uid);
    obj = obj.append('did', did);
    if(filtros){
      for (let index = 0; index < filtros.length; index++) {
        obj = obj.append(filtros[index].type,filtros[index].value)

      }
    }

    return this.http.get(`${environment.base_url}/design`, {params: obj});
  }


  cargarGuardados( desde: number, uid: string, textoBusqueda?: string, filtros?: any): Observable<object> {
    if (!desde) { desde = 0;}
    if (!textoBusqueda) {textoBusqueda = '';}
    if(!uid) { uid = ''}
    let obj = new HttpParams();
    obj = obj.append('desde', desde);
    obj = obj.append('texto', textoBusqueda);
    obj = obj.append('uid', uid);
    if(filtros){
      for (let index = 0; index < filtros.length; index++) {
        obj = obj.append(filtros[index].type,filtros[index].value)
      }
    }
    obj = obj.append('token', this.token);
    //return this.http.get(`${environment.base_url}/design/guardados/${uid}&desde=${desde}&texto=${textoBusqueda}` , this.cabeceras);
    //return this.http.get(`${environment.base_url}/design/guardados/?desde=${desde}&texto=${textoBusqueda}&uid=${uid}` , this.cabeceras);
    return this.http.get(`${environment.base_url}/design/guardados`, {params: obj});
  }

  rutaDesign(imagen: string) {
    // console.log(3)
    return this.http.get(`${environment.base_url}/upload/publicacion/${imagen}` , this.cabeceras);
  }

  subirDesign(formData: disenyoform, foto: File){
    //console.log('Datos pal baqen',formData)
    //console.log('petision', this.http.post(`${environment.base_url}/design/}`, formData, this.cabeceras));
    const datos: FormData = new FormData();

    // console.log("FOTO: ", foto);
    datos.append('archivo', foto, foto.name);
    datos.append('nombre', formData.nombre);
    for (let index = 0; index < formData.estilos.length; index++)
      datos.append('estilos', formData.estilos[index]);

    for (let index = 0; index < formData.zonas.length; index++)
      datos.append('zonas', formData.zonas[index]);

    if(formData.color === true)
      datos.append('color', 'true');
    else
      datos.append('color', 'false');


    datos.append('descripcion', formData.descripcion);
    datos.append('usuario', formData.usuario);
    datos.append('imagen_x', formData.imagen_x.toString())
    datos.append('imagen_y', formData.imagen_y.toString())
    datos.append('autor', formData.autor);


    // console.log('estos son los datos: ', datos);
    // console.log('Autor: ', datos.get('autor'));
    // console.log('color: ', datos.get('color'));
    // console.log('zonas: ', datos.get('zonas'));
    // console.log('estilos: ', datos.get('estilos'));
    // console.log('imagen_x: ', datos.get('imagen_x'));
    // console.log('imagen_y: ', datos.get('imagen_y'));

    //formData.archivo= datos;

    //console.log('Datos pal baqen',formData.archivo);

    return this.http.post(`${environment.base_url}/design/`, datos, this.cabeceras);
  }


  guardarDesign( data: Partial<Design>){
    let uid = this.usuarioService.uid;
    if (!uid) { uid = '';}

    // console.log('guardar design did: ', data);
    // console.log('guardar design uid: ', uid);

    const body = { uid: uid};

    // console.log('guardar design va');
      //return this.http.put(`${environment.base_url}/design/guardados/?uid=${uid}&did=${did}` , data, this.cabeceras);
      //return this.http.put(`${environment.base_url}/design/guardados/?uid=${uid}&did=${did}`, body, this.cabeceras);
      return this.http.put(`${environment.base_url}/design/guardados/${uid}`, data, this.cabeceras);
  }

  actualizarDesign ( uid: string, data: Partial<Design>) {//NO VA, AUN NO SE HA PROBADO.
    return this.http.put(`${environment.base_url}/design/${uid}`, data, this.cabeceras);
  }


  borrarDesign (did: string, uid: string) {
    let obj = new HttpParams;
    obj = obj.append('uid', uid);

    let cabeceras = new HttpHeaders({
      'x-token': this.token
    });
    return this.http.delete(`${environment.base_url}/design/${did}`, {headers: cabeceras, params: obj});
  }


  editarDesign (did: string, uid: string, formData: any) {

    const datos: FormData = new FormData();

    datos.append('uid', uid);

    datos.append('nombre', formData.nombre);
    for (let index = 0; index < formData.estilos.length; index++)
      datos.append('estilos', formData.estilos[index]);

    for (let index = 0; index < formData.zonas.length; index++)
      datos.append('zonas', formData.zonas[index]);

    if(formData.color)
      datos.append('color', 'true');
    else
      datos.append('color', 'false');


    datos.append('descripcion', formData.descripcion);

    return this.http.put(`${environment.base_url}/design/${did}`, datos, this.cabeceras);
  }


  cargarDesignId( did: string) {
    if (!did) { did = '';}
    //console.log('Cargar usu',this.http.get(`${environment.base_url}/usuarios/?id=${uid}` , this.cabeceras));
      return this.http.get(`${environment.base_url}/design/?id=${did}` , this.cabeceras);
  }

  //por si añadimos parámetros a la llamada en el futuro
  get cabeceras(){
    return {
      headers: {
        'x-token': this.token
      }};
  }

  get token(): string{
    return localStorage.getItem('token') || '';
  }

  anadirVista(uid: string, did: string){

    const datos: FormData = new FormData();

    datos.append('uid', uid);
    datos.append('did', did);

    if(did== null || did == ''){
      return null;
    }

    if(uid===''){

      return this.http.post(`${environment.base_url}/design/vista2/`, datos, this.cabeceras);

    }else{

      return this.http.post(`${environment.base_url}/design/vista/`, datos, this.cabeceras);
    }

  }


  get id(): string{return this.selectedDesign.did}
  get color(): boolean{return this.selectedDesign.color}
  get nombre(): string{return this.selectedDesign.nombre}
  get estilos(): string[]{return this.selectedDesign.estilos}
  get descripcion(): string{return this.selectedDesign.descripcion}
  get zonas(): string[]{return this.selectedDesign.zonas}
  get imagen_id(): string{return this.selectedDesign.imagen_id}
  get imagenUrl(): string{return this.selectedDesign.imagenUrl}
  get usuario(): Usuario{return this.selectedDesign.usuario}

  asignarDisenyo(disenyo: Design){
     this.selectedDesign = disenyo;
    //  console.log(this.selectedDesign);

  }


  }



