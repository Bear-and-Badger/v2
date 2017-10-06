'use strict'

const Schema = use('Schema')

class MessageSchema extends Schema {
  up () {
    this.create('messages', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('users.id')
      table.integer('chat_id').unsigned().references('chats.id')
      table.text('content')
      table.timestamps()
    })
  }

  down () {
    this.drop('messages')
  }
}

module.exports = MessageSchema
