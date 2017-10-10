const ModelUtil = use('App/Helpers/ModelUtil')

const Message = use('App/Models/Message')
const User = use('App/Models/User')
const Chat = use('App/Models/Chat')

class ChatController {
  async inbox ({view, auth}) {
    const chats = await Chat.query()
        .with('users')
        .whereHas('users', (builder) => {
          builder.where('users.id', auth.user.id)
        })
        .orderBy('created_at', 'desc')
        .fetch()

    const json = chats.toJSON()
    const chatIdString = json.map((chat) => chat.id).join(', ')

      // Select the latest message for each chat id. Results are ordered according to the Chats fetched earlier
    const subquery = 'select `chat_id`, max(`created_at`) created_at from `messages` where `chat_id` in (' +
          chatIdString + '' +
          ') group by `chat_id` order by field (`chat_id`, ' +
          chatIdString + ')'

    const latestMessages = await Message.query()
          .joinRaw('join (' + subquery + ') messages2 on messages.chat_id = messages2.chat_id and messages.created_at = messages2.created_at')
          .orderByRaw(`field (messages.chat_id, ${chatIdString})`)
          .with('user')
          .fetch()

    const latestMessagesJson = latestMessages.toJSON()

    json.forEach((chat, i) => {
      chat.latest_message = latestMessagesJson[i]
    })

    return view.render('user.inbox', {
      chats: json
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
