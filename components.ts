import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseCmsModule } from './sdk';

import { InstallComponent } from './components/install/install.component';
export * from './components/install/install.component';

import { UserComponent } from './components/user/user.component';
export * from './components/user/user.component';


import { CategoryComponent } from './components/category/category.component';
export * from './components/category/category.component';


@NgModule({
    declarations: [
        InstallComponent,
        UserComponent,
        CategoryComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        FirebaseCmsModule
    ],
    exports: [
        InstallComponent,
        UserComponent,
        CategoryComponent
    ]
})
export class FirebaseCmsComponentModule {
}
