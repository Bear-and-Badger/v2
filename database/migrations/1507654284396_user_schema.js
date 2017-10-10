'use strict'

const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.table('users', (table) => {
      table.datetime('last_online').defaultsTo(this.fn.now())
    })
  }

  down () {
    this.table('users', (table) => {
      table.dropColumn('last_online')
    })
  }
}

module.exports = UserSchema
