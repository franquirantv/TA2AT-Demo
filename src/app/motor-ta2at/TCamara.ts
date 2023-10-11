import { TEntidad } from "./TEntidad";
import { mat4 } from "gl-matrix";

export class TCamara extends TEntidad {
  private cercano: number;
  private lejano: number;
  private projMatrix: mat4;
  private viewMatrix: mat4;
  public gl: WebGL2RenderingContext;

  constructor(){
    super();
    var canvas = <HTMLCanvasElement>document.getElementById('glcanvas');
    this.gl = canvas.getContext('webgl2');
    this.projMatrix = mat4.create();
    this.viewMatrix = mat4.create();

    this.setPerspectiva(1, 100, this.gl.canvas.width/this.gl.canvas.height);
  }

  setPerspectiva(cerc: number, lej: number, aspect: number){
    this.cercano = cerc;
    this.lejano = lej;
    mat4.perspective(this.projMatrix, this.degToRad(60), aspect, this.cercano, this.lejano);
  }

  setParalela(cerc: number, lej: number, aspect: number){
    this.cercano = cerc;
    this.lejano = lej;
    mat4.perspective(this.projMatrix, this.degToRad(120), aspect, this.cercano, this.lejano);
  }

  setProjMatrix(angle:number, a:number, zMin:number, zMax:number){
    var ang = Math.tan((angle*.5)*Math.PI/180);
    this.projMatrix=[
       0.5/ang, 0, 0, 0,
       0, 0.5*a/ang, 0, 0,
       0, 0, -(zMax+zMin)/(zMax-zMin), -1,
       0, 0, (-2*zMax*zMin)/(zMax-zMin), 0
    ];
  }

  getViewMatrix(): mat4{
    return this.viewMatrix;
  }

  getProjMatrix():mat4{
    return this.projMatrix;
  }

  setViewMatrix(view: mat4){
    this.viewMatrix = view;
  }

  override dibujar(mat: mat4): void {
  }

  degToRad(d: number){
    return d * Math.PI / 180;
  }
}
