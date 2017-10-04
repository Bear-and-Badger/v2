'use strict'

const Category = use('App/Model/Category')
const Thread = use('App/Models/Thread')
const User = use('App/Models/User')

class AdminController {
  async categories ({view}) {
    const categories = await Category.all()

    return view.render('admin.categories', {
      categories: categories.toJSON()
    })
  }

  async threads ({request, view}) {
    const page = parseInt(request.param('page', 1), 10)

    const threads = await Thread.query()
                                .with('category')
                                .with('owner')
                                .orderBy('updated_at', 'desc')
                                .paginate(page, 50)

    return view.render('admin.threads', threads.toJSON())
  }

  async users ({request, view}) {
    const page = parseInt(request.param('page', 1), 10)

    const users = await User.query()
                            .orderBy('id', 'desc')
                            .paginate(page, 50)

    return view.render('admin.users', users.toJSON())
  }
}

module.exports = AdminController
