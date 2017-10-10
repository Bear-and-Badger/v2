'use strict'

const Schema = use('Schema')

class ThreadsSchema extends Schema {
  up () {
    this.table('threads', (table) => {
      table.integer('post_count').unsigned().defaultsTo(0)
    })
  }

  down () {
    this.table('threads', (table) => {
      table.dropColumn('post_count')
    })
  }
}

module.exports = ThreadsSchema
