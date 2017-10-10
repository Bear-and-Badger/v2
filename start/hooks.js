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

  View.global('linkTo', function (route, name, params, cssClass) {
    const routeTo = this.resolve('route')
    return this.safe(`<a href="${routeTo(route, params)}" class="${cssClass}"> ${name} </a>`)
  })

  View.global('bbcode', function (content) {
    return this.safe(bbcodeFilter(content || '').replace(/(?:\r\n|\r|\n)/g, '<br />'))
  })

  View.global('eq', function (a, b, success, failure) {
    return a === b ? success : failure
  })

  View.global('min', Math.min)
  View.global('max', Math.max)

  View.global('postCount', function (index, counts) {
    const count = counts[index]['count(*)'] || 0
    let suffix = ''

    if (count !== 1) {
      suffix = 's'
    }

    return count + ' post' + suffix
  })

  View.global('postFor', function (index, posts) {
    return posts[index]
  })

  View.global('isBookmarked', function (threadID, bookmarks) {
    for (let i = 0; i < bookmarks.length; ++i) {
      if (bookmarks[i].thread_id === threadID) {
        return true
      }
    }

    return false
  })
})
