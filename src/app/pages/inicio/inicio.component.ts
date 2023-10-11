import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { UsuariosService } from '../../services/usuario.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
})
export class InicioComponent implements OnInit {
  //private active:boolean = false;
  private video:boolean = false;
  private dire:number;
  private pagina:string = './login';


  public imagenLanding1:string = './assets/images/pexels-kevin-bidwell-2183131_c.jpg';
  public imagenLanding2:string = './assets/images/pexels-kevin-bidwell-2183132.webp';
  public imagenLanding3:string = './assets/images/pexels-lucas-guimarães-5533992_c.webp';

  public gifLanding2:string = './assets/images/VIDEO-LANDING.webp';


  constructor(private usuarioService: UsuariosService,
              private router: Router) { }
  ngOnInit(): void {

  }
  videoStart(){//Cuando empieza el video se coloca video a true
      return this.video;
  }


  iniciado(){
    /*
    //if(localStorage.getItem('token')){
    if(this.usuarioService.logged){
      this.active=true;
    }else{
      this.active=false;
    }
    return this.active;
    */
    return this.usuarioService.logged;
  }

  cambiarEstado(){
    //this.active=true;
    this.video=true;
    this.dire=1;
  }

  cambiarEstado2(){
    //this.active=true;
    this.video=true;
    this.dire=2;
  }

  cambiarEstado3(){//el caso 3 es para cuando se pulsa el boton estando iniciada la sesión, te redirije a explorar
    //this.active=true;
    this.video=true;
    this.dire=3;
  }

  onVideoEnded() {//cuando acaba el video te redirije a la página seleccionada
    switch (this.dire){
      case 1:
        this.router.navigate(['/login']);
          break;
      case 2:
        this.router.navigate(['/signup']);
          break;
      case 3:
        this.router.navigate(['/explorar']);
          break;
      default:
        this.router.navigate(['/inicio']);
          break;

    }
  }
}


