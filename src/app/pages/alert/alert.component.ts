import { debounceTime } from 'rxjs/operators';
import { Input, Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { UsuariosService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
import { FormBuilder,Validators } from '@angular/forms';

@Component({
  selector: 'app-ngbd-alert',
  templateUrl: 'alert.component.html',
  styleUrls: ['alert.component.css']
})
export class NgbdAlertBasicComponent implements OnInit {
  // this is for the Closeable Alert
  articulos:any;
  array: any[] = [{info:'El usuario con correo jaime@gmail.com ha enviado un mensaje con asunto tatuaje', mensaje:'¿EL tatuaje del dragón quedaría bien en el pecho?'},
  {info:'El usuario con correo jorge@gmail.com ha enviado un mensaje con asunto Fecha', mensaje:'¿A que hora podría ir a tu estudio para hablar sobre hacerme un tatuaje?'},
  {info:'El usuario con correo laura@gmail.com ha enviado un mensaje con asunto Localización', mensaje:'¿Podria enviarte mi avatar para ver que opinas sobre el?'},
  {info:'El usuario con correo carlos@gmail.com ha enviado un mensaje con asunto Precios', mensaje:'¿Sobre que precio oscilaría el tatuaje Ovni en la espalda?'},
  {info:'El usuario Paquico se ha guardado tu diseño', mensaje:''},
  {info:'El usuario con correo DarwinNunez@gmail.com ha enviado un mensaje con asunto Info', mensaje:'¿Me gustan tus diseños, podrias hacerme uno personalizado?'},];

  leidas: any[] = [{info:'El usuario con correo isma@gmail.com ha enviado un mensaje con asunto tatuaje', mensaje:'¿EL tatuaje del dragón quedaría bien en el pecho?'},
  {info:'El usuario con correo miguel@gmail.com ha enviado un mensaje con asunto Fecha', mensaje:'¿A que hora podría ir a tu estudio para hablar sobre hacerme un tatuaje?'},
  {info:'El usuario con correo jose@gmail.com ha enviado un mensaje con asunto Avatar', mensaje:'¿Podrías indicarme donde se encuentra situado tu estudio?'}];
  public contactoForm = this.fb.group({
    asunto: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    mensaje: ['', [Validators.required]]
  });

  constructor(private fb: FormBuilder,private usuarioService: UsuariosService) {

  }



  ngOnInit(): void {

    this.recibirNotificacion();
  }
//    this.articulosServicio.recuperarTodos().subscribe((result:any) => this.articulos = result);

  recibirNotificacion(){
    let obj = {
      /*
      asunto:this.contactoForm.get('asunto').value,
      email:this.contactoForm.get('email').value,
      mensaje:this.contactoForm.get('mensaje').value
      */
      asunto: "",
      email: "",
      mensaje: ""

    }

    this.articulos = this.array;

    // this.usuarioService.getContact(obj).subscribe({
    //   next: res => {
    //     let array: string[];
    //     array = res['result'];

    //   },
    //   error: err =>{

    //   },
    //   complete: () => {
    //     // console.log('req complete');
    //   }
    // });


  }

  esEstudio() {
    let devolver:boolean = false;
    if (this.usuarioService.logged)
      devolver = this.usuarioService.rol === 'ROL_ESTUDIO'

    return devolver;
  }
  //eliminar(ID){

//  }

}
