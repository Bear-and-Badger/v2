'use strict'

const Validator = use('Validator')
const User = use('App/Models/User')
const Role = use('App/Models/Role')
const Post = use('App/Models/Post')

class UserController {
  async logout ({auth, response}) {
    await auth.logout()

    response.redirect('home')
  }

  async login ({request, response, auth, session}) {
    const data = request.only(['email', 'password'])

    const rules = {
      email: 'required|email',
      password: 'required'
    }

    const validation = await Validator.validate(data, rules)

    session.put('email', data.email)

    if (validation.fails()) {
      session.withErrors(validation.messages())
             .flashAll()

      response.redirect('back')
    } else {
      try {
        await auth.attempt(data.email, data.password)
        response.redirect(session.get('prev', 'profile'))
      } catch (e) {
        session.withErrors([e])
               .flashAll()

        response.redirect('back')
      }
    }
  }

  async signup ({request, auth, session, response}) {
    const data = request.only(['name', 'email', 'password'])
    const validation = await Validator.validate(data, User.rules)

    if (validation.fails()) {
      session.withErrors(validation.messages())
             .flashAll()

      response.redirect('back')
    } else {
      const userRole = await Role.query().where('name', 'User')
      const user = await User.create(data)

      user.role().associate(userRole[0])

      await auth.attempt(data.email, data.password)

      response.redirect('home')
    }
  }

  async profile ({request, params, auth, view}) {
    let user

    if (params.id) {
      user = await User.find(params.id)
    } else {
      user = auth.user
    }

    const page = parseInt((params.page || 1))

    const posts = await Post.query()
        .with('thread')
        .where('user_id', user.id)
        .orderBy('created_at', 'desc')
        .paginate(page, 2)

    return view.render('user.profile', {
      user: user.toJSON(),
      posts: posts.toJSON()
    })
  }
}

module.exports = UserController
