import { ElementRef,Injectable,NgZone } from '@angular/core';
import * as THREE from 'three';

import Stats from 'three/examples/jsm/libs/stats.module.js';
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DecalGeometry } from 'three/examples/jsm/geometries/DecalGeometry';
import { Design } from '../models/design.model';

let renderer, scene, camera, stats;
let mesh;
let raycaster;
let line;
var url:string = '';

const intersection = {
  intersects: false,
  point: new THREE.Vector3(),
  normal: new THREE.Vector3()
};

const mouse = new THREE.Vector2();
const intersects = [];

const textureLoader = new THREE.TextureLoader();
const decalDiffuse = textureLoader.load( url );
const decalNormal = textureLoader.load( url );

const decalMaterial = new THREE.MeshPhongMaterial( {
  specular: 0x444444,
  map: decalDiffuse,
  normalMap: decalNormal,
  normalScale: new THREE.Vector2( 1, 1 ),
  shininess: 60,
  transparent: true,
  depthTest: true,
  depthWrite: false,
  polygonOffset: true,
  polygonOffsetFactor: - 4,
  wireframe: false
} );

const decals = [];
let mouseHelper;
const position = new THREE.Vector3();
const orientation = new THREE.Euler();
const size = new THREE.Vector3( 10, 10, 10 );
let canv;
var nuevoColor;
var cont;
var datos;
var añadido;
var m;
var tatuUid;
var oculto = false;
var datostatu;
var tatuajemodificandose:string = '';
var pintado = false;
var cambiandopos = false;
var mnuevo;


interface tatuajesThree {
  datos: any;
  position: THREE.Vector3;
  orientation: THREE.Euler;
  escala: number;
  oculto: boolean;
  colorsito: string;
}

var datosTatuajes: tatuajesThree[] = [];


const params = {
  escala: 5,
  rotate: true,
  'Aplicar Color': function() {
    CambiarTextura();
  },
  'Borrar Color': function(){
    borrarColor();
  },
  'Cambiar Posicion':function(){
    cambiarPosicion();
  }
};

function pintoLinea(lineas:boolean){
  if(lineas === true)
    scene.add(line);

  if(lineas === false){
    for (let index = 0; index < scene.children.length; index++) {
      if (scene.children[index] instanceof THREE.Line)
        scene.remove(scene.children[index]);
    }
  }

}


function editTatoo(listatatus: tatuajesThree[]){
  var material;

  for (let index = 0; index < decals.length; index++) {
    if(datos.nombre == decals[index].datos.nombre){
      var escalaAsig = decals[index].escal;
    }
  }

  size.set(escalaAsig, escalaAsig, escalaAsig);

  for (let index = 0; index < decals.length; index++) {
    if(decals[index].datos.nombre == datos.nombre){
      if(decals[index].colorsito != null) material = decals[index].colorsito;
      else material = decalMaterial.clone();
    }
  }

  mnuevo = new THREE.Mesh( new DecalGeometry(mesh,  position,  orientation, size ), material);

  for (let index = 0; index < decals.length; index++) {
    if(datos.nombre == decals[index].datos.nombre){
      decals[index].m = mnuevo;
      decals[index].posicion = position;
    }
  }

  //Añadir todos los datos de decals a listatatus
  for (let index = 0; index < decals.length; index++) {
    const nuevoTatuaje: tatuajesThree = {
      datos: decals[index].datos,
      position: decals[index].posicion,
      orientation: decals[index].orienta,
      escala: decals[index].escal,
      oculto: decals[index].oculto,
      colorsito: decals[index].colorsito
    };
    listatatus = [];
    listatatus.push(nuevoTatuaje);
  }

  añadido = true;

  scene.add(mnuevo);
  pintoLinea(false);
  pintado = false;
  cambiandopos = false;
  datos = '';
}

async function shoot() {

position.copy(intersection.point);
orientation.copy(mouseHelper.rotation);

const scale = params.escala;

if(datos && cambiandopos == true){

  editTatoo(datosTatuajes);

} else if (datos){
  size.set( 5, 5, 5);
  params.escala = 5;
  var escal = scale;
  const material =  decalMaterial.clone();
  var orienta= orientation;

  m = new THREE.Mesh( new DecalGeometry(mesh,  position,  orientation, size), material);

  var posicion = position.clone();

  var colorsito;

  //Añadir los datos al array tatuajes
  const nuevoTatuaje: tatuajesThree = {
    datos: datos,
    position: posicion,
    orientation: orienta,
    escala: escal,
    oculto: oculto,
    colorsito: colorsito
  };

  datosTatuajes.push(nuevoTatuaje);


  console.log("DIBUJANDO TATUAJE: ", datosTatuajes);

  decals.push({m,datos,oculto,posicion,orienta,colorsito,escal});

  añadido = true;
  // ---------- Añadir a la base de datos ------------ //

  scene.add(m);
  habilitar();
  pintoLinea(false);
  pintado = false;
  datos = '';
}

datos = '';
console.log("DECALS:",decals);
}


function habilitar(){
  for (let index = 0; index < document.getElementsByClassName("boton-eliminar-centrado").length; index++) {
    document.getElementsByClassName("boton-eliminar-centrado")[index].classList.remove("boton-inactivo")
  }
}

function CambiarTextura(){
  var mate;
  for (let index = 0; index < decals.length; index++) {
    if(decals[index].datos.nombre === tatuajemodificandose){
      tatuUid = decals[index].m.uuid;
    }
  }

  for (let index = 0; index < scene.children.length; index++) {
    if (scene.children[index] instanceof THREE.Mesh) {
      // // console.log("MESH:", scene.children[index]);
      if(scene.children[index].uuid === tatuUid ){
        // console.log("SCENE:",scene);
        const materi = scene.children[index].material;

        // console.log("MATERIII:",materi);
        materi.color.setHex(nuevoColor);
        mate = materi;
        scene.children[index].geometry.decalMaterial = materi;
        // console.log("COLOR PUESTOOOOO");
      }
    }
  }

  for (let index = 0; index < decals.length; index++) {
    if(decals[index].datos.nombre === tatuajemodificandose){
      decals[index].colorsito = mate;
    }
  }


}

function borrarColor() {
  for (let index = 0; index < decals.length; index++) {
    if(decals[index].datos.nombre === tatuajemodificandose){
      tatuUid = decals[index].m.uuid;
      var materil = decals[index].material;
      var me = decals[index].m;
      var TextMap = decals[index].m.material.map;
      var TextNormalMap = decals[index].m.material.normalMap;
      decals[index].colorsito = null;
      // var TextNormal = decals[index].m.material.normal;
      // console.log("MATERIAL:", materil);
    }
  }

  for (let index = 0; index < scene.children.length; index++) {
    if (scene.children[index] instanceof THREE.Mesh) {
      // // console.log("MESH:", scene.children[index]);
      if(scene.children[index].uuid === tatuUid ){

        const nuevoMaterial = new THREE.MeshPhongMaterial( {
          specular: 0x444444,
          map: TextMap,
          normalMap: TextNormalMap,
          normalScale: new THREE.Vector2( 1, 1 ),
          shininess: 60,
          transparent: true,
          depthTest: true,
          depthWrite: false,
          polygonOffset: true,
          polygonOffsetFactor: - 4,
          wireframe: false
        } );

        scene.children[index].material = nuevoMaterial;

      }
    }
  }
}

function removeDecals() {
      //scene.remove(decals[1]);
      //decals[1] = null;
      decals.forEach( function ( d ) {

        scene.remove( d.m );

      } );

      decals.length = 0;
      // console.log("decals",decals);
}

function borrarTatu(nombre:string){
  for (let index = 0; index < decals.length; index++) {
    if (decals[index].datos.nombre === nombre){
      tatuUid = decals[index].m.uuid;
    }
  }
  for (let index = 0; index < scene.children.length; index++) {
    if (scene.children[index] instanceof THREE.Mesh) {
      if(scene.children[index].uuid === tatuUid ){
        scene.remove(scene.children[index]);
      }
    }
  }
}

function ocultarTatu(nombre:string){

  for (let index = 0; index < decals.length; index++) {
    // // console.log("DECALSTATTOO:",decals[index].datos.nombre)
    // // console.log("NOMBREEEE:", nombre);
    if (decals[index].datos.nombre === nombre){
      // // console.log("PACO VA POR TI")
      tatuUid = decals[index].m.uuid;
      decals[index].oculto = true;
    }
  }
  for (let index = 0; index < scene.children.length; index++) {
    if (scene.children[index] instanceof THREE.Mesh) {
      // // console.log("MESH:", scene.children[index]);
      if(scene.children[index].uuid === tatuUid ){
        // // console.log("REMOVE CHILDREN", scene.children[index].uid)
        scene.remove(scene.children[index]);
      }
    }
  }
}

function mostrarTatu(nombre:string){

  // console.log("decals",decals);
  // console.log("ESCENA",scene.children);
  for (let index = 0; index < decals.length; index++) {
    // // console.log("DECALSTATTOO:",decals[index].datos.nombre)

    if (decals[index].datos.nombre === nombre){
      // // console.log("PACO VA POR TI")
      decals[index].oculto = false;
      // console.log("NOMBREEEE:", nombre);
      datostatu = decals[index].m;
    }

  }

  scene.add(datostatu);
}

function editTatuaje(nombre:string,tama:number){
  let posicionAnt = null;
  let vector;
  // console.log("ESCENA1:",scene);

  for (let index = 0; index < decals.length; index++) {

    if(decals[index].datos.nombre === nombre){
      // var vector = null;
      // console.log("BUCLE 1");
      // // console.log("PACO VA POR TI")
      decals[index].escal = tama;
      tatuUid = decals[index].m.uuid;
      // const posicionAnt = decals[index].m.geometry.position.array;
      vector = decals[index].posicion;
      console.log("POSICION DECALS:", vector);
      var orient = decals[index].orienta;
      console.log("POSSSSSSSSSSSSSSSSSS:", vector);
      // console.log("VAMOOOOOSSSSSSSSSSSSSSSSSS:", size.set(tama, tama, tama));

      // console.log("DECALS:",decals);
    }
  }
  const scale = params.escala;
  for (let index = 0; index < scene.children.length; index++) {

    if (scene.children[index] instanceof THREE.Mesh) {

      // // console.log("MESH:", scene.children[index]);
      if(scene.children[index].uuid === tatuUid ){
        // console.log("BUCLE 2");
        // console.log("ESCENA2:",scene);
        size.set(tama, tama, tama);
        // position.copy(vector);
        // vector =  new THREE.Vector3().fromArray(scene.children[index].geometry.attributes.position.array);
        // var me = new DecalGeometry(mesh, position, orientation, size);
        // console.log("MEEEE:", scene);
        // console.log("ORIENTACION:",orient);
        // console.log("SIZEEE:",size);
        // scene.children[index].geometry.size.set(tama, tama, tama);
        scene.children[index].geometry = new DecalGeometry(mesh, vector, orient, size);
      //  ç scene.children[index].geometry.attributes.position = vector;
      }
    }
  }
}

function Comprobarcolor(tatu:string){
  var col = false;
  if(tatu){
    for (let index = 0; index < decals.length; index++) {
      if(decals[index].datos.nombre === tatu){
        // console.log("TATUUUU:",decals[index].datos.nombre);
        if(decals[index].datos.color === true){
          // console.log("TIENE COLOR");
          col = true;
        }
        else{
          // console.log("NOOO TIENE COLOR");
          col = false;
        }
      }
    }
  }

  return col;

}

function cambiarPosicion(){
  var meshi;

  for (let index = 0; index < decals.length; index++) {
    if (decals[index].datos.nombre === tatuajemodificandose){
      meshi = decals[index].m;
      tatuUid = decals[index].m.uuid;
      var da = decals[index].datos;
    }
  }
  for (let index = 0; index < scene.children.length; index++) {
    if (scene.children[index] instanceof THREE.Mesh) {
      if(scene.children[index].uuid === tatuUid ){
      scene.remove(scene.children[index]);
      cambiandopos = true;
      pintoLinea(true);
      datos = da;

      }
    }
  }
}

function getescala(tatuajemodificandose:string){
  // console.log("TATUAJE MODIFICANDOSE:", tatuajemodificandose);
  var escalaa;
  // if(decals.length > 0){
    for (let index = 0; index < decals.length; index++) {
      // // console.log("DECALSTATTOO:",decals[index].datos.nombre)
      if (decals[index].datos.nombre === tatuajemodificandose){
        // // console.log("PACO VA POR TI")
        escalaa = decals[index].escal;
        // console.log("ESCALAAA:",escalaa);
      }
    }
  // }
  // }else{
  //   escalaa = 5;
  // }

  return escalaa;
}

function getParam(){
  // if(decals.length > 0){
  //   for (let index = 0; index < decals.length; index++) {
  //     if(decals[index].datos.nombre == tatuajemodificandose){
  //       params.escala = decals[index].escal;
  //     }
  //   }
  // }

  return params.escala;
}

function getDatosTatuajes(){
  return datosTatuajes;
}


function pintarTatuajesBBDD(){

  console.log('pintando tatuajes', datosTatuajes);
  for (let index = 0; index < datosTatuajes.length; index++) {
    if(datosTatuajes[index].oculto == false){
      var material = decalMaterial.clone();
      material.color.setHex( Number(datosTatuajes[index].colorsito) );
      size.set(datosTatuajes[index].escala, datosTatuajes[index].escala, datosTatuajes[index].escala);
      // let position = new THREE.Vector3(datosTatuajes[index].position.x, datosTatuajes[index].position.y, datosTatuajes[index].position.z);
      // let orientation = new THREE.Euler(datosTatuajes[index].orientation.x, datosTatuajes[index].orientation.y, datosTatuajes[index].orientation.z, "XYZ");
      console.log('orientation', orientation);
      console.log('MUÑECO', mesh);
      let geometry = new DecalGeometry(mesh, datosTatuajes[index].position, datosTatuajes[index].orientation, size)
      console.log('decalGeometry', geometry);

      m = new THREE.Mesh( geometry, material);
      console.log('mesh', m);
      scene.add(m);
      console.log('scene', scene);
    }
  }
}


@Injectable({
   providedIn: 'root'
})

export class EngineService {


  constructor(private ngZone: NgZone) {


   }

  public rotando:boolean = false;
  public colorear:string = '#e9caae';
  public personaje:string = './assets/humano/chicoo.glb';
  public modificar:boolean = false;
  public avatarmodificado:boolean = false;
  public pintarLinea:boolean = false;
  public eliminadotatuaje:boolean = false;
  public elimnando:string = '';
  public editando:boolean = false;

  public gui;
  public escalada;
  public contad = 0;



  public getControles(canvas: ElementRef<HTMLDivElement>){
    cont = canvas.nativeElement;
  }

  public getTatuajes(){
    return decals;
  }

  public getAñadido(){
    return añadido;
  }

  public setDatosTatu(ruta:string,tatuaje:Design){
    decalMaterial.map = textureLoader.load(ruta);
    datos = tatuaje;
    this.setPintado();
    decalMaterial.normalMap = textureLoader.load(ruta);
  }

  public createScene(canvas: ElementRef<HTMLCanvasElement>){


    //// console.log("MESH",mesh);
    canv = canvas.nativeElement;
    //// console.log("CANVASSS",canv);
    renderer = new THREE.WebGLRenderer( {antialias: true } );
     //// console.log("RENDERER",renderer);
     renderer.setPixelRatio( window.devicePixelRatio );
     //Para cuando es un movil y cuando no
     if(window.innerWidth > 360 && window.innerWidth < 420 )
      renderer.setSize( window.innerWidth, window.innerHeight );
     else
      renderer.setSize( window.innerWidth*0.5, window.innerHeight );

    // stats = Stats();
    //// console.log("STATS",stats);
    // canv.appendChild( stats.dom );
    canv.appendChild( renderer.domElement);
    //// console.log("STATS",stats);
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x212529);

    if(window.innerWidth > 360 && window.innerWidth < 420 )
      camera = new THREE.PerspectiveCamera( 45, window.innerWidth/ window.innerHeight, 1, 1000 );
    else
      camera = new THREE.PerspectiveCamera( 45, window.innerWidth*0.5/ window.innerHeight, 1, 1000 );
    camera.position.z = 180;
    camera.position.y = 30;

    const controls = new OrbitControls( camera, renderer.domElement );

    controls.minDistance = 50;
    controls.maxDistance = 200;

    scene.add( new THREE.AmbientLight( 0x443333,2) );

    const dirLight1 = new THREE.DirectionalLight( 0xffddcc, 0.35 );
    dirLight1.position.set( 1, 0.75, 0.5 );
    scene.add( dirLight1 );

    const dirLight2 = new THREE.DirectionalLight( 0xccccff,  0.35);
    dirLight2.position.set( - 1, 0.75, - 0.5 );
    scene.add( dirLight2 );

    const geometry = new THREE.BufferGeometry();
    geometry.setFromPoints( [ new THREE.Vector3(), new THREE.Vector3() ] );

    line = new THREE.Line( geometry, new THREE.LineBasicMaterial() );

    // scene.add( line );

   // this.escena();
   // console.log("COLOR:", this.colorear);

    this.loadLeePerrySmith();

    raycaster = new THREE.Raycaster();

    mouseHelper = new THREE.Mesh( new THREE.BoxGeometry( 1, 1, 10 ), new THREE.MeshNormalMaterial() );
    mouseHelper.visible = false;

    window.addEventListener( 'resize', this.onWindowResize );

    let moved = false;

    controls.addEventListener( 'change', function () {

      moved = true;

    } );

    window.addEventListener( 'pointerdown', function () {

      moved = false;

    } );

    window.addEventListener( 'pointerup', function ( event ) {

      if ( moved === false ) {

        checkIntersection( event.clientX, event.clientY );

        if ( intersection.intersects )

            shoot();

      }

    } );

    window.addEventListener( 'pointermove', onPointerMove );

    function onPointerMove( event ) {
      if ( event.isPrimary ) {
        checkIntersection( event.clientX, event.clientY );
      }
    }

    function checkIntersection( x, y ) {

      if ( mesh === undefined ) return;

      mouse.x = ( (x / window.innerWidth)*0.5) * 2 - 1 + 0.25;
      mouse.y = - ( y / window.innerHeight ) * 2 + 1 + 0.05;

      raycaster.setFromCamera( mouse, camera );
      raycaster.intersectObject( mesh, false, intersects );

      if ( intersects.length > 0 ) {

        const p = intersects[ 0 ].point;
        mouseHelper.position.copy( p );
        intersection.point.copy( p );

        const n = intersects[ 0 ].face.normal.clone();
        n.transformDirection( mesh.matrixWorld );
        n.multiplyScalar( 10 );
        n.add( intersects[ 0 ].point );

        intersection.normal.copy( intersects[ 0 ].face.normal );
        mouseHelper.lookAt( n );

        const positions = line.geometry.attributes.position;
        positions.setXYZ( 0, p.x, p.y, p.z );
        positions.setXYZ( 1, n.x, n.y, n.z );
        positions.needsUpdate = true;

        intersection.intersects = true;

       intersects.length = 0;

      } else {

        intersection.intersects = false;

      }
    }
    // if(this.editando){
    //   this.cambiarColor(decalMaterial);
    // }


  }

  public cambiarColor( obj ){

    this.gui = new GUI({autoPlace:false});
    this.gui.domElement.id = 'gui';

    // console.log("CONT:",cont);
    cont.appendChild(this.gui.domElement);

    this.gui.title('CONFIGURAR TATTOO');

    const Tamano = this.gui.addFolder('Tamaño');
    params.escala = this.escalatatu();
    var tam = Tamano.add( params , 'escala', 1, 20,1 );
    // console.log("NOOOOO");
    // tam.onChange( function(tam){
    //   editTatuaje(tatuajemodificandose,tam);
    //   console.log("YEEEE:",tam);
    // });

    // console.log("VALOOOR:", Comprobarcolor(tatuajemodificandose));
    // console.log("TATUUUUU:", tatuajemodificandose);
    //gui.add( params, 'rotate' );
  if(Comprobarcolor(tatuajemodificandose)){
    const colorar = this.gui.addFolder('Color');
    var Configuracion=function(){
            this.color = "#00000";
    }

    var conf = new Configuracion();

    var controlador = colorar.addColor( conf, 'color');
    colorar.add( params,'Aplicar Color');
    colorar.add( params, 'Borrar Color');

    controlador.onChange( function( colorValue)
    {
      //the return value by the chooser is like as: #ffff so
      //remove the # and replace by 0x

      colorValue=colorValue.replace( '#','0x' );
      // console.log("color",colorValue);
      //set the color in the object
      nuevoColor = colorValue;

    });

    const cambiopos = this.gui.addFolder('Posición');
    cambiopos.add( params,'Cambiar Posicion');
  }

  }

  public escena() {

      const loader1 = new GLTFLoader();
      let escenarecibida;
    loader1.load('./assets/3dmodels/Escenatoda.gltf',(gtlf)=> {
      escenarecibida = new THREE.Mesh();
      escenarecibida=gtlf.scene;
      escenarecibida.rotation.y = 3.02;

      escenarecibida.scale.set(13,13,13); //escalamos objeto

      scene.add(escenarecibida);
    });
  }

  public setColor(color:string){
    this.colorear = color;
  }

  public setModelo(modelo:string){
    this.personaje = modelo;
  }
  public setTatuajes(tatuajes:any){
    if (tatuajes.length > 0) {
      datosTatuajes.push(...tatuajes);
    }
    console.log("TATUAJES RECIBIDOS:",datosTatuajes);
  }

  public getTatuajesBBDD(){
    return getDatosTatuajes();
  }

  public loadLeePerrySmith() {

    const loader = new GLTFLoader();

    var obj = this;
    if (this.personaje)
      console.log("PERSONAJE", this.personaje);
    else
      console.log("NO HAY PERSONAJE");

    loader.load(this.personaje , function ( gltf ){
      mesh = gltf.scene.children[ 0 ];
      mesh.material = new THREE.MeshPhongMaterial({
        specular: 0x111111,
        color: obj.colorear,
        shininess: 25
      });
      mesh.transparent = 0.5;

      scene.add( mesh );
      mesh.scale.set( 60, 60, 60 ); //CUERPO
      mesh.position.y= -65;//CUERPO
    });

  }

  public onWindowResize() {
    camera.aspect = window.innerWidth*0.4 / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
  }

  public añadirTatuajesEscena() {
    pintarTatuajesBBDD();
  }

  public animate() {
    this.ngZone.runOutsideAngular(() => {
      if (document.readyState !== 'loading') {
        this.render();
      } else {
        window.addEventListener('DOMContentLoaded', () => {
          this.render();
        });
      }

      window.addEventListener('resize', () => {
        this.onWindowResize();
      });
    });


  }

  public conta = 0;
  public render(): void {
    let frameId = requestAnimationFrame(() => {
      this.animate();
    });
    // // console.log("ESCENA:",scene.children);
    if(this.modificar == true){
      var colorete = new THREE.Color(this.colorear);
      mesh.material.color = colorete;
      // console.log("SCENEEE",colorete);
      this.modificar = false;
    }

    if(this.eliminadotatuaje == true){
      // console.log("SCENE",scene.children);
    }

    if(this.avatarmodificado == true){
      this.loadLeePerrySmith();
      this.avatarmodificado = false;
    }

    if(this.editando == true){
      if(this.ComprobarEscala()){
        // editTatuaje(tatuajemodificandose);
        // console.log("ESTOY DENTROOOOO");
        if(this.conta == 0){

          this.cambiarColor(decalMaterial);
          this.conta++;
        }else{

        }
      }
    }
    else{
      if(this.gui){
        this.gui.destroy();
      }
      tatuajemodificandose = '';
      this.conta = 0;
      this.contad = 0;
    }


    // console.log("COLOREAR:",mesh.material.color);
    // console.log("ANIMATEEEE",mesh);
    if (this.rotando){

      mesh.rotation.y = mesh.rotation.y - 0.005;

      for (let index = 0; index < decals.length; index++) {
        decals[index].m.rotation.y = decals[index].m.rotation.y - 0.005;
      }
    }
    // console.log("SCENEEE",scene);
    // console.log("CAMARA",camera);
    renderer.render( scene, camera );
    // stats.update();
    // console.log("CAMARA",camera);
  }

  public rotarModelo(estaRotando:boolean){
    if(estaRotando) {
      for (let index = 0; index < scene.children.length; index++) {
        if (scene.children[index] instanceof THREE.Line) {
            scene.remove(scene.children[index]);
        }
      }
    }
    this.rotando = estaRotando;
  }

  public cambiarPiel(color:string){
    this.colorear = color;
    this.modificar = true;
  }

  public cambiarAvatar(avatar:string){
    console.log("CAMBIO AVATAR A:",this.personaje);
    console.log("MODELOS EN ESCENA:", scene.children);
    this.personaje = avatar;

    for (let index = 0; index < scene.children.length; index++) {
      if (scene.children[index] instanceof THREE.Mesh) {
        console.log(scene.children[index].name);
        if(scene.children[index].name === 'ImageToStlcom_personajo' || scene.children[index].name === 'Untitled'){
          // console.log("ENTROO3");
          scene.remove(scene.children[index]);
        }
      }
    }
    removeDecals();
    this.avatarmodificado = true;
  }

  public añadirLinea(lineas:boolean){
    pintoLinea(lineas);
  }

  public eliminarTatu(nombre:string){
    borrarTatu(nombre);
  }

  public ocultadoTatu(nombre:string){
    ocultarTatu(nombre);
  }

  public visibleTatu(nombre:string){
    mostrarTatu(nombre);
  }

  public editarTatu(nombre:string){
    console.log("NOMBREE:",nombre);
    tatuajemodificandose = nombre;
    this.editando = true;
  }

  public editaTatu(){
    if(this.editando == false) this.editando = true;
    else this.editando = false;
  }

  public ComprobarEscala(){
    var escala = getParam();
    if(this.contad == 0){

      this.escalada = escala;
      this.contad++;
      editTatuaje(tatuajemodificandose,escala);
      return true;
    }
    else if(escala != this.escalada ){
      this.contad = 0;
      editTatuaje(tatuajemodificandose,escala);
      // this.escalada = escala;
      return true;
    }
    else{
      return false;
    }
  }

  public setPintado(){
    pintado = !pintado;
  }

  public getPintado(){
    return pintado;
  }

  public escalatatu(){
    var esc = 5;
    if(tatuajemodificandose)
      esc = getescala(tatuajemodificandose);

    return esc;
  }

}
