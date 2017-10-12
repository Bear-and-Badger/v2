'use strict'

const moment = require('moment')
const Model = use('Model')

class Post extends Model {
  thread () {
    return this.belongsTo('App/Models/Thread')
  }

  user () {
    return this.belongsTo('App/Models/User')
  }

  getIsEdited ({created_at, updated_at}) {
    return created_at !== updated_at
  }

  getWasCreatedAt ({created_at}) {
    return moment(created_at).fromNow()
  }

  getWasUpdatedAt ({updated_at}) {
    return moment(updated_at).fromNow()
  }

  static get computed () {
    return ['isEdited', 'wasCreatedAt', 'wasUpdatedAt']
  }
}

module.exports = Post
