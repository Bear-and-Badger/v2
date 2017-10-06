'use strict'

const Model = use('Model')

class Message extends Model {
    chat () {
        return this.belongsTo('App/Models/Chat')
    }

    user () {
        return this.belongsTo('App/Models/User')
    }
}

module.exports = Message
