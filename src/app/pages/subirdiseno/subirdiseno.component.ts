import { Component, ElementRef, ViewChild, NgModule } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EngineService } from 'src/app/services/engine.service';
import { UsuariosService } from '../../services/usuario.service';
import { DesignService } from '../../services/design.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import { Observable, Subscription } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import Swal from 'sweetalert2';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { UploadsService } from '../../services/uploads.service';
import { Router, RouterLink } from '@angular/router';
import { DataUrl, NgxImageCompressService, UploadResponse } from 'ngx-image-compress';
import { EditarImagenComponent } from 'src/app/components/editar-imagen/editar-imagen.component';
import { Tatuaje } from 'src/app/models/tatuaje.model';
import { Motorpropio } from 'src/app/services/motorpropio.service';
import { faSave, faMessage, faBell, faUser, faFilter, faMagnifyingGlass, faNewspaper, faCheckCircle, faBrain, faCheck, faTimes, faWarning, faComputerMouse, faArrowsUpDownLeftRight,
  faRotate, faHandPointer } from '@fortawesome/free-solid-svg-icons';

const PIXELES_MAXIMOS = 1024;

@Component({
  selector: 'app-subirdiseno',
  templateUrl: './subirdiseno.component.html',
  styleUrls: ['./subirdiseno.component.scss']
})


export class SubirdisenoComponent {

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

  /* Estilos */
  iguales = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  estiloCtrl = new FormControl('');
  filteredEstilos: Observable<string[]>;
  estilos: string[] = ["Tribal"];
  allEstilos: string[] = ["Blackwork", "Tradicional", "Neotradicional", "Dotwork", "Realista", "Tribal", "Gótico", "Japonés tradicional", "Blackout", "Fluorescente"];

  imgResultAfterResize: DataUrl = './assets/images/blank-profile-picture.png';

  @ViewChild('estiloInput') estiloInput: ElementRef<HTMLInputElement>;

  /* Formulario */
  public formSubmit = false;
  public waiting = false;


  /* ZONAS */
  dropdownList = [];
  selectedZonas=[];
  dropdownSettings:IDropdownSettings={};
  dropDownForm:FormGroup;

  /* FOTO */
  public imagenUrl = './assets/images/blank-profile-picture.png';
  public fileText = 'Seleccione archivo';
  public foto: File = null;

  private imagenWidth: number;
  private imagenHeight: number;
  private canvas: HTMLCanvasElement;

  /*MOTOR-GRAFICO*/
  public texturica:string = '';
  public colorPiel:string = '';
  toggle = true;
  toggle2 = false;

 public disenyoForm = this.fb.group({
    foto: [''],
    nombre: ['', [Validators.required]],
    color: [false, [Validators.required]],
    estilos: [[''], [Validators.required]],
    zonas: [[''], [Validators.required]],
    descripcion: ['', [Validators.required]]
  });


  @ViewChild('rendererCanvas', {static: true})
  public rendererCanvasRef!: ElementRef<HTMLDivElement>;
  @ViewChild('controles', {static: true})
  public controles!: ElementRef<HTMLDivElement>;

  public constructor(private engServ: EngineService,
                    private fb: FormBuilder,
                    private usuarioService: UsuariosService,
                    private designService: DesignService,
                    private uploadService: UploadsService,
                    private router: Router,
                    private imageCompress: NgxImageCompressService,
                    private motor: Motorpropio,
                    private _formBuilder: FormBuilder


    ) {
      this.filteredEstilos = this.estiloCtrl.valueChanges.pipe(
        startWith(null),
        map((estilo: string | null) => (estilo ? this._filter(estilo) : this.allEstilos.slice())),
      );
  }

  firstFormGroup = this._formBuilder.group({
    foto: [''],
    nombre: ['', [Validators.required]],
    color: [false, [Validators.required]],
  });
  secondFormGroup = this._formBuilder.group({
    estilos: [[''], [Validators.required]],
    zonas: [['Cabeza'], [Validators.required]],
    descripcion: ['', [Validators.required]]
  });

  zonas = [
    { value: 'Cabeza', label: 'Cabeza' },
    { value: 'Pecho', label: 'Pecho' },
    { value: 'Espalda', label: 'Espalda' },
    { value: 'Brazos', label: 'Brazos' },
    { value: 'Piernas', label: 'Piernas' }
  ];


  public ngOnInit(): void {

    /* ZONAS */
    /*this.dropdownList = [
      { zona_id: 1, zona_text: 'Cabeza' },
      { zona_id: 2, zona_text: 'Pecho' },
      { zona_id: 3, zona_text: 'Espalda' },
      { zona_id: 4, zona_text: 'Brazos' },
      { zona_id: 5, zona_text: 'Piernas' }
    ];

    this.dropdownSettings = {
      idField: 'zona_id',
      textField: 'zona_text',
      selectAllText: "Marcar todos",
      unSelectAllText: "Desmarcar todos",
      allowSearchFilter: true,
      searchPlaceholderText: 'Buscar'
    };

    this.selectedZonas = [
      { zona_id: 3, zona_text: 'Espalda'},
    ];

    this.dropDownForm = new FormGroup({
      zonas: new FormControl(this.selectedZonas, Validators.required)
    });

    /* MOTOR */

    // this.engServ.getControles(this.controles);
    // this.engServ.createScene(this.rendererCanvasRef);
    // this.engServ.animate();

    /* MOTOR TAG */

    this.canvas = <HTMLCanvasElement>document.getElementById('glcanvas');

    var obj = this;

    /* Redimensionar ventana canvas */
    initialize();

    function initialize() {
      window.addEventListener('resize', resizeCanvas, false);
      resizeCanvas();
    }

    function resizeCanvas() {
      obj.canvas.width = window.innerWidth*0.5;
      obj.canvas.height = window.innerHeight;
    }

    this.motor.crearEscena(this.canvas);
  }

  /* Estilos */

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    this.estilos.forEach(element => {
      if (value === element){
        this.iguales = true;
      }
    });

    if (value && this.estilos.length <= 4) {
      if (!this.iguales)
        this.estilos.push(value);
      else
        Swal.fire({icon: 'warning', title: 'Oops...', text: 'No puedes añadir 2 tags iguales.'});
    } else {
      Swal.fire({icon: 'warning', title: 'Oops...', text: 'No puedes añadir más de 5 tags.'});
    }

    // Clear the input value
    event.chipInput!.clear();
    this.iguales = false;
    this.estiloCtrl.setValue(null);
  }

  remove(estilo: string): void {
    const index = this.estilos.indexOf(estilo);

    if (index >= 0) {
      this.estilos.splice(index, 1);
      // console.log('estilos', this.estilos)
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {

    this.estilos.forEach(element => {
      if (event.option.viewValue === element){
        this.iguales = true;
        // console.log('igualess')
      }
    });

    if (this.estilos.length <= 4) {
      if (!this.iguales){
        this.estilos.push(event.option.viewValue);
        this.estiloInput.nativeElement.value = '';
        this.estiloCtrl.setValue(null);
      } else {
        Swal.fire({icon: 'warning', title: 'Oops...', text: 'No puedes añadir 2 tags iguales.'});
      }
    } else {
      Swal.fire({icon: 'warning', title: 'Oops...', text: 'No puedes añadir más de 5 tags.'});
    }

    this.iguales = false;

  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allEstilos.filter(estilo => estilo.toLowerCase().includes(filterValue));
  }

  /* FOTO */

  uploadAndResize2(){
    let img = new Image();  //Creo una imagen nueva para comprobar las dimensiones de la imagen subida

    img.src = this.tatuajeSubido.imagen;


    img.onload = () => {
    // console.log("ANCHO IMAGEN",  img.naturalWidth)
    // console.log("ALTO DE LA IMAGEN",  img.naturalHeight)

    if (img.naturalHeight >= PIXELES_MAXIMOS || img.naturalWidth >= PIXELES_MAXIMOS) { //Si el alto o el ancho es mayor a 1024, se hace la compresión
      // console.log("LA IMAGEN TIENE MAS DE 1024PX DE ALTURA Y/O ANCHO")
      let orientation = -2;
      this.imageCompress
      .compressFile(this.tatuajeSubido.imagen, orientation, 100, 100, PIXELES_MAXIMOS, PIXELES_MAXIMOS)
      .then((result: DataUrl) => {
        this.imgResultAfterResize = result;
        this.anadirTatuaje(this.imgResultAfterResize, this.tatuajeSubido.nombre);

        let img2 = new Image();
        img2.src = result;

        this.foto = this.dataURLtoFile(result, this.tatuajeSubido.nombre) //Se crea el archivo a partir del dataURL
        // console.log(this.foto)

        img2.onload = () => { //Asignamos las nuevas dimensiones para subirlas a la BBDD

          this.imagenWidth = img2.naturalWidth;
          this.imagenHeight = img2.naturalHeight;
          // console.log("ALTURA: ", this.imagenWidth);
          // console.log("ANCHO: ", this.imagenHeight);
        }
        // console.log('Size in bytes is now:',this.imageCompress.byteCount(result));
      });
    } else { //Si ambas son menores a 1024, las reasignamos para que la mayor sea igual a 1024 y la otra mantenga la proporción
      // console.log("LA IMAGEN TIENE MENOS DE 1024PX DE ALTURA Y ANCHO")

      this.imgResultAfterResize = img.src;
      // console.log("MIRA: ",this.tatuajeSubido)
      this.anadirTatuaje(this.imgResultAfterResize, this.tatuajeSubido.nombre);
      this.foto = this.dataURLtoFile(img.src, this.tatuajeSubido.nombre) //Se crea el archivo a partir del dataURL
      // console.log(this.foto)
      var result: {ancho:number, alto:number};
      result = this.reasignarDimensiones(img.naturalWidth, img.naturalHeight);

      this.imagenWidth = result.ancho;
      this.imagenHeight = result.alto;
      // console.log("ALTURA: ", this.imagenWidth);
      // console.log("ANCHO: ", this.imagenHeight);
    }
  }

  }

  reasignarDimensiones(ancho:number, alto:number){
    if (ancho > alto) {
      // console.log("ANCHO MAYOR QUE ALTO")
      alto = (alto/ancho)*PIXELES_MAXIMOS;
      ancho = PIXELES_MAXIMOS;
    } else if (ancho < alto ) {
      // console.log("ANCHO MENOR QUE ALTO")
      ancho = (ancho/alto)*PIXELES_MAXIMOS;
      alto = PIXELES_MAXIMOS;
    } else {
      // console.log("ANCHO IGUAL QUE ALTO")
      ancho = PIXELES_MAXIMOS;
      alto = PIXELES_MAXIMOS;
    }

    return {
      ancho,
      alto
    }
  }

  dataURLtoFile(dataurl, filename) {

    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);

    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, {type:mime});
}

  /* Botón */
  subirDisenyo(){

    if (this.firstFormGroup.invalid || this.secondFormGroup.invalid) { return; }

    this.formSubmit = true;

    let object = {
      nombre: this.firstFormGroup.get('nombre').value,
      color: this.firstFormGroup.get('color').value,
      estilos: this.estilos,
      zonas: this.secondFormGroup.get('zonas').value,
      descripcion: this.secondFormGroup.get('descripcion').value,
      usuario: this.usuarioService.uid,
      autor: this.usuarioService.nombre,
      guardados:[],
      imagen_x: this.imagenWidth,
      imagen_y: this.imagenHeight
    }
     console.log('OBJ', object);
    //console.log('foto',this.foto)

    this.waiting = true;
    // console.log('Datos', object)
    //console.log('zonas', JSON.stringify(object.zonas))

    /* Suscribe subir publicacion */
    this.designService.subirDesign(object, this.foto).subscribe({
      next: res => {
        // console.log('Respuesta Publicacion: ',res);

        Swal.fire({
          title: "Éxito!",
          text: "El diseño ha sido subido con éxito.",
          icon: 'success'
        })

        this.waiting = false;


        this.router.navigateByUrl('/estudio/misdisenos');

      },
      error: err => {
        // console.log(err);
        Swal.fire({
          title: 'Error!',
          text: err.error.msg,
          icon: 'error',
          confirmButtonText: 'Aceptar',
          allowOutsideClick: false
        });

        this.waiting = false;
      },
      complete: () => {
        // console.log('req complete DATOS');
      }
    })
  }

  Atras(){
    this.router.navigateByUrl('/estudio/misdisenos');
  }

  showModalTatuajes(){
    document.getElementById("modalTatuajes").style.display = "block";
  }

  hideModalTatuajes(){
    document.getElementById("modalTatuajes").style.display = "none";
  }

  tatuajesUsuario:any[] = [];
  tatuajeSubido:any;

  cont:number = 0;

  subirResultado(){
    // console.log("SUBIDO: ",this.tatuajeSubido)

      // for (let index = 0; index < this.tatuajesUsuario.length; index++) {
      //   if (this.tatuajesUsuario[index].nombre === this.tatuajeSubido.nombre) {
      //   this.cont = this.cont+1;
      //   this.tatuajeSubido.nombre = this.tatuajeSubido.nombre + this.cont;
      //   }
      //   if (this.tatuajeSubido.nombre === '') {
      //     this.tatuajeSubido.nombre = 'Tatuaje';
      //   }
      // }
      // if (this.tatuajesUsuario.length < 5) {
        this.eliminarTatuaje(this.tatuajesUsuario[0]);
        this.tatuajesUsuario.push(this.tatuajeSubido);
      // } else {
      //   console.log("NO PUEDES METER MAS TATUS: ", this.tatuajesUsuario)
      // }

      // console.log("LISTA: ", this.tatuajesUsuario)

      // delete this.tatuajeSubido;
      this.uploadAndResize2();
  }

  @ViewChild('editarImagen') editarImagen: EditarImagenComponent;

  public resetearImagen(): void {
    // console.log("reseteo imagen");
    // delete this.tatuajeSubido;
    this.editarImagen.resetearImagen2(); // llamada al método de reseteo en el componente hijo
  }

  /* CAPTURA DEL MOTOR */

  @ViewChild('canvasTAG', { static: false }) canvasTAG: ElementRef<HTMLCanvasElement>;

  guardarImagen(){
    const canvas = this.canvasTAG.nativeElement
    this.motor.dibujarEscena(canvas);
    canvas.toBlob((blob) => {
    this.saveBlob(blob, `Avatar-${canvas.width}x${canvas.height}.png`);
  });
  }

  saveBlob = (function() {
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style.display = 'none';
    return function saveData(blob, fileName) {
       const url = window.URL.createObjectURL(blob);
       a.href = url;
       a.download = fileName;
       a.click();
    };
  }());

  onImageUploaded(tatuaje:any){
    // console.log("AAAAAAAAAAAAAAAA:", tatuaje )
    this.tatuajeSubido = tatuaje;

  }

  /***PARA EL MOTOR DE TAG, SE QUITA EN EL FUTURO */

  private posicion:number[] = [500, 0];
  private scale:number[] = [0.2,0.2];

  public listaTatuajes:Tatuaje[] = [];

  private tatuajeSeleccionado:boolean = false;

  public valorEditar:boolean = true;

  public value:string = "";

  private estaRotando:boolean = false;

  public mostrarselect:boolean = false;

  public valorMostrar:boolean;


  showControles(){
    // let mostrarActivo:boolean = false;
    if (this.listaTatuajes.length > 0) {
      return true;
    }
    // for (let index = 0; index < this.listaTatuajes.length; index++) {
    //   if (this.listaTatuajes[index].nombre == this.value) {
    //     if (!this.listaTatuajes[index].mostrar) {
    //       mostrarActivo = true;
    //     }
    //   }
    // }
    return this.tatuajeSeleccionado && this.valorEditar;
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

  moverTatuajes(direccion: string){
    // console.log("Boton pulsado: ", direccion);

    if (this.value === '')
    this.value = this.listaTatuajes[0].nombre;


    switch (direccion) {
      case 'abajo':  this.listaTatuajes[0].posicion_y = this.listaTatuajes[0].posicion_y+100;

        break;
      case 'arriba':  this.listaTatuajes[0].posicion_y = this.listaTatuajes[0].posicion_y-100;

        break;
      case 'izquierda': this.listaTatuajes[0].posicion_x = this.listaTatuajes[0].posicion_x-100;

        break;
      case 'derecha': this.listaTatuajes[0].posicion_x = this.listaTatuajes[0].posicion_x+100;

        break;
    }

    if (this.listaTatuajes[0].posicion_x < 0)
      this.listaTatuajes[0].posicion_x = 0;

    if (this.listaTatuajes[0].posicion_y < 0)
      this.listaTatuajes[0].posicion_y = 0;

      // console.log("LISTA: ",this.listaTatuajes)
    this.motor.actualizarPosicionTextura(this.listaTatuajes);


  }

  rotarModelo(){
    if (this.estaRotando)
      this.estaRotando = false;
    else
      this.estaRotando = true;

    this.motor.rotarModelo(this.estaRotando);
  }

  getEstaRotando(){
    return this.estaRotando;
  }

  handleChange(e){
    this.value = e.target.value;
    this.comprobarValorMostrar(this.value);
    // console.log("VALUEE: ", this.value);
  };

  comprobarValorMostrar(value:string){
    for (let index = 0; index < this.listaTatuajes.length; index++) {
      if (value == this.listaTatuajes[index].nombre) {
        this.valorMostrar = this.listaTatuajes[index].mostrar;
      }
    }
  }

  editarTatuaje(){
    if (!this.valorEditar) {
      document.getElementById("boton-editar").classList.remove("editar-activo");
      document.getElementById("boton-editar").classList.add("editar-inactivo");
      this.valorEditar = !this.valorEditar;
    } else {
      document.getElementById("boton-editar").classList.add("editar-activo");
      document.getElementById("boton-editar").classList.remove("editar-inactivo");
      this.valorEditar = !this.valorEditar;
    }

  }

  mostrarTatuaje(tatu:string){
    // console.log("mostrarTatuaje()");
    // console.log("LISTA ANTES: ", this.listaTatuajes)

    if (this.value == '') {
      // console.log("mostrar el primer elemento");
      // this.listaTatuajes[0].mostrar = !this.listaTatuajes[0].mostrar;
      // this.valorMostrar = this.listaTatuajes[0].mostrar;
      // console.log("Tatuaje despues de ocultar: ", this.listaTatuajes[0].mostrar);
      // console.log("LISTA: ", this.listaTatuajes);

      // this.motor.actualizaTextura(this.listaTatuajes[0].fuente, this.listaTatuajes[0].nombre, this.listaTatuajes[0].mostrar);
      // this.motor.actualizarLista(this.listaTatuajes);
      // return;
      this.value = this.listaTatuajes[0].nombre;
      tatu = this.value;
    }

    for (let index = 0; index < this.listaTatuajes.length; index++) {
      if (tatu == this.listaTatuajes[index].nombre) {
        // console.log("mostrar el tatuaje: ", this.listaTatuajes[index]);
        this.listaTatuajes[index].mostrar = !this.listaTatuajes[index].mostrar;
        this.valorMostrar = this.listaTatuajes[index].mostrar;
        // console.log("Estado del tatuaje: ", this.listaTatuajes[index].mostrar);

        this.motor.actualizaTextura(this.listaTatuajes[index].fuente, this.listaTatuajes[index].nombre, this.listaTatuajes[index].mostrar);
      }
    }
  }

  eliminarTatuaje(tatu:string){
    if (this.listaTatuajes.length > 0) {
      // console.log("eliminarTatuaje()")
      // console.log("this.listaTatuajes en eliminarTatuaje()", this.listaTatuajes)

      if (this.value === '') {
        // console.log("Borro el primer elemento")
        // this.listaTatuajes.splice(0,1);
        // console.log("this.listaTatuajes despues del splice: ", this.listaTatuajes)
        // this.motor.actualizarLista(this.listaTatuajes);
        // return;
        this.value = this.listaTatuajes[0].nombre;
        tatu = this.value;
      }

      if (this.listaTatuajes.length == 1) {
        // console.log("Borro el único elemento")
        this.listaTatuajes = [];
        // console.log("this.listaTatuajes despues del splice: ", this.listaTatuajes)
        this.tatuajeSeleccionado = false;
        for (let index = 0; index < document.getElementsByClassName("boton-eliminar-centrado").length; index++) {
          document.getElementsByClassName("boton-eliminar-centrado")[index].classList.add("boton-inactivo")
        }
        this.motor.actualizarLista(this.listaTatuajes);


        // console.log("resultado: ", this.listaTatuajes)
        return;
      }

      for (let index = 0; index < this.listaTatuajes.length; index++) {
        if (tatu == this.listaTatuajes[index].nombre)
          this.listaTatuajes.splice(index, 1);
      }

      this.value="";
      this.motor.actualizarLista(this.listaTatuajes);
      // this.avatar.editarAvatar(this.usuariosService.uid, MODELO_CABEZA_HOMBRE, this.listaTatuajes, this.avatarCargado).toPromise();
      // console.log("resultado: ", this.listaTatuajes)
    }
  }

  // comprobarTatuajes(){
  //   // for (let index = 0; index < this.tatuajesUsuario.length; index++) {
  //     if (this.tatuajesUsuario.length > 1) {
  //       console.log("NOMBRE:", )
  //       this.eliminarTatuaje(this.tatuajesUsuario[0]);
  //     }
  //   // }
  // }

  limpiarTatuajeSubido(){
    this.imgResultAfterResize = './assets/images/blank-profile-picture.png';
  }

  anadirTatuaje(imagen:string, nombre:string){
    this.motor.actualizaTextura(imagen, nombre);

    for (let index = 0; index < this.motor.getListaTatuajes().length; index++) {
      this.listaTatuajes.push(this.motor.getListaTatuajes()[index])
    }

    this.cantidadTatuajes(this.listaTatuajes.length);
  }

  cantidadTatuajes(tatuajes:number){
    if (tatuajes < 2) {
      this.mostrarselect = false;
    } else {
      this.mostrarselect = true;
    }
  }

  cambiarColorPiel(color:string){
    // console.log("COLOR: ", color)
    this.colorPiel = color;

    switch (this.colorPiel) {
      case 'muynegro': this.texturica = '../../../assets/images/TEXTURA4.jpg';

        break;
      case 'negro': this.texturica = '../../../assets/painball/Map-COL.jpg';

        break;
      case 'marron': this.texturica = '../../../assets/images/TEXTURA2.jpg';

        break;
      case 'blanco': this.texturica = './../../assets/images/TEXTURA1.jpg';

        break;

    }
    // console.log("TEXTURA: ",this.texturica)
  }

  marcado() {
    this.toggle = !this.toggle;
    this.toggle2 = !this.toggle2;
  }

  marcado2() {
    this.toggle = !this.toggle;
    this.toggle2 = !this.toggle2;
  }

  actualizarAvatar(){
    // console.log(this.texturica)
    this.motor.cambiarPiel(this.texturica);
  }
}
