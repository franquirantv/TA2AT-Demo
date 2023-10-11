import { mat4 } from "gl-matrix";

export class TEntidad{
  private nombre: string;

  public constructor (){
    this.nombre = '';
  }

  dibujar(mat: mat4): void{}
  setNombre(nombre: string): void{ this.nombre = nombre; }
  getNombre(): string{ return this.nombre; }
}



