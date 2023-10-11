import { Component, OnInit, ViewChild } from '@angular/core';
import { gsap } from "gsap";
import { Inject }  from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuariosService } from 'src/app/services/usuario.service';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';
import { Meta } from '@angular/platform-browser';
import { faBridgeLock } from '@fortawesome/free-solid-svg-icons';
import { timeout } from 'rxjs';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css', './boton.css']
})
export class ContactoComponent implements OnInit {
  //Nuevo

  //public contactoForm: FormGroup ;
  public stringAEnviar = 'Hola desde contacto';
  private formIsValid = false;
  public formSubmit = false;
  public waiting = false;
  faBridgeLock = faBridgeLock;

   public contactoForm = this.fb.group({
    asunto: ['', [Validators.required]],
    email: [this.usuarioService.email, [Validators.required, Validators.email]],
    mensaje: ['', [Validators.required]],
    privacidad: [false, [Validators.required]]
  });

  public constructor(@Inject(DOCUMENT) document: Document,
              private fb: FormBuilder,private usuarioService: UsuariosService,
              private router: Router) { }


  ngOnInit(): void {


    //this.meta.addTag({ name: 'description', content: '¿Necesitas ponerte en contacto con nosotros? En nuestra página de contacto encontrarás toda la información que necesitas para comunicarte con nuestro equipo. No dudes en hacernos saber tus preguntas, comentarios o inquietudes, ¡estamos aquí para ayudarte!' });
  }

  formSubmitData(){
    const myForm = document.querySelector('#myForm')
    myForm.addEventListener('submit', event => {
      event.preventDefault();
    });

   document.querySelectorAll(".button").forEach((bot) => {
    console.log(bot);
    let getVar = (variable) =>
      getComputedStyle(bot).getPropertyValue(variable);

    if (this.formIsValid) {

      bot.addEventListener("click", (e) => {
        //BOTON TO GUAPO
        if (!bot.classList.contains("active")) {
          bot.classList.add("active");
          gsap.to(bot, {
            keyframes: [
              {
                "--left-wing-first-x": 50,
                "--left-wing-first-y": 100,
                "--right-wing-second-x": 50,
                "--right-wing-second-y": 100,
                duration: 0.2,
                onComplete() {
                  gsap.set(bot, {
                    "--left-wing-first-y": 0,
                    "--left-wing-second-x": 40,
                    "--left-wing-second-y": 100,
                    "--left-wing-third-x": 0,
                    "--left-wing-third-y": 100,
                    "--left-body-third-x": 40,
                    "--right-wing-first-x": 50,
                    "--right-wing-first-y": 0,
                    "--right-wing-second-x": 60,
                    "--right-wing-second-y": 100,
                    "--right-wing-third-x": 100,
                    "--right-wing-third-y": 100,
                    "--right-body-third-x": 60
                  });
                }
              },
              {
                "--left-wing-third-x": 20,
                "--left-wing-third-y": 90,
                "--left-wing-second-y": 90,
                "--left-body-third-y": 90,
                "--right-wing-third-x": 80,
                "--right-wing-third-y": 90,
                "--right-body-third-y": 90,
                "--right-wing-second-y": 90,
                duration: 0.2
              },
              {
                "--rotate": 50,
                "--left-wing-third-y": 95,
                "--left-wing-third-x": 27,
                "--right-body-third-x": 45,
                "--right-wing-second-x": 45,
                "--right-wing-third-x": 60,
                "--right-wing-third-y": 83,
                duration: 0.25
              },
              {
                "--rotate": 55,
                "--plane-x": -8,
                "--plane-y": 24,
                duration: 0.2
              },
              {
                "--rotate": 40,
                "--plane-x": 45,
                "--plane-y": -180,
                "--plane-opacity": 0,
                duration: 0.3,
                onComplete() {
                  setTimeout(() => {
                    bot.removeAttribute("style");
                    gsap.fromTo(
                      bot,
                      {
                        opacity: 0,
                        y: -8
                      },
                      {
                        opacity: 1,
                        y: 0,
                        clearProps: true,
                        duration: 0.3,
                        onComplete() {
                          bot.classList.remove("active");
                        }
                      }
                    );
                  }, 2000);
                }
              }
            ]
          });

          gsap.to(bot, {
            keyframes: [
              {
                "--text-opacity": 0,
                "--border-radius": 0,
                "--left-wing-background": getVar("--primary-darkest"),
                "--right-wing-background": getVar("--primary-darkest"),
                duration: 0.1
              },
              {
                "--left-wing-background": getVar("--primary"),
                "--right-wing-background": getVar("--primary"),
                duration: 0.1
              },
              {
                "--left-body-background": getVar("--primary-dark"),
                "--right-body-background": getVar("--primary-darkest"),
                duration: 0.4
              },
              {
                "--success-opacity": 1,
                "--success-scale": 1,
                duration: 0.25,
                delay: 0.25
              }
            ]
          });
        }

      });
    }

  });
  }

  enviarMensaje(){

    this.formIsValid = true;

    if (!this.contactoForm.get('asunto').value || !this.contactoForm.get('mensaje').value ||
    this.contactoForm.get('privacidad').value === false) {
      Swal.fire({
        title: 'Error!',
        html: 'Los campos "Asunto" o "Mensaje" no pueden estar vacíos. <br> Además debes aceptar las políticas de privacidad.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#d4af37',
        allowOutsideClick: false
      });
      return;
    }

    let obj = {
      asunto:this.contactoForm.get('asunto').value,
      email:this.contactoForm.get('email').value,
      mensaje:this.contactoForm.get('mensaje').value,
      privacidad:this.contactoForm.get('privacidad').value
    }

    this.formSubmit = true;
    // console.log(this.contactoForm);
    if (!this.contactoForm.valid) {
      console.warn('Errores en le formulario');
      return;
    }

    this.waiting = true;
    // console.log("OBJETO:",obj);
    this.usuarioService.sendContact(obj)
    .subscribe({
      next: res => {

        this.waiting = false;
        console.log("Notificación enviada");
          Swal.fire({
              title: 'El mensaje ha sido enviado con éxito.',
              html: 'Un administrador se pondrá en contacto con usted lo antes posible.',
            icon: 'success',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#d4af37',
            allowOutsideClick: false
          }).then((result) => {
            if (result.isConfirmed)
              this.contactoForm.reset();
          });
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

  conectado() {//Método que emplea el booleano logged para saber si un usuario está conectado o no
    return this.usuarioService.logged;//en este caso es el condicional que usamos en el html para mostrar los botones d einicio de sesión o el usuario
  }

  goToLogin(){
    this.router.navigateByUrl('/login')
  }

}



