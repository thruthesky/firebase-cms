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
    subcategories?: string; // separated by comma.
    tags?: string; // separated by comma.
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
    created?: any;
    updated?: any;
}


/**
* POST data to create/update/delete.
* 
* @desc You can update more.
* 
* 
*/
export interface POST {
    id?: string;                    // Document ID. This is needed only on accessing. It does not need to be saved.
    uid: string;                    // author
    title?: string;
    content?: string;
    categoryId?: string;
    subcategory?: string;           // Sub category to categorize in detail.
    tags?: string;                  // Tags to search
    displayName?: string;
    email?: string;
    password?: string;              // Anonymous need to put a password to update/delete.
    phoneNumber?: string;
    country?: string;
    province?: string;
    city?: string;
    address?: string;
    zipCode?: string;
    files?: Array<string>;
    numberOfComments?: number;
    numberOfLikes?: number;
    numberOfDislikes?: number;
    numberOfViews?: number;
    private?: boolean;
    reminder?: number; // higher number will be listed on top.
}

export interface POST_PERMISSION {
    id?: string;
    password?: string;
}


export interface GET_POST {
    uid?: string;               // to see if who is the owner.
    postId?: string;
    category?: string;
}
