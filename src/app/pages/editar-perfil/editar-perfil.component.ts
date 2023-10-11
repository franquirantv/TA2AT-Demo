import { Component, OnInit, OnChanges, AfterViewInit, Input, ViewChild } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { formatDate } from '@angular/common';
import { faSave, faMessage, faBell, faUser, faFilter, faMagnifyingGlass, faNewspaper, faCheckCircle, faBrain, faCheck, faTimes, faWarning, faComputerMouse, faArrowsUpDownLeftRight,
faRotate, faHandPointer } from '@fortawesome/free-solid-svg-icons';

import * as Notiflix from 'notiflix';
import { UploadsService } from 'src/app/services/uploads.service';
import { Motorpropio } from 'src/app/services/motorpropio.service';
import { UsuariosService } from 'src/app/services/usuario.service';



@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.component.html',
  styleUrls: ['./editar-perfil.component.css']
})
export class EditarPerfilComponent implements OnInit{

  defaultDate: Date;
  isActive = false;
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
  faArrowsUpDownLeftRight = faArrowsUpDownLeftRight;
  faComputerMouse = faComputerMouse;
  faRotate = faRotate;
  faHandPointer = faHandPointer;

  public imagenUrl = 'assets/images/blank-profile-picture.png';
  public foto: File = null;
  public subs$: Subscription = new Subscription();
  public sendpass = false;
  public showOKP = false;
  public showOKD = false;
  public nostate = true;
  public fileText = 'Seleccione archivo';

  private nombreUsuario;
  public colorPiel:string = '';
  public texturica:string = '';

  toggle = true;
  toggle2 = false;

  public datosForm = this.fb.group({
    email: ['', [Validators.required, Validators.email] ],
    nombre: ['', Validators.required ],
    apellidos: ['', Validators.required ],
    imagen: [''],
    //fechaE: [formatDate(this.usuarioService.fnacimiento, 'dd/MM/yyyy', 'es'), [Validators.required]],
  });

  public datosPassword = this.fb.group({
    password: ['', Validators.required],
    nuevopassword: ['', Validators.required],
    nuevopassword2: ['', Validators.required],
  })

  constructor( private usuarioService: UsuariosService,
               private uploadsService: UploadsService,
               public fb: FormBuilder,
               private router: Router,
               private motor: Motorpropio) {
                this.defaultDate = new Date('2022-01-01');
               }



  ngOnInit() {
    this.cargarUsuario();
    this.ocultarCuenta();
  }

  ngAfterViewInit() {

    // Establecer el valor por defecto del input después de que Angular haya completado la detección de cambios inicial
    setTimeout(() => {
      this.cargarUsuario();
      this.defaultDate = new Date('2022-01-01');
    }, 500);
  }

  ngOnChanges() {
    this.cargarUsuario();
  }

  getFb() {
    return this.fb;
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
        Notiflix.Notify.success('¡Tu contraseña ha sido actualizada !', {
          timeout: 1200,
          showOnlyTheLastOne: true,
          });
  }

  // Actualizar datos de usuario
  enviar(): void {
    if (this.datosForm.invalid) { return; }

    // Actualizamos los datos del formulario y si va bien actualizamos foto
    this.usuarioService.actualizarUsuarioE( this.usuarioService.uid, this.datosForm.value )
    .subscribe({
      next: res => {
      this.usuarioService.establecerdatos( res['usuario'].nombre, res['usuario'].apellidos, res['usuario'].email);

      // Si la actualización de datos ha ido bien, entonces actualizamso foto si hay
      if (this.foto ) {
        this.uploadsService.subirFoto( this.usuarioService.uid, this.foto, 'fotoperfil')
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
      //Le decimos a usuario.model.ts que se ha hecho un cambio. Necesario para Google
      //localStorage.setItem("cambioImagen","true");

      this.fileText = 'Seleccione archivo';
      this.datosForm.markAsPristine(); // marcamos reiniciado de cambios
      this.showOKD = true;
    }, error: err =>{
      const errtext = err.error.msg || 'No se pudo guardar los datos';
      Swal.fire({icon: 'error', title: 'Oops...', text: errtext});
    }});
    Notiflix.Notify.success('¡Tus datos han sido actualizados!', {
      timeout: 1200,
      showOnlyTheLastOne: true,
      });
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
        this.usuarioService.establecerimagen(this.imagenUrl);
      };
    } else {
      // console.log('no llega target:', event);
    }
  }

  //Necesario solo si se usa localStorage para rellenar los campos
  cargarUsuarioHelper():void {
    if(localStorage.getItem('nombreUsuario') === '')
      localStorage.setItem("nombreUsuario",this.usuarioService.nombre);

    if(localStorage.getItem('apellidosUsuario') === '')
      localStorage.setItem("apellidosUsuario",this.usuarioService.apellidos);

    if(localStorage.getItem('emailUsuario') === '')
      localStorage.setItem("emailUsuarioo",this.usuarioService.email);

    if(localStorage.getItem('imagenUsuario') === '')
      localStorage.setItem("imagenUsuario",this.usuarioService.imagen);
  }
  // Recupera los datos del usuario
  cargarUsuario():void {
    //alert("cargarUsuario "+this.usuarioService.nombre);
    //if(this.nombreUsuario == null)
     // this.nombreUsuario = this.usuarioService.nombre;

     //Sin el settimeout no funciona porque carga antes que el validator
     //TIMEOUT PROHIBIDO
     //setTimeout(() => {
      //console.log("timeout cargarUsuario:",this.usuarioService);
      //alert(this.usuarioService.fnacimiento+ " "+ this.usuarioService.nombre);
      this.datosForm.get('nombre').patchValue(this.usuarioService.nombre);
      this.datosForm.get('apellidos').patchValue(this.usuarioService.apellidos);
      this.datosForm.get('email').patchValue(this.usuarioService.email);

      //Provocaban error y no permitian el funcionamiento. Por razones de seguridad no permite cambiar programaticamente imagenes
      //this.datosForm.get('imagen').setValue(this.usuarioService.imagen);
      //this.datosForm.get('fechaE').setValue(this.usuarioService.fnacimiento.toString());

      //`${base_url}/upload/fotoperfil/no-imagen?token=${token}`;
      //Ahora mismo necesario para que en editar perfil aparezca bien la imagen
      //alert(this.imagenUrl);
      if(this.usuarioService.isImagenGoogle && this.imagenUrl.toLowerCase().includes("http"))
        this.imagenUrl = this.usuarioService.imagenURL;
      else
        this.imagenUrl = this.usuarioService.imagenURL.split('?')[0];

     //TODO usuarioservices establecerImagen

      //this.foto = null;
    //}, 500);

    this.fileText = 'Seleccione archivo';
    this.datosForm.markAsPristine();
  }

  nombre() {
    //console.log('nombre() ',this.usuarioService.nombre );
    return this.usuarioService.nombre;
  }

  apellidos() {
    return this.usuarioService.apellidos;
  }

  email() {
    return this.usuarioService.email;
  }

  imagen () {
    return this.usuarioService.imagen;
  }

  cargarAjustes(){
    // console.log(1)
    //NO ES SOLUCION, QUITA LA CARGA DE TODOS LOS CAMPOS
    /*if(this.usuarioService.logged) {
      this.cargarUsuario();
    }*/
    return this.usuarioService.logged;
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

  marcado() {
    this.toggle = !this.toggle;
    this.toggle2 = !this.toggle2;
  }

  marcado2() {
    this.toggle = !this.toggle;
    this.toggle2 = !this.toggle2;
  }

  mensaje() {
    Notiflix.Report.init({
      plainText: false,
    });
    /*Notiflix.Notify.info(
      `CONTROLES<br>Click derecho arrastrar: mover modelo<br>Click izquierdo arrastrar: rotar modelo<br>Rueda del ratón: zoom<br>Doble click izquierdo : seleccionar`,
      {
        timeout: 5000,
      },
    );*/
    var message = 'CONTROLES<br>- Click derecho arrastrar: mover modelo<br>- Click izquierdo arrastrar: rotar modelo<br>- Rueda del ratón: zoom<br>- Doble click izquierdo : seleccionar';
    Notiflix.Report.info('CONTROLES', message, '¡Entendido!');
  }

  cambiarColorPiel(color:string){
    // console.log("COLOR: ", color)
    this.colorPiel = color;

    switch (this.colorPiel) {
      case 'muynegro': this.texturica = '../../../assets/painball/TEXTURA4.jpg';

        break;
      case 'negro': this.texturica = '../../../assets/painball/TEXTURA1.jpg';

        break;
      case 'marron': this.texturica = '../../../assets/painball/TEXTURA2.jpg';

        break;
      case 'blanco': this.texturica = '../../../assets/painball/Map-COL.jpg';

        break;

    }
    // console.log("TEXTURA: ",this.texturica)
  }

  actualizarAvatar(){
    // console.log(this.texturica)
    this.motor.cambiarPiel(this.texturica);
  }

  ocultarPerfil() {
    var contenido = document.getElementById('Perfil');

    var contenido2 = document.getElementById('Cuenta');
    if (contenido2.style.display === 'none') {
      contenido2.style.display = 'block';
    }
    if (contenido.style.display === 'none') {
      contenido.style.display = 'block';
    } else {
      contenido.style.display = 'none';
    }
  }
  ocultarCuenta() {
    var contenido = document.getElementById('Cuenta');
    var contenido2 = document.getElementById('Perfil');

    if (contenido2.style.display === 'none') {
      contenido2.style.display = 'block';
    }

    if (contenido.style.display === 'none') {
      contenido.style.display = 'block';
    } else {
      contenido.style.display = 'none';
    }
  }
}
