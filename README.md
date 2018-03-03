

## Resource

* To see an [Angular sample app](https://github.com/thruthesky/firebase-cms-app) that is using `Firebase CMS`. In fact, we use this app to build `Firebase CMS`.

## How develop adding Firebase CMS as a submodule to a project.

* It is very convinient to develop Firebase CMS as a submodule. You can update it while building a Project. and you can `npm publish` when ever you want to update the version of `Firebase CMS`.


* First add `Firebase CMS` submodule to a project.
$ git submodule add https://github.com/thruthesky/firebase-cms src/app/modules/firebase-cms


* Then open the app module and add the following.
````
import { FirebaseCmsModule, FirebaseCmsService } from './modules/firebase-cms/firebase-cms.module';
@NgModule({
  imports: [
    FirebaseCmsModule
  ]
})
export class AppModule {
  constructor(cms: FirebaseCmsService) {
    cms.initializeFirebase(environment.firebase);
  }
}
````

* If you want to publish update version of `Firebase CMS` as node module, please follow the instructions of [Ng-Packagr](https://github.com/dherges/ng-packagr)

