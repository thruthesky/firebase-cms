export const UID = 'uid';

export const Anonymous = {
    uid: 'anonymous-uid',
    email: 'anonymous@gmail.com',
    password: 'anonymous-password-and-it-is-not-harmful-that-anyone-can-login-as-anonymous',
    emailVerified: false,
    displayName: 'Anonymous',
    photoURL: '',
    disabled: false
};


export const COLLECTIONS = {
    USERS: 'users',
    SETTINGS: 'settings',
    POSTS: 'posts',
    CATEGORIES: 'categories',
    COMMENTS : 'comments'
};



import { BACKEND_ERROR_OBJECT } from './error';
export interface ROUTER_RESPONSE extends BACKEND_ERROR_OBJECT {
    role?: string;
    route: string;
    data?: any;
    installed?: boolean;
}


export interface SYSTEM_SETTINGS {
    adminEmail: string;
}
