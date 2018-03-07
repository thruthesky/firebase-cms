import { Component, Output, EventEmitter } from '@angular/core';
import * as firebase from 'firebase';
import { FirebaseCmsService } from './../../providers/firebase-cms.service';
import { Form } from '@angular/forms';


@Component({
    selector: 'app-cms-install',
    templateUrl: './install.component.html'
})
export class InstallComponent {


    email;
    installed = true;
    constructor(
        public cms: FirebaseCmsService
    ) {
        this.checkInstalled();
    }

    checkInstalled() {
        this.cms.checkInstall()
            .then(re => {
                console.log("check.install: ", re);
                this.installed = re.data;
            });
    }
    onInstallFormSubmit(event: Event, form) {
        event.preventDefault();
        this.cms.install( { adminEmail: this.email } )
            .then( re => {
                console.log('install: ', re);
                this.installed = true;
            })
            .catch( e => alert(e.message) );
        return false;
    }


}
