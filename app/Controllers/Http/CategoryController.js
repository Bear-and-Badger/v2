'use strict'

const ModelUtil = use('App/Helpers/ModelUtil')
const Category = use('App/Models/Category')

class CategoryController {
  async index ({response, view}) {
    const categories = await Category.all()

    return view.render('category.index', {
      categories: categories.toJSON()
    })
  }

  async view ({request, response, view}) {
    const page = parseInt(request.param('page', 1), 10)
    const slug = request.param('id')

    const category = await Category.findBy('slug', slug)

    if (category) {
      const threads = await category.threads()
                                    .with('category')
                                    .with('owner')
                                    .orderBy('updated_at', 'desc')
                                    .paginate(page, 5)

      return view.render('category.view', {
        category: category.toJSON(),
        threads: threads.toJSON()
      })
    } else {
      response.redirect('/', 404)
    }
  }

  async edit ({request, view}) {
    const category = await Category.find(request.param('id'))

    return view.render('category.edit', {
      category: category ? category.toJSON() : null
    })
  }

  async save ({request, response}) {
    const data = request.only('id', 'name')

    await ModelUtil.save(Category, data, Category.rules, async (errors) => {
      await request.withOnly('name')
                    .andWith({
                      errors: errors
                    })
                    .flash()

      response.redirect('back')
    }, async (category) => {

    }, async (category) => {
      response.route('category', {id: category.slug, page: 1})
    })
  }
}

module.exports = CategoryController
