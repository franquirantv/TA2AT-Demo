import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { Meta } from '@angular/platform-browser';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { AvatarService } from 'src/app/services/avatar.service';
import { loginform, Googleloginform } from '../../interfaces/login-form.interface';

@Component({
  selector: 'app-signup-google',
  template: '{{ email }} {{ firstName }} {{ lastName }} {{ name }} {{ photoUrl }} {{ id }} {{ idToken }}',
  templateUrl: './signup-google.component.html',
  styleUrls: ['./signup-google.component.css']
})
export class SignupGoogleComponent {
  public personalDetails = this.formBuilder.group({
    rol: ['', Validators.required]
  });
  public user: any = null;
  public loggedIn: any;
  public urlTree: any;

  public email: any = null;
  public firstName: any = null;
  public lastName: any = null;
  public name: any = null;
  public photoUrl: any = null;
  public id: any = null;
  public idToken: any = null;
  public nombreUsuario: any = null;


  public estaDeshabilitado: boolean = true;

  public datosUsuario = this.formBuilder.group({
    usu: ['', [Validators.required]],
    nombre: ['', [Validators.required]],
    apellidos: ['', [Validators.required]],
    fnacimiento: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    foto: [''],
    politicaAceptada: ['', Validators.required]

  });

  public datosEstudio = this.formBuilder.group({
    est: ['', [Validators.required]],
    CIF: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    foto: [''],
    politicaAceptada: ['', Validators.required]
  });

  rol_step = false;
  registro_step = false;
  resumen_step = false;
  step = 1;
  rolSelected: string = '';
  visible: boolean = true;
  changetype: boolean = true;

  public formSubmit = false;
  public waiting = false;

  constructor(private formBuilder: FormBuilder,
    private usuarioService: UsuariosService,
    private router: Router,
    private http: HttpClient,
    private meta: Meta,
    private authService: SocialAuthService,
    private activatedRoute: ActivatedRoute,
    private avatarService: AvatarService
  ) {

    this.urlTree = this.router.parseUrl(this.router.url);
    //this.type = this.urlTree.queryParams['type'];
    //this.agent = this.urlTree.queryParams['agent'];

  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.email = params['email'] || null;
      this.nombreUsuario = "" + this.email.split("@", 1);
      this.firstName = params['firstName'] || null;
      this.lastName = params['lastName'] || null;
      this.name = params['name'] || null;
      this.photoUrl = params['photoUrl'] || null;
      this.url = this.photoUrl;
      this.id = params['id'] || null;
      this.idToken = params['idToken'] || null;
      //var id = this.activatedRoute.snapshot.queryParams['email'];
    });

    this.redirectToPageAfterDelay();
    this.meta.addTag({ name: 'description', content: 'Regístrate en TA2AT para acceder a una amplia variedad de servicios y contenido exclusivo. Crea una cuenta en pocos minutos y disfruta de una experiencia personalizada. Proporciona tu información personal y de contacto, elige una contraseña segura y ¡listo! Únete a nuestra comunidad en línea y empieza a disfrutar de todas las ventajas de ser miembro.' });
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
    });
  }

  redirectToPageAfterDelay(): void {
    setTimeout(() => {
      if (this.step == 3) {
        this.router.navigate(['/login']);
      }
    }, 10000);
  }

  viewpass() {
    this.visible = !this.visible;
    this.changetype = !this.changetype;
  }

  get personal() { return this.personalDetails.controls; }

  get address() { return this.datosUsuario.controls; }

  get education() { return this.datosEstudio.controls; }

  desbloquear() {
    return this.rolSelected === '';
  }

  usuario() {
    this.rolSelected = 'Usuario';
  }

  estudio() {
    this.rolSelected = 'Estudio';
  }

  next() {

    if (this.step == 1) {
      this.rol_step = true;

      if (this.rolSelected === '') {
        return
      }
      this.step++;

    }

    else if (this.step == 2) {
      this.registro_step = true;
      /*if (!this.datosUsuario.valid || !this.datosEstudio.valid) {
        console.warn('Errores en le formulario');
        return
      } //Esto es lo que no deja avanzar//*/
      this.step++;
    }


  }

  previous() {
    this.formSubmit = false;
    if (this.step == 1) {
      this.step--
      this.registro_step = false;
    }
    if (this.step == 2) {
      this.step--
      this.rolSelected = '';
      this.resumen_step = false;
    }
    if (this.step == 3) {
      this.step--
    }

  }

  campoValido(campo: string) {
    return this.datosEstudio.get(campo).valid || !this.formSubmit;
  }

  campoValido2( campo: string) {
    return this.datosUsuario.get(campo).valid || !this.formSubmit;
  }

  registerGoogleEstudio() {
    console.log('LLEGO 1');
    this.formSubmit = true;

    let camposInvalidos = [];

    // Comprobar si los campos son válidos y agregar los no válidos al array
    if (!this.campoValido('CIF')) {
      camposInvalidos.push('CIF');
    }
    if (!this.campoValido('est')) {
      camposInvalidos.push('Apellidos');
    }
    if (!this.campoValido('email')) {
      camposInvalidos.push('Email');
    }

    console.log('LLEGO 2');
    // Construir el HTML de la alerta dinámicamente
    let alertaHtml = `<h1>Errores en los campos</h1>
                      <h4>Asegúrate de cumplir las siguientes condiciones:</h4>
                      ${camposInvalidos.map(campo => `<p class="text-danger">${campo} es obligatorio</p>`).join('')}`;

    if(!this.datosEstudio.value.politicaAceptada){
      alertaHtml+='<p class="text-danger">Debes aceptar los términos y condiciones de TA2AT.</p>';
    }

    if (!this.datosEstudio.valid || !this.datosEstudio.value.politicaAceptada) {
      console.log('LLEGO A ENVIAR POP UP');
      Swal.fire({
        icon: 'warning',
        html: alertaHtml
      })
      return;
    }

    //Creo el avatar que va a tener el usuario
    let avatar = {
      usuario: '',
      modelo: "../../assets/humano/chico.glb",
      piel: "#e9caae",
      tatuajes: [],
    }

    let obj = {
      nombre: this.name,
      nombre_estudio: this.datosEstudio.get('est').value,
      apellidos: this.lastName,
      CIF: this.datosEstudio.get('CIF').value,
      email: this.datosEstudio.get('email').value,
      //this.datosEstudio.get('foto').value
      foto: this.photoUrl, //foto
      photoUrl: this.photoUrl, //foto
      rol: 'ROL_ESTUDIO',
      provider: "GOOGLE",
      firstName: this.firstName,
      id : this.id,
      idToken: this.idToken,
      lastName: this.lastName,
      name: this.name,
      imagenGoogle: "true",
      avatar: avatar,
    }


    this.waiting = true;
    this.usuarioService.registroGoogle(obj).subscribe({
      next: res => {
        let obj2 = {
          email:res['usuario'].email,
        }

        this.usuarioService.loginGoogle(obj2.email).subscribe({
          next: res => {
            this.waiting = false;
            /////////////////////////////RUTA_DESTINO//////////////////////////////////////////////////////
                window.location.assign('/explorar');

          },
          error: err =>{
            console.log(err);
            Swal.fire({
              title: 'Error!',
              text: err.error.msg || 'No pudo completarse la acción, vuelva a intentarlo más tarde',
              icon: 'error',
              confirmButtonText: 'Cool',
              allowOutsideClick: false
            });
            this.waiting = false;
            //this.router.navigateByUrl('/login');
          },
          complete: () => {
            console.log('req complete');
          }
        });
        this.waiting = false;
      },
      error: err => {
        // console.log(err);
        Swal.fire({
          title: 'ERROR',
          text: 'Ha habido un problema al iniciar sesión con Google. Vuelve a intentarlo más tarde.',
          icon: 'error',
          confirmButtonText: 'Entendido',
          allowOutsideClick: false
        });
        this.waiting = false;
      },
      complete: () => {
        // console.log('req complete');
      }
    });
  }

  registerGoogleUsuario() {
    console.log('LLEGO 1');
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

    console.log('LLEGO 2');
    let mayorDe16 = this.esMayorDe16(new Date(this.datosUsuario.get('fnacimiento').value));
    // Construir el HTML de la alerta dinámicamente
    let alertaHtml = `<h1>Errores en los campos</h1>
                      <h4>Asegúrate de cumplir las siguientes condiciones:</h4>
                      ${camposInvalidos.map(campo => `<p class="text-danger">${campo} es obligatorio</p>`).join('')}
                      ${mayorDe16 ? '' : '<p class="text-danger">Debes ser mayor de 16 años para registrarte en TA2AT.</p>'}`;

    if(!this.datosUsuario.value.politicaAceptada){
      alertaHtml+='<p class="text-danger">Debes aceptar los términos y condiciones de TA2AT.</p>';
    }

    if (!this.datosUsuario.valid || !this.datosUsuario.value.politicaAceptada || !mayorDe16) {
      console.log('LLEGO A ENVIAR POP UP');
      Swal.fire({
        icon: 'warning',
        html: alertaHtml
      })
      return;
    }
    console.log('LLEGO 3');
    //Creo el avatar que va a tener el usuario
    let avatar = {
      usuario: '',
      modelo: "../../assets/humano/chico.glb",
      piel: "#e9caae",
      tatuajes: [],
    }

    let obj = {
      email: this.datosUsuario.get('email').value,
      rol: 'ROL_USUARIO',
      usu: this.datosUsuario.get('usu').value,
      nombre: this.datosUsuario.get('nombre').value,
      apellidos: this.datosUsuario.get('apellidos').value,
      foto: this.photoUrl,
      fnacimiento: new Date(this.datosUsuario.get('fnacimiento').value),
      photoUrl: this.photoUrl,
      provider: "GOOGLE",
      firstName: this.firstName,
      id : this.id,
      idToken: this.idToken,
      lastName: this.lastName,
      name: this.name,
      imagenGoogle: "true",
      avatar: avatar,
    }

    console.log('LO QUE ENVÍO A BACKEND', obj);
    this.formSubmit = true;
    if (!this.datosUsuario.valid) {
      Swal.fire({
        icon: 'warning',
        html: `<h1>Errores en los campos</h1>
                          <h4>Asegurate de cumplir las siguientes condiciones</h4>
                          <p class="text-danger">Los campos marcados con asterico son obligatorios</p>
                          <p class="text-danger">El email debe tener un formato correcto</p>
                          <p class="text-danger">Debes aceptar los términos y condiciones de TA2AT</p>
                  `
      })
      return;
    }

    this.waiting = true;
    console.log('ENTRO A REGISTRAR USUARIO CON GOOGLE');
    this.usuarioService.registroGoogle(obj).subscribe({
      next: res => {
        let obj2 = {
          email:res['usuario'].email,
        }
        this.usuarioService.loginGoogle(obj2.email).subscribe({
          next: res => {
            this.waiting = false;
            /////////////////////////////RUTA_DESTINO//////////////////////////////////////////////////////
                window.location.assign('/explorar');

          },
          error: err =>{
            console.log(err);
            Swal.fire({
              title: 'Error!',
              text: err.error.msg || 'No pudo completarse la acción, vuelva a intentarlo más tarde',
              icon: 'error',
              confirmButtonText: 'Cool',
              allowOutsideClick: false
            });
            this.waiting = false;
            //this.router.navigateByUrl('/login');
          },
          complete: () => {
            console.log('req complete');
          }
        });
        this.waiting = false;
      },
      error: err => {
        // console.log(err);
        Swal.fire({
          title: 'ERROR',
          text: 'Ha habido un problema al iniciar sesión con Google. Vuelve a intentarlo más tarde.',
          icon: 'error',
          confirmButtonText: 'Entendido',
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

  url = this.photoUrl;

  onselectFile(e) {
    if (e.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (event: any) => {
        //Le decimos a usuario.model.ts que se ha hecho un cambio. Necesario para Google
        //localStorage.setItem("cambioImagen","true");
        this.url = event.target.result;
      }
    }
  }

}
