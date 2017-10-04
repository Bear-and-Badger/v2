'use strict'

const Permission = use('App/Models/Permission')
const Category = use('App/Models/Category')
const User = use('App/Models/User')
const Role = use('App/Models/Role')

class BaseSeeder {
  async run () {
    Category.create({ name: 'Games' })
    Category.create({ name: 'Off topic' })
    Category.create({ name: 'Forum talk' })

    const threadEditPermission = await Permission.create({
      action: 'edit',
      model: 'thread',
      all: true
    })

    const adminRole = await Role.create({ name: 'Admin' })

    threadEditPermission.role().associate(adminRole)

    const admin = await User.create({
      name: 'admin',
      email: 'admin@bearandbadger.co.uk',
      password: 'password'
    })

    admin.roles().save(adminRole)
  }
}

module.exports = BaseSeeder
