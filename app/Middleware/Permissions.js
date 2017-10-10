'use strict'

const PermissionUtil = use('App/Helpers/PermissionUtil')
const Bookmark = use('App/Models/Bookmark')
const Role = use('App/Models/Role')
const View = use('View')

const moment = require('moment')

const DEFAULT_RESPONSE = function () {
  return false
}

class PermissionContext {
  constructor (user, role) {
    this.user = user
    this.role = role
  }

  async getCategories () {
    return this.role.categories().orderBy('name', 'asc').fetch()
  }

  async getCategoryIds () {
    const categories = await this.getCategories()
    return categories.toJSON().map((category) => { return category.id })
  }
}

class Permissions {
  async handle ({request, auth}, next) {
    try {
      const user = await auth.getUser()
      const checker = await PermissionUtil.createChecker(user)

      const bookmarks = await Bookmark.query()
        .where('user_id', user.id)
        .with('thread')
        .fetch()

      View.global('hasPermission', checker)
      View.global('currentUser', user.toJSON())
      View.global('bookmarks', bookmarks.toJSON())

      user.last_online = moment().format('YYYY-MM-DD HH:mm:ss')
      user.save()

      request.permissions = new PermissionContext(user, await user.role().fetch())
    } catch (e) {
      View.global('currentUser', undefined)
      View.global('hasPermission', DEFAULT_RESPONSE)
      View.global('bookmarks', [])

      request.permissions = new PermissionContext(null, await Role.findBy('name', 'Visitor'))
    }

    const categories = await request.permissions.getCategories()

    View.global('page_categories', categories.toJSON())

    return next()
  }
}

module.exports = Permissions
