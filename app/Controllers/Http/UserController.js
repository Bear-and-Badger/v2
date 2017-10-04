'use strict'

const Validator = use('Validator')
const User = use('App/Models/User')
const Role = use('App/Models/Role')

class UserController {
  async logout ({auth, response}) {
    await auth.logout()

    response.redirect('/')
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
      const userRole = await Role.query().where('name', '=', 'User').fetch()
      const user = await User.create(data)

      user.roles().save(userRole)

      await auth.attempt(data.email, data.password)

      response.redirect('profile')
    }
  }

  async profile ({auth, view}) {
    const user = await auth.user

    return view.render('user.profile', {
      user: user
    })
  }
}

module.exports = UserController
