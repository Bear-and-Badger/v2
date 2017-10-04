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
ModelUtil.save = async (Model, data, rules, failure, preSave, postSave) => {
  const validation = await Validator.validate(data, rules)

  if (validation.fails()) {
    return failure(validation.messages())
  }

  let instance

  if (data.id) {
    instance = await Model.find(data.id)

    if (!instance) {
      return failure([new Error('Unable to find instance for id: ' + data.id)])
    }
  } else {
    instance = new Model()
  }

  delete data.id

  Object.keys(data).forEach(function (key) {
    instance[key] = data[key]
  })

  await preSave(instance)

  await instance.save()

  await postSave(instance)
}
