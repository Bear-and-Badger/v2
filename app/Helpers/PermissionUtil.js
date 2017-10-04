'use strict'

const PermissionUtil = module.exports = {}

const checkForUser = function (action, model, owner, user, permissions) {
  let allowed = false

  permissions.forEach(function (permission) {
    if (permission.action === action &&
            permission.model === model &&
            (permission.all || owner === user)) {
      allowed = true
    }
  })

  return allowed
}

PermissionUtil.check = async (action, model, owner, user) => {
  const permissions = await user.permissions()

  return checkForUser(action, model, owner, user.id, permissions)
}

PermissionUtil.createChecker = async (user) => {
  const permissions = await user.permissions()

  return function (action, model, owner) {
    return checkForUser(action, model, owner, user.id, permissions)
  }
}
