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

    open = false;
    inCreating = false;
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
        this.inCreating = true;
        this.cms.categoryCreate(this.form).then( re => {
            console.log("categoryCreate: re: ", re);
            this.cms.categoryGet( re.data ).then( got => {
                this.categories.push( got.data );
                this.inCreating = false;
            }).catch( e => alert(e) );
        }).catch( e => {
            this.inCreating = false;
            alert(e.message);
        });
        return false;
    }

    onClickDeleteCategory( category: CATEGORY ) {
        category['inDeleting'] = true;
        this.cms.categoryDelete( category.id ).then( re => {
            category['inDeleting'] = false;
            const i = this.categories.findIndex( v => v.id === category.id );
            this.categories.splice( i, 1 );
        })
        .catch( e => {
            category['inDeleting'] = false;
            alert(e.message);
        });
    }

}
