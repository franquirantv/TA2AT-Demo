import { TEntidad } from './TEntidad';
import { glMatrix, mat4, vec3 } from "gl-matrix";

export class TNodo{
  private entidad: TEntidad;
  private padre: TNodo;
  private hijos: TNodo[];
  private traslacion: vec3;
  private rotacion: vec3;
  private escalado: vec3;
  private matrizTransf: mat4;
  private actualizarMatriz: boolean;

  public constructor(){
    this.entidad = new TEntidad();
    this.padre = null;
    this.hijos = [];
    this.traslacion = vec3.create();
    this.rotacion = vec3.create();
    this.escalado = vec3.create();
    this.matrizTransf = mat4.create();
    this.actualizarMatriz = false;
  }

  addHijo(nodo: TNodo): void{
    this.hijos.push(nodo);
    nodo.padre = this;
  }

  remHijo(nodo: TNodo): void{
    for(let i = 0; i < this.hijos.length; i++){
      if(this.hijos[i] == nodo)
        nodo.padre = null;
        this.hijos.splice(i, 1);
    }
  }

  setEntidad(entidad:TEntidad): boolean{
    var actualizada: boolean = false;

    if(entidad != null){
      this.entidad = entidad;
      actualizada = true;
    }

    return actualizada;
  }

  getEntidad(){
    return this.entidad;
  }

  getPadre(): TNodo{
    return this.padre;
  }

  recorrer(matriz: mat4): void{
    if(this.actualizarMatriz){
      mat4.multiply(this.matrizTransf, matriz, this.calcularMatriz());
      this.setActualizarMatriz(false);
    }

    this.entidad.dibujar(this.matrizTransf);

    for(let i=0; i<this.hijos.length; i++){
      this.hijos[i].recorrer(this.matrizTransf);
    }

  }

  calcularMatriz(): mat4{
    var matrizaux: mat4 = mat4.create();

    /* mat4.multiply(matrizaux, this.trasladar(this.traslacion), this.rotar(this.rotacion));
    mat4.multiply(matrizaux, matrizaux, this.escalar(this.escalado)); */
    matrizaux = this.translation(matrizaux);
    matrizaux = this.rotateX(matrizaux);
    matrizaux = this.rotateY(matrizaux);
    matrizaux = this.scale(matrizaux);

    return matrizaux;
  }

  rotateX(matriz: mat4): mat4{
    var cos = Math.cos(this.rotacion[0]);
    var sin = Math.sin(this.rotacion[0]);
    var matrizaux: mat4 = mat4.clone(matriz);

    matriz[1] = cos * matriz[1] - sin * matriz[2];
    matriz[5] = cos * matriz[5] - sin * matriz[6];
    matriz[9] = cos * matriz[9] - sin* matriz[10];

    matriz[2] = cos * matriz[2] + sin * matrizaux[1];
    matriz[6] = cos * matriz[6] + sin * matrizaux[5];
    matriz[10] = cos * matriz[10] + sin * matrizaux[9];

    return matriz;
  }

  rotateY(matriz: mat4): mat4{
    var cos: number = Math.cos(this.rotacion[1]);
    var sin: number = Math.sin(this.rotacion[1]);
    var matrizaux: mat4 = mat4.clone(matriz);

    matriz[0] = cos * matriz[0] + sin * matriz[2];
    matriz[4] = cos * matriz[4] + sin * matriz[6];
    matriz[8] = cos * matriz[8] + sin * matriz[10];

    matriz[2] = cos * matriz[2] - sin * matrizaux[0];
    matriz[6] = cos * matriz[6] - sin * matrizaux[4];
    matriz[10] = cos * matriz[10] - sin * matrizaux[8];

    return matriz;
  }

  scale(matriz: mat4): mat4{
    mat4.scale(matriz, matriz, this.escalado);

    return matriz;
  }

  translation(matriz: mat4): mat4{
    mat4.translate(matriz, matriz, this.traslacion);

    return matriz;
  }

  rotar(vector: vec3): mat4{
    var matrizaux: mat4 = mat4.create();

    mat4.rotate(matrizaux, this.matrizTransf, glMatrix.toRadian(15), vector);

    return matrizaux;
  }

  trasladar(vector: vec3): mat4{
    var matrizaux: mat4 = mat4.create();

    mat4.translate(matrizaux, this.matrizTransf, vector);

    return matrizaux;
  }

  escalar(vector: vec3): mat4{
    var matrizaux: mat4 = mat4.create();

    mat4.scale(matrizaux, this.matrizTransf, vector);

    return matrizaux;
  }

  setTraslacion(vec: vec3): void{
    this.traslacion = vec;
    this.setActualizarMatriz(true);
  }

  setRotacion(vec: vec3): void{
    this.rotacion = vec;
    this.setActualizarMatriz(true);
  }

  setEscalado(vec: vec3): void{
    this.escalado = vec;
    this.setActualizarMatriz(true);
  }

  setActualizarMatriz(actualizar: boolean): void{
    this.actualizarMatriz = actualizar;

    if(actualizar){
      for(let i = 0; i < this.hijos.length; i++)
        this.hijos[i].setActualizarMatriz(actualizar);
    }
  }

  getActualizarMatriz(): boolean{
    return this.actualizarMatriz;
  }

  getTraslacion(): vec3{
    return this.traslacion;
  }

  getRotacion(): vec3{
    return this.rotacion;
  }

  getEscalado(): vec3{
    return this.escalado;
  }

  setMatrizTransf(matriz: mat4): void{
    this.matrizTransf = matriz;
  }

  getMatrizTransf(): mat4{
    return this.matrizTransf;
  }

  getHijos(): TNodo[]{
    return this.hijos;
  }


}
