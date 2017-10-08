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

module.exports = Thread
