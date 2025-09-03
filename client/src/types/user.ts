export type User = {
    id: string;
    displayName:string; 
    email:string;
    token:string;
    image?:string;
}

export type LoginCreds = {
    email:string;
    password : string;
}

export type RegisterCreds = {
    email:string;
    displayName:string;
    password:string;
}