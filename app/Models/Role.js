'use strict'

const Model = use('Model')

class Role extends Model {
    users () {
        return this.hasMany('App/Models/User')
    }

    permissions () {
        return this.hasMany('App/Models/Permission')
    }

    categories () {
        return this.belongsToMany('App/Models/Category')
    }

    threads () {
        return this.manyThrough('App/Models/Category', 'threads')
    }
}

module.exports = Role
