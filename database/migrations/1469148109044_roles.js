'use strict'

const Schema = use('Schema')

class RolesSchema extends Schema {

  up () {
    this.create('roles', (table) => {
      table.increments()
      table.string('name')
      table.timestamps()
    })
  }

  down () {
    this.drop('roles')
  }

}

module.exports = RolesSchema
