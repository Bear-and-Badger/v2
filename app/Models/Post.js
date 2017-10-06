'use strict'

const Model = use('Model')

class Post extends Model {
  thread () {
    return this.belongsTo('App/Models/Thread')
  }

  user () {
    return this.belongsTo('App/Models/User')
  }

  static castDates (field, value) {
    if (field === 'updated_at') {
      return `${value.fromNow(true)} ago`
    }

    return super.castDates(field, value)
  }
}

module.exports = Post
