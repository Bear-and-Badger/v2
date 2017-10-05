'use strict'

const ModelUtil = use('App/Helpers/ModelUtil')
const ViewUtil = use('App/Helpers/ViewUtil')

const Thread = use('App/Models/Thread')
const Post = use('App/Models/Post')

async function getCategoryIds (role) {
  const categories = await role.categories().fetch()
  return categories.toJSON().map((category) => { return category.id })
}

class ThreadController {
  async index ({request, view}) {
    const page = parseInt(request.input('page', 1), 10)

    const threads = await Thread.query()
        .with('category')
        .with('user')
        .whereIn('category_id', await getCategoryIds(request.currentRole))
        .orderBy('updated_at', 'desc')
        .paginate(page, 5)

    return view.render('thread.index', threads.toJSON())
  }

  async view ({view, params, request, response}) {
    const thread = await Thread.query()
        .where('id', params.id)
        .whereIn('category_id', await getCategoryIds(request.currentRole))
        .with('user')
        .first()

    if (!thread) {
      return response.route('404', 404)
    }

    const page = parseInt((params.page || 1), 10)

    const posts = await Post.query()
        .with('user')
        .where('thread_id', '=', thread.id)
        .orderBy('created_at', 'asc')
        .paginate(page, 2)

    return view.render('thread.view', {
      thread: thread.toJSON(),
      posts: posts.toJSON()
    })
  }

  async new ({request, view}) {
    const categories = await request.currentRole.categories().fetch()

    return view.render('thread.edit', {
      categories: ViewUtil.objectToSelectOptions(categories.toJSON(), 'id', 'name')
    })
  }

  async edit ({request, params, view, response}) {
    const categories = await request.currentRole.categories().fetch()

    const thread = await Thread.query()
        .where('id', params.id)
        .whereIn('category_id', await getCategoryIds(request.currentRole))
        .fetch()

    if (!thread) {
      return response.route('404', 404)
    }

    return view.render('thread.edit', {
      categories: ViewUtil.objectToSelectOptions(categories.toJSON(), 'id', 'name'),
      thread: thread.toJSON()
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
