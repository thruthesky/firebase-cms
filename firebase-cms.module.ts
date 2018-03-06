import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';



import { FirebaseCmsService } from './providers/firebase-cms.service';
export * from './providers/firebase-cms.service';
import { UnitTestService } from './providers/unit-test.service';
export * from './providers/unit-test.service';


import { UserComponent } from './components/user/user.component';
export * from './components/user/user.component';

import { InstallComponent } from './components/install/install.component';
export * from './components/install/install.component';


@NgModule({
  declarations: [
    UserComponent,
    InstallComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  exports: [
    UserComponent,
    InstallComponent
  ],
  providers: [
    HttpClient,
    FirebaseCmsService,
    UnitTestService
  ]
})


export class FirebaseCmsModule {
  public static forRoot(config: { firebase: any, api: string }): ModuleWithProviders {
    FirebaseCmsService.config = config;
    return {
      ngModule: FirebaseCmsModule,
      providers: [ FirebaseCmsService, UnitTestService ],
    };
  }
}
