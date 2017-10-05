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
}

module.exports = Thread
