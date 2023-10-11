import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-recovery',
  templateUrl: './recovery.component.html',
  styleUrls: ['./recovery.component.css']
})
export class RecoveryComponent implements OnInit {

  public formSubmit = false;
  public waiting = false;
  public siguientePaso = false;

  public recoveryForm = this.fb.group({
    email: [ '', [Validators.required, Validators.email]],//se ponene corchetes si vamos a poner varias validaciones
  });

  constructor(private fb: FormBuilder,
              private usuarioService: UsuariosService,
              private router: Router,
              private meta: Meta
              ) { }

  ngOnInit(): void {
    this.meta.addTag({ name: 'description', content: '"¿Olvidaste tu contraseña? No te preocupes, en nuestra página de recuperación de cuenta podrás restablecerla fácilmente. Proporciona tu correo electrónico asociado a tu cuenta y sigue los pasos indicados para recibir instrucciones y volver a tener acceso a tu perfil en TA2AT. ¡Recupera tu cuenta en unos pocos pasos simples!' });
  }

  recovery() {
    let obj = {
      email:this.recoveryForm.get('email').value,
    }

    this.formSubmit = true;
    // console.log(this.recoveryForm);
    if (!this.recoveryForm.valid) {
      console.warn('Errores en le formulario');
      return;
    }

    this.waiting = true;

    this.usuarioService.sendRecovery(obj)
    .subscribe({
      next: res => {
        this.waiting = false;
        this.siguientePaso = !this.siguientePaso;
        // console.log("Email enviado");
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

  campoValido( campo: string) {
    return this.recoveryForm.get(campo).valid || !this.formSubmit;
  }

}
