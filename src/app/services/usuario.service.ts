import { Injectable } from '@angular/core';
import { HttpClient, HttpParams} from '@angular/common/http';
import { loginform, Googleloginform } from '../interfaces/login-form.interface';
import { registerform, registerform2 } from '../interfaces/register-form.interface';
import { recoveryform, NewPasswordForm } from '../interfaces/recovery-form.interface';
import { updateform } from '../interfaces/update-form.interface';
import { environment } from '../../environments/environment';
import { catchError, tap, map, of, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { SocialAuthService} from '@abacritt/angularx-social-login';
import { ComunicacionService } from './comunicacion.service';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private usuario: Usuario = new Usuario("", "", "", false, "", "", "", null, null, false, false, "", false, false, true);
  //private usuario: Usuario = new Usuario("", "", "", false, "", "", "", null, null, false, "");

  constructor( private http: HttpClient,
               private router: Router,//id
               private authService: SocialAuthService,
                ) {
                  const token=localStorage.getItem('token')||'';
                  if(token.length>0){
                    this.usuario.token = token;
                  }
                 } //esto para la api

  login(formData: loginform) {
    //este post tiene que devolver todos los datos del ususario
    return this.http.post(`${environment.base_url}/login`, formData)
            .pipe(
              tap( (res : any) => {
                const { uid, nombre, apellidos, email, rol, alta, activo, token, fnacimiento, imagen, Gacount, tour, imagenGoogle, Valoracion } = res;
                localStorage.setItem('token', token);
                this.usuario = new Usuario(uid, rol, token, true, nombre, apellidos, email, fnacimiento, alta, activo, tour, imagen, Gacount, imagenGoogle, Valoracion);
              })
            );
  }
  idChatbot(funcion: string,d: string){
    let datos={
      headers: {
        'x-token': this.token,
        'funcion': funcion,
        'datos': d
      }};
    return this.http.get(`${environment.base_url}/webhook`,datos);
  }



  logout() {
    this.idChatbot('miFuncionU','')
    .subscribe({
      next: res => {
          // console.log('Conseguido');

      },
      error: err =>{
        // console.log(err);
      },
      complete: () => {
        // console.log('req complete');
      }

  });
    // console.log('logout');

    this.authService.signOut().then((data) => {
      this.router.navigate(['/login']);
    }).catch((data) => {
    });

    this.limpiarLocalStore();
    this.usuario = new Usuario("","","",false);
    /*Necesario si es usuario de Google*/

    //window.location.assign('/login');
    //this.router.navigate(['/login']);
    this.router.navigateByUrl('/login');

  }

  moverRuta(){
    this.router.navigateByUrl('/login')
    return 'a'
  }

  cargarUsuario( uid: string) {
    if (!uid) { uid = '';}
    //console.log('Cargar usu',this.http.get(`${environment.base_url}/usuarios/?id=${uid}` , this.cabeceras));
      return this.http.get(`${environment.base_url}/usuarios/?id=${uid}` , this.cabeceras);
  }

  cargarUsuarios( desde: number, textoBusqueda?: string ): Observable<object> {
    if (!desde) { desde = 0;}
    if (!textoBusqueda) {textoBusqueda = '';}
    return this.http.get(`${environment.base_url}/usuarios/?desde=${desde}&texto=${textoBusqueda}` , this.cabeceras);
  }


  getDatosUsuarios( usuarios: any){//Pasamos un objeto con una lista de ids de usuarios y se nos devuelve el nombre, la foto y su id.

    if (!usuarios) { usuarios=null}
    let obj = new HttpParams();
    //obj = obj.append('desde', desde);

    if(usuarios){
      obj = obj.append('nUsuarios', usuarios.length);
      for (let index = 0; index < usuarios.length; index++) {
        obj = obj.append(index.toString(),usuarios[index])
      }
    }

    obj = obj.append('token', this.token);
    return this.http.get(`${environment.base_url}/usuarios/chat/`, {params: obj});
  }


  validar(correcto: boolean, incorrecto: boolean): Observable<boolean> {
    if(this.usuario.token === ''){
      this.limpiarLocalStore();
      return of(incorrecto);
    }

    return this.http.get(`${environment.base_url}/login/token`, this.cabeceras)
      .pipe(
        tap( (res: any) => {

          const { uid, nombre, apellidos, email, rol, alta, activo, token, imagen, fnacimiento, Gacount, imagenGoogle, Valoracion} = res;
          localStorage.setItem('token', token);
          this.usuario = new Usuario(uid, rol, token, true, nombre, apellidos, email, fnacimiento, alta, activo, imagen, Gacount, imagenGoogle, Valoracion);
          this.idChatbot('miFuncionU', nombre)
        }),
        map ( resp => {
          return correcto;
        }),
        catchError((err) => {
          console.warn(err);
          this.limpiarLocalStore();
          return throwError(err); // Lanza un error observable para forzar el catchError
        })
      )
  }

  validarExplorar(): Observable<boolean> {
    if(this.token === ''){//caso usuario sin registrar
      this.limpiarLocalStore();
      return of(true);
    }
      // console.log('token de validarExplorar: ', this.cabeceras);
      return this.http.get(`${environment.base_url}/login/token`, this.cabeceras)
      .pipe(
        tap( (res: any) => {
          const { uid, nombre, apellidos, email, rol, alta, activo, token, imagen, fnacimiento, tour, Gacount, imagenGoogle, Valoracion } = res;

          localStorage.setItem('token', token);
          this.usuario = new Usuario(uid, rol, token, true, nombre, apellidos, email, fnacimiento, alta, activo, tour, imagen, Gacount, imagenGoogle, Valoracion);
        }),
        map ( resp => {
          return true;
        }),
        catchError ( err => {
          console.warn(err);
          this.limpiarLocalStore();
          return of(false);
        })
      )
  }


  validarToken(): Observable<boolean>{
    return this.validar(true,false);
  }

  validarNoToken():Observable<boolean> {
    return this.validar(false,true);
  }

  limpiarLocalStore(){
    // console.log('Limpiar localstorage');
    localStorage.removeItem('token');
    localStorage.removeItem('id');
  }

  nuevoUsuario ( data: Usuario) {
    return this.http.post(`${environment.base_url}/usuarios/`, data, this.cabeceras);
  }

  borrarUsuario( uid: string) {
    if (!uid || uid === null) {uid = 'a'; }
    return this.http.delete(`${environment.base_url}/usuarios/${uid}` , this.cabeceras);
  }

  actualizarTour( uid: string, valor) {
    let obj={
      tour:valor
    };
    return this.http.put(`${environment.base_url}/usuarios/tour/${uid}`, obj, this.cabeceras);
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

  get uid(): string{
    return this.usuario.uid;
  }

  get rol(): string {
    return this.usuario.rol;
  }

  get logged(): boolean {
    return this.usuario.logged;
  }

  get nombre(): string{
    return this.usuario.nombre;
  }

  get apellidos(): string{
    return this.usuario.apellidos;
  }

  get email(): string{
    return this.usuario.email;
  }

  get imagen(): string{
    return this.usuario.imagen;
  }

  get tour(): boolean{
    return this.usuario.tour;
  }

  get imagenURL(): string{
    return this.usuario.imagenUrl;
  }

  get fnacimiento(): Date{
    return this.usuario.fnacimiento;
  }

  get isGoogle(): boolean {
    return this.usuario.Gacount;
  }

  get isImagenGoogle(): boolean {
    return this.usuario.imagenGoogle;
  }

  get valoracion(): Boolean{
    return this.usuario.Valoracion;
  }

  sendRecovery(formData: recoveryform) {
    return this.http.post(`${environment.base_url}/login/recovery`, formData);
  }

  sendNewPassword(formdata: NewPasswordForm, token:string){

    let cabecera={
      headers: {
        'x-token': token
      }};

    return this.http.put(`${environment.base_url}/login/recaccount`, formdata, cabecera);
  }

  actualizarUsuario ( uid: string, data: Partial<Usuario>) {
    return this.http.put(`${environment.base_url}/usuarios/${uid}`, data, this.cabeceras);
  }

  actualizarUsuarioE ( uid: string, formData: updateform) {
    let usuarionew: Usuario = this.usuario;

    usuarionew.nombre = formData.nombre;
    usuarionew.email = formData.email;
    usuarionew.apellidos = formData.apellidos;
    if(formData.imagen !== ""){
      usuarionew.imagen = formData.imagen;
    }


    return this.http.put(`${environment.base_url}/usuarios/${uid}`, usuarionew, this.cabeceras);
  }

  cambiarPassword( uid: string, data) {
    return this.http.put(`${environment.base_url}/usuarios/np/${uid}`, data, this.cabeceras);
  }

  establecerimagen(nueva: string): void {
    // console.log('establercer imagen: ', nueva);
    this.quitarImagenGoogle();
    this.usuario.imagen = nueva;
  }

  quitarImagenGoogle(): void {
    this.usuario.imagenGoogle = false;
  }

  establecerdatos(nombre: string, apellidos: string, email: string): void {
    this.usuario.nombre = nombre;
    this.usuario.apellidos = apellidos;
    this.usuario.email = email;
  }

  registro(formData: registerform) {
    // console.log("Registro desde el Usuario.Service", formData);
    return this.http.post(`${environment.base_url}/login/register`, formData);
  }

  registro2(formData: registerform2) {
    // console.log("Registro desde el Usuario.Service", formData);
    return this.http.post(`${environment.base_url}/login/register`, formData);
  }

  registroGoogle(formData: Googleloginform) {
    console.log('HAGO LA LLAMADA REGISTRAR USUARIO CON GOOGLE');
    return this.http.post(`${environment.base_url}/login/google/register`, formData)
  }

  existeCorreo(email: string) {
    return this.http.get(`${environment.base_url}/usuarios/ee/${email}`);
  }

  loginGoogle(email: string) {
    let formData = {
      email:email,
    }
    console.log('ESTO ES LO QUE ENVIO A LOGIN CON GOOGLE', formData);
    return this.http.post(`${environment.base_url}/login/google/login`, formData)
            .pipe(
              tap( (res : any) => {
                const {uid, rol, token}= res;
                localStorage.setItem('token', token);
                this.usuario = new Usuario(uid, rol, token, true);
                //Voy a guardar el uid tambien en el localstorage y en principio no es una fuga de seguridad
                //localStorage.setItem('id', uid);
              })
            );
  }
  sendContact( data: any) {
    return this.http.post(`${environment.base_url}/notificaciones/contacto`, data);
  }

  getContact(data: any) {
    let obj = new HttpParams();
    obj = obj.append('token', this.token);
    return this.http.get(`${environment.base_url}/notificaciones/contacto`, {params: obj});
  }

  ValorarUsu ( obj:any) {
    // console.log(obj);
    //return null;
    return this.http.post(`${environment.base_url}/notificaciones/valoracion/${this.uid}`, obj, this.cabeceras);
  }

/* Este metodo está ahora en uploads service
  subirFoto( uid: string, foto: File) {
    const datos: FormData = new FormData();
    datos.append('archivo', foto, foto.name);
    return this.http.post(`${environment.base_url}/upload/fotoperfil/${uid}`, datos, this.cabeceras);
  }
*/

  setRol( rol: string){
    this.usuario.rol = rol;
  }


}
