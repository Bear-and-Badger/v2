'use strict'

const ModelUtil = use('App/Helpers/ModelUtil')
const ViewUtil = use('App/Helpers/ViewUtil')

const Database = use('Database')

const Category = use('App/Models/Category')
const Thread = use('App/Models/Thread')
const Post = use('App/Models/Post')

const getThreads = async (page, filter) => {
  const baseThreadQuery = Thread.query()
        .orderBy('updated_at', 'desc')
        .with('category')
        .with('user')

  const threads = await filter(baseThreadQuery).paginate(page, 15)
  const json = threads.toJSON()

  if (json.data.length > 0) {
    const threadIds = json.data.map((thread) => thread.id)
    const threadIdString = threadIds.join(', ')

      // Get a list of post counts for each thread in this page
    const postCounts = await Database.from('posts')
          .whereIn('thread_id', threadIds)
          .groupBy('thread_id')
          .orderByRaw(`field (thread_id, ${threadIdString})`)
          .select('thread_id')
          .count()

    // Select the latest post for each thread id. Results are ordered according to the Threads fetched earlier
    const subquery = 'select `thread_id`, max(`created_at`) created_at from `posts` where `thread_id` in (' +
          threadIdString + '' +
          ') group by `thread_id` order by field (`thread_id`, ' +
          threadIdString + ')'

    const latestPosts = await Post.query()
          .joinRaw('join (' + subquery + ') posts2 on posts.thread_id = posts2.thread_id and posts.created_at = posts2.created_at')
          .orderByRaw(`field (posts.thread_id, ${threadIdString})`)
          .with('user')
          .fetch()

    const latestPostsJson = latestPosts.toJSON()

    json.data.forEach((thread, index) => {
      thread.latest_post = latestPostsJson[index]
      thread.post_count = postCounts[index]['count(*)']
    })
  }

  return json
}

class ThreadController {
  async index ({request, view}) {
    const categoryIds = await request.permissions.getCategoryIds()
    const page = parseInt(request.input('page', 1), 10)

    const threads = await getThreads(page, (query) => {
      return query.whereIn('category_id', categoryIds)
    })

    return view.render('thread.index', {
      threads: threads
    })
  }

  async category ({request, params, view, response}) {
    const categoryIds = await request.permissions.getCategoryIds()
    const page = parseInt(request.input('page', 1), 10)

    const category = await Category.query()
      .where('slug', params.id)
      .whereIn('id', categoryIds)
      .first()

    if (category) {
      const threads = await getThreads(page, (query) => {
        return query.where('category_id', category.id)
      })

      return view.render('thread.index', {
        category: category.toJSON(),
        threads: threads
      })
    } else {
      response.route('404', 404)
    }
  }

  async view ({view, params, request, response}) {
    const thread = await Thread.query()
        .where('id', params.id)
        .whereIn('category_id', await request.permissions.getCategoryIds())
        .with('category')
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
        .paginate(page, 15)

    return view.render('thread.view', {
      thread: thread.toJSON(),
      posts: posts.toJSON()
    })
  }

  async new ({request, view}) {
    const categories = await request.permissions.getCategories()

    return view.render('thread.edit', {
      categories: ViewUtil.objectToSelectOptions(categories.toJSON(), 'id', 'name')
    })
  }

  async edit ({request, params, view, response}) {
    const categories = await request.permissions.getCategories()

    const thread = await Thread.query()
        .where('id', params.id)
        .whereIn('category_id', await request.permissions.getCategoryIds())
        .first()

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
