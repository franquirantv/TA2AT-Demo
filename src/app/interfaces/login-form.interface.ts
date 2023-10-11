
export interface loginform {
    email: string;
    password: string; //para un campo opcional se pondria este por ejemplo: password?:... y ya igual
    //remember: boolean;
}

export interface Googleloginform {
    email: string;
}
/*
let partialLoginform: Partial<loginform> = {email: };
let loginform: loginform = partialLoginform as loginform;
*/