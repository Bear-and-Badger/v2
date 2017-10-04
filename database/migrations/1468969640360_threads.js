'use strict'

const Schema = use('Schema')

class ThreadsSchema extends Schema {

  up () {
    this.create('threads', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('users.id')
      table.integer('category_id').unsigned().references('categories.id')
      table.string('title')
      table.text('content')
      table.timestamps()
    })
  }

  down () {
    this.drop('threads')
  }

}

module.exports = ThreadsSchema
