const Permission = use('App/Models/Permission')
const Role = use('App/Models/Role')

class UserRoleSeeder {
  async run () {
    const userRole = await Role.create({name: 'User'})

    const threadEditPermission = await Permission.create({
      action: 'edit',
      model: 'thread',
      all: false
    })

    const postEditPermission = await Permission.create({
      action: 'edit',
      model: 'post',
      all: false
    })

    threadEditPermission.role().associate(userRole)
    postEditPermission.role().associate(userRole)
  }
}

module.exports = UserRoleSeeder
