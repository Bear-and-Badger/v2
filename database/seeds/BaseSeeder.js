const Permission = use('App/Models/Permission')
const Category = use('App/Models/Category')
const Role = use('App/Models/Role')

// The set of permissions assigned to all users
const commonPermissions = {
  edit: ['thread', 'post', 'user'],
  delete: ['thread', 'post']
}

// The set of permissions assigned to admins only
const adminPermissions = {
  delete: ['user'],
  sticky: ['thread']
}

// List of default categories
const categorySet = [
    { name: 'Games', public: true, visitor: true },
    { name: 'Off topic', public: true, visitor: true },
    { name: 'Forum Talk', public: true, visitor: false },
    { name: 'Inner Sanctum', public: false, visitor: false }
]

class BaseSeeder {
  async run () {
    const visitorRole = await Role.create({name: 'Visitor'})
    const adminRole = await Role.create({name: 'Admin'})
    const userRole = await Role.create({name: 'User'})

    await assignPermissions(adminRole, adminPermissions, true)
    await assignPermissions(adminRole, commonPermissions, true)
    await assignPermissions(userRole, commonPermissions, false)

    // Create categories and assign to roles
    categorySet.forEach(async (spec) => {
      const category = await Category.create({ name: spec.name })
      category.roles().save(adminRole)

      if (spec.public) {
        category.roles().save(userRole)
      }

      if (spec.visitor) {
        category.roles().save(visitorRole)
      }
    })
  }
}

async function assignPermissions (role, permissionSet, forAll) {
  Object.keys(permissionSet).forEach(async (actionName) => {
    permissionSet[actionName].forEach(async (modelName) => {
      const permission = await Permission.create({
        action: actionName,
        model: modelName,
        all: forAll
      })

      await role.permissions().save(permission)
    })
  })
}

module.exports = BaseSeeder
