import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Dimensions, ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-imagen',
  templateUrl: './editar-imagen.component.html',
  styleUrls: ['./editar-imagen.component.scss']
})

export class EditarImagenComponent {
  imageChangedEvent: any = '';
    croppedImage: any = '';
    canvasRotation = 0;
    cropperForm = false;
    rotation = 0;
    scale = 1;
    showCropper = false;
    containWithinAspectRatio = false;
    transform: ImageTransform = {};

    files: any[] = [];
    imagenUsuario:string = "";
    imagenSubida:any;
    maximoArchivos:boolean = false;
    fileName:string = "";
    @Output() imageUploaded = new EventEmitter<any>();

    croppedEvent:any;


    public resetearImagen2(): void {
      // console.log("reseteo imagen en editarComponent")
      this.imageChangedEvent = '';
      this.croppedEvent = null;
      const imageElement = document.getElementById("imagen");
      (imageElement as HTMLImageElement).src = "";
      this.showCropper = false;
    }

    imageCropped(event: ImageCroppedEvent) {
      this.croppedEvent = event;
      this.croppedImage = event.base64;
      if (this.quitarFondo) {
        // console.log("SIN FONDO")
        this.loadImage(this.croppedImage);

      } else {
        // console.log("CON FONDO")
        const imageElement = document.getElementById("imagen");
        if (imageElement !== null) {
          (imageElement as HTMLImageElement).src = this.croppedImage;
          let object = {
            imagen: (imageElement as HTMLImageElement).src,
            nombre: this.fileName
          }
          this.imageUploaded.emit(object);
        }
      }
    }

    imageLoaded() {
      this.showCropper = true;
      // console.log('Image loaded');
    }

    cropperReady(sourceImageDimensions: Dimensions) {
      // console.log('Cropper ready', sourceImageDimensions);
    }

    loadImageFailed() {
      // console.log('Load failed');
    }

    setCropperForm(){
      this.cropperForm = !this.cropperForm;
      // console.log("FORMA: ", this.cropperForm)
    }

    quitarFondo:boolean;
    displayValue: string = 'Con Fondo Blanco';


    updateDisplayValue() {
      this.displayValue = this.quitarFondo ? 'Sin Fondo Blanco' : 'Con Fondo Blanco';
      this.imageCropped(this.croppedEvent);
    }

    rotateLeft() {
      this.canvasRotation--;
      this.flipAfterRotate();
    }

    rotateRight() {
        this.canvasRotation++;
        this.flipAfterRotate();
    }

    private flipAfterRotate() {
        const flippedH = this.transform.flipH;
        const flippedV = this.transform.flipV;
        this.transform = {
            ...this.transform,
            flipH: flippedV,
            flipV: flippedH
        };
    }

    flipHorizontal() {
        this.transform = {
            ...this.transform,
            flipH: !this.transform.flipH
        };
    }

    flipVertical() {
        this.transform = {
            ...this.transform,
            flipV: !this.transform.flipV
        };
    }

    resetImage() {
        this.scale = 1;
        this.rotation = 0;
        this.canvasRotation = 0;
        this.transform = {};
    }

    zoomOut() {
        this.scale -= .1;
        this.transform = {
            ...this.transform,
            scale: this.scale
        };
    }

    zoomIn() {
        this.scale += .1;
        this.transform = {
            ...this.transform,
            scale: this.scale
        };
    }

    toggleContainWithinAspectRatio() {
        this.containWithinAspectRatio = !this.containWithinAspectRatio;
    }

    updateRotation() {
        this.transform = {
            ...this.transform,
            rotate: this.rotation
        };
    }

    private RED = 255;
    private BLUE = 255;
    private GREEN = 255;
    private TOLERANCE = 100;


    loadImage(imagenSRC:string){
      const image = new Image();
      image.src = imagenSRC;
      var obj = this;
      image.onload = function() {
          const result = obj.removeBackground(image, obj.RED, obj.BLUE, obj.GREEN, obj.TOLERANCE); // Remove white background
          const outputImage = new Image();
          outputImage.src = result;
          const imageElement = document.getElementById("imagen");
          if (imageElement !== null) {
            (imageElement as HTMLImageElement).src = outputImage.src;
            let object = {
              imagen: outputImage.src,
              nombre: obj.fileName
            }
            obj.imageUploaded.emit(object);
          }
      };

    }

    removeBackground(image:HTMLImageElement, r:number, g:number, b:number, tolerance:number) {
      // console.log("removeBackground()")
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = image.width;
      canvas.height = image.height;
      if (ctx) {
        ctx.drawImage(image, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const red = data[i];
            const green = data[i + 1];
            const blue = data[i + 2];
            const alpha = data[i + 3];

            if (
                Math.abs(red - r) <= tolerance &&
                Math.abs(green - g) <= tolerance &&
                Math.abs(blue - b) <= tolerance
            ) {
                data[i + 3] = 0; // Set alpha to 0 (transparent)
            }
        }

        ctx.putImageData(imageData, 0, 0);
      }

      return canvas.toDataURL();

    }


    async onFileDropped($event:Event) {
      // console.log("DROPEADA:", $event)
      this.imageChangedEvent = $event;
      // console.log("imageChangedEvent: ",this.imageChangedEvent)
      let myFileList = ($event.target as HTMLInputElement).files;
      this.fileName = myFileList[0].name.split(".")[0];
      const files2 = Array.from(myFileList);
      // console.log("DROP FILES:", files2);

      const extensiones = ['jpeg','jpg','png','avif','webp'];

      let imagenValida:boolean = false;
      //Comprobamos el formato del archivo
      for (let index = 0; index < files2.length; index++) {
        let nombre: string = files2[index].name;
        let nombrecortado: string[] = nombre.split('.');
        let extension = nombrecortado[nombrecortado.length - 1];
        if (!extensiones.includes(extension)) {
          imagenValida = false;
          Swal.fire({icon: 'error', title: 'Error', text: "La imagen debe de tener uno de estos formatos: JPG, JPEG, PNG, AVIF o WEBP."});
          return;
        } else {
          imagenValida = true
        }
      }

      if (this.files.length >= 5 && imagenValida) {
        Swal.fire({icon: 'error', title: 'Error', text: "No puedes subir más de 5 archivos."});
      } else {

        for (let index = 0; index < files2.length; index++) {
          this.imagenUsuario = await this.fileHandler(files2[index]);
          let objeto = {
            nombre: files2[index].name.split(".")[0],
            imagen: this.imagenUsuario
          }
          if (this.files.length >= 5){
            this.maximoArchivos = true;

          } else {
            this.files.push(objeto);
          }
        }

        // console.log("LISTA DE FILES: ", this.files);
      }
    }

    @ViewChild('fileInput', { static: false }) fileInput: ElementRef;

    async fileBrowseHandler(e: Event) {
      // console.log("CLICADA:", e)

      this.imageChangedEvent = e;

      let myFileList = (e.target as HTMLInputElement).files;
      this.fileName = myFileList[0].name.split(".")[0];
      const files2 = Array.from(myFileList);

      // console.log("ARCHIVOS: ", files2);

      if (this.files.length >= 5) {

        Swal.fire({icon: 'error', title: 'Error', text: "No puedes subir más de 5 imágenes"});

      } else {

        for (let index = 0; index < files2.length; index++) {
          this.imagenUsuario = await this.fileHandler(files2[index]);

          let objeto = {
            nombre: files2[index].name.split(".")[0],
            imagen: this.imagenUsuario
          }
          this.files.push(objeto);
        }

        if (this.files.length >= 5) {
          this.maximoArchivos = true;
        }

        // console.log("LISTA DE FILES: ", this.files);
      }
      this.fileInput.nativeElement.value = null;

    }

    fileHandler = (file: File) => {
      return new Promise<string>((resolve) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
          resolve(event.target.result.toString());
        };
      });
    };

}
