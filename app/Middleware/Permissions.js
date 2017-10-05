'use strict'

const PermissionUtil = use('App/Helpers/PermissionUtil')
const Role = use('App/Models/Role')
const View = use('View')

const DEFAULT_RESPONSE = function () {
  return false
}

class Permissions {
  async handle ({request, auth}, next) {
    try {
      const user = await auth.getUser()
      const checker = await PermissionUtil.createChecker(user)

      View.global('hasPermission', checker)
      View.global('currentUser', user)

      request.currentRole = await user.role().fetch()
    } catch (e) {
      View.global('currentUser', undefined)
      View.global('hasPermission', DEFAULT_RESPONSE)

      request.currentRole = await Role.findBy('name', 'Visitor')
    }

    return next()
  }
}

module.exports = Permissions
