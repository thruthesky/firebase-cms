import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { HttpClient } from '@angular/common/http';
import * as firebase from 'firebase';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';


export interface BACKEND_ERROR_OBJECT {
  code: number;
  message?: string;
}

export interface ROUTER_RESPONSE extends BACKEND_ERROR_OBJECT {
  route: string;
  data?: any;
}



@Injectable()
export class FirebaseCmsService {

  static config = null;

  firebaseApp: firebase.app.App;
  apiUrl: string = null;
  afAuth: AngularFireAuth = null;
  idToken: string = null;

  isLogin = false; // If true, the user has logged in.

  constructor(
    public http: HttpClient
  ) {
    console.log("Firebase Cms Service runs...");
  }

  /**
   * It initialize the CMS with the configuration.
   * @param config Backend configuration
   *      config['firebase'] is the firebase configuration.
   *      config['api'] is the function api url.
   */
  initialize(config: { firebase: any, api: string }) {
    this.apiUrl = config.api;
    this.firebaseApp = this.firebaseApp = firebase.initializeApp(config.firebase);
    this.initializeFirebase();
  }

  initializeFirebase() {
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
    console.log('updateIdToken: idToken.length: ', idToken.length);
    // console.log('ID Token: ', idToken);
    this.idToken = idToken;
  }




  get userDisplayName(): string {
    return this.afAuth.auth.currentUser.displayName;
  }

  version(): Promise<ROUTER_RESPONSE> {
    return this.route({ route: 'user.version' });
  }

  userSet(data) {
    // this.http.post(this.apiUrl, data).subscribe(re => {
    //   console.log(re);
    // });
  }

  login(email, password): Promise<ROUTER_RESPONSE> {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  logout(): Promise<void> {
    this.idToken = null;
    return this.afAuth.auth.signOut();
  }

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
      // .then(url => {
      //   return this.http.get(url).toPromise();
      // })
      // .then( (profile): any => {
      //   console.log("then: profile: ", profile);
      //   return this.http.post(this.apiUrl, profile)
      //     // .map(x => x )
      //     .toPromise();
      // })
      .catch(error => {
        console.log(error);
      });
  }

  register(data): Promise<ROUTER_RESPONSE> {

    data['route'] = 'user.register';
    return this.route(data);

  }

  profileUpdate(data): Promise<ROUTER_RESPONSE> {
    data['route'] = 'user.update';
    data['idToken'] = this.idToken;
    return this.route(data);
  }



  /**
   * Request to `firebase functions` and returns the response.
   *
   * @desc If there is error, the `BACKEND_ERROR_RESPONSE` object will be returned instead of `Error` object.
   *      This is important when you handle error.
   * @param data request data
   */
  route(data): Promise<any> {
    if (!this.apiUrl) {
      return Promise.reject(new Error('apiUrl is empty. It should have backend server URL.'));
      // Promise.throw('apiUrl is empty. It should have backend server URL.');
      // throw new Error('apiUrl is empty. It should have backend server URL.');
    }
    if (data['debug'] !== void 0 && data['debug'] === true) {
      delete data['debug'];
      const url = this.apiUrl + '?' + this.httpBuildQuery(data);
      console.log("debug: route() request url: ", url);
    }
    return this.http.post(this.apiUrl, data).toPromise()
      .then((re: ROUTER_RESPONSE) => {
        if (re.code === void 0) {
          throw new Error('Failed to get response from server. Error code: -1');
        }
        else if (re.code) {
          // console.log("re: ", re);
          throw re;
        }
        else {
          return re;
        }
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

}
