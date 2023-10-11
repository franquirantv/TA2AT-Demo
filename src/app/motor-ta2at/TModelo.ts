import { TEntidad } from './TEntidad';
import { mat4 } from "gl-matrix";
import { TRecursoMalla } from './TRecursoMalla';

export class TModelo extends TEntidad {
  public TRecursoMalla: TRecursoMalla;
  private cargada: boolean;

  constructor(){
    super();
    this.TRecursoMalla = null;
    this.cargada = false;
  }

  cargarMalla(recurso: TRecursoMalla){
    this.TRecursoMalla = recurso;
    this.cargada = true;
    // console.log("TRECURSO MALLA: ", this.TRecursoMalla.getNombre())
  }

  override dibujar(mat: mat4): void {
    if(this.cargada)
      this.TRecursoMalla.dibujar(mat);
  }

  getRutaFicheroMalla(): string{
    return this.TRecursoMalla.getNombre();
  }
}
