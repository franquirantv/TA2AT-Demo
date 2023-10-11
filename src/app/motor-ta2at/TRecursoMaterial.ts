import { TRecurso } from "./TRecurso";

export class TRecursoMaterial extends TRecurso{

  override cargarFichero(nombre){
   var fichero = require(nombre);
  }
}
