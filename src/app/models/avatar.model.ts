import { Tatuaje } from "./tatuaje.model";
import { Usuario } from "./usuario.model";

export class Avatar {

  constructor(
    public modelo: string,
    public piel: string,
    public usuario?: Usuario,
    public tatuajes?: Tatuaje[],
  ){}

 }
