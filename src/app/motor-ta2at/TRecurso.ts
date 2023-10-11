export class TRecurso{
  private nombre: string;
  public gl: WebGL2RenderingContext;

  public constructor(){
    this.nombre = '';
    var canvas = <HTMLCanvasElement>document.getElementById('glcanvas');
    this.gl = canvas.getContext('webgl2');
  }

  getNombre(): string{ return this.nombre; }

  setNombre(nombre: string): void{ this.nombre = nombre;}

  cargarFichero(nombre: string): void {
  }
}

