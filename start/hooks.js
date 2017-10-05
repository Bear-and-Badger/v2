global.window = undefined

const { hooks } = require('@adonisjs/ignitor')
const XBBCode = require('xbbcode')

const bbcodeFilter = XBBCode.create({
  b: '<strong>{content}</strong>',
  i: '<em>{content}</em>',
  u: '<u>{content}</u>',
  code: '<code>{content}</code>',
  img: '<img src="{source}" alt="Image({source}" />',
  size: tag => `<span style="font-size: ${tag.getOption()}%">${tag.getContent()}</span>`,
  url: tag => `<a href="${tag.getOption()}" target="_blank">${tag.getContent()}</a>`,
  color: tag => `<span style="color: ${tag.getOption()}">${tag.getContent()}</span>`,
  table: '<table class="table table-striped">{content}</table>',
  tr: '<tr>{content}</tr>',
  td: '<td>{content}</td>',
  left: '<span style="text-align: left">{content}</span>',
  center: '<span style="text-align: center">{content}</span>',
  right: '<span style="text-align: right">{content}</span>'
})

hooks.after.providersBooted(() => {
  const View = use('View')

  View.global('linkTo', function (route, name, params) {
    const routeTo = this.resolve('route')
    return this.safe(`<a href="${routeTo(route, params)}"> ${name} </a>`)
  })

  View.global('bbcode', function (content) {
    return this.safe(bbcodeFilter(content).replace(/(?:\r\n|\r|\n)/g, '<br />'))
  })
})
