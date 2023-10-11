import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { UsuariosService } from 'src/app/services/usuario.service';
import { DataUrl, NgxImageCompressService, UploadResponse } from 'ngx-image-compress';
import { Subject } from 'rxjs';

const PIXELES_MAXIMOS = 1024;

@Injectable({
  providedIn: 'root'
})
export class UploadsService {

  imgResultBeforeCompress: DataUrl = '';
  imgResultAfterCompress: DataUrl = '';
  imgResultAfterResize: DataUrl = '';
  imgResultUpload: DataUrl = '';
  imgResultAfterResizeMax: DataUrl = '';
  imgResultMultiple: UploadResponse[] = [];

  public imagenComprimida: string = '';

  constructor(private http: HttpClient,
    private router: Router,
    private usuarioservice: UsuariosService,
    private imageCompress: NgxImageCompressService,) { }

  //subirFoto( uid: string, foto: File) {
  subirFoto( uid: string, foto: File, tipo: string) {
    // this.compresionImagenes(foto);
    const datos: FormData = new FormData();
    datos.append('archivo', foto, foto.name);
    return this.http.post(`${environment.base_url}/upload/${tipo}/${uid}`, datos, this.usuarioservice.cabeceras);
  }

  eliminarFoto(imagen: string, tipo: string){

    //return this.http.delete(`${environment.base_url}/upload/${tipo}/${imagen}`, this.usuarioservice.cabeceras);
  }


  //compresionImagenes(foto: File, ratio: number){
  compresionImagenes(foto, imagen_x:number, imagen_y:number){
    // console.log(2)
    var dimensiones = this.reasignarDimensiones(imagen_x, imagen_y);

    let ratio=50; //tamaño en pixeles a lo que se reduce la imagen || 100 es el tamaño original // 50 sería la mitad de pizeles de altura y ancho
    let orientacion= 1;
    let PorcentajeCompresion= 100;
    // console.log(3)
    this.imageCompress.compressFile(foto, orientacion, 50, PorcentajeCompresion).then(
      (result: string) => {
        // console.log("ENTRO AL COMPRESION IMAGENES")
        this.imagenComprimida= result;
    },
      (result: string) => {
    console.error(
          "¡El algoritmo de compresión no tuvo éxito! El mejor tamaño que podemos hacer es: ",
          this.imageCompress.byteCount(result),
          'bytes'
      );
    });
  }

  reasignarDimensiones(ancho:number, alto:number){
    if (ancho > alto) {
      // console.log("ANCHO MAYOR QUE ALTO")
      alto = (alto/ancho)*PIXELES_MAXIMOS;
      ancho = PIXELES_MAXIMOS;
    } else if (ancho < alto ) {
      // console.log("ANCHO MENOR QUE ALTO")
      ancho = (ancho/alto)*PIXELES_MAXIMOS;
      alto = PIXELES_MAXIMOS;
    } else {
      // console.log("ANCHO IGUAL QUE ALTO")
      ancho = PIXELES_MAXIMOS;
      alto = PIXELES_MAXIMOS;
    }

    return {
      ancho,
      alto
    }
  }

  descompresionImagenes(fotoComprimida: File){

    //this.NgxImageCompress.decompressFile()


  }

  uploadAndResize() {
    return this.imageCompress
      .uploadFile()
      .then(({ image, orientation }: UploadResponse) => {
        console.warn('Size in bytes was:', this.imageCompress.byteCount(image));
        console.warn('Compressing and resizing to width 200px height 100px...');

        this.imageCompress
          .compressFile(image, orientation, 50, 50, 100, 100)
          .then((result: DataUrl) => {
            this.imgResultAfterResize = result;
            console.warn(
              'Size in bytes is now:',
              this.imageCompress.byteCount(result)
            );
          });
      });
  }

}
