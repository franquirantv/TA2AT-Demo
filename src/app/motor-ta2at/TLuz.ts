import { TEntidad } from "./TEntidad";
import { mat4, vec3 } from "gl-matrix";

export class TLuz extends TEntidad {
  private intensidad: vec3;

  constructor(){
    super();

    this.intensidad = vec3.create();
  }

  setIntensidad(){
    this.intensidad = [0, 0.5, 1.0];
  }

  getIntensidad(){
    this.setIntensidad();
    return this.intensidad;
  }

  override dibujar(mat: mat4): void {
  }
}
