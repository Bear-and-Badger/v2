'use strict'

const Category = use('App/Models/Category')

class CategorySeeder {
    async run () {
        Category.create({name: 'Games'})
        Category.create({name: 'Off topic'})
        Category.create({name: 'Forum talk'})
    }
}

module.exports = CategorySeeder
