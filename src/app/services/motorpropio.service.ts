import { Injectable } from "@angular/core"
import { mat4, vec3 } from "gl-matrix";
import { TCamara } from "../motor-ta2at/TCamara";
import { TEntidad } from "../motor-ta2at/TEntidad";
import { TGestorRecursos } from "../motor-ta2at/TGestorRecurso";
import { TLuz } from "../motor-ta2at/TLuz";
import { TModelo } from "../motor-ta2at/TModelo";
import { TNodo } from "../motor-ta2at/TNodo"
import { TRecursoTextura } from "../motor-ta2at/TRecursoTextura";
import { TRecurso } from "../motor-ta2at/TRecurso";
import { Tatuaje } from "../models/tatuaje.model";
import { AvatarService } from "./avatar.service";
import Swal from "sweetalert2";
import { UsuariosService } from "./usuario.service";

var gl: WebGL2RenderingContext; // variable global para el contexto WebGL

var dragLeft = false;
var old_x = 0;
var old_y = 0;
var dx = 0;
var dy = 0;
var theta = 0;
var phi = 0;
var scale = 0.5;
var dragRight = false;
var old_xRight = 0;
var old_yRight = 0;
var dxRight = 0;
var dyRight = 0;
var trasX = 0;
var trasY = 0;

@Injectable({
  providedIn: 'root'
})

export class Motorpropio{

  private escena: TNodo;
  private gestorRecursos: TGestorRecursos;
  private luzActiva: number;
  private camaraActiva: number;
  private viewportActivo: number;
  private luces: TNodo[];
  private camaras: TNodo[];
  private viewports: number[][];
  private nodoModelo: TNodo;
  private canvas: HTMLCanvasElement;
  private width: number;
  private height: number;
  // private TRrecurso:TRecurso = new TRecurso();
  private Ttextura:TRecursoTextura;
  private nuevaTextura:HTMLImageElement = new Image();
  private malla: TModelo;

  public modelo:TModelo;
  public cubo:TModelo;
  public textura:string = '../../assets/painball/Map-COL.jpg';
  public textura2:string = '../../assets/painball/Map-SPEC.jpg';
  public fichero:string = '../../assets/painball/LeePerrySmith.json';
  public fichero2:string = '../../assets/painball/cubo.json';
  public nomMalla:string = 'modelo';

  public posicion:number[] = [500,0];
  public scale:number[] = [0.2,0.2];

  public rotando:boolean = false;
  public time:number = 0;

  public anchoTextura:number;
  public altoTextura:number;

  public texturaActiva: string;


  public listaTatuajes:Tatuaje[] = [];
  public listaza;


  constructor( private avatarService:AvatarService, private usuarioService:UsuariosService){
    this.escena = new TNodo();
    this.gestorRecursos = new TGestorRecursos();
    this.luces = [];
    this.camaras = [];
    this.viewports = [];
  }

  crearNodo(padre: TNodo, entidad: TEntidad, traslacion: vec3, escalado: vec3, rotacion: vec3): TNodo{
    var nodo: TNodo = new TNodo();

    nodo.setEntidad(entidad);
    padre.addHijo(nodo);
    nodo.setTraslacion(traslacion);
    nodo.setEscalado(escalado);
    nodo.setRotacion(rotacion);
    nodo.setActualizarMatriz(true);

    return nodo;
  }

  crearCamara(): TCamara{
    var camara: TCamara = new TCamara();

    return camara;
  }

  crearLuz(): TLuz{
    var luz: TLuz = new TLuz();

    return luz;
  }

  crearMalla(fuenteModelo:string, texturaModelo:string): TModelo{
    this.malla = new TModelo();
    // console.log("CREAR MALLA")
    // console.log(fuenteModelo);
    // console.log(texturaModelo);
    this.malla.cargarMalla(this.gestorRecursos.getRecurso(fuenteModelo, 'malla', texturaModelo , this.nomMalla));

    this.malla.setNombre(this.nomMalla);

    return this.malla;
  }

  cambiarPiel(piel:string){

    // console.log("CAMBIAR PIEL");

    this.textura = piel;
    this.Ttextura = this.gestorRecursos.getRecursoTextura();
    // console.log("--------------------------TEXTURA-------------------------",this.Ttextura);
    this.Ttextura.actualizarTextura(this.textura);

    // this.gestorRecursos = new TGestorRecursos();

  }


  async actualizaTextura(ficheroNueva: string, nombre?:string, mostrar:boolean = false, reiniciar:boolean = false, piel?:string){
    this.texturaActiva = ficheroNueva;
    if (piel !== '' && piel !== undefined) {
      this.textura = piel;
    }

    let textura2;
    // console.log("actualizaTextura()");
    // console.log("this.textura = ", this.textura);
    this.Ttextura = this.gestorRecursos.getRecurso(this.textura,'textura',nombre);
    this.listaTatuajes = this.Ttextura.getListaTatuajes();
    // console.log("this.listaTatuajes en actualizaTextura(): ",this.listaTatuajes)

    if (!reiniciar) {
      this.nuevaTextura = await this.Ttextura.combinarTextura(nombre, ficheroNueva, this.scale, mostrar);
      textura2 = this.gestorRecursos.getRecurso(this.fichero, 'malla', this.nuevaTextura.src, this.nomMalla, true);
      // console.log("nuevatextura: ", this.nuevaTextura.src);
    } else {
      // console.log("REINICIAR ES TRUE!!!!!")
      textura2 = this.gestorRecursos.getRecurso(this.fichero, 'malla', ficheroNueva, this.nomMalla);
    }

    this.malla.cargarMalla(textura2);

    return this.malla;
  }

  getListaTatuajes(){
    return this.listaTatuajes;
  }

  actualizarPosicionTextura(listaTatus:Tatuaje[]){

    // console.log("POSICION AL MOTOR: ", posicion)
    // console.log("TATUAJE ACTIVO AL MOTOR: ", tatuajeActivo)
    if (this.texturaActiva){
      this.Ttextura.moverTatuajes(listaTatus);
      // console.log("texturica activa: ",this.texturaActiva)
      this.actualizaTextura(this.texturaActiva)
    }

  }

  actualizarEscalaTextura(scale: number[]){

    // console.log("ESCALA AL MOTOR: ", this.scale)
    if (this.texturaActiva){
      this.actualizaTextura(this.texturaActiva);
      this.scale = scale;
    }

  }

  rotarModelo(estaRotando:boolean){

    this.rotando = estaRotando;

  }

  async crearEscena(canvas: HTMLCanvasElement){

    canvas.addEventListener("mousedown", this.mouseDown, false);
    canvas.addEventListener("mouseup", this.mouseUp, false);
    canvas.addEventListener("mouseout", this.mouseUp, false);
    canvas.addEventListener("mousemove", this.mouseMove, false);
    canvas.addEventListener("wheel", this.zoom, false);

    var tras: vec3 = [0, 0, 0];
    var esc: vec3 = [1, 1, 1];
    var rot: vec3 = [0, 0, 0];

    var camara: TCamara = this.crearCamara();
    var luz: TLuz = this.crearLuz();

    var texturaAvatar: string;
    var ficheroAvatar: string;

    if (this.usuarioService.uid !== '') {

      let data = await this.cargarAvatar2(this.usuarioService.uid);
      texturaAvatar = data['avatar'].piel;
      ficheroAvatar = data['avatar'].modelo;

    } else {
      texturaAvatar = this.textura;
      ficheroAvatar = this.fichero;
    }

    // console.log("TEXTURA: ", texturaAvatar);
    // console.log("FICHERO: ", ficheroAvatar);

    this.modelo = this.crearMalla(ficheroAvatar, texturaAvatar);
    this.nodoModelo = this.crearNodo(this.getEscena(), this.modelo, tras, esc, rot);

    var nodoCamara: TNodo = this.crearNodo(this.getEscena(), camara, tras, esc, rot);
    var nodoLuz: TNodo = this.crearNodo(this.getEscena(), luz, tras, esc, rot);

    nodoLuz.rotar([0, 90, 0]);

    var nViewport: number = this.registrarViewport(0, 0, canvas.width, canvas.height);
    this.setViewportActivo(nViewport);
    var nCamara: number = this.registrarCamara(nodoCamara);
    this.setCamaraActiva(nCamara);
    var nLuz: number = this.registrarLuz(nodoLuz);
    this.setLuzActiva(nLuz);

    var obj = this;

    function renderLoop(){

      obj.nodoModelo.setTraslacion([trasX, trasY, 0]);

      if (obj.rotando){
        obj.time = obj.time - 0.005;
        obj.nodoModelo.setRotacion([0,obj.time,0]);
        phi = 0;
        theta = 0;
      } else {
        obj.time = 0;
        obj.nodoModelo.setRotacion([phi, theta, 0]);
      }

      obj.nodoModelo.setEscalado([scale, scale, scale]);

      obj.dibujarEscena(canvas);

      requestAnimationFrame(renderLoop);
    }

    renderLoop();
  }

  async cargarAvatar2(uid:string ) {
    var data = await this.avatarService.cargarAvatar(uid).toPromise();
    return data;
  }

  mouseDown(event: MouseEvent){
    event.preventDefault();

    if(event.button == 0){
      dragLeft = true;
      old_x = event.pageX;
      old_y = event.pageY;
    }

    if(event.button == 2){
      dragRight = true;
      old_xRight = event.pageX;
      old_yRight = event.pageY;
    }
  }

  mouseUp(event: MouseEvent){
    event.preventDefault();

    if(event.button == 0)
      dragLeft = false;

    if(event.button == 2)
      dragRight = false;
  }

  mouseMove(event: MouseEvent){
    event.preventDefault();

    //Rotar
    if(dragLeft){
      dx = (event.pageX - old_x) * 2 * Math.PI / this.width;
      dy = (event.pageY - old_y) * 2 * Math.PI / this.height;
      theta += dx;
      phi += dy;
      old_x = event.pageX;
      old_y = event.pageY;
    }

    //Mover
    if(dragRight){
      dxRight = (event.pageX - old_xRight) * 5 / this.width;
      dyRight = (event.pageY - old_yRight) * 5 / this.height;
      trasX += dxRight;
      trasY += -dyRight;
      old_xRight = event.pageX;
      old_yRight = event.pageY;
    }
  }

  zoom(event: WheelEvent){
    event.preventDefault();

    if(event.deltaY < 0)
      scale += 0.25;
    else
      scale -= 0.25;

    scale = Math.min(Math.max(0.25, scale), 4);
  }

  dibujarEscena(canvas: HTMLCanvasElement): void{
    gl = this.initWebGL(canvas);

    //Inicializar luces
    this.luces[this.luzActiva].recorrer(mat4.create());

    //Inicializar el viewport
    var view = this.viewports[this.viewportActivo];
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.1294, 0.1451, 0.1608, 1.0);
    gl.clearDepth(1.0);
    gl.viewport(view[0], view[1], view[2], view[3]);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    //Inicializar camara
    this.camaras[this.camaraActiva].recorrer(mat4.create());


    this.escena.recorrer(mat4.create());
  }

  actualizarLuz(): boolean{
    return true;
  }

  actualizarCamara(): boolean{
    return true;
  }

  registrarLuz(luz: TNodo): number{
    this.escena.addHijo(luz);
    return this.luces.push(luz) - 1;
  }

  registrarCamara(camara: TNodo): number{
    this.escena.addHijo(camara);
    return this.camaras.push(camara) - 1;
  }

  registrarViewport(x: number, y: number, ancho: number, alto: number): number{
    return this.viewports.push([x, y, ancho, alto]) - 1;
  }

  setLuzActiva(luz: number){
    this.luzActiva = luz;
  }

  setCamaraActiva(camara: number){
    this.camaraActiva = camara;
  }

  setViewportActivo(viewport: number){
    this.viewportActivo = viewport;
  }

  getEscena(): TNodo{
    return this.escena;
  }
  getModelo(): TModelo{
    return this.modelo;
  }
  getNodoModelo(): TNodo{
    return this.nodoModelo;
  }

  initWebGL(canvas: HTMLCanvasElement) {//iniciará el webgl
    gl = null;

    try {
      // Tratar de tomar el contexto estandar. Si falla, retornar al experimental.
      gl = canvas.getContext("webgl2")
    }
    catch(e) {
    }

    // Si no tenemos ningun contexto GL, date por vencido ahora
    if (!gl) {
      alert("Imposible inicializar WebGL. Tu navegador puede no soportarlo.");
      gl = null;
    }

    return gl;
  }

  actualizarLista(lista:Tatuaje[]){
    this.listaza = this.listaTatuajes;
    this.listaTatuajes = lista;
    this.Ttextura.actualizarLista(lista);
    // console.log("LISTA TATUAJES EN RTEXTURA: ", this.Ttextura.getListaTatuajes())
    // console.log("TAMAÑO: ", this.listaTatuajes.length);

    this.gestorRecursos.eliminarRecurso(this.fichero);
    this.gestorRecursos.eliminarRecurso(this.nuevaTextura.src);

    if (this.listaTatuajes.length == 0) {
      // console.log("QUEDAN 0 TATUAJES")
      this.gestorRecursos.eliminarRecurso(this.textura);
      this.actualizaTextura(this.textura,null,null,true); //Poner la textura base
    }

      // this.actualizaTextura(this.textura,null,null,true);
      // console.log("EN ACTUALIZA TEXTURA:", this.listaTatuajes.length);
      for (let index = 0; index < this.listaTatuajes.length; index++) {
        // console.log("For dentro de actualizarLista")
        // console.log("PINTANDO TATTOO:", this.listaTatuajes[index]);
        this.actualizaTextura(this.listaTatuajes[index].fuente ,this.listaTatuajes[index].nombre)
      }



  }
}

