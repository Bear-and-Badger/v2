'use strict'

const Validator = use('Validator')
const ModelUtil = module.exports = {}

/**
 * With provided data, either update or create an instance of the given model.
 * <P>
 * Rules may be provided to validate the data prior to update/creation.
 * <P>
 * Generator callbacks for failure, pre-save and post-save are used.
 */
ModelUtil.save = async (model, data, rules, failure, preSave, postSave) => {
  const validation = await Validator.validate(data, rules)

  if (validation.fails()) {
    return await failure(validation.messages())
  }

  let instance

  if (data.id) {
    instance = yield model.find(data.id)

    if (!instance) {
      return yield failure([new Error('Unable to find instance for id: ' + data.id)])
    }
  } else {
    instance = new model()
  }

  delete data.id

  Object.keys(data).forEach(function (key) {
    instance[key] = data[key]
  })

  yield preSave(instance)

  yield instance.save()

  yield postSave(instance)
}
