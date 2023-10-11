import { Component, AfterViewInit, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/services/usuario.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
//declare var require: any;

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  subtitle: string;
  authUrl = 'token=' + this.UsuariosService.token;
  private cambio:boolean=false;
  constructor( private UsuariosService: UsuariosService,
               private sanitizer: DomSanitizer) {

    this.subtitle = 'This is some text within a card block.';
  }
  ngOnInit(): void {
    this.cargarenlaces();
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content-item');

    tabs.forEach(tab => {
      tab.addEventListener('click', function() {
        // remove active class from all tabs and tab content
        tabs.forEach(tab => tab.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // add active class to current tab and its corresponding tab content
        this.classList.add('active');
        document.getElementById(this.dataset.tabContent).classList.add('active');
      });
    });
  }


  elige(){
    return this.UsuariosService.rol==='ROL_ESTUDIO';
  }

  showContent(){

    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content-item');

    tabs.forEach(tab => {
      tab.addEventListener('click', function() {
        // remove active class from all tabs and tab content
        tabs.forEach(tab => tab.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // add active class to current tab and its corresponding tab content
        this.classList.add('active');
        document.getElementById(this.dataset.tabContent).classList.add('active');
      });
    });


  }

  //-------------------------------------------------------GRAFANA ESTUDIO-----------------------------------------------------------------------------------
  cargarenlaces(){
    this.GuardadosDesign();
    this.VisitasDesign();
    this.VisitasDia();
    this.NGuardados();
    this.NDesign();
    this.NVisitas();
  }

  RutaEstudio(){
    return(this.UsuariosService.rol === 'ROL_ESTUDIO');
  }

  guardadosDesign: SafeResourceUrl;

  GuardadosDesign(){
    let uid = this.UsuariosService.uid;
    let enlace=`https://ta2at.ovh/grafana/d-solo/30zGLGB4k/pruebas?orgId=1&from=1682553600000&to=1682812800000&theme=light&panelId=10&var-usuariog=${uid}`;

    this.guardadosDesign = this.sanitizer.bypassSecurityTrustResourceUrl(enlace);
    //return this.enlaceGrafana1;
  }

  visitasDesign: SafeResourceUrl;

  VisitasDesign(){
    let uid = this.UsuariosService.uid;
    // let enlace=`https://ta2at.ovh/grafana/d-solo/30zGLGB4k/pruebas?orgId=1&from=1682553600000&to=1682812800000&theme=light&panelId=14&var-usuariog=${uid}`;
    let enlace=`https://ta2at.ovh/grafana/d-solo/30zGLGB4k/pruebas?orgId=1&from=1678618277058&to=1680000677058&theme=light&panelId=14&var-usuariog=${uid}`;

    this.visitasDesign = this.sanitizer.bypassSecurityTrustResourceUrl(enlace);
    //return this.enlaceGrafana2;
  }

  visitasDia: SafeResourceUrl;
  rangotiempo: number= 1;

  ultimoSem(){
    this.rangotiempo=1;
    this.VisitasDia();
  }

  ultimoMes(){
    this.rangotiempo=2;
    this.VisitasDia();
  }

  ultimoAno(){
    this.rangotiempo=3;
    this.VisitasDia();
  }


  VisitasDia(){
    let uid = this.UsuariosService.uid;
    let enlace=`https://ta2at.ovh/grafana/d-solo/30zGLGB4k/pruebas?orgId=1&from=now-7d&to=now&theme=light&panelId=16&var-usuariog=${uid}`;
    switch (this.rangotiempo) {
      case 1:
        enlace=`https://ta2at.ovh/grafana/d-solo/30zGLGB4k/pruebas?orgId=1&from=now-7d&to=now&theme=light&panelId=16&var-usuariog=${uid}`;
        break;
      case 2:
        enlace=`https://ta2at.ovh/grafana/d-solo/30zGLGB4k/pruebas?orgId=1&from=now-30d&to=now&theme=light&panelId=16&var-usuariog=${uid}`;
        break;
      case 3:
        enlace=`https://ta2at.ovh/grafana/d-solo/30zGLGB4k/pruebas?orgId=1&from=now-1y&to=now&theme=light&panelId=16&var-usuariog=${uid}`;
        break;

      default:
        break;
    }
    this.visitasDia = this.sanitizer.bypassSecurityTrustResourceUrl(enlace);
    //return this.enlaceGrafana3;
  }


  nGUardados: SafeResourceUrl;

  NGuardados(){
    let uid = this.UsuariosService.uid;
    let enlace=`https://ta2at.ovh/grafana/d-solo/30zGLGB4k/pruebas?orgId=1&from=1651053632486&to=1682589632486&theme=light&panelId=8&var-usuariog=${uid}`;

    this.nGUardados = this.sanitizer.bypassSecurityTrustResourceUrl(enlace);
    //return this.enlaceGrafana4;
  }

  nDesign: SafeResourceUrl;

  NDesign(){
    let uid = this.UsuariosService.uid;
    let enlace=`https://ta2at.ovh/grafana/d-solo/30zGLGB4k/pruebas?orgId=1&from=1651054034127&to=1682590034127&theme=light&panelId=12&var-usuariog=${uid}`;

    this.nDesign = this.sanitizer.bypassSecurityTrustResourceUrl(enlace);
    //return this.enlaceGrafana5;
  }

  nVisitas: SafeResourceUrl;

  NVisitas(){
    let uid = this.UsuariosService.uid;
    let enlace=`https://ta2at.ovh/grafana/d-solo/30zGLGB4k/pruebas?orgId=1&from=1651054083198&to=1682590083198&theme=light&panelId=18&var-usuariog=${uid}`;

    this.nVisitas = this.sanitizer.bypassSecurityTrustResourceUrl(enlace);
    //return this.enlaceGrafana6;
  }


}

