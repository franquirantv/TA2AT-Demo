import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { Design } from '../../models/design.model';
import { DesignService } from '../../services/design.service';
import { Usuario } from '../../models/usuario.model';
import { UsuariosService } from '../../services/usuario.service';

@Component({
  selector: 'app-misdisenos',
  templateUrl: './misdisenos.component.html',
  styleUrls: ['./misdisenos.component.css']
})
export class MisdisenosComponent {



  // private design = new Design ("","",null,"")
  public totalDisenyos = 0;
  public posicionactual = 0;
  public registrosporpagina = environment.registros_por_pagina;
  public listaDisenyos: Design[] = [];

  constructor(public router: Router,
              private designService: DesignService,
              private usuarioService: UsuariosService) { }

  ngOnInit(): void {
    // this.cargarDesignEstudio();

    //this.rutaDisenyo('e0210a59-50cc-4e28-965f-e1eb67caa226.png')
  }

  pulsado() {
    this.router.navigate(['/estudio/subirdiseno']);
  }

  cargarDesignEstudio( ) {

    this.designService.cargarDesign( this.posicionactual, '', this.usuarioService.uid)
      .subscribe( res => {
        // console.log('b', res)
        // Lo que nos llega lo asignamos a lista usuarios para renderizar la tabla
        // Comprobamos si estamos en un apágina vacia, si es así entonces retrocedemos una página si se puede
        if (res['design'].length === 0) {
          if (this.posicionactual > 0) {
            this.posicionactual = this.posicionactual - this.registrosporpagina;
            if (this.posicionactual < 0) { this.posicionactual = 0};
            this.cargarDesignEstudio();
          } else {
            this.listaDisenyos = [];
            this.totalDisenyos = 0;
          }
        } else {

          this.listaDisenyos = res['design'];
          this.totalDisenyos = res['page'].total;
          // console.log('lista: ',this.listaDisenyos)
          for (let index = 0; index < this.listaDisenyos.length; index++) {

            this.listaDisenyos[index].imagenUrl = `${environment.base_url}/upload/publicacion/${this.listaDisenyos[index].imagen_id}?token=${this.designService.token}`;

          }

        }
      }, (err) => {
        Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
        //console.warn('error:', err);
        // console.log('error:',err)
      });

  }

  cambiarPagina( pagina: number ){
    pagina = (pagina < 0 ? 0 : pagina);
    this.posicionactual = ((pagina - 1) * this.registrosporpagina >=0 ? (pagina - 1) * this.registrosporpagina : 0);
    this.cargarDesignEstudio();
  }

  EmptyDesignList(lista:Design[]){
    return lista.length > 0
  }


}
