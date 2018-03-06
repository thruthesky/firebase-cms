import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { FirebaseCmsModule } from './sdk';



import { UnitTestService } from './unit-tests/unit-tests.service';
export * from './unit-tests/unit-tests.service';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FirebaseCmsModule
  ],
  exports: [
  ],
  providers: [
    HttpClient,
    UnitTestService
  ]
})


export class UnitTestsModule {
}
