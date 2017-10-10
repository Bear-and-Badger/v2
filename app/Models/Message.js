'use strict'

const Model = use('Model')

class Message extends Model {
    chat () {
        return this.belongsTo('App/Models/Chat')
    }

    user () {
        return this.belongsTo('App/Models/User')
    }

    static castDates (field, value) {
        if (field === 'created_at' || field === 'updated_at') {
            return `${value.fromNow(true)} ago`
        }

        return super.castDates(field, value)
    }
}

module.exports = Message
