import { Component } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-aviso-legal',
  templateUrl: './aviso-legal.component.html',
  styleUrls: ['./aviso-legal.component.css']
})
export class AvisoLegalComponent {
  constructor(private meta: Meta) { }

  ngOnInit() {
    this.meta.addTag({ name: 'description', content: 'En nuestra página de aviso legal encontrarás toda la información relevante sobre las condiciones de uso y los términos legales de nuestro sitio web. Aquí podrás encontrar información sobre nuestra política de privacidad, derechos de propiedad intelectual, responsabilidades legales y mucho más. Consulta esta página para estar al tanto de todas las reglas y normativas que rigen nuestro sitio web y garantizar una experiencia segura y confiable para todos nuestros usuarios' });
  }

}
