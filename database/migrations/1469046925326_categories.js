'use strict'

const Schema = use('Schema')

class CategoriesSchema extends Schema {

  up () {
    this.table('categories', (table) => {
        table.string('slug'); 
    })
  }

  down () {
    this.table('categories', (table) => {
        table.dropColumn('slug')
    })
  }

}

module.exports = CategoriesSchema
