'use strict'

const ModelUtil = use('App/Helpers/ModelUtil')
const ViewUtil = use('App/Helpers/ViewUtil')

const Category = use('App/Models/Category')
const Thread = use('App/Models/Thread')

class ThreadController {
  async index ({request, view}) {
    const page = parseInt(request.param('page', 1), 10)

    const threads = await Thread.query().with('category')
            .with('owner')
            .orderBy('updated_at', 'desc')
            .paginate(page, 5)

    return view.render('thread.index', threads.toJSON())
  }

  async view ({request, view}) {
    const page = parseInt(request.param('page', 1), 10)
    const thread = await Thread.find(request.param('id'))

    const posts = await thread.posts().with('owner')
            .orderBy('created_at', 'asc')
            .paginate(page, 2)

    return view.render('thread.view', {
      thread: thread.toJSON(),
      posts: posts.toJSON()
    })
  }

  async edit ({request, view}) {
    const thread = await Thread.find(request.param('id'))
    const categories = await Category.all()

    return view.render('thread.edit', {
      categories: ViewUtil.objectToSelectOptions(categories.toJSON(), 'id', 'name'),
      thread: thread ? thread.toJSON() : null
    })
  }

  async save ({request, response}) {
    const data = request.only('id', 'title', 'category_id', 'content')

    const rules = {
      title: 'required|max:150',
      content: 'required'
    }

    await ModelUtil.save(Thread, data, rules, async (errors) => {
      await request.withOnly('id', 'title', 'content', 'category_id')
                .andWith({
                  errors: errors
                })
                .flash()

      response.redirect('back')
    }, async (thread) => {
      if (thread.isNew()) {
        thread.user_id = request.user.id
      }
    }, async (thread) => {
      response.route('discussion', {id: thread.id})
    })
  }
}

module.exports = ThreadController
