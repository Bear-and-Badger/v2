'use strict'

const Model = use('Model')

class Permission extends Model {
    role () {
        return this.belongsTo('App/Models/Role')
    }
}

module.exports = Permission
