/**
 * @file unit-test.service.ts
 *
 * Unit Test Service for Client SDK.
 *
 * It must be injected and run after `cms.initialize()`
 *
 */
import { Injectable } from '@angular/core';
import { FirebaseCmsService } from './firebase-cms.service';
import * as _ from 'lodash';
import * as E from './../error';


@Injectable()
export class UnitTestService {

    countTests = 0;
    countSuccess = 0;
    countFailture = 0;
    constructor(public cms: FirebaseCmsService) {
    }



    success(msg) {
        this.countTests++;
        this.countSuccess++;
        console.log(`Success: [${this.countSuccess}/${this.countTests}]: `, msg);
    }
    failure(msg) {
        this.countTests++;
        this.countFailture++;
        console.error(`Failture: [${this.countFailture}/${this.countTests}]: `, msg);
    }
    test(b, msg) {
        if (b) {
            this.success(msg);
        }
        else {
            this.failure(msg);
        }
    }
    runTests() {
        this.versionTests();
        this.userTests();
    }

    versionTests() {
        this.cms.version()
            .then(re => {
                console.log("re: ", re);
                this.test(re.code === 0 && _.isString(re.data), `Version: ${re.data}`);
            });
    }


    userTests() {
        this.userRegisterTest();
        this.userGetTest();
        this.userUpdateTest();
    }

    userRegisterTest() {
        const user_email = 'user' + (new Date()).getTime() + '@gmail.com';
        this.cms.register({})
            .then(re => {
                this.failure( re );
            })
            .catch(e => {
                console.log('e.code: ', e.code);
                this.test( e.code === E.NO_EMAIL, e.message );
            });
        this.cms.register({ email: user_email })
            .then(re => {
                this.failure( re );
            })
            .catch(e => {
                this.test( e.code === E.NO_PASSWORD, e.message );
            });
        this.cms.register({ email: user_email, password: '1234' })
            .then(re => {
                this.failure( re );
            })
            .catch(e => {
                this.test( e.code === E.FIREBASE_INVALID_PASSWORD, e.message );
            });
        this.cms.register({ email: user_email, password: '12345a' })
            .then(re => {
                this.test( re.code === 0, 'uid: ' + re.data );
            })
            .catch(e => {
                this.failure(e.message);
            });
        this.cms.register({ email: user_email, password: '12345a' })
            .then(re => {
                console.log("I shouln't come jhere ============ ");
                this.failure( re );
            })
            .catch(e => {
                this.test( e.code === E.FIREBASE_AUTH_UID_ALREADY_EXISTS, "Failed to register since the email is already registered.");
            });
    }
    userGetTest() {

    }
    userUpdateTest() {

    }
}
