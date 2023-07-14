export interface User {
    usernames: string;
    displayName: string;
    token: string;
    imageg? : string;
}

export interface UserFormValues {
    email: string;
    password: string;
    displayName?: string;
    username?: string;
}