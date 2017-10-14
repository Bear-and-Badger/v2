const Model = use('Model')

class LastReadPost extends Model {
    static get createdAtColumn () {
        return null
    }

    static get updatedAtColumn () {
        return null
    }
}

module.exports = LastReadPost
