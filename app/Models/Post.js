'use strict'

const Model = use('Model')

class Post extends Model {
  thread () {
    return this.belongsTo('App/Models/Thread')
  }

  user () {
    return this.belongsTo('App/Models/User')
  }

  getIsEdited ({created_at, updated_at}) {
      return created_at === updated_at
  }

  static get computed () {
    return ['isEdited']
  }

  static castDates (field, value) {
    if (field === 'created_at' || field === 'updated_at') {
      return `${value.fromNow(true)} ago`
    }

    return super.castDates(field, value)
  }
}

module.exports = Post
