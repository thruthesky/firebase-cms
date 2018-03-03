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

import { LoginComponent } from './components/login/login.component';
export * from './components/login/login.component';

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  exports: [
    LoginComponent
  ],
  providers: [
    HttpClient,
    FirebaseCmsService
  ]
})


export class FirebaseCmsModule {
  // public static forRoot(config): ModuleWithProviders {
  //   FirebaseCmsService.config = config;
  //   return { ngModule: FirebaseCmsModule, providers: [] };
  // }
}
