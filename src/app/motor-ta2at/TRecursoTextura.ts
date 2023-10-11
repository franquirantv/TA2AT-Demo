import { TRecurso } from "./TRecurso";
import { Tatuaje } from "../models/tatuaje.model";

export class TRecursoTextura extends TRecurso{
  private imagen: HTMLImageElement;
  private imagenNueva: HTMLImageElement;

  private tatuajes:Tatuaje[] = [];

  public textura: WebGLTexture;

  public canvas = document.createElement("canvas");
  public context = this.canvas.getContext("2d");

  constructor(){
    super();
    this.crearTextura();
  }

  override cargarFichero(nombre: string){
    // console.log("cargarFichero()");
    this.imagen = new Image();
    if(nombre != 'textura')
      this.imagen.src = nombre;
      // console.log("NOMBRE TEXTURA: ", nombre);
      // console.log("IMAGEN TEXTURA: ", this.imagen.src);
  }

  actualizarTextura(fichero:string){
    this.imagenNueva = new Image();
    this.imagenNueva.src = fichero;
    this.imagen = this.imagenNueva;
  }

  crearTextura(){
    this.textura = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.textura);
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
    // console.log("TEXTURA CREADA:");

  }

  cargarTextura(){
    var that = this;
    this.imagen.addEventListener('load', function() {

      // console.log("ENTRO CARGAR TEXTURA")
      that.gl.activeTexture(that.gl.TEXTURE0);
      that.gl.bindTexture(that.gl.TEXTURE_2D, that.textura);
      that.gl.texImage2D(that.gl.TEXTURE_2D, 0, that.gl.RGBA, that.gl.RGBA, that.gl.UNSIGNED_BYTE, that.imagen);
      // console.log(that.imagen)
      if (that.isPowerOf2(that.imagen.width) && that.isPowerOf2(that.imagen.height)) {
        that.gl.generateMipmap(that.gl.TEXTURE_2D);
        // console.log("Potencia de 2");
      } else {
        // No, it's not a power of 2. Turn off mips and set
        // wrapping to clamp to edge
        // console.log("No es Potencia de 2")
        that.gl.texParameteri(that.gl.TEXTURE_2D, that.gl.TEXTURE_WRAP_S, that.gl.CLAMP_TO_EDGE);
        that.gl.texParameteri(that.gl.TEXTURE_2D, that.gl.TEXTURE_WRAP_T, that.gl.CLAMP_TO_EDGE);
        that.gl.texParameteri(that.gl.TEXTURE_2D, that.gl.TEXTURE_MIN_FILTER, that.gl.LINEAR);
      }
      // console.log("TEXTURA CARGADAAAA");
    });
  }

  isPowerOf2(value: number) {
    return (value & (value - 1)) === 0;
  }

// Si el ancho o alto de la textura que le pasamos es mayor a la de la textura del modelo (1024),
// nos quedamos con el mayor entre el alto y el ancho de la textura y con la otra propiedad le multiplicamos 1024 x la relacion de aspecto.

  async combinarTextura(nombre:string, imagenTatuaje: string, scale:number[], mostrar:boolean) {

    this.añadirTatuaje(nombre, imagenTatuaje, mostrar);

    const imagenCombinada = this.imagen;

    const canvasWidth = this.imagen.width;
    const canvasHeight = this.imagen.height;

    this.canvas.width = canvasWidth;
    this.canvas.height = canvasHeight;

    this.context.drawImage(imagenCombinada, 0, 0, canvasWidth, canvasHeight);

    this.context.scale(scale[0], scale[1]);
    // console.log("this.tatuajes.length: ", this.tatuajes.length)
    for (let index = 0; index < this.tatuajes.length; index++) {
      if (!this.tatuajes[index].mostrar) {
        // console.log("this.tatuajes[index].mostrar: ", this.tatuajes[index].mostrar)
        const result = await fetch(this.tatuajes[index].fuente);
        const blob = await result.blob();
        const image = await createImageBitmap(blob);

        const pattern = this.context.createPattern(image, "no-repeat");
        // console.log("TATTOO:",this.tatuajes[index].nombre);
        // console.log("this.tatuajes[index].posicion_x:",this.tatuajes[index].posicion_x);
        // console.log("this.tatuajes[index].posicion_y:",this.tatuajes[index].posicion_y);

        if (index > 0) {

          this.context.translate(
            Math.abs(this.tatuajes[index-1].posicion_x - this.tatuajes[index].posicion_x),
            Math.abs(this.tatuajes[index-1].posicion_y - this.tatuajes[index].posicion_y)
          )

        } else {

          this.context.translate(
            this.tatuajes[index].posicion_x,
            this.tatuajes[index].posicion_y
          );

        }

        // console.log("EL TATUAJE: ", this.tatuajes[index].nombre,
        //  "TIENE LA POSICION_X: ", this.tatuajes[index].posicion_x,
        //  "Y LA POSICION_Y: ", this.tatuajes[index].posicion_y);

        this.context.rect(0, 0, canvasWidth, canvasHeight);

        this.context.fillStyle = pattern;

        this.context.fill();

        }
      }

      var dataURL = this.canvas.toDataURL("image/png");
      // console.log("dataURL", dataURL)
      const img = new Image();
      img.src = dataURL;

    return img;
  }

  moverTatuajes(listaTatus:Tatuaje[]){

    this.tatuajes = listaTatus;
    // for (let index = 0; index < this.tatuajes.length; index++) {
    //   if (this.tatuajes[index].nombre === tatuajeActivo) {
    //     this.tatuajes[index].posicion_x = posicion[0];
    //     this.tatuajes[index].posicion_y = posicion[1];
    //     console.log("SEGUNDO!! EL TATUAJE: ", this.tatuajes[index].nombre,
    //     "TIENE LA POSICION_X: ", this.tatuajes[index].posicion_x,
    //     "Y LA POSICION_Y: ", this.tatuajes[index].posicion_y);
    //   }
    // }

  }


  añadirTatuaje(nombre:string, imagenTatuaje: string, mostrar:boolean){
    let posicionInicial:number[] = [2000,3750]
    let escalaInicial:number = 0.2;

    var existe:boolean = false;

    if (nombre==undefined) {
      return;
    }


    for (let index = 0; index < this.tatuajes.length; index++) {
      if (nombre === this.tatuajes[index].nombre) {
        existe = true;
        // console.log("YA EXISTE EL TATUAJE", nombre)
      }
    }


    if (!existe) {
      // console.log("SE AÑADE EL TATUAJE")
      this.tatuajes.push(new Tatuaje(nombre, imagenTatuaje, posicionInicial[0], posicionInicial[1], escalaInicial, mostrar));
      // console.log("ARRAY DE TATUAJES DESPUES DE AÑADIR: ",this.tatuajes)
    }
  }

  getListaTatuajes(){
    return this.tatuajes;
  }

  actualizarLista(lista:Tatuaje[]){
    this.tatuajes = lista;
  }

}
