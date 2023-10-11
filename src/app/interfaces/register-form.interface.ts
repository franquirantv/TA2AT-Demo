export interface registerform {
    usu: string;
    nombre: string;
    apellidos: string;
    email: string;
    fnacimiento: Date;
    password: string; //para un campo opcional se pondria este por ejemplo: password?:... y ya igual
    rol: string
    foto?: string;
}

export interface registerform2 {
    nombre_estudio: string;
    //nombre: string;
    //apellidos: string;
    CIF: string;
    email: string;
    password: string; //para un campo opcional se pondria este por ejemplo: password?:... y ya igual
    rol: string
    foto?: string;
}

export interface registerformG {
    email: string;
    rol: string;
    firstName: string;
    id: string;
    idToken: string;
    lastName: string;
    //TODO incluirla
    //fnacimiento: Date;
    name: string; //para un campo opcional se pondria este por ejemplo: password?:... y ya igual
    photoUrl: string;
    provider: string;
    foto?: string;
}

/*
export interface registerform {
    usu: string;
    email: string;
    fnacimiento?: Date;
    password: string; //para un campo opcional se pondria este por ejemplo: password?:... y ya igual
    password2: string;
    foto?: File;
}
*/
