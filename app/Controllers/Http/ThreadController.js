'use strict'

const ModelUtil = use('App/Helpers/ModelUtil')
const ViewUtil = use('App/Helpers/ViewUtil')

const Category = use('App/Models/Category')
const Thread = use('App/Models/Thread')
const Post = use('App/Models/Post')

class ThreadController {
  async index ({request, view}) {
    const page = parseInt(request.input('page', 1), 10)

    const threads = await Thread.query()
        .with('category')
        .with('user')
        .orderBy('updated_at', 'desc')
        .paginate(page, 5)

    return view.render('thread.index', threads.toJSON())
  }

  async view ({view, params, auth}) {
    const page = params.page ? parseInt(params.page, 10) : 1

    const thread = await Thread.find(params.id)
    const owner = await thread.user().fetch()

    const posts = await Post.query()
        .with('user')
        .where('thread_id', '=', thread.id)
        .orderBy('created_at', 'asc')
        .paginate(page, 2)

    return view.render('thread.view', {
      thread: thread.toJSON(),
      owner: owner.toJSON(),
      posts: posts.toJSON()
    })
  }

  async new ({view}) {
    const categories = await Category.all()

    return view.render('thread.edit', {
      categories: ViewUtil.objectToSelectOptions(categories.toJSON(), 'id', 'name')
    })
  }

  async edit ({params, view}) {
    const thread = await Thread.find(params.id)
    const categories = await Category.all()

    return view.render('thread.edit', {
      categories: ViewUtil.objectToSelectOptions(categories.toJSON(), 'id', 'name'),
      thread: thread ? thread.toJSON() : null
    })
  }

  async save ({request, response, session, auth}) {
    const data = request.only(['id', 'title', 'category_id', 'content'])

    const rules = {
      title: 'required|max:150',
      content: 'required'
    }

    await ModelUtil.save(Thread, data, rules, async (errors) => {
      session.put('id', data.id)
      session.put('title', data.title)
      session.put('content', data.content)
      session.put('category_id', data.category_id)

      session.withErrors(errors)
             .flashAll()

      response.redirect('back')
    }, async (thread) => {
      thread.user_id = auth.user.id
    }, async (thread) => {
      response.route('discussion', {id: thread.id})
    })
  }
}

module.exports = ThreadController
