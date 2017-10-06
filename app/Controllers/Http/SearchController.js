const Thread = use('App/Models/Thread')
const Post = use('App/Models/Post')
const User = use('App/Models/User')

class SearchController {
  async search ({params, request, view}) {
    const query = request.input('query', '')

    const page = parseInt((params.page || 1), 10)
    const type = params.id || 'discussions'

    let results = []

    if (query !== '') {
      if (type === 'discussions' || type === 'all') {
        const threads = await Thread.query()
                .where('title', 'like', `%${query}%`)
                .whereIn('category_id', await request.permissions.getCategoryIds())
                .paginate(page, 10)

        results = threads.toJSON()
      }

      if (type === 'posts' || type === 'all') {
        const posts = await Post.query()
                .where('posts.content', 'like', `%${query}%`)
                .innerJoin('threads', 'thread_id', 'threads.id')
                .whereIn('threads.category_id', await request.permissions.getCategoryIds())
                .with('thread')
                .with('user')
                .select('posts.*')
                .paginate(page, 10)

        results = posts.toJSON()
      }

      if (type === 'users' || type === 'all') {
        const users = await User.query()
                .where('name', 'like', `%${query}%`)
                .paginate(page, 10)

        results = users.toJSON()
      }
    }

    return view.render('search.results', {
      results: results,
      query: query,
      type: type
    })
  }
}

module.exports = SearchController
