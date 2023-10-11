import { Component, OnInit } from '@angular/core';
import { ROUTES, ROUTES2 } from '../sidebar-dashboard/menu-items';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UsuariosService } from '../../services/usuario.service';
import { RouteInfo, RouteInfoAdmin } from '../../interfaces/sidebar.inteface';

@Component({
  selector: 'app-sidebar-admin',
  templateUrl: './sidebar-admin.component.html',
  styleUrls: ['./sidebar-admin.component.css', '../../../../dist/output.css']
})
export class SidebarAdminComponent {
  showMenu = '';
  showSubMenu = '';

  public sidebarnavItems:RouteInfo[]=[];
  public sidebarnavItemsA:RouteInfoAdmin[]=[];
  // this is for the open close
  addExpandClass(element: string) {
    if (element === this.showMenu) {
      this.showMenu = '0';
    } else {
      this.showMenu = element;
    }
  }

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private usuariosService: UsuariosService
  ) { }

  ngOnInit(): void {
    if(this.usuariosService.rol==='ROL_ADMIN'){
      // console.log("ADMIIIINN");
      this.sidebarnavItems = ROUTES2.filter(sidebarnavItemA => sidebarnavItemA);

    }
    else if(this.usuariosService.rol==='ROL_ESTUDIO'){
      // console.log("ESTUDIOOO");
      this.sidebarnavItems = ROUTES.filter(sidebarnavItem => sidebarnavItem);

    }else{
      // console.log("ninguno");
    }
  }

  logout() {
    this.usuariosService.logout();
  }

  isAdmin(){
    return this.usuariosService.rol==='ROL_ADMIN'
  }

  imagen() {
    return 'assets/images/blank-profile-picture.png';
  }

  redirigirPerfil(){
    this.router.navigate(['/editar-perfil']);
  }
}
