import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';


import { FirebaseCmsService, FIREBASE_CMS_SERVICE_CONFIG } from './providers/firebase-cms.service';
export * from './providers/firebase-cms.service';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule
    ],
    providers: [
        HttpClient,
        FirebaseCmsService
    ]
})
export class FirebaseCmsModule {
    public static forRoot(config: FIREBASE_CMS_SERVICE_CONFIG ): ModuleWithProviders {
        
            FirebaseCmsService.config = config;
        
        return {
            ngModule: FirebaseCmsModule,
            providers: [FirebaseCmsService],
        };
    }
}
