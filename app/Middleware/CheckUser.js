'use strict'

class CheckUser {
  async handle ({request, response, auth, session}, next) {
    try {
      await auth.check()
      return next()
    } catch (e) {
      session.put('prev', request.originalUrl())
      response.redirect('/login')
    }
  }
}

module.exports = CheckUser
