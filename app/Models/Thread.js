'use strict'

const moment = require('moment')
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

module.exports = Thread
