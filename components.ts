import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseCmsModule } from './sdk';

import { InstallComponent } from './components/install/install.component';
export * from './components/install/install.component';

import { UserComponent } from './components/user/user.component';
export * from './components/user/user.component';



@NgModule({
    declarations: [
        InstallComponent,
        UserComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        FirebaseCmsModule
    ],
    exports: [
        InstallComponent,
        UserComponent
    ]
})
export class FirebaseCmsComponentModule {
}
