'use strict'

const ModelUtil = use('App/Helpers/ModelUtil')
const Post = use('App/Models/Post')

class PostController {
  async new ({request, view}) {
    const id = request.param('thread')

    return view.render('post.edit', {
      thread_id: id
    })
  }

  async edit ({request, view}) {
    const post = await Post.find(request.param('id'))

    return view.render('post.edit', {
      post: post.toJSON()
    })
  }

  async save ({request, response}) {
    const data = request.only('id', 'content', 'thread_id')

    const rules = {
      content: 'required'
    }

    if (data.thread_id) {
      rules.thread_id = 'required'
    }

    await ModelUtil.save(Post, data, rules, async (errors) => {
      await request.withOnly('id', 'content', 'thread_id')
                .andWith({
                  errors: errors
                })
                .flash()

      response.redirect('back')
    }, async (post) => {
      if (post.isNew()) {
        post.user_id = request.user.id
      }
    }, async (post) => {
      response.route('discussion', {id: post.thread_id, page: 1})
    })
  }
}

module.exports = PostController
