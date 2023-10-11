import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService } from 'src/app/services/usuario.service';
import { SocialLoginModule, SocialAuthService, SocialUser, GoogleLoginProvider  } from '@abacritt/angularx-social-login';
import Swal from 'sweetalert2';
//import { getCookie, setCookie } from 'typescript-cookie'
import { ShowHidePasswordDirective } from 'src/app/directivas/show-hide-password.directive';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public formSubmit = false;
  public waiting = false;
  public user: any = null;
  public loggedIn: any;
  //public existeBool = false;

  public loginForm = this.fb.group({
    email: [localStorage.getItem('email') || '', [Validators.required, Validators.email]],//se ponene corchetes si vamos a poner varias validaciones
    password: ['', Validators.required],
    remember: [ false || localStorage.getItem('email')]//esto hace que siempre sea falso a no ser que haya valor verdadero en la segunda condicion
  });


  constructor( private fb: FormBuilder,
               private usuarioService: UsuariosService,
               private router: Router,
               private authService: SocialAuthService,
               private meta: Meta
               ) { }

  ngOnInit(): void {
    this.meta.addTag({ name: 'description', content: 'Ingresa a tu cuenta en TA2AT para acceder a todos nuestros servicios y contenido exclusivo. Inicia sesión con tu correo electrónico y contraseña para disfrutar de una experiencia personalizada y única. ¡Bienvenido de nuevo!' });
    /* Google */

      this.authService.authState.subscribe((user) => {
        this.user = user;
        this.loggedIn = (user != null);

        if (user) {

          let obj = {
            email:user.email,
            rol: "ROL_USUARIO",
            firstName: user.firstName,
            id : user.id,
            idToken: user.idToken,
            lastName: user.lastName,
            name: user.name,
            photoUrl: user.photoUrl,
            provider: "GOOGLE"
          }

          let existeC:any;
          this.usuarioService.existeCorreo(obj.email).subscribe({
            next: res => {
              //this.existeBool = !this.existeBool;
              existeC = res['existe'];

              if(existeC) {
                this.loginG(user);
              } else {
                // this.usuarioService.registroGoogle(obj).subscribe({
                //   next: res => {

                this.router.navigate(
                  ['/signup-google'],
                  { queryParams: {
                    email:user.email,
                      firstName: user.firstName,
                      lastName: user.lastName,
                      name: user.name,
                      photoUrl: user.photoUrl,
                      id: user.id,
                      idToken: user.idToken
                    }
                  }
                );

                  // window.location.assign("/signup-google");
                  // },
                //   error: err =>{
                //     // 1603 this.loginG(user);
                //     // console.log(err);
                //     Swal.fire({
                //       title: 'ERROR',
                //       text: 'Ha habido un problema al iniciar sesión con Google. Vuelve a intentarlo más tarde.',
                //       icon: 'error',
                //       confirmButtonText: 'Entendido',
                //       allowOutsideClick: false
                //     });
                //     this.waiting = false;
                //   },
                //   complete: () => {
                //     // console.log('req complete');
                //   }
                // });
              }
            },
            error: err =>{
              // console.log("error existeCorreo",err);
            },
            complete: () => {
              // console.log('req complete');
            }
          });

          //OJO quitar cuando se acaben las pruebas
          // console.log(this.user);
          //this.authService.signOut();.
        }
      });
  }

  /*-----------Funciones Google*/

  signInWithGoogle(): void {
    // console.log("signInWithGoogle()");
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    this.authService.signOut();
  }

  refreshToken(): void {
    this.authService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
  }
  /*-----------Fin funciones Google*/
  login() {
    let obj = {
      email:this.loginForm.get('email').value,
      password:this.loginForm.get('password').value,
      remember: this.loginForm.get('remember').value
    }

    this.formSubmit = true;
    // console.log(this.loginForm);
    if (!this.loginForm.valid) {
      console.warn('Errores en le formulario');
      return;
    }


    // this.usuarioService.login(obj)
    // .subscribe({
    //   next: res => {
    //     if (this.loginForm.get('remember').value){
    //       localStorage.setItem('email', this.loginForm.get('email').value);
    //     } else{
    //       localStorage.removeItem('email');
    //     }
    //     this.waiting = false;

    //     /////////////////////////////RUTA_DESTINO//////////////////////////////////////////////////////
    //     switch (this.usuarioService.rol) {
    //       case 'ROL_ADMIN':
    //         this.router.navigateByUrl('/admin/dashboard');
    //         break;
    //       case 'ROL_ESTUDIO':
    //         this.router.navigateByUrl('/estudio/dashboard');
    //         break;
    //       case 'ROL_USUARIO':
    //         //window.location.assign('/explorar');
    //         this.router.navigateByUrl('/explorar');
    //         break;
    //     }
    //   },
    //   error: err =>{
    //     // console.log(err);
    //     Swal.fire({
    //       title: 'Error!',
    //       text: err.error.msg || 'No pudo completarse la acción, vuelva a intentarlo más tarde',
    //       icon: 'error',
    //       confirmButtonText: 'Aceptar',
    //       allowOutsideClick: false
    //     });
    //     this.waiting = false;
    //   },
    //   complete: () => {
    //     // console.log('req complete');
    //   }
    // });

  }

  campoValido( campo: string) {
    return this.loginForm.get(campo).valid || !this.formSubmit;//valido la propiedad valid dentro de el fromulario en concreto dentro de campo
  }

  loginG(useremail : SocialUser ) {
    //Llega bien
    //console.log("soy loginG "+useremail);
    this.waiting = true;

    this.usuarioService.loginGoogle(useremail.email)
    .subscribe({
      next: res => {
        this.waiting = false;
        /////////////////////////////RUTA_DESTINO//////////////////////////////////////////////////////
        switch (this.usuarioService.rol) {
          case 'ROL_ADMIN':
            this.router.navigateByUrl('/admin/dashboard');
            break;
          case 'ROL_ESTUDIO':
            this.router.navigateByUrl('/admin/dashboard');
            break;
          case 'ROL_USUARIO':
            //window.location.assign('/explorar');
            this.router.navigateByUrl('/explorar');
            break;
        }
      },
      error: err =>{
        // console.log(err);
        Swal.fire({
          title: 'Error!',
          text: err.error.msg || 'No pudo completarse la acción, vuelva a intentarlo más tarde',
          icon: 'error',
          confirmButtonText: 'Cool',
          allowOutsideClick: false
        });
        this.waiting = false;
      },
      complete: () => {
        // console.log('req complete');
      }
    });

  }

  /*campoValido( campo: string) {
    return this.loginForm.get(campo).valid || !this.formSubmit;//valido la propiedad valid dentro de el fromulario en concreto dentro de campo
  }*/
  navigate(url: string){
    this.router.navigateByUrl(url);
  }
}
/*
      .subscribe( res => {

      console.log('Respuesta al suscribe: ',res);
      localStorage.setItem('token', res['token']);   //Aqui almaceno los datos de la api
      this.router.navigateByUrl('/explorar');       //Aqui te redirije hacia la pagina que queramos

     }, (err) => {
      console.log(err);
      Swal.fire({
        title: 'Error!',
        text: err.error.msg,
        icon: 'error',
        confirmButtonText: 'Cool',
        backdrop: false
      });
     });//aqui envio los campos necesarios para la api




     .subscribe({
      next: res => {
        console.log('Respuesta al suscribe: ',res);
        localStorage.setItem('token', res['token']);   //Aqui almaceno los datos de la api
        this.router.navigateByUrl('/explorar');       //Aqui te redirije hacia la pagina que queramos
      },
      error: err =>{
        console.log(err);
        Swal.fire({
          title: 'Error!',
          text: err.error.msg,
          icon: 'error',
          confirmButtonText: 'Cool',
          backdrop: false
        })
      },
      complete: () => {
        console.log('req complete');
      }
    });//aqui envio los campos necesarios para la api
*/

