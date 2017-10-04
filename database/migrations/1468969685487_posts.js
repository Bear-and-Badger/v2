'use strict'

const Schema = use('Schema')

class PostsSchema extends Schema {

  up () {
    this.create('posts', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('users.id')
      table.integer('thread_id').unsigned().references('threads.id')
      table.text('content')
      table.timestamps()
    })
  }

  down () {
    this.drop('posts')
  }

}

module.exports = PostsSchema 
