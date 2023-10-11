import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { UsuariosService } from '../../services/usuario.service';
import { Router } from '@angular/router';
import { ComunicacionService } from '../../services/comunicacion.service';
import { fadeAnimation, listAnimation } from 'src/app/app.animations';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  animations: [fadeAnimation, listAnimation]
})

export class NavbarComponent implements OnInit {


  mostrar_ajustes: boolean = false;

  @Output() sentValue = new EventEmitter<boolean>();

  isMenuOpened: boolean = false;

  //Variable para animacion

  openModal() {
    console.log('abro modal desde navbar');
    let estado = !this.comunicacionService.getData('mostrarChat');
    this.comunicacionService.setData('mostrarChat', estado);
  }

  openModal2() {
    // console.log('abro modal desde navbar');
    let estado = !this.comunicacionService.getData('mostrarAjustes');
    this.comunicacionService.setData('mostrarAjustes', estado);
  }

  toggleMenu():void{
    this.isMenuOpened = !this.isMenuOpened;
  }

  clickedOutside():void{
    this.isMenuOpened=false;
  }

  constructor(
    private usuarioService: UsuariosService,
    private router: Router,
    private comunicacionService: ComunicacionService
    ) { //aqui en los parametros del contructor importo y declaro componenetes de otros sitios

  }


  ngOnInit(): void {

  }

  llamarAjustes(){

    this.mostrar_ajustes = !this.mostrar_ajustes;
    // console.log('llamar ajustes: ', this.mostrar_ajustes);
    this.sentValue.emit(this.mostrar_ajustes);
  }

  logout() {
    this.usuarioService.logout();
  }

  conectado() {//Método que emplea el booleano logged para saber si un usuario está conectado o no
    return this.usuarioService.logged;//en este caso es el condicional que usamos en el html para mostrar los botones d einicio de sesión o el usuario

  }

  esEstudio() {
    return(this.usuarioService.rol === 'ROL_ESTUDIO');
  }

  esAdmin() {
    return(this.usuarioService.rol === 'ROL_ADMIN');
  }

  esUsuario() {
    return(this.usuarioService.rol === 'ROL_USUARIO');
  }

  rutalanding(){//Método que comprueba si nos encontramos en la página landing para añadir otro condicional a mostrar los botones en el navbar
    return(this.router.url === '/');
  }

  rutaInicioSes(){
    return(this.router.url === '/login');
  }

  rutaSignup(){
    return(this.router.url === '/signup');
  }

  rutaSignup2(){
    return(this.router.url === '/signup-google');
  }

  explorar(){
    return(this.router.url === '/explorar');
  }

  imagen() {
    // return this.usuarioService.imagenURL;
    return 'assets/images/blank-profile-picture.png';
  }

  nombre() {
    // return this.usuarioService.nombre;
    return 'Pepe';
  }

  redirigirDashboard() {
    this.router.navigate(['/estudio/dashboard']);
  }

  redirigirAdminDashboard() {
    this.router.navigate(['/admin/dashboard']);
  }

  TNL() {
    return this.comunicacionService.getData('TNL');
  }

  redirigirEditarPerfil() {
    this.router.navigate(['/editar-perfil']);
  }

}
