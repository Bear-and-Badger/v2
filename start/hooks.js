const { hooks } = require('@adonisjs/ignitor')

hooks.after.providersBooted(() => {
  const View = use('View')

  View.global('linkTo', function (route, name, params) {
    const routeTo = this.resolve('route')
    return this.safe(`<a href="${routeTo(route, params)}"> ${name} </a>`)
  })
})
