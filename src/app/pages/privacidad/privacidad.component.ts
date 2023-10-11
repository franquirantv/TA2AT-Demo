/*import { Component } from '@angular/core';

@Component({
  selector: 'app-privacidad',
  templateUrl: './privacidad.component.html',
  styleUrls: ['./privacidad.component.css']
})
export class PrivacidadComponent {

}*/
import {Component} from '@angular/core';
import { Meta } from '@angular/platform-browser';

/*import {NgxImageCompressService} from 'ngx-image-compress';*/

@Component({
  selector: 'app-privacidad',
  templateUrl: './privacidad.component.html',
  styleUrls: ['./privacidad.component.css']
})
export class PrivacidadComponent {
    constructor(/*private imageCompress: NgxImageCompressService*/private meta: Meta) {}

    ngOnInit() {
      this.meta.addTag({ name: 'description', content: 'En nuestra página de privacidad, te informamos sobre cómo manejamos y protegemos la información personal de nuestros usuarios. Nos tomamos muy en serio la privacidad de nuestros usuarios y nos aseguramos de cumplir con las normativas y regulaciones en cuanto a la protección de datos. En esta página, encontrarás información detallada sobre cómo recopilamos, utilizamos y protegemos tu información personal, tus derechos en cuanto a tus datos y cómo puedes ejercerlos, y mucho más. ¡Lee nuestra página de privacidad para saber más sobre cómo protegemos tus datos y tu privacidad!' });
    }


    /*imgResultBeforeCompression: string = '';
    imgResultAfterCompression: string = '';

    compressFile() {

        this.imageCompress.uploadFile().then(({image, orientation}) => {
            this.imgResultBeforeCompression = image;
            console.log('Size in bytes of the uploaded image was:', this.imageCompress.byteCount(image));
            console.log('esta es la imagen original: ', image)
            this.imageCompress
                .compressFile(image, orientation, 50, 50) // 50% ratio, 50% quality
                .then(compressedImage => {
                    this.imgResultAfterCompression = compressedImage;
                    console.log('Size in bytes after compression is now:', this.imageCompress.byteCount(compressedImage));
                });
        });
    }*/
}
