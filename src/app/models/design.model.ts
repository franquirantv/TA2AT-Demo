import { Usuario } from "./usuario.model";
import { environment } from "src/environments/environment";

export class Design {

  constructor( public did: string,
               public color: boolean,
               public nombre: string,
               public usuario: Usuario,//esto deberia ser un string
               public imagen_id:string,
               public imagen_x:number,
               public imagen_y:number,
               public estilos: string[],
               public zonas: string[],
               public descripcion:string,
               public autor: string,
               public guardados?: string[],
               public imagenUrl?:string,

               ) {}
              /*get imagenUrl(): string {
                console.log(1)

              // Devolvemos la imagen en forma de peticion a la API
              const token = localStorage.getItem('token') || '';
              if (!this.imagen_id) {
                  return `${environment.base_url}/upload/publicacion/error?token=${token}`;
              }
              console.log(`${environment.base_url}/upload/fotoperfil/${this.imagen_id}?token=${token}`);
              return `${environment.base_url}/upload/publicacion/${this.imagen_id}?token=${token}`;
          }*/

}
