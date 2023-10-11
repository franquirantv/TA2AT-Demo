
import { UsuariosService } from "../services/usuario.service";
import { environment } from '../../environments/environment';

const base_url: string = environment.base_url;

export class Usuario {


    constructor( public uid: string,
                 public rol: string,
                 public token: string,
                 public logged: boolean = false,
                 public nombre?: string,
                 public apellidos?: string,
                 public email?: string,
                 public fnacimiento?: Date,
                 public alta?: Date,
                 public activo?: boolean,
                 public tour?:boolean,
                 public imagen?: string,
                 public Gacount?: boolean,
                 public imagenGoogle?: boolean,
                 public Valoracion?: boolean) {}

    get imagenUrl(): string {
        /*Se puede controlar cuando se hace un cambio de imagen en el if. Puede ser un campo de BD que diga si tiene su imagen*/
        if(this.Gacount){
            if(this.Gacount === true && this.imagenGoogle == true){
                return this.imagen;
            }
        }
        // Devolvemos la imagen en forma de peticilon a la API
        const token = localStorage.getItem('token') || '';
        if (!this.imagen) {
            return `${base_url}/upload/fotoperfil/no-imagen?token=${token}`;
        }
        //console.log(`${base_url}/upload/fotoperfil/${this.imagen}?token=${token}`);
        return `${base_url}/upload/fotoperfil/${this.imagen}?token=${token}`;
    }
}
