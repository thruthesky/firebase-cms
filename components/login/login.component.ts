import { Component, Output, EventEmitter } from '@angular/core';
import * as firebase from 'firebase';
import { FirebaseCmsService } from './../../providers/firebase-cms.service';
import { Form } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {

  email: string = null;
  password: string = null;
  mobile: number = null;
  name: string = null;

  mode: 'login' | 'register' = 'login';

  @Output() login = new EventEmitter<void>();
  constructor(public cms: FirebaseCmsService) {
    console.log(cms.afAuth);
  }


  onClickGoogleLogin() {
    this.cms.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(user => {
        console.log("Google login ok", user);
        this.login.emit();
      })
      .catch(e => {
        console.error('Google login failed with ....: ', e);
      });
  }


  onClickLogout() {
    this.cms.afAuth.auth.signOut();
  }
  onLoginFormSubmit(event: Event, form) {
    event.preventDefault();
    if (this.mode === 'login') {
      this.onClickLogin();
    }
    else {
      this.onClickRegister();
    }
    return false;
  }

  onClickLogin() {
    this.cms.login(this.email, this.password)
      .then(re => {
        console.log("onClickLogin() => cms.login() => re: ", re);
      });
  }
  onClickRegister() {
    this.cms.register({
      email: this.email,
      password: this.password,
      name: this.name,
      mobile: this.mobile
    })
      .then(re => {
        console.log('cms.register() => then: ', re);
      });


  }

}
