'use strict'

const Schema = use('Schema')

class ChatUserSchema extends Schema {
  up () {
    this.create('chat_users', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('users.id')
      table.integer('chat_id').unsigned().references('chats.id')
    })
  }

  down () {
    this.drop('chat_users')
  }
}

module.exports = ChatUserSchema
