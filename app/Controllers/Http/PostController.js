'use strict'

const ModelUtil = use('App/Helpers/ModelUtil')
const Post = use('App/Models/Post')

class PostController {
  async new ({params, view}) {
    return view.render('post.edit', {
      thread_id: params.thread
    })
  }

  async edit ({params, view}) {
    const post = await Post.find(params.id)

    return view.render('post.edit', {
      post: post.toJSON()
    })
  }

  async save ({request, response, auth, session}) {
    const data = request.only(['id', 'content', 'thread_id'])

    const rules = {
      content: 'required'
    }

    await ModelUtil.save(Post, data, rules, async (errors) => {
      session.put('id', data.id)
      session.put('content', data.content)
      session.put('thread_id', data.thread_id)

      session.withErrors(errors)
            .flashAll()

      response.redirect('back')
    }, async (post) => {
      post.user_id = auth.user.id
    }, async (post) => {
      response.route('discussion', {id: post.thread_id, page: 1})
    })
  }
}

module.exports = PostController
