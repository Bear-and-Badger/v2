'use strict'

class CheckUser {
  async handle ({request, response, auth, session}, next) {
    const user = await auth.check()

    if (user) {
      request.user = auth.getUser()
      await next()
    } else {
      session.put('prev', request.originalUrl())
      response.redirect('/login')
    }
  }
}

module.exports = CheckUser
