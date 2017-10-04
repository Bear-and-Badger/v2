'use strict'

const PermissionUtil = use('App/Helpers/PermissionUtil')
const View = use('View')

const DEFAULT_RESPONSE = function () {
  return false
}

class Permissions {
  async handle ({auth}, next) {
    try {
      const user = await auth.getUser()
      const checker = await PermissionUtil.createChecker(user)

      View.global('hasPermission', checker)
      View.global('currentUser', user)
    } catch (e) {
      View.global('currentUser', undefined)
      View.global('hasPermission', DEFAULT_RESPONSE)
    }
    return next()
  }
}

module.exports = Permissions
