'use strict'

const Schema = use('Schema')

class LastreadPostSchema extends Schema {
  up () {
    this.create('last_read_posts', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('users.id')
      table.integer('post_id').unsigned().references('posts.id')
      table.integer('thread_id').unsigned().references('threads.id')
      table.integer('page').unsigned().defaultsTo(1)
    })
  }

  down () {
    this.drop('last_read_posts')
  }
}

module.exports = LastreadPostSchema
