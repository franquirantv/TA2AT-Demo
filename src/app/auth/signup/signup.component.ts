import { Component, OnInit } from '@angular/core';
import { FormControl,FormGroup,Validators,FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { Meta } from '@angular/platform-browser';
import { AvatarService } from 'src/app/services/avatar.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit {

  public personalDetails = this.formBuilder.group({
    rol: ['', Validators.required]
  });

  public datosUsuario = this.formBuilder.group({
    usu: ['', [Validators.required]],
    nombre: ['', [Validators.required]],
    apellidos: ['', [Validators.required]],
    fnacimiento: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],//se ponene corchetes si vamos a poner varias validaciones
    password: ['', Validators.required],
    password2: ['', Validators.required],
    foto: [''],
    politicaAceptada: ['', Validators.required]

  });

  public datosEstudio = this.formBuilder.group({
    est: ['', [Validators.required]],
    //nombre: ['', [Validators.required]],
    //apellidos: ['', [Validators.required]],
    CIF: ['', [Validators.required]],
    //fnacimiento: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],//se ponene corchetes si vamos a poner varias validaciones
    password: ['', Validators.required],
    password2: ['', Validators.required],
    foto: [''],
    politicaAceptada: ['', Validators.required]
  });

  rol_step = false;
  registro_step = false;
  resumen_step = false;
  step = 1;
  rolSelected: string='Usuario';
  visible:boolean=true;
  changetype:boolean=true;

  public formSubmit = false;
  public waiting = false;

  constructor( private formBuilder: FormBuilder,
              private usuarioService: UsuariosService,
              private router: Router,
              private http: HttpClient,
              private meta: Meta,
              private avatarService: AvatarService
              ) { }

  ngOnInit(): void {
    this.redirectToPageAfterDelay();
    this.meta.addTag({ name: 'description', content: 'Regístrate en TA2AT para acceder a una amplia variedad de servicios y contenido exclusivo. Crea una cuenta en pocos minutos y disfruta de una experiencia personalizada. Proporciona tu información personal y de contacto, elige una contraseña segura y ¡listo! Únete a nuestra comunidad en línea y empieza a disfrutar de todas las ventajas de ser miembro.' });
  }

  redirectToPageAfterDelay(): void {
    setTimeout(() => {
      if(this.step==3){
        this.router.navigate(['/']);
      }
    }, 15000);
  }

  viewpass(){
    this.visible=!this.visible;
    this.changetype=!this.changetype;
  }

  desbloquear(){
    return this.rolSelected==='';
  }

  usuario(){
    this.rolSelected='Usuario';
  }

  estudio(){
    this.rolSelected='Estudio';
  }

  modal(){
    Swal.fire({
      title: 'Aviso',
      text: 'Hemos restringido temporalmente los registros. Disculpad las molestias.',
      icon: 'warning',
      confirmButtonText: 'Ok',
      allowOutsideClick: false
    });
  }

  next(){

    if(this.step==1){
      this.rol_step = true;

      if (this.rolSelected==='') {
        return
      }
      this.step++;
    }

    else if(this.step==2){
      this.registro_step = true;
      this.step++;
    }
  }

  previous(){
    this.formSubmit=false;
    if(this.step==1){
      this.step--
      this.registro_step = false;
    }
    if(this.step==2){
      this.step--
      this.rolSelected='';
      this.resumen_step = false;
    }
    if(this.step==3){
      this.step--
    }
  }

  mostrarAviso = false; // agregamos una variable para controlar el aviso

  campoValido( campo: string) {
    return this.datosEstudio.get(campo).valid || !this.formSubmit;
  }

  campoValido2( campo: string) {
    return this.datosUsuario.get(campo).valid || !this.formSubmit;//valido la propiedad valid dentro de el fromulario en concreto dentro de campo
  }

  registerEstudio() {//ESTO HAY QUE CAMBIARLO Y DECIDIR QUE PASAREMOS
    console.log('registerEstudio()');
    this.formSubmit = true;

    let camposInvalidos = [];

    if (!this.campoValido('est')) {
      camposInvalidos.push('Nombre estudio');
      // console.log("entro");
    }
    if (!this.campoValido('email')) {
      camposInvalidos.push('Email');
    }
    if (!this.campoValido('password')) {
      camposInvalidos.push('Contraseña');
    }
    if (!this.campoValido('password2')) {
      camposInvalidos.push('Confirmación de contraseña');
    }

    // Construir el HTML de la alerta dinámicamente
    let alertaHTML = `<h1>Errores en los campos</h1>
                      <h4>Asegúrate de cumplir las siguientes condiciones:</h4>
                      ${camposInvalidos.map(campo => `<p class="text-danger">${campo} es obligatorio</p>`).join('')}
                      ${this.filtro_contraE() ? '' : '<p class="text-danger">La contraseña debe contener al menos una mayúscula, una minúscula, un número, debe estar compuesta entre 6 y 20 y no debe contener espacios en blanco.</p>'}
                      ${this.contraE() ? '' : '<p class="text-danger">Las contraseñas deben ser iguales</p>'}`;

    if(!this.datosEstudio.value.politicaAceptada){
      alertaHTML+='<p class="text-danger">Debes aceptar los términos y condiciones de TA2AT.</p>';
    }

    let avatar = {
        usuario: this.usuarioService.uid,
        modelo: "./assets/humano/chico.glb", // Por defecto, el modelo del hombre
        piel: "#e9caae", // Por defecto, el color blanco
        tatuajes: [],
    }

    let obj = {
      nombre_estudio:this.datosEstudio.get('est').value,
      //nombre:this.datosEstudio.get('nombre').value,
      //apellidos:this.datosEstudio.get('apellidos').value,
      CIF:this.datosEstudio.get('CIF').value,
      email:this.datosEstudio.get('email').value,
      password:this.datosEstudio.get('password').value,
      foto: this.datosEstudio.get('foto').value,
      //fnacimiento:new Date(this.registerForm2.get('fnacimiento').value),
      rol:'ROL_ESTUDIO',
      avatar: avatar,
    }

    // console.log(this.datosEstudio);
    if (!this.datosEstudio.valid || !this.datosEstudio.value.politicaAceptada) {
      Swal.fire({
        icon: 'warning',
          html: alertaHTML
      })
      return;
    }

    this.waiting = true;

    this.usuarioService.registro2(obj).subscribe({
      next: res => {
        console.log('Respuesta al registrarse: ',res);
        ++this.step;

        this.waiting = false;
      },
      error: err =>{
        // console.log(err);
        Swal.fire({
          title: 'Error!',
          text: err.error.msg || 'No pudo completarse la acción, vuelva a intentarlo más tarde',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          allowOutsideClick: false
        });
        this.waiting = false;
      },
      complete: () => {

        // console.log('req complete');
      }
    });

}

  registerUsu() {//ESTO HAY QUE CAMBIARLO Y DECIDIR QUE PASAREMOS

    this.formSubmit = true;

    let camposInvalidos = [];

    // Comprobar si los campos son válidos y agregar los no válidos al array
    if (!this.campoValido2('usu')) {
      camposInvalidos.push('Nombre de Usuario');
    }
    if (!this.campoValido2('nombre')) {
      camposInvalidos.push('Nombre');
    }
    if (!this.campoValido2('apellidos')) {
      camposInvalidos.push('Apellidos');
    }
    if (!this.campoValido2('email')) {
      camposInvalidos.push('Email');
    }
    if (!this.campoValido2('password')) {
      camposInvalidos.push('Contraseña');
    }
    if (!this.campoValido2('password2')) {
      camposInvalidos.push('Confirmación de contraseña');
    }

    let mayorDe16 = this.esMayorDe16(new Date(this.datosUsuario.get('fnacimiento').value));
    // Construir el HTML de la alerta dinámicamente
    let alertaHtml = `<h1>Errores en los campos</h1>
                      <h4>Asegúrate de cumplir las siguientes condiciones:</h4>
                      ${camposInvalidos.map(campo => `<p class="text-danger">${campo} es obligatorio</p>`).join('')}
                      ${this.filtro_contraU() ? '' : '<p class="text-danger">La contraseña debe contener al menos una mayúscula, una minúscula, un número, debe estar compuesta entre 6 y 20 y no debe contener espacios en blanco.</p>'}
                      ${this.contraU() ? '' : '<p class="text-danger">Las contraseñas deben ser iguales</p>'}
                      ${mayorDe16 ? '' : '<p class="text-danger">Debes ser mayor de 16 años para registrarte en TA2AT.</p>'}`;

    if(!this.datosUsuario.value.politicaAceptada){
      alertaHtml+='<p class="text-danger">Debes aceptar los términos y condiciones de TA2AT.</p>';
    }

    let obj = {
      usu:this.datosUsuario.get('usu').value,
      nombre:this.datosUsuario.get('nombre').value,
      apellidos:this.datosUsuario.get('apellidos').value,
      email:this.datosUsuario.get('email').value,
      password:this.datosUsuario.get('password').value,
      foto: this.datosUsuario.get('foto').value,
      fnacimiento:new Date(this.datosUsuario.get('fnacimiento').value),
      rol:'ROL_USUARIO',
    }

    // console.log(this.datosUsuario);
    if (!this.datosUsuario.valid || !this.datosUsuario.value.politicaAceptada || !mayorDe16) {
      Swal.fire({
        icon: 'warning',
        html: alertaHtml
      })
      return;
    }

    this.waiting = true;

    this.usuarioService.registro(obj).subscribe({
      next: res => {
        // console.log('Respuesta al registrarse: ',res);
        ++this.step;

        this.waiting = false;
      },
      error: err =>{
        // console.log(err);
        Swal.fire({
          title: 'Error!',
          text: err.error.msg || 'No pudo completarse la acción, vuelva a intentarlo más tarde',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          allowOutsideClick: false
        });
        this.waiting = false;
      },
      complete: () => {
        // console.log('req complete');
      }
    });

  }

  public fnacimiento = this.datosUsuario.get('fnacimiento').value;
  public hoy = new Date();
  public fechaNacimientoObj = new Date(this.fnacimiento);
  public edad = this.hoy.getFullYear() - this.fechaNacimientoObj.getFullYear();
  public mes = this.hoy.getMonth() - this.fechaNacimientoObj.getMonth();

  esMayorDe16(fechaNacimiento: Date): boolean {
    const hoy = new Date();
    const fechaNacimientoObj = new Date(fechaNacimiento);
    const edad = hoy.getFullYear() - fechaNacimientoObj.getFullYear();
    const mes = hoy.getMonth() - fechaNacimientoObj.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimientoObj.getDate())) {
      this.edad--;
    }
    return edad >= 16 || !this.formSubmit;
  }

//Compruebo que las contraseñas son iguales
  contraU( ){
      return ( this.datosUsuario.get('password2').value === this.datosUsuario.get('password').value) || !this.formSubmit;
  }
  contraE( ){
    return ( this.datosEstudio.get('password2').value === this.datosEstudio.get('password').value) || !this.formSubmit;
}

      //Filtro para las contraseñas
  filtro_contraU(){
    var password=this.datosUsuario.get('password').value;
    var no_espacios = true;
    var mayuscula = false;
    var minuscula = false;
    var numero = false;
    var tamaño = false;
    var tamaño_min = 6;
    var tamaño_max = 20;
    var cont = 0;
      //No hay espacios
    while (no_espacios && (cont < password.length)){
      if(password.charAt(cont)==" "){
        no_espacios= false;
      }
      cont++;
    }
      //Tamaño de la contraseña
    if(password.length<=tamaño_max && password.length>=tamaño_min){
      // console.log('valido1');
      tamaño= true;
    }
      //Hay mayuscula
    if ( password.match(/[A-Z]/) ) {
      // console.log('valido2');
      mayuscula=true;
    }
      //Hay minuscula
    if ( password.match(/[a-z]/) ) {
      // console.log('valido3');
        minuscula=true;
    }
      //Hay numero
      if ( password.match(/\d/) ) {
        // console.log('valido4');
        numero=true;
      }
    return (no_espacios && tamaño && mayuscula && minuscula && numero) || !this.formSubmit;
  }

  filtro_contraE(){
    var password=this.datosEstudio.get('password').value;
    var no_espacios = true;
    var mayuscula = false;
    var minuscula = false;
    var numero = false;
    var tamaño = false;
    var tamaño_min = 6;
    var tamaño_max = 20;
    var cont = 0;
      //No hay espacios
    while (no_espacios && (cont < password.length)){
      if(password.charAt(cont)==" "){
        no_espacios= false;
      }
      cont++;
    }
      //Tamaño de la contraseña
    if(password.length<=tamaño_max && password.length>=tamaño_min){
      // console.log('valido1');
      tamaño= true;
    }
      //Hay mayuscula
    if ( password.match(/[A-Z]/) ) {
      // console.log('valido2');
      mayuscula=true;
    }
      //Hay minuscula
    if ( password.match(/[a-z]/) ) {
      // console.log('valido3');
        minuscula=true;
    }
      //Hay numero
      if ( password.match(/\d/) ) {
        // console.log('valido4');
        numero=true;
      }
    return (no_espacios && tamaño && mayuscula && minuscula && numero) || !this.formSubmit;
  }

//Filtro para compropbar que los campos que sean de su tipo (strings, date,...)



  ////////////////////////////////////////////////////////////////////////////////

  url="./assets/images/blank-profile-picture.png";

  onselectFile(e){
    if(e.target.files){
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload=(event:any)=>{
        this.url=event.target.result;
      }
    }
  }

}
