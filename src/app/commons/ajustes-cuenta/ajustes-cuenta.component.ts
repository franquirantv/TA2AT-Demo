import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import {UsuariosService} from '../../services//usuario.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { faSave, faMessage, faBell, faUser, faFilter, faMagnifyingGlass, faNewspaper, faCheckCircle, faBrain, faCheck, faTimes, faWarning } from '@fortawesome/free-solid-svg-icons';
import { UploadsService } from '../../services/uploads.service';
import { NgcCookieConsentService, NgcInitializationErrorEvent, NgcInitializingEvent, NgcNoCookieLawEvent, NgcStatusChangeEvent } from 'ngx-cookieconsent';
import { TranslateService } from '@ngx-translate/core';
import { ComunicacionService } from '../../services/comunicacion.service';

@Component({
  selector: 'app-ajustes-cuenta',
  templateUrl: './ajustes-cuenta.component.html',
  styleUrls: ['./ajustes-cuenta.component.css']
})

export class AjustesCuentaComponent {

  @Input() mostrarAjustes: boolean;

  title = 'cfrontend';
  faStar = faStar;
  faMagnifyingGlass = faMagnifyingGlass;
  faUser = faUser;
  faBell = faBell;
  faMessage = faMessage;
  faSave = faSave;
  faFilter = faFilter;
  faNewspaper = faNewspaper;
  faCheckCircle = faCheckCircle;
  fachec = faCheck;
  facruz = faTimes;
  faWarning = faWarning;


  public imagenUrl = '';
  public foto: File = null;
  public subs$: Subscription = new Subscription();
  public sendpass = false;
  public showOKP = false;
  public showOKD = false;
  public nostate = true;
  public fileText = 'Seleccione archivo';

  public datosForm = this.fb.group({
    email: [ '', [Validators.required, Validators.email] ],
    nombre: ['kk', Validators.required ],
    apellidos: ['', Validators.required ],
    imagen: [''],
  });

  public datosPassword = this.fb.group({
    password: ['', Validators.required],
    nuevopassword: ['', Validators.required],
    nuevopassword2: ['', Validators.required],
  })

  constructor(
    private cd: ChangeDetectorRef,
    private usuarioService: UsuariosService,
    private uploadService: UploadsService,
    private fb: FormBuilder,
    private router: Router,
    private cookieService: NgcCookieConsentService,
    private translateService:TranslateService,
    private comunicacionService: ComunicacionService) { }

  //@ViewChild('modalPerfil') modal: ElementRef;

  ngOnInit(): void {
    this.cargarUsuario();
    this.cd.detectChanges();
    // console.log(1234);
    //this.modal.nativeElement.style.display = 'block';
    //console.log(this.comunicacionService.getData('mostrarAjustes'));
  }

  // Actualizar password
  cambiarPassword(): void {
    this.sendpass = true;
    this.showOKP = false;
    if (this.datosPassword.invalid || this.passwordNoIgual()) { return; }
    this.usuarioService.cambiarPassword( this.usuarioService.uid, this.datosPassword.value )
      .subscribe({
        next: res => {
        this.showOKP = true;
        this.datosPassword.markAsPristine();
      }, error: err => {
          const errtext = err.error.msg || 'No se pudo cambiar la contraseña';
          Swal.fire({icon: 'error', title: 'Oops...', text: errtext});
          return;
        }});

  }

  // Actualizar datos de usuario
  enviar(): void {
    if (this.datosForm.invalid) { return; }

    // Actualizamos los datos del formulario y si va bien actualizamos foto
    this.usuarioService.actualizarUsuarioE( this.usuarioService.uid, this.datosForm.value )
    .subscribe({
      next: res => {
      this.usuarioService.establecerdatos( res['usuario'].nombre, res['usuario'].apellidos, res['usuario'].email );

      // Si la actualización de datos ha ido bien, entonces actualizamso foto si hay
      if (this.foto ) {
        this.uploadService.subirFoto( this.usuarioService.uid, this.foto, 'fotoperfil')
        .subscribe({
          next: res => {
          // Cambiamos la foto del navbar, para eso establecemos la imagen (el nombre de archivo) en le servicio
          this.usuarioService.establecerimagen(res['nombreArchivo']);
        }, error: err =>{
          const errtext = err.error.msg || 'No se pudo cargar la imagen';
          Swal.fire({icon: 'error', title: 'Oops...', text: errtext});
          return;
        }});
      }
      this.fileText = 'Seleccione archivo';
      this.datosForm.markAsPristine(); // marcamos reiniciado de cambios
      this.showOKD = true;
    }, error: err =>{
      const errtext = err.error.msg || 'No se pudo guardar los datos';
      Swal.fire({icon: 'error', title: 'Oops...', text: errtext});
    }});
  }

  // Precargar la imagen en la vista
  cambioImagen( evento ): void {
    if (evento.target.files && evento.target.files[0]) {
      // Comprobamos si es una imagen jpg, jpet, png
      const extensiones = ['jpeg','jpg','png'];
      const nombre: string = evento.target.files[0].name;
      const nombrecortado: string[] = nombre.split('.');
      const extension = nombrecortado[nombrecortado.length - 1];
      if (!extensiones.includes(extension)) {
        // Si no teniamos ningúna foto ya seleccionada antes, dejamos el campo pristine
        if (this.foto === null) {
          this.datosForm.get('imagen').markAsPristine();
        }
        Swal.fire({icon: 'error', title: 'Oops...', text: 'El archivo debe ser una imagen jpeg, jpg o png'});
        return;
      }

      let reader = new FileReader();
      // cargamos el archivo en la variable foto que servirá para enviarla al servidor
      this.foto = evento.target.files[0];
      // leemos el archivo desde el dispositivo
      reader.readAsDataURL(evento.target.files[0]);
      // y cargamos el archivo en la imagenUrl que es lo que se inserta en el src de la imagen
      reader.onload = (event) => {
        this.imagenUrl = event.target.result.toString();
        this.fileText = nombre;
      };
    } else {
      // console.log('no llega target:', event);
    }
  }
  // Recupera los datos del usuario
  cargarUsuario():void {
    //console.log('cargarUsuario():',this.usuarioService);
    let nombre = this.usuarioService.nombre;
    //console.log("nombre = ",nombre);
    this.datosForm.get('nombre').setValue(this.usuarioService.nombre);
    this.datosForm.get('apellidos').setValue(this.usuarioService.apellidos);
    this.datosForm.get('email').setValue(this.usuarioService.email);
    this.datosForm.get('imagen').setValue('');
    this.imagenUrl = this.usuarioService.imagenURL;
    this.foto = null;
    this.fileText = 'Seleccione archivo';
    this.datosForm.markAsPristine();
  }

  imprimir() {
    this.cargarUsuario();
    //console.log('imprimir():',this.usuarioService);
  }

  cancelarPassword() {
    this.sendpass = false;
    this.showOKP = false;
    this.datosPassword.reset();
  }

  campoNoValido( campo: string): boolean {
    return this.datosForm.get(campo).invalid;
  }

  campopNoValido( campo: string): boolean {
    return this.datosPassword.get(campo).invalid && this.sendpass;
  }
  // Comprobar que los campos son iguales
  passwordNoIgual(): boolean {
    return !(this.datosPassword.get('nuevopassword').value === this.datosPassword.get('nuevopassword2').value) && this.sendpass;
  }

  nombre() {
    return this.usuarioService.nombre;
  }
  //-------Funciones para modal

  cargarAjustes(){
    // console.log(1)
    if(this.usuarioService.logged) {

      this.cargarUsuario();
    }
    return this.usuarioService.logged;
  }

  mostrarModal(){
    // console.log(2)
    return this.comunicacionService.getData('mostrarAjustes');
  }

  hideModal(){
    this.comunicacionService.setData('mostrarAjustes', false);
  }

}
