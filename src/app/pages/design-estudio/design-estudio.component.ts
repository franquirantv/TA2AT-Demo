import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, Input } from '@angular/core';
import { UsuariosService } from '../../services/usuario.service';
import { Observable, tap } from 'rxjs';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router, ActivatedRoute } from '@angular/router';
import { faSave, faMessage, faBell, faUser, faFilter, faMagnifyingGlass, faNewspaper, faCheckCircle, faBrain, faCheck, faTimes, faWarning } from '@fortawesome/free-solid-svg-icons';
import * as $ from 'jquery'
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgZone } from '@angular/core';
import * as Notiflix from 'notiflix';
import { DesignService } from '../../services/design.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { environment } from '../../../environments/environment.prod';
import { Design } from '../../models/design.model';
import Swal from 'sweetalert2';
import { EngineService } from 'src/app/services/engine.service';
import { Usuario } from 'src/app/models/usuario.model';
import {MatChipInputEvent} from '@angular/material/chips';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {map, startWith} from 'rxjs/operators';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-design-estudio',
  templateUrl: './design-estudio.component.html',
  styleUrls: ['./design-estudio.component.css']
})

export class DesignEstudioComponent implements OnInit{
  searchQuery: string = '';

  isCargado: boolean = false;
  toggle = true;
  toggle2 = false;
  encendida:boolean = true;

  luces: NodeListOf<Element> = document.querySelectorAll(".luz");
  inputs: NodeListOf<Element> = document.querySelectorAll("input");

  public waiting = false;

  public editar = false;

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

  public datosIni: any;

  public usuario:Usuario
   info: boolean = false;
  public zonas:string[]
  public estiloR:string[]
  public descripcion:string
  public nombre:string
  public color:boolean
  public imagenUrl:string
  public colorString:string
  public nombreUsuario: string;


  constructor(private usuariosService: UsuariosService,
              private router: Router,
              private route: ActivatedRoute,
              private ngZone: NgZone,
              private fb: FormBuilder,
              private designService: DesignService,
              private engServ: EngineService
    ) {
      this.filteredEstilos = this.estiloCtrl.valueChanges.pipe(
        startWith(null),
        map((estilo: string | null) => (estilo ? this._filter(estilo) : this.allEstilos.slice())),
      );
     }

  ngOnInit(): void {

    this.uid = this.route.snapshot.params['uid'];

    this.cargarZonas();
    // console.log(1)
    this.cargarDisenyo();

    this.encender();


  }

  recargar(){
    this.estilos = [];
    this.selectedZonas = [];
    this.cargarDatos(this.datosIni);
  }

  cargarZonas(){
    //ZONAS
    this.dropdownList = [
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

    ];

    this.dropDownForm = this.fb.group({
      zonas: [this.selectedZonas, [Validators.required]]
    });

    // console.log('zonas seleccionadas= ', this.selectedZonas)
  }

  cargarDatos(res: any){
    this.zonas = res['design'].zonas
    this.estiloR = res['design'].estilos
    this.descripcion = res['design'].descripcion
    this.nombre = res['design'].nombre
    this.color = res['design'].color
    this.nombreUsuario = res['design'].autor

    // console.log('zonassss==== ', this.zonas)

    this.datosForm.get('nombre').setValue(this.nombre);
    this.datosForm.get('descripcion').setValue(this.descripcion);
    this.datosForm.get('color').setValue(this.color);
    this.datosForm.get('estilos').setValue(this.estiloR);
    this.datosForm.get('zonas').setValue(this.zonas);

    //------Seleccionar estilos
    for (let index = 0; index < this.estiloR.length; index++) {
      this.estilos.push(this.estiloR[index]);
    }

    //------Seleccionar zonas
    for (let index = 0; index < this.zonas.length; index++) {
      for (let index2 = 0; index2 < this.dropdownList.length; index2++) {
        if(this.zonas[index] === this.dropdownList[index2].zona_text){
          this.selectedZonas.push(
            this.dropdownList[index2]
          );
        }
      }
    }
    this.dropDownForm.get('zonas').setValue(this.selectedZonas);

    this.imagenUrl = `${environment.base_url}/upload/publicacion/${res['design'].imagen_id}?token=${this.designService.token}`;
    console.log(this.imagenUrl)
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
      // console.log('autor',res['design'].autor)
      this.datosIni= res;
      // console.log('NIÑOOOO: ',this.datosIni);
      // console.log('NIÑAAAA: ',res);
      this.cargarDatos(res);
    }, (err) => {
      this.router.navigateByUrl('/estudio/misdisenos');
      Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
      return;
    });
  }

    encender(): void {
      var miElemento = document.getElementById('luce');

        if (this.encendida === false) {
          miElemento.classList.remove('l0');
          this.encendida = true;
        } else {
          miElemento.classList.add('luz');
          miElemento.classList.add('l0');
          this.encendida = false;
        }
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

    prueba(){
      //console.log(123456789)
    }

    borrardesign(did: string){
      this.waiting = true; //El waiting se utilizará en el botón de ir atrás cuando se cree o en cualquier apartado que queramos bloquear
      this.designService.borrarDesign(did, this.usuariosService.uid).subscribe({
        next: res => {

          this.router.navigateByUrl('/estudio/misdisenos');

          this.waiting = false;
        },
        error: err =>{
          // console.log(err);
          Swal.fire({
            title: 'ERROR',
            text: 'Ha habido un problema al borrar el diseño. Vuelva a intentarlo mas tarde. Si persiste contacte con nosotros.',
            icon: 'error',
            confirmButtonText: 'Entendido',
            allowOutsideClick: false
          });
          this.waiting = false;
        },
        complete: () => {
          // console.log('req complete');
        }
      });
    }

    Atras(){
      this.router.navigateByUrl('/estudio/misdisenos');
    }

    isExplorar(){
      return this.router.url === '/explorar'
    }

    //----------------------------------------EDITAR DESIGN--------------------------------------------------------
    public datosForm = this.fb.group({
      nombre: ['', Validators.required ],
      descripcion: ['', Validators.required ],
      color: [false, [Validators.required]],
      estilos: [[''], [Validators.required]],
      zonas: [[''], [Validators.required]],
    });

    editarDesign(){
      this.recargar();
        this.editar= !this.editar;
    }

    esEditar(){
      //
      return this.editar;
      //return true //PARA HACER PRUEBAS
    }

    campoNoValido( campo: string): boolean {
      return this.datosForm.get(campo).invalid;
    }

    enviar(){
      if (this.datosForm.invalid) { return; }

      var takeZonas=[];

      /* Recoger datos de las zonas */
      for (var i = 0; i < this.dropDownForm.get('zonas').value.length; i++)
        takeZonas.push(this.dropDownForm.get('zonas').value[i].zona_text);

      let object = {
        //imagen_id: this.imagenSubida,
        nombre: this.datosForm.get('nombre').value,
        color: this.datosForm.get('color').value,
        estilos: this.estilos,
        zonas: takeZonas,
        descripcion: this.datosForm.get('descripcion').value,
      }

      this.designService.editarDesign(this.uid,this.usuariosService.uid, object).subscribe({
        next: res => {
          this.cargarZonas();
          this.cargarDisenyo();
          this.editar= !this.editar;

        }, error: err =>{
          const errtext = err.error.msg || 'No se pudo guardar los datos';
          Swal.fire({icon: 'error', title: 'Oops...', text: errtext});
        }});

      // console.log('objeto', object);
    }

    /* Estilos */
  iguales = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  estiloCtrl = new FormControl('');
  filteredEstilos: Observable<string[]>;
  estilos: string[] = [];
  allEstilos: string[] = ["Blackwork", "Tradicional", "Neotradicional", "Dotwork", "Realista", "Tribal", "Gótico", "Japonés tradicional", "Blackout", "Fluorescente"];

  @ViewChild('estiloInput') estiloInput: ElementRef<HTMLInputElement>;

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


  /*------------------------------------ZONAS---------------------------------------------------*/
  dropdownList = [];
  selectedZonas=[];
  dropdownSettings:IDropdownSettings={};
  dropDownForm:FormGroup;


}

