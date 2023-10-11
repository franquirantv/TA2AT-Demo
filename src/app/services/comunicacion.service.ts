import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ComunicacionService {

  private mostrarAjustes= false;
  private mostrarChat= {
    mostrar:false,
    nuevo:false,
    usuario: null,
  };
  private mostrarVal= false;

  private TNL = 0;

  constructor() { }

  setData(variable: string,data: any){
    console.log('variable',variable,'data',data)
    switch (variable) {
      case 'mostrarChat':
        this.mostrarChat.mostrar=data;
        break;
      case 'TNL':
        this.TNL=data;
        // console.log('Total de no leidos',this.TNL)
        break;
      case 'nuevoChat':
        this.mostrarChat.mostrar=data.mostrar;
        this.mostrarChat.nuevo=data.nuevo;
        this.mostrarChat.usuario=data.usuario;
        break;
      case 'mostrarVal':
        this.mostrarVal=data;
        break;

      case 'mostrarAjustes':
        this.mostrarAjustes = data;
        break;

      default:
        break;
    }
  }

  getData(variable: string){
    switch (variable) {
      case 'mostrarChat':
        return this.mostrarChat.mostrar;
      case 'TNL':
        return this.TNL;
      case 'nuevoChat':
        return this.mostrarChat;
      case 'mostrarAjustes':
        return this.mostrarAjustes;
      case 'mostrarVal':
        return this.mostrarVal;

      default:
        return null;
    }
  }
}
