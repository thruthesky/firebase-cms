import { Component, Output, EventEmitter } from '@angular/core';
import * as firebase from 'firebase';
import { FirebaseCmsService } from './../../providers/firebase-cms.service';
import { Form } from '@angular/forms';



@Component({
    selector: 'app-cms-category',
    templateUrl: './category.component.html'
})
export class CategoryComponent {

    

    constructor(
        public cms: FirebaseCmsService
    ) {

        cms.subscribeCategoryies();


        
    }

    



}
