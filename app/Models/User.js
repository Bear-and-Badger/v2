'use strict'

const PermissionUtil = use('App/Helpers/PermissionUtil')
const Model = use('Model')

class User extends Model {
  static get rules () {
    return {
      name: 'required|alpha_numeric|unique:users',
      email: 'required|email|unique:users',
      password: 'required|min:8|max:30'
    }
  }

  static boot () {
    super.boot()
    this.addHook('beforeCreate', 'User.hashPassword')
  }

  tokens () {
    return this.hasMany('App/Models/Token')
  }

  static get deleteTimestamp () {
    return 'deleted_at'
  }

  posts () {
    return this.hasMany('App/Models/Post', 'id')
  }

  role () {
    return this.belongsTo('App/Models/Role')
  }

  can (action, model, owner) {
    return PermissionUtil.check(action, model, owner, this)
  }
}

module.exports = User
