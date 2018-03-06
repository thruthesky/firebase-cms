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
import * as E from './error';


@Injectable()
export class UnitTestService {

    countTests = 0;
    countSuccess = 0;
    countFailture = 0;
    constructor(public cms: FirebaseCmsService) {
    }


    success(...params) {
        this.countTests++;
        this.countSuccess++;
        console.log(`Success: [${this.countSuccess}/${this.countTests}]: `);
        if (params && params.length) {
            for (const p of params) {
                console.log(p);
            }
        }
    }
    failure(...params) {
        this.countTests++;
        this.countFailture++;
        console.error(`Failture: [${this.countFailture}/${this.countTests}]: `);

        if (params && params.length) {
            for (const p of params) {
                console.log(p);
            }
        }
    }
    test(b, ...params) {
        if (b) {
            this.success(params);
        }
        else {
            this.failure(params);
        }
    }
    runTests() {
        this.versionTests();
        this.userTests();
    }

    versionTests() {
        this.cms.version(true)
            .then(re => {
                console.log("re: ", re);
                this.test(re.code === 0 && _.isString(re.data), `Version: ${re.data}`);
            });
    }


    userTests() {
        this.userRegisterLoginProfileUpdateGetTest();
    }

    async userRegisterLoginProfileUpdateGetTest() {
        const user_email = 'user' + (new Date()).getTime() + '@gmail.com';
        const password = '12345a';
        this.cms.register({})
            .then(re => {
                this.failure('Expect failure: No email', re);
            })
            .catch(e => {
                console.log('e.code: ', e.code);
                this.test(e.code === E.NO_EMAIL, 'Expect failure: No email', e.message);
            });
        this.cms.register({ email: user_email })
            .then(re => {
                this.failure('Expect failure: no password', re);
            })
            .catch(e => {
                this.test(e.code === E.NO_PASSWORD, 'Expect failure: no password', e.message);
            });
        this.cms.register({ email: user_email, password: '1234' })
            .then(re => {
                this.failure(re);
            })
            .catch(e => {
                this.test(e.code === E.FIREBASE_INVALID_PASSWORD, e.message);
            });
        await this.cms.register({ email: user_email, password: password })
            .then(re => {
                this.test(re.code === 0, 'uid: ' + re.data);
            })
            .catch(e => {
                this.failure(e.message);
            });
        this.cms.register({ email: user_email, password: '12345a' })
            .then(re => {
                this.failure("Expect error: email exists", re);
            })
            .catch(e => {
                this.test(e.code === E.FIREBASE_AUTH_UID_ALREADY_EXISTS, "Expect failture: Email exits", "to register since the email is already registered.");
            });

        this.cms.login(user_email, password)
            .then((user) => {
                this.success('Expect login success: ', 'uid:' + user);
                return user.getIdToken();
            })
            .then( idToken => {
                this.cms.idToken = idToken;
            })
            .then( () => {
                return this.cms.profileUpdate({ address: 'Manila'});
            })
            .then( re => {
                this.test( re.code === 0, 'Expect success on profile update', re);
                return this.cms.getUserData();
            })
            .then( re => {
                this.test( re.code === 0, 'Expect success on get user data', re);
            })
            .catch(e => this.failure('Expect success: ', e.code, e.message));
    }

}
