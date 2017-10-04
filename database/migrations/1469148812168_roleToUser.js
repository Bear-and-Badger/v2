'use strict'

const Schema = use('Schema')

class RoleToUserSchema extends Schema {

  up () {
    this.create('role_user', (table) => {
        table.integer('role_id').unsigned().references('roles.id')
        table.integer('user_id').unsigned().references('users.id')
    })
  }

  down () {
    this.drop('role_user')
  }

}

module.exports = RoleToUserSchema
