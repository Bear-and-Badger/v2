'use strict'

const ModelUtil = use('App/Helpers/ModelUtil')
const Category = use('App/Models/Category')
const Thread = use('App/Models/Thread')

class CategoryController {
  async index ({view}) {
    const categories = await Category.all()

    return view.render('category.index', {
      categories: categories.toJSON()
    })
  }

  async view ({request, params, response, view}) {
    const category = await Category.findBy('slug', params.id)

    if (category) {
      const page = parseInt(request.input('page', 1), 10)
      const threads = await Thread.query()
                                  .with('category')
                                  .with('user')
                                  .where('category_id', category.id)
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
