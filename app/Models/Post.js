'use strict'

const Model = use('Model')

class Post extends Model {
    thread () {
        return this.belongsTo('App/Models/Thread')
    }

    user () {
        return this.belongsTo('App/Models/User')
    }
}

module.exports = Post
