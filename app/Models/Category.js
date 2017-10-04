'use strict'

const Model = use('Model')

class Category extends Model {
    static get rules() {
        return {
            name : 'required|max:120|unique:categories'
        };
    }

    static boot() {
        super.boot();
        this.addHook('beforeCreate', 'Category.createSlug');
    }

    threads() {
        return this.hasMany('App/Models/Thread');
    }
}

module.exports = Category
