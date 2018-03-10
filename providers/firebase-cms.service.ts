import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as firebase from 'firebase';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

import { BACKEND_ERROR_OBJECT } from './error';
import { ROUTER_RESPONSE, CATEGORY, COLLECTIONS } from './defines';



/**
 * Interface for Configuration
 */
export interface FIREBASE_CMS_SERVICE_CONFIG {
  firebase: any;
  apiUrl: string;

  // If it is set to true, then it will not alert a message when the backend is not installed.
  // It will log error with `console.error()`
  disableAlertOnNotInstall?: boolean;

  // If it is set to true, it will
  // 1. Query with GET method to `Functions`
  // Use it for debugging in development.
  debug?: boolean;
}

@Injectable()
export class FirebaseCmsService {

  static config = null;

  firebaseApp: firebase.app.App;
  apiUrl: string = null;
  afAuth: AngularFireAuth = null;
  afs: AngularFirestore = null;
  idToken: string = null;

  isLogin = false; // If true, the user has logged in.



  /// category
  categoryCollection: AngularFirestoreCollection<CATEGORY>;
  categories: Observable<CATEGORY[]>;




  ///
  constructor(
    public http: HttpClient
  ) {
    console.log("Firebase Cms Service runs...");


    if (FirebaseCmsService.config) this.initialize(FirebaseCmsService.config);
  }

  get config(): FIREBASE_CMS_SERVICE_CONFIG {
    return FirebaseCmsService.config;
  }



  /**
   * It initialize the CMS with the configuration.
   * @param config Backend configuration
   *      config['firebase'] is the firebase configuration.
   *      config['api'] is the function api url.
   */
  initialize(config: FIREBASE_CMS_SERVICE_CONFIG) {
    this.apiUrl = config.apiUrl;
    this.firebaseApp = this.firebaseApp = firebase.initializeApp(config.firebase);
    this.initializeFirebase();
  }

  initializeFirebase() {

    /// post, category
    this.afs = new AngularFirestore(<any>this.firebaseApp, true);
    this.categoryCollection = this.afs.collection<CATEGORY>( COLLECTIONS.CATEGORIES );


    /// users
    this.afAuth = new AngularFireAuth(<any>this.firebaseApp);
    this.initializeFirebaseAuthentication();
  }

  initializeFirebaseAuthentication() {

    // When user authentication changes.
    this.afAuth.auth.onAuthStateChanged(user => {
      if (user) { // User is signed in.
        this.isLogin = true;
        user.getIdToken().then(x => this.updateIdToken(x)).catch(e => e);
      } else { // No user is signed in.
        this.isLogin = false;
      }

    });

    // User's ID Token changes.
    this.afAuth.auth.onIdTokenChanged(user => {
      if (user) {  // Check if user logged in
        user.getIdToken().then(x => this.updateIdToken(x)).catch(e => e);
      }
    });
  }



  updateIdToken(idToken: string) {
    // console.log('updateIdToken: idToken.length: ', idToken.length);
    // console.log('ID Token: ', idToken);
    this.idToken = idToken;
  }




  get userDisplayName(): string {
    return this.afAuth.auth.currentUser.displayName;
  }

  version(debug: boolean = false): Promise<ROUTER_RESPONSE> {
    return this.route({ route: 'user.version', debug: debug });
  }

  userSet(data) {
    // this.http.post(this.apiUrl, data).subscribe(re => {
    //   console.log(re);
    // });
  }

  /**
   * Returns the same return value of `auth.signInWithEmailAndPassword()`
   * @desc It does not return `backend server response`.
   * @param email user email
   * @param password user passowrd
   *
   * @return `Firebase` Promise.
   */
  login(email, password): Promise<firebase.User> {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  logout(): Promise<void> {
    this.idToken = null;
    return this.afAuth.auth.signOut();
  }

  /**
   * Returns a Promise of `ROUTER_REPONSE` or Firebase Error Object.
   * @param data User data to resiter with Email/Password on Authentication.
   */
  registerWithAuthentication(data): Promise<ROUTER_RESPONSE> {
    return this.afAuth.auth.createUserWithEmailAndPassword(data.email, data.password)
      .then((user: firebase.User) => {
        return user.getIdToken();
      })
      .then((idToken) => { // 이 (JWT) 토큰을 서버로 전송하면 된다.
        // console.log('ID Token: ', idToken);
        this.idToken = idToken;
        const profile = {
          route: 'user.set',
          idToken: idToken,
          name: data.name,
          mobile: data.mobile
        };
        return this.route(profile);
      })
      .catch(e => {
        console.log(e);
        return e;
      });
  }

  /**
   * Returns server response after register.
   * @param data User data to create `Firebase Authentication` and set Document on `user collection`
   *
   * @desc It does not log after registration since it may get a complicated code. Simple is the best!
   */
  register(data): Promise<ROUTER_RESPONSE> {

    data['route'] = 'user.register';
    return this.route(data);
    // .then(re => {
    //   return this.login(data.email, data.password);
    // })
    // .then((user: firebase.User) => {
    //   return { code: 0, data: user.uid, route: 'user.register' };
    // });
  }

  profileUpdate(data): Promise<ROUTER_RESPONSE> {
    data['route'] = 'user.update';
    data['idToken'] = this.idToken;
    return this.route(data);
  }

  getUserData(): Promise<ROUTER_RESPONSE> {
    const data = {
      route: 'user.get',
      idToken: this.idToken
    };
    return this.route(data);
  }


  // logUrl(data) {
  //   console.log("Request Url: ", url);
  // }

  getUrl(data) {
    delete data['debug'];
    const url = this.apiUrl + '?' + this.httpBuildQuery(data);
    return url;
  }

  /**
   * Request to `Firebase Functions` and returns the response.
   * 
   * @desc All request must be done through this method.
   *
   * @desc If there is error, the `BACKEND_ERROR_RESPONSE` object will be returned instead of `Error` object.
   *      This is important when you handle error.
   * @param data request data
   */
  route(data): Promise<ROUTER_RESPONSE> {


    if (!this.apiUrl) {
      return Promise.reject(new Error('apiUrl is empty. It should have backend server URL.'));
      // Promise.throw('apiUrl is empty. It should have backend server URL.');
      // throw new Error('apiUrl is empty. It should have backend server URL.');
    }

    let req;
    if (this.config.debug || (data['debug'] !== void 0 && data['debug'] === true)) {
      console.log(data.route + " : ", this.getUrl(data));
      req = this.http.get(this.getUrl(data));
    }
    else {
      req = this.http.post(this.apiUrl, data);
    }

    return req.toPromise()
      .then((re: ROUTER_RESPONSE) => {
        if (re.code === void 0) { /// No response from backend. Maybe Javascript error / Network error.
          throw { code: -1, message: 'Failed to get response from server' };
        }
        else if (re.code) { /// Backend error response.
          throw re;
        }
        else {
          return re;
        }
      })
      .then(re => {
        if (re.installed !== void 0 && re.installed === false) {
          const msg = "The system is not installed. Please install now.";
          if (this.config.disableAlertOnNotInstall === true) {
            console.error(msg);
          }
          else {
            alert(msg);
          }
        }
        return re;
      });
  }


  /**
     * Returns http query string.
     * @param params Object to build as http query string
     * @return
     *      - http query string
     *      - Or null if the input is emtpy or not object.
     */
  httpBuildQuery(params): string | null {
    const keys = Object.keys(params);
    if (keys.length === 0) {
      return null;
    }
    const esc = encodeURIComponent;
    const query = keys
      .map(k => esc(k) + '=' + esc(params[k]))
      .join('&');
    return query;
  }



  /**
   * Returns server response.
   * 
   * @return
   *    - `data` is set to true if the backend is installed.
   *    - Otherwise, `data` will be false.
   */
  checkInstall(): Promise<ROUTER_RESPONSE> {
    return this.route({ route: 'system.checkInstall' });
  }

  install(data): Promise<ROUTER_RESPONSE> {
    data['route'] = 'system.install';
    return this.route(data);
  }


  categoryCreate(data): Promise<ROUTER_RESPONSE> {
    data['route'] = 'category.create';
    return this.route(data);
  }
  categoryGet(id): Promise<ROUTER_RESPONSE> {
    const data = {
      route: 'category.get',
      id: id
    };
    return this.route(data);
  }
  categoryUpdate(data): Promise<ROUTER_RESPONSE> {
    data['route'] = 'category.create';
    return this.route(data);
  }

  /**
   * @warning It saves the stream into `this.categories`. This means you can only use one categories stream through out the project.
   */
  categoryObserve() {
    this.categories = this.categoryCollection.valueChanges();
    return this.categories;
  }
}
