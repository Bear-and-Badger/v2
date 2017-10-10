'use strict'

const Model = use('Model')

class Bookmark extends Model {
  thread () {
    return this.belongsTo('App/Models/Thread')
  }

  user () {
    return this.belongsTo('App/Models/User')
  }
}

module.exports = Bookmark
