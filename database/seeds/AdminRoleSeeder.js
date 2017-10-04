'use strict'

const Permission = use('App/Models/Permission')
const Role = use('App/Models/Role')

class AdminRoleSeeder {
  async run () {
    const adminRole = await Role.create({ name: 'Admin' })

    const threadEditAllPermission = await Permission.create({
      action: 'edit',
      model: 'thread',
      all: true
    })

    const postEditAllPermission = await Permission.create({
      action: 'edit',
      model: 'post',
      all: true
    })

    threadEditAllPermission.role().associate(adminRole)
    postEditAllPermission.role().associate(adminRole)
  }
}

module.exports = AdminRoleSeeder
