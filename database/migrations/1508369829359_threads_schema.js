'use strict'

const Schema = use('Schema')

class ThreadsSchema extends Schema {
  up () {
    this.table('threads', (table) => {
      table.boolean('stickied').defaultsTo(false)
    })
  }

  down () {
    this.table('threads', (table) => {
      table.dropColumn('stickied')
    })
  }
}

module.exports = ThreadsSchema
