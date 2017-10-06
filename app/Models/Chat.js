'use strict'

const Model = use('Model')

class Chat extends Model {
  users () {
    return this.belongsToMany('App/Models/User')
  }

  user () {
    return this.belongsTo('App/Models/User')
  }

  messages () {
    return this.hasMany('App/Models/Message')
  }
}

module.exports = Chat
