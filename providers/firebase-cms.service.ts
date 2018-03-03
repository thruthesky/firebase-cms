import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { HttpClient } from '@angular/common/http';
import * as firebase from 'firebase';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';


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

  initializeFirebase(config) {
    this.firebaseApp = firebase.initializeApp(config);
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
  setFirebaseFunctionsApi(url: string) {
    this.apiUrl = url;
  }
  updateIdToken(idToken) {
    console.log('ID Token: ', idToken);
    this.idToken = idToken;
  }

  version() {
    return '0.2.2';
  }

  get userDisplayName(): string {
    return this.afAuth.auth.currentUser.displayName;
  }

  userSet(data) {
    // this.http.post(this.apiUrl, data).subscribe(re => {
    //   console.log(re);
    // });
  }

  login(email, password): Promise<any> {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }
  register(data): Promise<any> {
    return this.afAuth.auth.createUserWithEmailAndPassword(data.email, data.password)
      .then((user: firebase.User) => {
        return user.getIdToken();
      })
      .then((idToken) => { // 이 (JWT) 토큰을 서버로 전송하면 된다.
        // console.log('ID Token: ', idToken);
        this.idToken = idToken;

        // let url = this.apiUrl + '?route=user.set&idToken=' + this.idToken;
        // url += '&name=' + data.name;
        // url += '&mobile=' + data.mobile;
        // console.log('url: ', url);
        // return url;

        const profile = {
          route: 'user.set',
          idToken: idToken,
          name: data.name,
          mobile: data.mobile
        };

        return profile;
      })
      // .then(url => {
      //   return this.http.get(url).toPromise();
      // })
      .then(profile => {
        console.log("then: profile: ", profile);
        return this.http.post(this.apiUrl, profile)
          // .map(x => x )
          .toPromise();
      })
      .catch(error => {
        console.log(error);
      });

  }
}
