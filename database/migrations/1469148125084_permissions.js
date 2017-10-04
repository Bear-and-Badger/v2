'use strict'

const Schema = use('Schema')

class PermissionsSchema extends Schema {

  up () {
    this.create('permissions', (table) => {
      table.increments()
      table.integer('role_id').unsigned().references('roles.id')
      table.string('action')
      table.string('model')
      table.boolean('all').defaultsTo(false)
      table.timestamps()
    })
  }

  down () {
    this.drop('permissions')
  }

}

module.exports = PermissionsSchema
