import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';


import { FirebaseCmsService } from './providers/firebase-cms.service';
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
    public static forRoot(config: { firebase: any, api: string } ): ModuleWithProviders {
        
            FirebaseCmsService.config = config;
        
        return {
            ngModule: FirebaseCmsModule,
            providers: [FirebaseCmsService],
        };
    }
}
