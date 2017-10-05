'use strict'

const Model = use('Model')

class Thread extends Model {
  category () {
    return this.belongsTo('App/Models/Category')
  }

  user () {
    return this.belongsTo('App/Models/User')
  }

  posts () {
    return this.hasMany('App/Models/Post')
  }

  roles () {
    return this.manyThrough('App/Models/Role', 'categories')
  }
}

module.exports = Thread
