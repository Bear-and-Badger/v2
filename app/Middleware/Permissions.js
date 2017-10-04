'use strict'

const PermissionUtil = use('App/Helpers/PermissionUtil')
const View = use('View')

const DEFAULT_RESPONSE = function () {
  return false
}

class Permissions {
  async handle ({auth}, next) {
    if (auth.user) {
      const checker = await PermissionUtil.createChecker(auth.user)
      View.global('hasPermission', checker)
      View.global('currentUser', auth.user)
    } else {
      View.global('hasPermission', DEFAULT_RESPONSE)
    }

    await next()
  }
}

module.exports = Permissions
