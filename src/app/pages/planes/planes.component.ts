import { Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-planes',
  templateUrl: './planes.component.html',
  styleUrls: ['./planes.component.css']
})
export class PlanesComponent implements OnInit {

  constructor(private meta: Meta) { }

  ngOnInit(): void {
    this.meta.addTag({ name: 'description', content: '"Explora nuestros planes y encuentra el que mejor se adapte a tus necesidades. En nuestra página de planes, encontrarás información detallada sobre las características y precios de cada uno de nuestros planes, para que puedas compararlos y elegir el que más te convenga.' });
  }

}
