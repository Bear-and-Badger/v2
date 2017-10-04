'use strict'

const Validator = use('Validator')
const Category = module.exports = {}

Category.createSlug = async (category) => {
  category.slug = await Validator.sanitizor.slug(category.name)
}
