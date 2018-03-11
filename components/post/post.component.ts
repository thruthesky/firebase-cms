import { Component } from '@angular/core';
import * as firebase from 'firebase';
import { FirebaseCmsService } from './../../providers/firebase-cms.service';
import { Form } from '@angular/forms';
import { CATEGORY, POST } from '../../sdk';


@Component({
    selector: 'app-cms-post',
    templateUrl: './post.component.html'
})
export class PostComponent {


    open = true;
    show = {
        create: true
    };
    loader = {
        creating: false
    };
    categories: { [id: string]: CATEGORY } = {};
    post = <POST>{};
    constructor(
        public cms: FirebaseCmsService
    ) {
        cms.categoryGets({ properties: ['id', 'name', 'subcategories'] }).then(re => {
            console.log("categories: ", re);
            if (re.code) return alert(re.message);
            for (const c of re.data) {
                this.categories[c.id] = c;
            }
        });
    }
    get categoryIds() {
        const keys = Object.keys(this.categories);
        if ( keys.length ) return keys;
        else return false;
    }
    get subcategories() {
        if ( ! this.categoryIds ) return false;
        if ( this.categories[ this.post.categoryId ] === void 0 ) return false;
        const sub = this.categories[ this.post.categoryId ].subcategories;
        if ( sub ) {
            return sub.split(',').map( v => v.trim() );
        }
        else return false;
    }

    showCreateForm() {

    }



    onPostCreateFormSubmit(event: Event) {
        event.preventDefault();
        this.loader.creating = true;
        this.cms.postCreate(this.post).then(re => {
            // console.log("categoryCreate: re: ", re);
            // this.cms.categoryGet( re.data ).then( got => {
            //     this.categories.push( got.data );
            //     this.loader.creating = false;
            // }).catch( e => alert(e) );
        }).catch(e => {
            this.loader.creating = false;
            alert(e.message);
        });
        return false;
    }
}


