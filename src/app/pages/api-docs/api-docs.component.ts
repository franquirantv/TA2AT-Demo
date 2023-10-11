import {
  AfterViewInit,
  Component,
  ElementRef,
  VERSION,
  ViewChild
} from '@angular/core';
import { SwaggerUIBundle, SwaggerUIStandalonePreset } from 'swagger-ui-dist';
import file from './openapi.json'

@Component({
  selector: 'my-app',
  templateUrl: './api-docs.component.html',
  styleUrls: ['./api-docs.component.css']
})
export class ApiDocsComponent implements AfterViewInit {
  name = 'Angular ' + VERSION.major;
  @ViewChild('swagger') swaggerDom: ElementRef<HTMLDivElement>;

  ngAfterViewInit() {
    SwaggerUIBundle({
      spec: file,
      domNode: this.swaggerDom.nativeElement,
      deepLinking: true,
      presets: [SwaggerUIBundle['presets'].apis, SwaggerUIStandalonePreset],
      layout: 'StandaloneLayout'
    });
  }
}
