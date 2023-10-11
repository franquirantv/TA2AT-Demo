import { Component } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-politica-cookies',
  templateUrl: './politica-cookies.component.html',
  styleUrls: ['./politica-cookies.component.css']
})
export class PoliticaCookiesComponent {
  constructor(private meta: Meta) { }

  ngOnInit() {
    this.meta.addTag({ name: 'description', content: 'En nuestra página de política de cookies, te informamos sobre cómo utilizamos las cookies en nuestro sitio web. En esta página, encontrarás información detallada sobre las cookies que utilizamos, para qué fines las utilizamos y cómo puedes controlarlas o eliminarlas. Aseguramos que nuestra política de cookies cumple con las normativas de privacidad y protección de datos, para garantizar la privacidad y seguridad de nuestros usuarios.' });
  }

}
