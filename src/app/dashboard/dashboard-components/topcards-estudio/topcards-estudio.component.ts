import { Component } from '@angular/core';
import {topcard,topcards} from './topcards-Estudiodata';
import { UsuariosService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-topcards-estudio',
  templateUrl: './topcards-estudio.component.html',
  styleUrls: ['./topcards-estudio.component.css']
})
export class TopcardsEstudioComponent {
  topcards:topcard[];

  constructor(private UsuariosService: UsuariosService) {

    this.topcards=topcards;
  }

  ngOnInit(): void {
  }

  elige(){
    return this.UsuariosService.rol==='ROL_ESTUDIO';
  }


}
