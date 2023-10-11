import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recovery-contra',
  templateUrl: './recovery-contra.component.html',
  styleUrls: ['./recovery-contra.component.css']
})
export class RecoveryContraComponent {
  public formSubmit = false;
  public waiting = false;
  public siguientePaso = false;

  public NewPasswordForm = this.fb.group({
    pass: [ '', [Validators.required]],
    pass2: [ '', [Validators.required]],
  });

  constructor(private fb: FormBuilder,
              private usuarioService: UsuariosService,
              private router: Router
              ) { }


ngOnInit(): void {
}

recoveryC() {


  this.formSubmit = true;
  // console.log(this.NewPasswordForm);
  if (!this.NewPasswordForm.valid) {
    console.warn('Errores en le formulario');
    return;
  }

  if (this.NewPasswordForm.get('pass').value !== this.NewPasswordForm.get('pass2').value) {
    console.warn('Contraseñas distintas');
    return;
  }

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const urltoken = urlParams.get('token')


  let obj = {
    password:this.NewPasswordForm.get('pass').value,
    password2:this.NewPasswordForm.get('pass2').value,
  }

  this.waiting = true;

  this.usuarioService.sendNewPassword(obj, urltoken)
  .subscribe({
    next: res => {
      this.waiting = false;
      Swal.fire({
        title: 'Enhorabuena!',
        text: 'Tu contraseña ha sido cambiada',
        icon: 'success',
        confirmButtonText: 'Cool',
        allowOutsideClick: false
      });
      this.router.navigateByUrl('/login');
      // console.log("Cuenta Recuperada");
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

campoValido( campo: string) {
  return this.NewPasswordForm.get(campo).valid || !this.formSubmit;
}

}
