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

    show = {
        content: false,
        createForm: false,
        editForm: false
    };
    loader = {
        create: false,
        edit: false
    };
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
        this.loader.create = true;
        this.cms.categoryCreate(this.form).then(re => {
            console.log("categoryCreate: re: ", re);
            this.cms.categoryGet(re.data).then(got => {
                this.categories.push(got.data);
                this.loader.create = false;
                this.form = <CATEGORY>{};
            }).catch(e => alert(e));
        }).catch(e => {
            this.loader.create = false;
            alert(e.message);
        });
        return false;
    }

    onClickDeleteCategory(category: CATEGORY) {
        category['inDeleting'] = true;
        this.cms.categoryDelete(category.id).then(re => {
            category['inDeleting'] = false;
            const i = this.categories.findIndex(v => v.id === category.id);
            this.categories.splice(i, 1);
        })
            .catch(e => {
                category['inDeleting'] = false;
                alert(e.message);
            });
    }



    /**
     * Submit to server.
     */
    onCategoryEditFormSubmit(event: Event) {
        event.preventDefault();
        this.loader.edit = true;
        this.cms.categoryEdit(this.form).then(re => {
            this.cms.categoryGet(re.data).then(got => {
                this.loader.edit = false;
                this.show.editForm = false;
                if ( got.code ) return alert( got.message );
                const i = this.categories.findIndex(v => v.id === got.data.id);
                this.categories.splice(i, 1, got.data);
                this.form = <CATEGORY>{};
            }).catch(e => alert(e));
        }).catch(e => {
            this.loader.edit = false;
            alert(e.message);
        });
        return false;
    }

    /**
     * Show category edit form
     */
    onClickCategoryEdit(category: CATEGORY) {
        this.show.createForm = false;
        this.show.editForm = true;
        this.loader.edit = true;
        this.cms.categoryGet(category.id).then(re => {
            this.loader.edit = false;
            if (re.code) alert(re.message);
            else this.form = re.data;
            console.log('form: ', this.form);
        }).catch(e => {
            this.loader.edit = false;
            alert(e.message);
        });
    }



    onCancelEditCategory() {
        this.show.editForm = false;
        this.form = <CATEGORY>{};

    }
}
