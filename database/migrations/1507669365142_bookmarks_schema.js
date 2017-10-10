'use strict'

const Schema = use('Schema')

class BookmarksSchema extends Schema {
  up () {
    this.create('bookmarks', (table) => {
      table.integer('user_id').unsigned().references('users.id')
      table.integer('thread_id').unsigned().references('threads.id')
      table.timestamps()
    })
  }

  down () {
    this.drop('bookmarks')
  }
}

module.exports = BookmarksSchema
