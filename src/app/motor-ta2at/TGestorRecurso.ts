import { TRecurso } from './TRecurso';
import { TRecursoMalla } from './TRecursoMalla';
import { TRecursoShader } from './TRecursoShader';
import { TRecursoTextura } from './TRecursoTextura';

const RESOURCES_TYPES = {
  MALLA: 'malla',
  SHADER: 'shader',
  TEXTURA: 'textura'
}

export class TGestorRecursos{
  private recursos: TRecurso[];

  constructor(){
    this.recursos = [];
  }

  getRecurso(nombre: string, tipo: string, nombreTextura: string, nombreMalla: string = '', actualizando:boolean = false){
    let rec = null;

    // if (!actualizando) {

      for(let i = 0; i < this.recursos.length; i++){
        // console.log("COMPARACION: ", this.recursos[i].getNombre())
        // console.log("COMPARACION2: ", nombre)
        if(this.recursos[i].getNombre() == nombre){
          // console.log("NOMBREEE: ", nombre)
          // console.log("TIPOOOOOO: ", tipo)
          rec = this.recursos[i];
          // console.log("RECURSOS: ",this.recursos)
        }
      }
    // }

    if(!rec || actualizando){
      if(tipo === RESOURCES_TYPES.MALLA){
        // console.log("CREANDO MALLA...")
        rec = new TRecursoMalla(this.getRecurso('shader', 'shader', ''), nombreMalla, this.getRecurso(nombreTextura, 'textura', ''));
      }

      if(tipo === RESOURCES_TYPES.SHADER)
        rec = new TRecursoShader();

      if(tipo === RESOURCES_TYPES.TEXTURA){
        // console.log("Creando la textura: ", nombre);
        rec = new TRecursoTextura();
      }
      // console.log("RECURSOS: ",this.recursos)
      rec.cargarFichero(nombre);
      rec.setNombre(nombre);
      this.recursos.push(rec);
    }

    return rec;
  }

  getRecursoTextura(){
    var salida:any;
    // console.log("RECURSOS: ",this.recursos)
    for (let index = 0; index < this.recursos.length; index++) {
      if (this.recursos[index] instanceof TRecursoTextura) {
        salida = this.recursos[index];
      }
    }
    return salida;
  }

  eliminarRecurso(nombre:string){
    console.log("---- ELIMINANDO RECURSO -----")
    for(let i = this.recursos.length-1; i > 0 ; i--){
      if(this.recursos[i].getNombre() === nombre){
        // console.log("BORRADO: ", nombre)
        // console.log("POSICIONNNN: ",i)
        this.recursos.splice(i,1);
        // console.log("RECURSOS: ",this.recursos)
      }
    }
  }


}
