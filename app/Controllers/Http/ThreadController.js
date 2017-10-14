'use strict'

const knex = require('knex')

const ModelUtil = use('App/Helpers/ModelUtil')
const ViewUtil = use('App/Helpers/ViewUtil')

const LastReadPost = use('App/Models/LastReadPost')
const Category = use('App/Models/Category')
const Bookmark = use('App/Models/Bookmark')
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

    const lastRead = await LastReadPost.query()
        .whereIn('thread_id', threadIds)
        .fetch()

    const lastReadMap = lastRead.toJSON().reduce((map, value) => {
      map[value.thread_id] = value
      return map
    }, {})

    const latestPostsJson = latestPosts.toJSON()

    let index = 0

    json.data.forEach((thread) => {
      // Latest posts only contain values for threads with at least one post, so only assign field & increment index
      // if this is true. Latest posts results will be in the same order as the threads, so we can safely iterate
      if (thread.post_count) {
        thread.latest_post = latestPostsJson[index++]
      }

      thread.last_read = lastReadMap[thread.id] || { page: 1 }
    })
  }

  return json
}

class ThreadController {
  async index ({auth, request, view}) {
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

  async view ({view, auth, params, request, response}) {
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

    const postJson = posts.toJSON()

    const lastPost = postJson.data[postJson.data.length - 1]

    const lastRead = await LastReadPost.query()
        .where('thread_id', '=', thread.id)
        .where('user_id', '=', auth.user.id)
        .first()

    if (lastRead) {
      if (lastRead.post_id < lastPost.id) {
        lastRead.post_id = lastPost.id
        lastRead.page = page

        await lastRead.save()
      }
    } else if (page > 1) {
      await LastReadPost.create({
        thread_id: thread.id,
        user_id: auth.user.id,
        post_id: lastPost.id,
        page: page
      })
    }

    return view.render('thread.view', {
      thread: thread.toJSON(),
      posts: postJson
    })
  }

  async bookmark ({auth, params, response}) {
    await Bookmark.create({
      thread_id: params.id,
      user_id: auth.user.id
    })

    response.route('discussions')
  }

  async removeBookmark ({auth, params, response}) {
    await Bookmark.query()
          .where('user_id', auth.user.id)
          .where('thread_id', params.id)
          .delete()

    response.route('discussions')
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
