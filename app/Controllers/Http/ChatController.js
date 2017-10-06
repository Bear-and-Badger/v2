const ModelUtil = use('App/Helpers/ModelUtil')

const Message = use('App/Models/Message')
const User = use('App/Models/User')
const Chat = use('App/Models/Chat')

class ChatController {
  async inbox ({view, auth}) {
    const chats = await Chat.query()
        .with('user')
        .whereHas('users', (builder) => {
          builder.where('users.id', auth.user.id)
        })
        .orderBy('created_at', 'desc')
        .fetch()

    return view.render('user.inbox', {
      chats: chats.toJSON()
    })
  }

  async chat ({params, view}) {
    const chat = await Chat.query()
            .where('id', params.id)
            .with('users')
            .with('messages')
            .with('messages.user')
            .first()

    return view.render('user.chat', {
      chat: chat.toJSON()
    })
  }

  async create ({params, view}) {
    let user

    if (params.recipient) {
      user = await User.findBy('name', params.recipient)
    }

    return view.render('chat.create', {
      recipient: user
    })
  }

  async store ({request, response, auth, session}) {
    const recipients = request.input('recipients', '').split(',')

    const chat = await Chat.create({
      user_id: auth.user.id
    })

    await chat.users().save(auth.getUser())

    recipients.forEach(async (name) => {
      const recipient = await User.findBy('name', name.trim())
      await chat.users().save(recipient)
    })

    const data = request.only(['content'])

    const rules = {
      content: 'required'
    }

    await ModelUtil.save(Message, data, rules, async (errors) => {
      session.put('content', data.content)

      session.withErrors(errors)
             .flashAll()

      response.redirect('back')
    }, async (message) => {
      message.user_id = auth.user.id
      message.chat_id = chat.id
    }, async (message) => {
      response.route('chat', {id: chat.id})
    })
  }

  async reply ({request, response, auth, session}) {
    const data = request.only(['chat_id', 'content'])

    const rules = {
      content: 'required'
    }

    await ModelUtil.save(Message, data, rules, async (errors) => {
      session.put('content', data.content)

      session.withErrors(errors)
                .flashAll()

      response.redirect('back')
    }, async (message) => {
      message.user_id = auth.user.id
    }, async (message) => {
      response.route('chat', {id: message.chat_id})
    })
  }
}

module.exports = ChatController
