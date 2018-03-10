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

/**
 * Moderator roles.
 * 
 * 
 */
export interface MODERATOR_ROLES {
    read?: boolean;
    write?: boolean;                /// users may create a post.
    edit?: boolean;                 /// but not delete. For instance. All post must be monitored by admin. So, when they edit, they need admin's confirm.
    delete?: boolean;
    copy?: boolean;
    move?: boolean;
    reminder?: boolean; // moderator can change the remdiner or stick posts.
}

/**
 * 'categories' collection schema.
 * Feel free to extends properties.
 */
export interface CATEGORY {
    id: string;
    name?: string; // to display.
    description?: string; // to display as long description.
    header?: string;
    footer?: string;
    numberOfPostsPerPage?: number;
    numberOfPagesOnNavigation?: number;
    moderators?: Array<string>;
    moderatorRoles?: MODERATOR_ROLES;
    allowAttachment?: boolean;
    levelOnList?: number; // if set to 0, Anonymous can list
    levelOnRead?: number; // if set to 0, Anonymous can read
    levelOnWrite?: number;  // if set to 1, Only member can create/edit/delete. Anonymous cannot.
    disableDeleteWithDependant?: boolean; // if set to true, author cannot edit/delete when there is any comments.
    headerOnList?: string;
    footerOnList?: string;
    headerOnWrite?: string;
    footerOnWriter?: string;
    headerOnView?: string;
    footerOnView?: string;
    numberOfPosts?: number;
    numberOfComment?: number;
}
