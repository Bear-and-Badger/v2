'use strict'

const ViewUtil = module.exports = {}

ViewUtil.objectToSelectOptions = function (objects, valKey, textKey) {
  const options = {}

  objects.forEach(function (obj) {
    options[obj[valKey]] = obj[textKey]
  })

  return options
}
