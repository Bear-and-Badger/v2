'use strict'

const Model = use('Model')

class Post extends Model {
    thread () {
        return this.belongsTo('App/Models/Thread', 'id')
    }

    owner () {
        return this.belongsTo('App/Models/User', 'id')
    }
}

module.exports = Post
