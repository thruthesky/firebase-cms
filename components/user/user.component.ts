import { Component, Output, EventEmitter } from '@angular/core';
import * as firebase from 'firebase';
import { FirebaseCmsService } from './../../providers/firebase-cms.service';
import { Form } from '@angular/forms';


@Component({
  selector: 'app-cms-user',
  templateUrl: './user.component.html'
})
export class UserComponent {

  email: string = null;
  password: string = null;
  mobile: number = null;
  name: string = null;

  // mode: 'login' | 'register' = 'login';
  show: {
    register: false;
    profile: boolean;
  } = {
      register: false,
      profile: false
    };

  @Output() login = new EventEmitter<void>();
  constructor(public cms: FirebaseCmsService) {
  }


  onClickGoogleLogin() {
    this.cms.firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(user => {
        console.log("Google login ok", user);
        this.login.emit();
      })
      .catch(e => {
        console.error('Google login failed with ....: ', e);
      });
  }


  onClickLogout() {
    this.cms.logout();
  }


  onProfileUpdateFormSubmit(event: Event, form) {
    event.preventDefault();
    this.cms.profileUpdate({
      name: this.name,
      mobile: this.mobile,
      debug: true
    }).then(re => {
      console.log(re);
    }).catch(e => {
      console.log("Caught: ", e instanceof Error);
      console.error(e);
      alert(e.message);
    });
    return false;
  }


  onLoginFormSubmit(event: Event, form) {
    event.preventDefault();
    if (this.show.register === false) {
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
      })
      .catch(e => {
        alert(e.message);
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
        return this.cms.login(this.email, this.password);
      })
      .then(re => {
        console.log('login: ', re);
      })
      .catch( e => alert(e.message) );
  }

}
