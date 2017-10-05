'use strict'

const Category = use('App/Models/Category')
const Thread = use('App/Models/Thread')

class CategoryController {
  async index ({request, view, auth}) {
    const categories = await request.permissions.getCategories()

    return view.render('category.index', {
      categories: categories.toJSON()
    })
  }

  async view ({params, request, response, view}) {
    const categoryIds = await request.permissions.getCategoryIds()
    const category = await Category.query()
        .where('slug', params.id)
        .whereIn('id', categoryIds)
        .first()

    if (category) {
      const page = parseInt((params.page || 1), 10)
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
      response.route('404', 404)
    }
  }
}

module.exports = CategoryController
