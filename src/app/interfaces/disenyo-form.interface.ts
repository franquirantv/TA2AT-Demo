
export interface disenyoform {
  //imagen_id: string ya no hace falta
  nombre: string,
  color: boolean,
  estilos: string[],
  zonas: string[],
  descripcion: string,
  usuario: string,
  autor: string,
  imagen_x: number,
  imagen_y: number,
  archivo?: FormData
}
