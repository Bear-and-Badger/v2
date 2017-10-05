'use strict'

const Schema = use('Schema')

class CategoryToRoleSchema extends Schema {
  up () {
    this.create('category_role', (table) => {
      table.increments()
      table.integer('category_id').unsigned().references('categories.id')
      table.integer('role_id').unsigned().references('roles.id')
    })
  }

  down () {
    this.drop('category_role')
  }
}

module.exports = CategoryToRoleSchema
