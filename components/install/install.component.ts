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
    onInstallFormSubmit(event: Event, form) {
        event.preventDefault();
        return false;
    }


}
