import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild, OnChanges, Output, EventEmitter, NgModule } from '@angular/core';
import { UsuariosService } from '../../services/usuario.service';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { faSave, faMessage, faBell, faUser, faFilter, faMagnifyingGlass, faNewspaper, faCheckCircle, faBrain, faCheck, faTimes, faWarning, faComputerMouse, faArrowsUpDownLeftRight,
  faRotate, faHandPointer } from '@fortawesome/free-solid-svg-icons';
  import { Loading } from 'notiflix/build/notiflix-loading-aio';

import { NgZone } from '@angular/core';
import * as Notiflix from 'notiflix';
import { DesignService } from '../../services/design.service';

import { environment } from '../../../environments/environment';
import { Design } from '../../models/design.model';
import Swal from 'sweetalert2';
import { EngineService} from 'src/app/services/engine.service';
import { Motorpropio } from 'src/app/services/motorpropio.service';
import { Usuario } from 'src/app/models/usuario.model';
import { FormBuilder, Validators } from '@angular/forms';
import { Meta } from '@angular/platform-browser';
import { Tatuaje } from 'src/app/models/tatuaje.model';
import { AvatarService } from 'src/app/services/avatar.service';
import { ComunicacionService } from 'src/app/services/comunicacion.service';
import { EditarImagenComponent } from 'src/app/components/editar-imagen/editar-imagen.component';
import { IntroJSService } from 'src/app/services/introjs.service';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { ModalControlesComponent } from './modal-controles/modal-controles.component';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { HttpClient } from '@angular/common/http';


const MODELO_CABEZA_HOMBRE = '../../../assets/painball/LeePerrySmith.json';

interface Option {
  type: string;
  value: string;
}

@Component({
  selector: 'app-explorar',
  templateUrl: './explorar.component.html',
  styleUrls: ['./explorar.component.scss']
})

export class ExplorarComponent implements OnInit ,AfterViewInit{
  searchQuery: string = '';


  toggle = true;
  toggle2 = false;

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

  public showOKT = false;

  @ViewChild('rendererCanvas', {static: true})
  public rendererCanvasRef!: ElementRef<HTMLCanvasElement>;

  @ViewChild('controles', {static: true})
  public controles!: ElementRef<HTMLDivElement>;

  @Input() info: boolean = false;

  public zonas:string[]
  public estilo:string[]
  public descripcion:string
  public nombre:string
  public color:boolean
  public colorString:string
  public imagenUrl:string
  public usuario:Usuario
  public nombreUsuario: string
  public editando = false;

  /* VARIABLES MOTOR TAG */
  private canvas: HTMLCanvasElement;
  private posicion:number[] = [500, 0];
  private scale:number[] = [0.2,0.2];

  private estaRotando:boolean = false;

  private tatuajeSeleccionado:boolean = false;

  public mostrarselect:boolean = false;

  public listaTatuajes:any = [];

  public value:string = "";

  public valorMostrar:boolean;

  public valorEditar:boolean = true;

  public colorPiel:string = '';
  public texturica:string = '#e9caae'; //PARA MOTOR TAG CAMBIAR
  public avatar:string = '../../../assets/humano/chico.glb'; //PARA MOTOR TAG CAMBIAR
  public pintando:boolean = false;

  public texturaAvatar:any;
  public modeloAvatar:any;

  files: any[] = [];
  imagenUsuario:string = "";
  imagenSubida:any;

  public filtrosForm = this.fb.group({
    color: [false, [Validators.required]],
    estilos: [[''], [Validators.required]],
    zonas: [[''], [Validators.required]],
  });

  constructor(private usuariosService: UsuariosService,
              private router: Router,
              private ngZone: NgZone,
              private designService: DesignService,
              private engServ: EngineService,
              private motor: Motorpropio,
              private fb: FormBuilder,
              private meta: Meta,
              private comunicacionService: ComunicacionService,
              private avatarService: AvatarService,
              private introService: IntroJSService,
              private dialog: MatDialog,
              private http: HttpClient
              ) {
               }

  abrirControles(): void {
    this.dialog.open(ModalControlesComponent);
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
    var message = '- Click derecho arrastrar: mover modelo<br>- Click izquierdo arrastrar: rotar modelo<br>- Rueda del ratón: zoom<br>- Doble click izquierdo : seleccionar';
    Notiflix.Report.warning('CONTROLES', message, '¡Entendido!');
  }

  // Perform initialization tasks here
  ngOnInit(): void {
    //???Que es esto
    this.meta.addTag({ name: 'description', content: 'Explora todos los diseños que ofrecemos y prueba a visualizarlos en tu propio avatar personalizado. Entra y descubre como te quedara tu futuro designs' });
    /*--------GALERIA-----------*/
    this.cargarDesign1(this.ultimaBusqueda, null);
    /*--------MOTOR GRAFICO-----------*/
    const motorgra = document.querySelector("div#motorgra.motorgra");

    /* MOTOR THREEJS */
    if (this.usuariosService.uid) {
      //Cargamos el avatar del usuario
      this.avatarService.cargarAvatar(this.usuariosService.uid).subscribe({
      next: res => {
        console.log("AVATAR CARGADO: ",res['avatar'])
        this.texturaAvatar = res['avatar'].piel;
        // this.listaTatuajes = res['avatar'].tatuajes;
        this.modeloAvatar = res['avatar'].modelo;

        this.engServ.setColor(this.texturaAvatar);
        this.engServ.setModelo(this.modeloAvatar);
        this.engServ.setTatuajes(res['avatar'].tatuajes);

        this.listaTatuajes = res['avatar'].tatuajes.map(designs => {
          return designs;
        });

        console.log("TATUAJES CARGADOS: ",this.listaTatuajes)
        this.value = this.listaTatuajes.length>0  && this.listaTatuajes[0].datos
                    ? this.listaTatuajes[0].datos.nombre : '';


        this.engServ.getControles(this.controles);
        // this.engServ.createScene(this.rendererCanvasRef).then(() => {
        //   this.engServ.añadirTatuajesEscena();
        // });
        this.engServ.animate();
        // this.engServ.añadirTatuajesEscena();

      }, error: err => {
        console.log(err)
      }
      });
    } else {

      this.engServ.getControles(this.controles);
      this.engServ.createScene(this.rendererCanvasRef);
      this.engServ.animate();
    }
  }

  ContadorVal: number=0;

  Valorado: boolean= false;
  ActivarValoracion(){
    //if(!this.usuariosService.valoracion && this.usuariosService.rol === 'ROL_USUARIO'){
    if(this.usuariosService.uid === '63874455a7ca794afff94a59'){
      this.ContadorVal += 1;
      if(this.ContadorVal >= 5){

        let estado = !this.comunicacionService.getData('mostrarVal');
        this.comunicacionService.setData('mostrarVal', estado);
        this.Valorado=true;
      }
    }else{
      if(this.usuariosService.rol === 'ROL_USUARIO' && !this.usuariosService.valoracion){
        this.ContadorVal += 1;
        if(this.ContadorVal >= 5){

          let estado = !this.comunicacionService.getData('mostrarVal');
          this.comunicacionService.setData('mostrarVal', estado);
          this.Valorado=true;
        }
      }
    }
  }

  moverTatuajes(direccion: string){
    // console.log("Boton pulsado: ", direccion);

    if (this.value === '')
    this.value = this.listaTatuajes[0].nombre;

    for (let index = 0; index < this.listaTatuajes.length; index++) {
      if(this.listaTatuajes[index].nombre === this.value){

        switch (direccion) {
          case 'abajo':  this.listaTatuajes[index].posicion_y = this.listaTatuajes[index].posicion_y+100;

            break;
          case 'arriba':  this.listaTatuajes[index].posicion_y = this.listaTatuajes[index].posicion_y-100;

            break;
          case 'izquierda': this.listaTatuajes[index].posicion_x = this.listaTatuajes[index].posicion_x-100;

            break;
          case 'derecha': this.listaTatuajes[index].posicion_x = this.listaTatuajes[index].posicion_x+100;

            break;
        }

        if (this.listaTatuajes[index].posicion_x < 0)
          this.listaTatuajes[index].posicion_x = 0;

        if (this.listaTatuajes[index].posicion_y < 0)
          this.listaTatuajes[index].posicion_y = 0;

        this.motor.actualizarPosicionTextura(this.listaTatuajes);


      }

    }

    // switch (direccion) {
    //   case 'abajo':  this.posicion[1] = this.posicion[1]+100;

    //     break;
    //   case 'arriba':  this.posicion[1] = this.posicion[1]-100;

    // console.log("Posicion X: ", this.posicion[0]);
    // console.log("Posicion Y: ", this.posicion[1]);
    if (this.value === '')
      this.value = this.listaTatuajes[0].nombre;

    //     break;
    //   case 'derecha': this.posicion[0] = this.posicion[0]+100;

    //     break;
    // }

    // if (this.posicion[0] < 0)
    //   this.posicion[0] = 0;

    // if (this.posicion[1] < 0)
    //   this.posicion[1] = 0;

    // console.log("Posicion X: ", this.posicion[0]);
    // console.log("Posicion Y: ", this.posicion[1]);
    // if (this.value === '')
    //   this.value = this.listaTatuajes[0].nombre;

    // this.motor.actualizarPosicionTextura(this.posicion, this.value);
  }

  cambiarEscala(tipo:string){
    // console.log("Tipo: ", tipo)

    if(tipo == 'mas'){
      this.scale[0] = this.scale[0]+0.025;
      this.scale[1] = this.scale[1]+0.025;
    }

    if (tipo == 'menos') {
      this.scale[0] = this.scale[0]-0.025;
      this.scale[1] = this.scale[1]-0.025;
    }

    if (this.scale[0] < 0.05) {
      this.scale[0] = 0.05;
      this.scale[1] = 0.05;
    }

    // console.log("Escala: ", this.scale)

    this.motor.actualizarEscalaTextura(this.scale);

  }

  rotarModelo(){
    if (this.estaRotando)
      this.estaRotando = false;
    else
      this.estaRotando = true;

    // this.motor.rotarModelo(this.estaRotando)
    this.engServ.rotarModelo(this.estaRotando);
  }

  seleccionarTatuaje(){
    this.ActivarValoracion();
    // this.habilitar();
    if (this.tatuajeSeleccionado) {
      return;
    }
    this.tatuajeSeleccionado = !this.tatuajeSeleccionado;
  }

  inhabilitar(){
    for (let index = 0; index < document.getElementsByClassName("boton-eliminar-centrado").length; index++) {
      document.getElementsByClassName("boton-eliminar-centrado")[index].classList.add("boton-inactivo")
    }
    if (!this.tatuajeSeleccionado) {
      return;
    }
    this.tatuajeSeleccionado = false;
  }

  habilitar(){
    for (let index = 0; index < document.getElementsByClassName("boton-eliminar-centrado").length; index++) {
      document.getElementsByClassName("boton-eliminar-centrado")[index].classList.remove("boton-inactivo")
    }
  }


  abrirFiltros(){
    var panel = document.getElementById('panel-advanced-search');

    //slide down search panel if not visible
    if ( panel.classList.contains("is-hidden") ) {
      // panel.slideDown();
      panel.classList.remove("is-hidden");
    } else {
      // panel.slideUp();
      panel.classList.add("is-hidden");
    }
  }

  clearSearchInput() {
    this.searchQuery = '';
  }

  // Perform tasks after views are initialized here
  ngAfterViewInit(): void {
    window.addEventListener('load', (event) => {
    Loading.remove();
  });
  }

  imagen() {
    return this.usuariosService.imagenURL;
  }

  hombreMarcado() {
    this.toggle = !this.toggle;
    this.toggle2 = !this.toggle2;
    this.modeloAvatar = './assets/humano/chicoo.glb';
  }

  mujerMarcada() {
    this.toggle = !this.toggle;
    this.toggle2 = !this.toggle2;
    this.modeloAvatar = './assets/humano/chicanueva.glb';
  }

  //------------------------------------------GUARDADOS-----------------------------------------------------
  public guardados: boolean = false;
  public estadopagina: string = "paginaNOguardados";
  public estadopagina2: string = "destacadosAvatar";
  setGuardado(did: Design){

    this.designService.guardarDesign(did).subscribe({
      next: res => {

        did.guardados = res['design'].guardados;
        if(this.guardados){//esto es para que si nos encontramos en la pestaña con el filtro de guardados y le pulsamos al boton de quitar de guardados nos recargue la llamada
          this.cargarDesign1("", null);//como podriamos hacerlo sin rehacer la llamada?
        }

      }, error: err =>{
        Swal.fire({
          title: 'Error!',
          text: err.error.msg || 'Fallo al guardar diseño',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          allowOutsideClick: true
        });

      }, complete: () => {
        // console.log("DISEÑO GUARDADO");
      }}
  );

  }

  estadoGuardado(){
    if(this.usuariosService.logged){
      this.guardados = !this.guardados;
    if(this.guardados){
      this.estadopagina = 'paginaguardados';
      this.estadopagina2 = 'destacadosAvatar2';
    }else{
      this.estadopagina = 'paginaNOguardados';
      this.estadopagina2 = 'destacadosAvatar';
    }
        //PREGUNTAR QUE SI PASAMOS DE NO GUARDADOS A GUARDADO HAY QUE MANTENER LOS FILTROS DE BUSQUEDA O NO
        //this.cargarDesign1("",null);
        this.cargarDesign1(this.ultimaBusqueda, this.ultimosFiltros);
    }else{

      Swal.fire({
        title: 'Error!',
        text: 'Esta función no está disponible en esta DEMO. \n Disculpa las molestias.',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        allowOutsideClick: true
      });

    }

  }

  esGuardado(did: string[]){
    for (let index = 0; index < did.length; index++) {
      if(did[index]===this.usuariosService.uid){
        return true;
      }

    }
    return false;
  }

  //------------------------------------------FILTROS--------------------------------------------------------

  public aplicar: boolean = false; //Esta variable nos sirve para evitar hacer llamadas de más cuando cerremos los filtros (Para que si ya se le ha dado al botón de aplicar cuando se cierre no se vuelva a enviar la petición)

  isOpen = false;
  activeTab = 'Color';
  colors = ['Blanco y Negro', 'Colorido'];
  colorsSelected: number[];
  estilos =  ["Blackwork", "Tradicional", "Neotradicional", "Dotwork", "Realista", "Tribal", "Gótico", "Japonés tradicional", "Blackout", "Fluorescente"];
  estilosSelected: number[];
  zonas1 = ['Cabeza', 'Espalda', 'Pecho', 'Brazos', 'Piernas'];
  zonas1Selected: number[];
  public opcionesSeleccionadas: string[] = [];
  selectedOptions: Option[] = [];
  public OpcionSelec: string = "dropdown-option";

  toggleDropdown() {
    this.isOpen = !this.isOpen;
    if(this.isOpen=== false){
      // this.aplicarFiltros();
    }
  }

  changeTab(tab: string) {
    this.activeTab = tab;
  }

  estadoSelected(opcion: string){
    const index = this.opcionesSeleccionadas.indexOf(opcion);
    if (index > -1) {
      return true;
    } else {
      return false;
    }
  }

  selectOption(type: string, value: string) {
    // console.log('Valor: ', value);
    // console.log('Tipo: ', type);
    this.aplicar = true;
    if (!this.selectedOptions.find(option => option.type === type && option.value === value)) {

      if(this.selectedOptions.find(option => option.type === 'Color') && type === 'Color'){ //Si existe un color vamos a añadir el nuevo y quitar el viejo

        //  console.log('Antes ',this.selectedOptions);
        if(value === 'Colorido'){
          let option:Option = {type: 'Color', value:'Blanco y Negro'}
          // console.log('Borro esto: ', option);
          this.removeOption(option, false)
        }else{
          let option:Option = {type: 'Color', value:'Colorido'}
          // console.log('Borro esto: ', option);
          this.removeOption(option, false)
        }

        this.selectedOptions.push({ type, value });

        this.opcionesSeleccionadas.push(value);

      }else{ //Si no existe ningun filtro de tipo color
        this.selectedOptions.push({ type, value });

      this.opcionesSeleccionadas.push(value);

      }

    } else {
      let option:Option = {type, value}

      this.removeOption(option, false)

    }
  }

  removeOption(optionS: Option, filtrar: boolean) {
    const index = this.selectedOptions.findIndex(option => option.type === optionS.type && option.value === optionS.value);
    this.selectedOptions.splice(index, 1);

    //ESTO ES PARA EL CSS NO TOCAR
    const index2 = this.opcionesSeleccionadas.findIndex(value => value === optionS.value);
    this.opcionesSeleccionadas.splice(index2, 1);


    if(filtrar){
      this.aplicar=true;
      // this.aplicarFiltros();
    }

  }

  aplicarFiltros(){
    if(this.aplicar){
      // console.log('Aplicando filtros', this.selectedOptions);
      this.cargarDesign1(this.ultimaBusqueda, this.selectedOptions);
      this.aplicar = false;
    }
  }

  borrarFiltros(){
    this.opcionesSeleccionadas = [];
    this.selectedOptions = [];
    this.cargarDesign1(this.ultimaBusqueda, this.selectedOptions);
  }


  //------------------------------------------BUSCAR--------------------------------------------------------

  public totalDisenyos = 0;
  public posicionactual = 0;
  public registrosporpagina = environment.registros_por_pagina;
  public loading = true;
  public listaDisenyos: Design[] = [];

  private ultimaBusqueda = '';
  private ultimosFiltros : Option[] = [];;

  cargarDesign1( textoBuscar: string, filtros: Option[] ) {
    console.log('Cargando diseño');
    this.ultimaBusqueda = textoBuscar;
    this.ultimosFiltros = filtros;
    this.loading = true;

    setTimeout(() => {
      this.startIntro();
    }, 1000);

    if(this.guardados){
      this.designService.cargarGuardados(this.posicionactual, this.usuariosService.uid, textoBuscar, filtros).subscribe({
          next: res => {

            // Lo que nos llega lo asignamos a lista usuarios para renderizar la tabla
            // Comprobamos si estamos en un apágina vacia, si es así entonces retrocedemos una página si se puede
            if (res['design'].length === 0) {
              if (this.posicionactual > 0) {
                this.posicionactual = this.posicionactual - this.registrosporpagina;
                if (this.posicionactual < 0) { this.posicionactual = 0};
                this.cargarDesign1(this.ultimaBusqueda, this.ultimosFiltros);
              } else {
                this.listaDisenyos = [];
                this.totalDisenyos = 0;
              }
            } else {

              this.listaDisenyos = res['design'];
              this.totalDisenyos = res['page'].total;

              for (let index = 0; index < this.listaDisenyos.length; index++) {
                //this.listaDisenyos[index].imagenUrl = `${environment.base_url}/upload/publicacion/${this.listaDisenyos[index].imagen_id}?token=${this.designService.token}`;
                this.listaDisenyos[index].imagenUrl = `${environment.base_url}/upload/publicacion/${this.listaDisenyos[index].imagen_id}`;
              }
              //console.log('guardado: ', this.guardado);

            }
            this.loading = false;

          }, error: err =>{

            Swal.fire({icon: 'error', title: 'Oops...', text: 'Error al cargar los diseños, recargue la página',});
            console.log('error:',err)
            this.loading = false;

          }, complete: () => {

          }}
      );
    }else{

      this.http.get('assets/designListResponse.json').subscribe((res) => {

        // Lo que nos llega lo asignamos a lista usuarios para renderizar la tabla
        // Comprobamos si estamos en un apágina vacia, si es así entonces retrocedemos una página si se puede
        if (res['design'].length === 0) {
          if (this.posicionactual > 0) {
            this.posicionactual = this.posicionactual - this.registrosporpagina;
            if (this.posicionactual < 0) { this.posicionactual = 0};
            this.cargarDesign1(this.ultimaBusqueda, this.ultimosFiltros);
          } else {
            this.listaDisenyos = [];
            this.totalDisenyos = 0;
          }
        } else {

          this.listaDisenyos = res['design'];
          this.totalDisenyos = res['page'].total;

          for (let index = 0; index < this.listaDisenyos.length; index++) {
            //this.listaDisenyos[index].imagenUrl = `${environment.base_url}/upload/publicacion/${this.listaDisenyos[index].imagen_id}?token=${this.designService.token}`;
            this.listaDisenyos[index].imagenUrl = `assets/staticDesigns/${this.listaDisenyos[index].imagen_id}`;
          }
          //console.log('guardado: ', this.guardado);

        }
        this.loading = false;
      }, (err) => {
        Swal.fire({icon: 'error', title: 'Oops...', text: 'Error al cargar los diseños, recargue la página',});
        //console.warn('error:', err);
        console.log('error:',err)
        this.loading = false;
      });
    }

  }

  public enableDisableRule() {
      this.toggle = !this.toggle;
      //this.status = this.toggle ? '' : '';
  }

  cambiarPagina( pagina: number ){
    pagina = (pagina < 0 ? 0 : pagina);
    this.posicionactual = ((pagina - 1) * this.registrosporpagina >=0 ? (pagina - 1) * this.registrosporpagina : 0);
    this.cargarDesign1(this.ultimaBusqueda, this.ultimosFiltros);
  }

//------------------------------AÑADIR VISTA---------------------------------------------------------------------------------------------------------------

 anadirVista(design: any){

  this.designService.anadirVista(this.usuariosService.uid, design.did).subscribe({
    next: res => {
      // console.log('req completed vista: ', res)
    }, error: err =>{
      // console.log('error:',err);
    }
 });
}

// -----------------------------CARGAR FICHA---------------------------------------------------------------------------------------------------------------


  ficha(){
    return this.info;
  }

  cambiarInfo(disenyo: Design){
    // this.designService.asignarDisenyo(disenyo);

      this.http.get('assets/designListResponse.json').subscribe((res) => {

        const designs = res['design'];
        const filteredDesigns = designs.filter((design: any) => design.nombre === disenyo.nombre);

        if (filteredDesigns.length === 0) {
          this.router.navigateByUrl('/explorar');
          return;
        };
        this.zonas = filteredDesigns[0].zonas;
        this.estilo = filteredDesigns[0].estilos;
        this.descripcion = filteredDesigns[0].descripcion;
        this.nombre = filteredDesigns[0].nombre;
        this.color = filteredDesigns[0].color;
        this.imagenUrl = `assets/staticDesigns/${filteredDesigns[0].imagen_id}`;
        this.nombreUsuario = filteredDesigns[0].autor;

        //Para obtener el usuario que sube el diseño
        // let listaUsu: string[] = [res['design'].usuario];
        // this.usuariosService.getDatosUsuarios(listaUsu).subscribe( res => {
        //   if (!res['usuarios']) {
        //     this.router.navigateByUrl('/explorar');
        //     return;
        //   };
          // this.usuario = res['usuarios'];
          // console.log("USUARIO:",this.usuario)
          this.info=true;
        // }, (err) => {
        //   // console.log('error: ', err)

        // });

        if (this.color)
          this.colorString = 'Colorido'
        else
          this.colorString = 'Blanco y negro'
      }, (err) => {
        this.router.navigateByUrl('/explorar');
        Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
        return;
      });

  }

  setInfo(){
    this.info = false
  }

  public repetido = 0;
  existe = false;

  anadirAvatar(disenyo: Design){

    if(!this.estaRotando && this.engServ.getPintado() == false){
      this.pintando = true;

    this.engServ.añadirLinea(this.pintando);

    this.http.get('assets/designListResponse.json').subscribe({
      next: async (res) => {
        const designs = res['design']
        const filteredDesigns = designs.filter((design: any) => design.nombre === disenyo.nombre);

        if (filteredDesigns.length === 0) {
          this.router.navigateByUrl('/explorar');
          return;
        };

        this.imagenUrl = `assets/staticDesigns/${filteredDesigns[0].imagen_id}`;

         if(this.imagenUrl){


          if(this.listaTatuajes.length > 0){
            for (let index = 0; index < this.listaTatuajes.length; index++) {
              var nombre = filteredDesigns[0].nombre.split("(");
              if(this.listaTatuajes[index].nombre === nombre[0] || this.listaTatuajes[index].nombre === filteredDesigns[0].nombre)
                this.repetido++;
            }

            if(this.repetido > 0){
              var nomtatu = filteredDesigns[0].nombre +"("+ this.repetido +")";
              for (let index = 0; index < this.listaTatuajes.length; index++) {
                if(this.listaTatuajes[index].nombre === nomtatu){
                  this.repetido = this.repetido + 1;
                  nomtatu = filteredDesigns[0].nombre + "(" + this.repetido + ")";
                }
              }
              filteredDesigns[0].nombre = nomtatu;
            }

            this.engServ.setDatosTatu(this.imagenUrl,filteredDesigns[0]);

            const tatuajesBBDD = this.engServ.getTatuajesBBDD();
            // console.log('lista1: ', tatuajesBBDD)
            // this.listaTatuajes.push(...tatuajesBBDD);
            tatuajesBBDD.forEach(tatu => {
              console.log(`Meto el tatuaje ${tatu.datos.nombre} en la lista`)
              this.listaTatuajes.push(tatu);
            });

            for (let i = 0; i < this.listaTatuajes.length; i++) {
              if (filteredDesigns[0].nombre === this.listaTatuajes[i].nombre) {
                this.existe = true;
                break;
              }
            }

            // Si no existe el filteredDesigns[0] en la lista de tatuajes, lo añadimos
            if (!this.existe)
              this.listaTatuajes = Array.from(tatuajesBBDD);

            console.log("LISTA DEVUUELTA:",this.listaTatuajes);

            this.value = filteredDesigns[0].nombre;
            this.cantidadTatuajes(this.listaTatuajes.length);

          } else{
            this.engServ.setDatosTatu(this.imagenUrl,filteredDesigns[0]);

            const tatuajesBBDD = this.engServ.getTatuajesBBDD();
            console.log('lista2: ', tatuajesBBDD)
            // this.listaTatuajes.push(...tatuajesBBDD);
            tatuajesBBDD.forEach(tatu => {
              console.log(`Meto el tatuaje ${tatu.datos.nombre} en la lista`)
              this.listaTatuajes.push(tatu);
            });

            console.log("LISTA DEVUUELTA:",this.listaTatuajes);

            this.value = filteredDesigns[0].nombre;
            this.cantidadTatuajes(this.listaTatuajes.length);
            this.repetido = 0;
          }
        }

        // for (let index = 0; index < this.listaTatuajes.length; index++) {
        //   if(this.listaTatuajes[index].datos.nombre == designs.nombre){
        //     this.listaTatuajes[index].datos.mostrar = false;
        //     // console.log("AÑADIDOOO:", this.value);
        //   }
        // }

        // if (this.usuariosService.uid)
        // this.avatarService.editarAvatar(this.usuariosService.uid, this.modeloAvatar, this.listaTatuajes, this.texturaAvatar).subscribe({
        //   next: (res) => {
        //     console.log("RES:",res);
        //   }, error: (err) => {
        //     console.log("ERROR:",err);
        //   }
        // });

      }, error:(res) => {
        this.router.navigateByUrl('/explorar');
        Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
        return;
      }});
    }
    else{
      Swal.fire('Primero debes de pintar el designs seleccionado anteriormente');
    }
  }

  finPintado(){
    if(this.pintando == false)
      this.pintando = true;
  }

  esEstudio() {
    return(this.usuariosService.rol === 'ROL_ESTUDIO');
  }

  async anadirAvatarNuestro(disenyo: any){

    this.designService.cargarDesignId(disenyo.did).subscribe( res => {
        if (!res['design']) {
          this.router.navigateByUrl('/explorar');
          return;
        };

        this.imagenUrl = `${environment.base_url}/upload/publicacion/${res['design'].imagen_id}?token=${this.designService.token}`;

        this.motor.actualizaTextura(this.imagenUrl, res['design'].nombre);

        // for (let index = 0; index < this.motor.getListaTatuajes().length; index++) {
        //   this.listaTatuajes.push(this.motor.getListaTatuajes()[index])
        // }

        this.listaTatuajes = this.motor.getListaTatuajes();

        this.cantidadTatuajes(this.listaTatuajes.length);

        if (this.usuariosService.uid)
        this.avatarService.editarAvatar(this.usuariosService.uid, MODELO_CABEZA_HOMBRE, this.listaTatuajes, this.texturaAvatar).toPromise();
        // console.log("LISTA DE TATUAJES DESPUES:", this.listaTatuajes);

        }, (err) => {
          this.router.navigateByUrl('/explorar');
          Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
          return;
    });
  }

  anadirAvatarNuestroUsuario(designs:string, nombre:string){

    this.motor.actualizaTextura(designs, nombre);

    for (let index = 0; index < this.motor.getListaTatuajes().length; index++) {
      this.listaTatuajes.push(this.motor.getListaTatuajes()[index])
    }

    this.cantidadTatuajes(this.listaTatuajes.length);

  }

  getEstaRotando(){
    return this.estaRotando;
  }

  /* MODAL EDITAR */

  showModal(){
    document.getElementById("modalAvatar").style.display = "block";
  }

  showModalTatuajes(){
    document.getElementById("modalTatuajes").style.display = "block";
  }

  hideModal2(){
    document.getElementById("modalAvatar").style.display = "none";
  }

  hideModalTatuajes(){
    document.getElementById("modalTatuajes").style.display = "none";
  }

  cambiarColorPiel(color:string){
    // console.log("COLOR: ", color)
    this.colorPiel = color;

    switch (this.colorPiel) {
      case 'marron': this.texturica = '#d6a980';

        break;
      case 'muynegro': this.texturica = '#4f3125';

        break;
      case 'negro': this.texturica = '#a56c3f';

        break;
      case 'blanco': this.texturica = '#e9caae';

        break;
    }
    // console.log("TEXTURA: ",this.texturica)

  }

  actualizarAvatar(){
    // console.log(this.texturica)
    // this.motor.cambiarPiel(this.texturica);
    this.engServ.cambiarAvatar(this.modeloAvatar);
    this.engServ.cambiarPiel(this.texturica);
    // this.avatarService.editarAvatar(this.usuariosService.uid, this.modeloAvatar, this.listaTatuajes, this.texturica).toPromise();
  }

  /***************************DESPLEGABLE TATUAJES**************************** */
  handleChange(e){
    this.value = e.target.value;
    this.comprobarValorMostrar(this.value);
    // console.log("VALUEE: ", this.value);
  };

  comprobarValorMostrar(value:string){

    for (let index = 0; index < this.listaTatuajes.length; index++) {
      if (value == this.listaTatuajes[index].nombre) {
        this.valorMostrar = this.listaTatuajes[index].mostrar;
        if(this.valorMostrar){
          document.getElementById("boton-eliminar").classList.add("boton-inactivo");
          document.getElementById("boton-editar").classList.add("boton-inactivo");
        }
        else{
          document.getElementById("boton-eliminar").classList.remove("boton-inactivo");
          document.getElementById("boton-editar").classList.remove("boton-inactivo");
        }

      }
    }
  }

  editarTatuaje(tatu:string){
    if(this.value == ''){
      tatu = this.listaTatuajes[0].nombre;
    }
    for (let index = 0; index < this.listaTatuajes.length; index++) {
      if(this.listaTatuajes[index].nombre == tatu){
          var mostrando = this.listaTatuajes[index].mostrar;
      }
    }

    if(!mostrando){
      if (this.valorEditar == true) {

        this.engServ.editarTatu(tatu);

        this.valorEditar = !this.valorEditar;

        this.mostrarselect = false;
        document.getElementById("boton-eliminar").classList.add("boton-inactivo");
        document.getElementById("boton-mostrar").classList.add("boton-inactivo");

      } else {

        document.getElementById("boton-eliminar").classList.remove("boton-inactivo");
        document.getElementById("boton-mostrar").classList.remove("boton-inactivo");

        this.mostrarselect = true;
        this.engServ.editaTatu();
        this.valorEditar = !this.valorEditar;
      }

      if(this.editando == false)
        this.editando = true;
      else
        this.editando = false;

      if (this.usuariosService.uid)
        this.avatarService.editarAvatar(this.usuariosService.uid, this.modeloAvatar, this.engServ.getTatuajesBBDD(), this.texturaAvatar).subscribe({
          next: (res) => {
            console.log("RES:",res);
          }, error: (err) => {
            console.log("ERROR:",err);
          }
        });

    }
  }

  mostrarTatuaje(tatu:string){

    if (this.value == '') {
      if(this.listaTatuajes[0].mostrar == true){
        tatu = this.listaTatuajes[0].nombre;
        this.listaTatuajes[0].mostrar = false;
        this.valorMostrar = false;
        this.engServ.visibleTatu(tatu);
        if(this.listaTatuajes[0].mostrar == false){
          document.getElementById("boton-editar").classList.remove("boton-inactivo");
          document.getElementById("boton-eliminar").classList.remove("boton-inactivo");
        }

        // this.motor.actualizaTextura(this.listaTatuajes[0].fuente, this.listaTatuajes[0].nombre, this.listaTatuajes[0].mostrar);
        // this.motor.actualizarLista(this.listaTatuajes);
        return;
      }
      else{
        tatu = this.listaTatuajes[0].nombre;
        this.listaTatuajes[0].mostrar = true;
        this.valorMostrar = true;
        this.engServ.ocultadoTatu(tatu);
        if(this.listaTatuajes[0].mostrar == true){
          document.getElementById("boton-editar").classList.add("boton-inactivo");
          document.getElementById("boton-eliminar").classList.add("boton-inactivo");
        }
        // this.motor.actualizaTextura(this.listaTatuajes[0].fuente, this.listaTatuajes[0].nombre, this.listaTatuajes[0].mostrar);
        // this.motor.actualizarLista(this.listaTatuajes);
        return;
      }
    }
    else if(this.listaTatuajes.length == 1) {
      if(this.listaTatuajes[0].mostrar == true){
        tatu = this.listaTatuajes[0].nombre;
        this.listaTatuajes[0].mostrar = false;
        this.valorMostrar = false;
        // this.valorMostrar = !this.listaTatuajes[0].mostrar;
        // // console.log("MOSTRARRR:", this.valorMostrar);
        // // console.log("Tatuaje despues de pintar: ", this.listaTatuajes[0].mostrar);
        // // console.log("LISTA: ", this.listaTatuajes);
        this.engServ.visibleTatu(tatu);
        if(this.listaTatuajes[0].mostrar == false){
          document.getElementById("boton-editar").classList.remove("boton-inactivo");
          document.getElementById("boton-eliminar").classList.remove("boton-inactivo");
        }

        // this.motor.actualizaTextura(this.listaTatuajes[0].fuente, this.listaTatuajes[0].nombre, this.listaTatuajes[0].mostrar);
        // this.motor.actualizarLista(this.listaTatuajes);
        return;
      }
      else{
        tatu = this.listaTatuajes[0].nombre;
        this.listaTatuajes[0].mostrar = true;
        this.valorMostrar = true;
        this.engServ.ocultadoTatu(tatu);
        if(this.listaTatuajes[0].mostrar == true){
          document.getElementById("boton-editar").classList.add("boton-inactivo");
          document.getElementById("boton-eliminar").classList.add("boton-inactivo");
        }
        // this.motor.actualizaTextura(this.listaTatuajes[0].fuente, this.listaTatuajes[0].nombre, this.listaTatuajes[0].mostrar);
        // this.motor.actualizarLista(this.listaTatuajes);
        return;
      }
    }
    else{
      for (let index = 0; index < this.listaTatuajes.length; index++) {
        if (tatu == this.listaTatuajes[index].nombre) {
          if(this.listaTatuajes[index].mostrar == true){
            this.listaTatuajes[index].mostrar = false;
            this.valorMostrar = false;
            this.engServ.visibleTatu(tatu);
            if(this.listaTatuajes[index].mostrar == false){
              document.getElementById("boton-editar").classList.remove("boton-inactivo");
              document.getElementById("boton-eliminar").classList.remove("boton-inactivo");
            }
          }
          else{
            this.listaTatuajes[index].mostrar = true;
            this.valorMostrar = true;
            this.engServ.ocultadoTatu(tatu);
            if(this.listaTatuajes[index].mostrar == true){
              document.getElementById("boton-editar").classList.add("boton-inactivo");
              document.getElementById("boton-eliminar").classList.add("boton-inactivo");
            }
          }
        }
      }
    }
  }

  eliminarTatuaje(tatu:string){
    // this.engServ.eliminarTatu(tatu);

    if (this.value == '') {
      tatu = this.listaTatuajes[0].nombre;
      this.engServ.eliminarTatu(tatu);
      this.listaTatuajes.splice(0,1);
      // this.motor.actualizarLista(this.listaTatuajes);

      this.engServ.eliminarTatu(tatu);
      this.cantidadTatuajes(this.listaTatuajes.length);

      if(this.listaTatuajes.length == 0){
        this.inhabilitar();
      }
      // this.comprobarValorMostrar(this.value);

      this.repetido = this.repetido-1;
      if (this.usuariosService.uid)
      this.avatarService.editarAvatar(this.usuariosService.uid, this.modeloAvatar, this.listaTatuajes, this.texturaAvatar).subscribe({
        next: (res) => {
          console.log("RES:",res);
        }, error: (err) => {
          console.log("ERROR:",err);
        }
      });
      return;
    }

    if (this.listaTatuajes.length == 1){
      tatu = this.listaTatuajes[0].nombre;
      this.engServ.eliminarTatu(tatu);
      this.listaTatuajes = [];
      this.tatuajeSeleccionado = false;

      for (let index = 0; index < document.getElementsByClassName("boton-eliminar-centrado").length; index++) {
        document.getElementsByClassName("boton-eliminar-centrado")[index].classList.add("boton-inactivo")
      }

      this.inhabilitar();
      this.valorMostrar = false;

      this.repetido = this.repetido-1;

      if (this.usuariosService.uid)
      this.avatarService.editarAvatar(this.usuariosService.uid, this.modeloAvatar, this.listaTatuajes, this.texturaAvatar).subscribe({
        next: (res) => {
          console.log("RES:",res);
        }, error: (err) => {
          console.log("ERROR:",err);
        }
      });

      return;
    }

    for (let index = 0; index < this.listaTatuajes.length; index++) {
      if (tatu == this.listaTatuajes[index].datos.nombre){
        this.engServ.eliminarTatu(tatu);
        this.listaTatuajes.splice(index, 1);

        this.comprobarValorMostrar(this.listaTatuajes[0].datos.nombre);
        this.repetido = this.repetido-1;
        this.value=this.listaTatuajes[this.listaTatuajes.length-1].datos.nombre;
      }
    }

    if (this.usuariosService.uid)
    this.avatarService.editarAvatar(this.usuariosService.uid, this.modeloAvatar, this.listaTatuajes, this.texturaAvatar).subscribe({
      next: (res) => {
        console.log("RES:",res);
      }, error: (err) => {
        console.log("ERROR:",err);
      }
    });

  //  this.value= this.listaTatuajes[0].nombre;
  //   this.motor.actualizarLista(this.listaTatuajes);
  }

  cantidadTatuajes(tatuajes:number){
    if (tatuajes < 1)
      this.mostrarselect = false;
    else
      this.mostrarselect = true;
  }

  showControles(){
    if (this.listaTatuajes.length > 0)
      return true;

    return this.tatuajeSeleccionado && this.valorEditar;
  }


  /*********************** SUBIDA DISEÑOS USUARIO *************************/

  maximoArchivos:boolean = false;

  tatuajesUsuario:any[] = [];
  tatuajeSubido:any;

  deleteFile(index: number) {
    this.tatuajesUsuario.splice(index, 1)
    this.maximoArchivos = false
  }

  cont:number = 0;
  onImageUploaded(designs:any){
    // console.log("AAAAAAAAAAAAAAAA:", designs )
    this.tatuajeSubido = designs;
  }

  subirResultado(){
    // console.log("SUBIDO: ",this.tatuajeSubido)
    if (this.tatuajeSubido) {

      for (let index = 0; index < this.tatuajesUsuario.length; index++) {
        if (this.tatuajesUsuario[index].nombre === this.tatuajeSubido.nombre) {
        this.cont = this.cont+1;
        this.tatuajeSubido.nombre = this.tatuajeSubido.nombre + this.cont;
        }
        if (this.tatuajeSubido.nombre === '') {
          this.tatuajeSubido.nombre = 'Tatuaje';
        }
      }
      if (this.tatuajesUsuario.length < 5) {
        this.tatuajesUsuario.push(this.tatuajeSubido);
      } else {
        // console.log("NO PUEDES METER MAS TATUS: ", this.tatuajesUsuario)
      }
      // console.log("LISTA: ", this.tatuajesUsuario)
      delete this.tatuajeSubido;
    }
  }

  @ViewChild('editarImagen') editarImagen: EditarImagenComponent;

  public resetearImagen(): void {
    // console.log("reseteo imagen")
    this.editarImagen.resetearImagen2(); // llamada al método de reseteo en el componente hijo
  }

  /* CAPTURA DEL MOTOR */

  // @ViewChild('rendererCanvas', { static: false }) canvasTAG: ElementRef<HTMLCanvasElement>;

  // guardarImagen(){
  //   const canvas = this.rendererCanvasRef.nativeElement
  //   // this.engServ.createScene(this.rendererCanvasRef)
  //   // this.motor.dibujarEscena(canvas);
  //   canvas.toBlob((blob) => {
  //     console.log("blob: ", blob)
  //     this.saveBlob(blob, `Avatar-${canvas.width}x${canvas.height}.png`);
  //   });
  // }

  // saveBlob = (function() {
  //   const a = document.createElement('a');
  //   document.body.appendChild(a);
  //   a.style.display = 'none';
  //   return function saveData(blob, fileName) {
  //       const url = window.URL.createObjectURL(blob);
  //       a.href = url;
  //       a.download = fileName;
  //       a.click();
  //   };
  // }());

  /*  TUTORIAL */

  startIntro(){
    this.showOKT = false;
    // console.log(this.usuariosService.tour);
    if(this.usuariosService.tour==false && this.usuariosService.logged==true){
      this.introService.tourExplorar();
      this.usuariosService.actualizarTour( this.usuariosService.uid , true).subscribe({
        next: res => {
        this.showOKT = true;
      }, error: err => {
          const errtext = err.error.msg;
          Swal.fire({icon: 'error', title: 'Oops...', text: errtext});
          return;
        }});
    }
  }

  getUsuarioLogged(){
    return this.usuariosService.logged;
  }
}
