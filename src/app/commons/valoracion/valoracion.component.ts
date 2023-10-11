import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { UsuariosService } from '../../services/usuario.service';
import { Router } from '@angular/router';
import { ComunicacionService } from '../../services/comunicacion.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-valoracion',
  templateUrl: './valoracion.component.html',
  styleUrls: ['./valoracion.component.css']
})
export class ValoracionComponent implements OnInit {

  @Input() mostrarVal: boolean;

  public valoracionForm = this.fb.group({
    comentario: ['', Validators.required],
  });

  public decision:boolean = false;

  constructor(
    private usuarioService: UsuariosService,
    private router: Router,
    private comunicacionService: ComunicacionService,
    private fb: FormBuilder,) { //aqui en los parametros del contructor importo y declaro componenetes de otros sitios

  }

  ngOnInit(): void {
    // console.log('hoalosa')
    // console.log(this.comunicacionService.getData('mostrarVal'));
  }

  mostrarModal(){
    // console.log(2)
    return this.comunicacionService.getData('mostrarVal');
  }

  hideModal(){
    this.comunicacionService.setData('mostrarVal', false);
  }

  rating: number = 0;

  onStarClick(rating: number) {
    this.rating = rating;
  }

  TomarDecision(deci:boolean){
    this.decision=deci;
  }

  valorar(){
    let obj={}

    if(this.decision){
      obj = {
        comentario:this.valoracionForm.get('comentario').value,
        puntuacion: this.rating,
      }
    }else{
      obj = {
        comentario:'NV',
        puntuacion: 0,
      }
    }


    this.usuarioService.ValorarUsu(obj).subscribe({
      next: res => {

      },
      error: err =>{
        // console.log(err);
      },
      complete: () => {
        // console.log('req complete');
      }
    });

  }

}
