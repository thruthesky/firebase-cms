# Firebase Backend Client SDK

# TODO

* @see [Firebase CMS issue tracker.](https://github.com/thruthesky/firebase-cms/issues)
* Add more tests on user register with wrong email format and more.


# Resource

* To see an [Angular sample app](https://github.com/thruthesky/firebase-cms-app) that is using `Firebase CMS`. In fact, we use this app to build `Firebase CMS`.

# How develop adding Firebase CMS as a submodule to a project.

* It is very convinient to develop Firebase CMS as a submodule. You can update it while building a Project. and you can `npm publish` when ever you want to update the version of `Firebase CMS`.


* First add `Firebase CMS` submodule to a project.
````
$ git submodule add https://github.com/thruthesky/firebase-cms src/app/modules/firebase-cms
````

* Install dependencies
````
$ npm i lodash
$ npm i @types/lodash -S
$ npm i firebase angularfire2
$ npm i ng-packagr -D
````

* Then open the app module and add the following.
````
import { environment } from '../environments/environment'; // You need to save firebase configuration in environment.ts
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

 * Update below in `package.json`

````
{
  "name": "firebase-cms",
  "version": "0.2.12",
  "scripts": {
    "pack": "ng-packagr -p package.json"
  },
  "private": false,
  "ngPackage": {
    "lib": {
      "entryFile": "public_api.ts"
    }
  }
}
````

 * save below in `public_api.ts`
````
export * from './src/app/modules/firebase-cms/firebase-cms.module';
````

 * compile with `npm run pack`

 * distribute with `npm publish dist`






# For Developers


## Unit test

* We have a unit-test on client side to test the client sdk.
Simple inject the `UnitTest` serivce.
````
constructor( unitTest: UnitTest ) {}
````



## Error thrown

* Error will be thrown all the time if there is any error on sdk.

For instance, if router is missing, a Promise error is thrown and it is catchable with `.catch() { ... }`

