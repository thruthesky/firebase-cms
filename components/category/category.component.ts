import { Component, Output, EventEmitter } from '@angular/core';
import * as firebase from 'firebase';
import { FirebaseCmsService } from './../../providers/firebase-cms.service';
import { Form } from '@angular/forms';
import { CATEGORY } from '../../sdk';





@Component({
    selector: 'app-cms-category',
    templateUrl: './category.component.html'
})
export class CategoryComponent {


    categories: Array<CATEGORY> = [];
    form = <CATEGORY>{};

    constructor(
        public cms: FirebaseCmsService
    ) {
        cms.categoryGets({ properties: ['id', 'name', 'description', 'created', 'numberOfPosts'] }).then(re => {
            console.log("categories: ", re);

            this.categories = re.data;
        });
    }



    onCategoryCreateFormSubmit(event: Event) {
        event.preventDefault();
        this.cms.categoryCreate(this.form).then( re => {
            console.log("categoryCreate: re: ", re);
        }).catch( e => alert(e.message));
        return false;
    }

    onClickDeleteCategory( id ) {
        this.cms.categoryDelete( id ).then( re => {
            console.log("categoryDelete: re: ", re);
        })
        .catch( e => alert(e.message));
    }

}
