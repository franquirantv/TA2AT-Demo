import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { UsuariosService } from '../../services/usuario.service';
import { Router } from '@angular/router';
import { ComunicacionService } from '../../services/comunicacion.service';
import { ChatService } from 'src/app/services/chat.service';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  Cargado: boolean= false;
  @Input() mostrarchat: boolean;
  articulos2:any;
  public nuevoMensaje : string = "";
  public waiting = false;
  mensajes: any = [
  ];
  HayChats: boolean=false;
  Conversaciones: any[][] = [];
  listaUids: string[]=[]; //Lista de uids que vamos a obtener datos
  public listaNL: any[];
  constructor(
    private usuarioService: UsuariosService,
    private router: Router,
    private chatService: ChatService,
    private comunicacionService: ComunicacionService,
    private http: HttpClient,
    ) { //aqui en los parametros del contructor importo y declaro componenetes de otros sitios

  }

  ngOnInit(): void {
    this.cargarChat();
  }


  //Prueba
  nombre() {
    return this.usuarioService.nombre;
  }

  cargarChat(){
    if(!this.Cargado){
      this.Cargado= true;
      this.cargarMensajes();
      // console.log('CARGO EL CHAT')
    }
    return this.Cargado;
  }

  ExisteNuevo: boolean=false;

  mostrarModal(){
    if(this.comunicacionService.getData('nuevoChat')['nuevo'] && !this.ExisteNuevo){
      this.ExisteNuevo = true;
      this.ChatNuevo();
    }
    return this.comunicacionService.getData('mostrarChat');
  }

  ChatNuevo(){
    // console.log('SE CREA UN NUEVO CHAT');
    let obj={
      nombre: this.comunicacionService.getData('nuevoChat')['usuario'].nombre,
      imagen: this.comunicacionService.getData('nuevoChat')['usuario'].imagen,
      uid: this.comunicacionService.getData('nuevoChat')['usuario'].uid,
    };
    // console.log('Viejo chat', this.Conversaciones);
    // nuevoChat= [[obj],this.Conversaciones];
    // this.Conversaciones = nuevoChat;
    let chatExiste:boolean =false;
    for (let index = 0; index < this.Conversaciones.length; index++) {
      if(this.Conversaciones[index][0].uid === obj.uid){
        this.chatActivo = index;
        chatExiste = true;
      }
    }

    if(!chatExiste && obj.uid !== this.usuarioService.uid){
      this.Conversaciones.unshift([obj]);
    }
    // console.log('Nuevo chat', this.Conversaciones);
  }



  hideModal(){//Logout de chat
    this.comunicacionService.setData('mostrarChat', false);

    if(this.ExisteNuevo){
      this.ExisteNuevo = false;
      let obj={
        mostrar: false,
        nuevo: false,
        usuario: null,
      }

      this.comunicacionService.setData('nuevoChat', obj);
      this.Cargado = false;
    }
    // console.log('Cierro Chat');

    //Actualizo los leidos del chat en cuestion que se estuviera viendo por si no ha cambiado de vista
    this.ActualizarLeidosEstatico(this.chatActivo);
    this.ActualizarLeidosBD(this.chatActivo);
    this.chatActivo=0;


    this.cargarMensajes();
  }

  enviar() {
    let usuarioAct = this.usuarioService.uid;
    if(this.nuevoMensaje== "") return;


    let mensaje={
      emisor: this.usuarioService.uid, //636ce64b383e1a0feb82175b
      texto: this.nuevoMensaje
    }
    // console.log('mensaje:',mensaje.emisor);
    this.mensajes.push(mensaje);

    let mensajeSinComillas = this.nuevoMensaje;

    this.nuevoMensaje = JSON.stringify(this.nuevoMensaje);

    let destino;

    if(!this.Conversaciones[this.chatActivo][0]){
      console.warn('Errores al enviar mensaje');
      return;
    }
    /*
    if(this.usuarioService.uid == '636ce64b383e1a0feb82175b'){
      destino = '63c0608a0a1a4833ebf968dd'
    }
    else{
      destino = '636ce64b383e1a0feb82175b'
    }
    */
    destino=this.Conversaciones[this.chatActivo][0].uid;

    let obj = {
      remitente: this.getUsuarioId(),
      destinatario: destino,
      mensaje:this.nuevoMensaje
    };

    let nmensaje = {
      remitente: this.getUsuarioId(),
      destinatario: destino,
      mensaje:mensajeSinComillas,
      fecha: new Date
    };

    this.waiting = false;

    this.Conversaciones[this.chatActivo].push(nmensaje);
      // this.chatService.sendMensaje(obj)
      // .subscribe({
      //   next: res => {
      //     this.waiting = false;

      //     this.Conversaciones[this.chatActivo].push(nmensaje);

      //     // console.log('Nuevas conversaciones: ', this.Conversaciones);
      //   },
      //   error: err =>{
      //     // console.log(err);
      //     Swal.fire({
      //       title: 'Error!',
      //       text: err.error.msg || 'No pudo completarse la acción, vuelva a intentarlo más tarde',
      //       icon: 'error',
      //       confirmButtonText: 'Aceptar',
      //       allowOutsideClick: false
      //     });
      //     this.waiting = false;
      //   },
      //   complete: () => {
      //     // console.log('req complete');
      //   }
      // });

   // this.location.go(this.location.path());
   // window.location.reload();
    this.nuevoMensaje = '';

    //this.scrollToTheLastElementByClassName();
  }

  cargarMensajes(){
    // let remitente = this.usuarioService.uid;
    // this.chatService.getMensaje(remitente).subscribe({
    this.http.get('assets/getMensajes.json').subscribe({
      next: res => {
          this.crearArrayChats(res['result']);
          let array: any[];
          array = res['result'];
          this.articulos2 = array;//hora
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

  crearArrayChats(mensajes: any[]){
    //let listaUids: string[]=[]; //Lista de uids que vamos a obtener datos

    let uid= this.getUsuarioId(); //Uid del estudio online

    //Aquí filtramos entre los mensajes para separar por conversaciones obteniendo el uid del que no es el estudio conectado
    let conversaciones: any[][] = [];
    for (let index = 0; index < mensajes.length; index++) {
      let idDest: any;
      if(mensajes[index].remitente === uid){
        idDest=mensajes[index].destinatario;
      }else{
        idDest=mensajes[index].remitente
      }
      let existe: boolean= false;
        for (let index2 = 0; index2 < conversaciones.length; index2++) {
          if(conversaciones[index2][0].includes(idDest)){

              conversaciones[index2].push(mensajes[index]);

            existe= true;
          }
        }
        if(!existe){
          conversaciones.push([idDest]);
          this.listaUids.push(idDest);
          conversaciones[conversaciones.length - 1].push(mensajes[index]);
        }
    }
    // console.log('conversaciones',conversaciones)
    //Procedemos a obtener los datos de los usuarios

    this.Conversaciones= conversaciones;
    console.log('coonvers',this.Conversaciones)

    // this.chatService.getDatosUsuarios(this.listaUids).subscribe({
    this.http.get('assets/getDatosUsuarios.json').subscribe({
      next: res => {

        for (let index = 0; index < res['usuarios'].length; index++) {

          for (let index2 = 0; index2 < this.Conversaciones.length; index2++) {
            if(this.Conversaciones[index2][0] === res['usuarios'][index].uid){
              this.Conversaciones[index2][0] = res['usuarios'][index];
            }
          }

        }
        // console.log('Respuesta de getDatosUsuarios: ', this.Conversaciones);
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

      },
      complete: () => {
        if(this.comunicacionService.getData('nuevoChat')['nuevo']){
          this.ChatNuevo();
        }
      }
    });

    this.insertarDatos();

  }

  public TNL: number = 0; //Siglas de total de no leidos

  insertarDatos(){
    let dias:string[]= [];

    this.listaNL = [];
    this.TNL=0;
    let leidos: boolean= true;
    let NL: number= 0;
    let PNL: number;

    for (let index = 0; index < this.Conversaciones.length; index++) {
      for (let index2 = 0; index2 < this.Conversaciones[index].length; index2++) {

        if(index2!==0){

          //Metodo de insterar nueva fecha
          let fechaAct= this.fechaFormato(this.Conversaciones[index][index2].fecha);

          if(!dias.includes(fechaAct)){

            dias.push(fechaAct);

            let obj={
              id: 'fecha',
              fecha: fechaAct
            }

            this.Conversaciones[index].splice(index2, 0, obj);

          }

          //Metodo de insertar no leidos
          if(this.Conversaciones[index][index2].id !== 'fecha' && this.Conversaciones[index][index2].leido=== 0 && this.Conversaciones[index][index2].remitente !== this.usuarioService.uid){
            if(leidos){
              PNL = index2;
            }
            leidos = false;
            NL += 1;
          }

        }

      }

      if(!leidos){
        let obj2={
          id: 'nl',
          mensaje: 'MENSAJES NO LEÍDOS',
          numero: NL,
        }
        this.TNL += NL;
        this.Conversaciones[index].splice(PNL, 0, obj2)
      }
      //Antes de empezar con el siguiente chat reinicio la variables
      this.listaNL.push(NL);
      leidos=true;
      dias = [];
      NL = 0;
    }

    for (let index = 0; index < this.Conversaciones.length; index++) {
      for (let index2 = 0; index2 < this.Conversaciones[index].length; index2++) {
        if (index2!==0) {

          if (this.Conversaciones[index][index2].id !== 'nl' && this.Conversaciones[index][index2].id !== 'fecha') {

            let ultimoCaracter = this.Conversaciones[index][index2].mensaje.slice(0,-1);
            let sinComillas = ultimoCaracter.slice(1);
            this.Conversaciones[index][index2].mensaje = sinComillas;
          }
        }

      }
    }
    this.comunicacionService.setData('TNL', this.TNL);
  }



  fechaFormato(data: any){
    //console.log('FECHAFORMATO data: ', data)
    let nuevaFecha: Date= new Date(data);
    //console.log('FECHAFORMATO nueva: ', nuevaFecha)

    let ano= nuevaFecha.getFullYear().toString();

    let dia= nuevaFecha.getDate().toString();

    let mes= (nuevaFecha.getMonth()+ 1).toString();



    let stringFecha: string = `${dia}/${mes}/${ano}`;
    //console.log('FECHAFORMATO buena: ', stringFecha)
    return stringFecha;
  }

  cargarSRC(imagen: string){
    const token = this.usuarioService.token;

    if (!imagen){
      return `${environment.base_url}/upload/fotoperfil/no-imagen?token=${token}`;
    } else{
      return `${environment.base_url}/upload/fotoperfil/${imagen}?token=${token}`;
    }
    //console.log(`${base_url}/upload/fotoperfil/${this.imagen}?token=${token}`);


  }

  chatActivo: number= 0;

  seleccionarChat(n: number){
    //Primero actualizo los leidos si los hay en la conversacion en cuestion
    this.ActualizarLeidosEstatico(this.chatActivo);
    this.ActualizarLeidosBD(this.chatActivo);
    //Luego cambio de chat
    this.chatActivo= n;
  }

  getUsuarioId(){
    return '63874455a7ca794afff94a59';
  }

  getUsuarioNombre(){
    return this.usuarioService.nombre;
  }

  getHora(data: any){
    let nuevaFecha: Date= new Date(data.fecha);

    let hora= nuevaFecha.getHours().toString();

    if(nuevaFecha.getHours()<10){
      hora = `0${hora}`;
    }

    let minutos= nuevaFecha.getMinutes().toString();

    if(nuevaFecha.getMinutes()<10){
      minutos = `0${minutos}`;
    }

    let stringFecha: string = `${hora}:${minutos}`;

    return stringFecha;
  }

  existenConvers(){
    return this.Conversaciones || this.Conversaciones.length !== 0
  }

  refrescarChat(){
    this.cargarMensajes();
  }

  ActualizarLeidosEstatico(chat:number){
    const nm: number= this.Conversaciones[chat].length || 0;
    let existe:boolean= false;
    let donde:number;


      for (let index = 1; index < nm; index++) {
        if(this.Conversaciones[chat][index].id === 'nl'){
          existe=true;
          donde= index;
        }
      }
      if(existe){
        this.Conversaciones[chat].splice(donde, 1);
      }

      this.listaNL[chat] = 0;
      this.ActualizarTNL();
  }

  ActualizarLeidosBD(chat:number){
    let ids: any[]=[]
    let uid:string = this.usuarioService.uid;

    for (let index = 1; index < this.Conversaciones[chat].length; index++) {
      if (this.Conversaciones[chat][index].id !== 'nl' && this.Conversaciones[chat][index].id !== 'fecha') {
        if(this.Conversaciones[chat][index].leido === 0 && this.Conversaciones[chat][index].destinatario === uid){
          ids.push(this.Conversaciones[chat][index].id);
        }
      }
    }

    if(ids.length != 0){
      let obj ={
        ids: ids,
        uid: uid
      };
      this.chatService.updateMensaje(obj).subscribe({
        next: res => {

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
  }


  ActualizarTNL(){
    let nuevoTotal: number = 0;
    for (let index = 0; index < this.listaNL.length; index++) {
      nuevoTotal+=this.listaNL[index];
    }
    this.TNL=nuevoTotal;
    this.comunicacionService.setData('TNL', this.TNL);
  }

}
