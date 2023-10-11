import { Component } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-opendata',
  templateUrl: './opendata.component.html',
  styleUrls: ['./opendata.component.css']
})
export class OpendataComponent {

  constructor(private meta: Meta) { }

  ngOnInit(): void {
    this.meta.addTag({ name: 'description', content: 'En TA2AT ofrecemos datos en abierto para su libre uso. Entra y descarga nuestro dataset o pruebalo online.' });
  }

  download() {
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', './assets/dataset.csv');
    link.setAttribute('download', 'datataset.csv');
    link.click();
  }
}
