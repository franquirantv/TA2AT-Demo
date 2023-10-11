import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, Input } from '@angular/core';
import { UsuariosService } from '../../services/usuario.service';
import { Observable, tap } from 'rxjs';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router, ActivatedRoute } from '@angular/router';
import { faSave, faMessage, faBell, faUser, faFilter, faMagnifyingGlass, faNewspaper, faCheckCircle, faBrain, faCheck, faTimes, faWarning } from '@fortawesome/free-solid-svg-icons';
import * as $ from 'jquery'
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import { NgZone } from '@angular/core';
import * as Notiflix from 'notiflix';
import { DesignService } from '../../services/design.service';

import { environment } from '../../../environments/environment';
import { Design } from '../../models/design.model';
import Swal from 'sweetalert2';
import { EngineService } from 'src/app/services/engine.service';
import { Usuario } from 'src/app/models/usuario.model';
import { ComunicacionService } from '../../services/comunicacion.service';
import { ExplorarComponent } from '../explorar/explorar.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-diseno',
  templateUrl: './diseno.component.html',
  styleUrls: ['./diseno.component.css']
})
export class DisenoComponent implements OnInit{
  searchQuery: string = '';

  isCargado: boolean = false;
  toggle = true;
  toggle2 = false;
  encendida:boolean = true;

  luces: NodeListOf<Element> = document.querySelectorAll(".luz");
  inputs: NodeListOf<Element> = document.querySelectorAll("input");

  public waiting = false;


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

  private uid: string = '';

  @Input() public usuario:Usuario;
  @Input() info: boolean = false;
  @Input() public zonas:string[]
  @Input() public estilo:string[]
  @Input() public descripcion:string
  @Input() public nombre:string
  @Input() public color:boolean
  @Input() public imagenUrl:string
  @Input() public colorString:string
  @Input() public nombreUsuario: string;
  public autorId:string;

  public imagenEstudio:string;

  public existeUsuario:boolean=false;
  public existeImagen:boolean=false;

  constructor(private usuariosService: UsuariosService,
              private router: Router,
              private route: ActivatedRoute,
              private ngZone: NgZone,
              private designService: DesignService,
              private engServ: EngineService,
              private comunicacionService: ComunicacionService,
              private explorar: ExplorarComponent,
              private http: HttpClient
    ) {

     }

  ngOnInit(): void {

    // this.uid = this.route.snapshot.params['uid'];

    // this.cargarDisenyo();
    if (!this.usuario[0].imagen) {
      this.imagenEstudio =`${environment.base_url}/upload/fotoperfil/no-imagen?token=${this.designService.token}`;
    }else{
      this.imagenEstudio = `${environment.base_url}/upload/fotoperfil/${this.usuario[0].imagen}?token=${this.designService.token}`;
    }


    this.comprobarUsuarioCargadoyImagen();

  }

  comprobarUsuarioCargadoyImagen(){
    if (this.usuario[0]) {
      this.existeUsuario = true;
    }
    if (this.imagenEstudio) {
      this.existeImagen = true;
    }
  }

  cargarDatos(res: any){
    this.zonas = res['design'].zonas
    this.estilo = res['design'].estilos
    this.descripcion = res['design'].descripcion
    this.nombre = res['design'].nombre
    this.color = res['design'].color
    this.nombreUsuario = res['design'].autor
    this.autorId = res['design'].usuario

    this.imagenUrl = `${environment.base_url}/upload/publicacion/${res['design'].imagen_id}?token=${this.designService.token}`;

    if (this.color)
      this.colorString = 'Colorido'
    else
      this.colorString = 'Blanco y negro'
  }

  cargarDisenyo(){

    this.designService.cargarDesignId(this.uid)
    .subscribe( res => {
      if (!res['design']) {
        this.router.navigateByUrl('/estudio/misdisenos');
        return;
      };
      this.cargarDatos(res);
    }, (err) => {
      this.router.navigateByUrl('/estudio/misdisenos');
      Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
      return;
    });
  }

  mensaje() {
    // Notiflix.Confirm.init({
    //   // plainText: false
    // });
    var message = 'Si aceptas, borrarás definitivamente el diseño del sitio web de TA2AT, no estando disponible para su uso';
    Notiflix.Confirm.show(
      'BORRAR DISEÑO',
      message,
      'Borrar',
      'Cancelar',
      function okey() {
        this.borrardesign(this.uid);
      }.bind(this),
        function cancelCb() {

        },
      {
        titleColor: '#e6301c',
        okButtonBackground: '#e6301c',

      },
    );
  }

  atras(){
    this.router.navigateByUrl('/estudio/misdisenos');
  }

  isExplorar(){
    return this.router.url === '/explorar'
  }

  abrirNuevoChat(){
    let Nuevo = !this.comunicacionService.getData('mostrarChat');
    let usuDest={
      uid: '63c0608a0a1a4833ebf968dd',
      nombre: 'Estudio X',
      imagen: 'assets/images/blank-profile-picture.png'
    }
    let obj={
      mostrar: Nuevo,
      nuevo: true,
      usuario: usuDest,
    }

    this.comunicacionService.setData('nuevoChat', obj);
  }

  anyadirAvatar(){
    this.http.get('assets/designListResponse.json').subscribe(
      res => {

      const designs = res['design']
      const filteredDesigns = designs.filter((design: any) => design.nombre === this.nombre);

      if (!designs) {
        return;
      };
      // console.log("Añadiendo tatu: ", res['design'][0])
      this.explorar.anadirAvatar(filteredDesigns[0])
      this.explorar.seleccionarTatuaje();
    }, (err) => {
      Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo'+err ,});
      return;
    });
  }

}
