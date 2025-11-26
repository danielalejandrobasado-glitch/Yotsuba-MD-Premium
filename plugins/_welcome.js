import fetch from 'node-fetch'

export async function before(m, { conn, participants, groupMetadata }) {
  try {
    if (!m.isGroup) return true
    if (!m.messageStubType) return true

    if (!global.db) global.db = { data: { chats: {} } }
    if (!global.db.data) global.db.data = { chats: {} }
    if (!global.db.data.chats) global.db.data.chats = {}
    if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}

    const chat = global.db.data.chats[m.chat]
    
    if (chat.welcome === undefined) {
      chat.welcome = true
    }
    if (chat.welcome === false && chat.welcome !== true) {
      chat.welcome = true
    }
    
    console.log(`🔍 Estado welcome para ${m.chat}:`, chat.welcome)
    
    if (!chat.welcome) {
      console.log('❌ Welcome desactivado, saltando...')
      return true
    }

    const canalUrl = 'https://whatsapp.com/channel/0029Vb73g1r1NCrTbefbFQ2T'
    const groupSize = (participants || []).length

    const sendSingleWelcome = async (jid, text, user, quoted) => {
      try {
        let ppBuffer = null
        try {
          const ppUrl = await conn.profilePictureUrl(user, 'image').catch(() => null)
          if (ppUrl) {
            const response = await fetch(ppUrl)
            ppBuffer = await response.buffer()
          }
        } catch (e) {
          console.log('Error obteniendo foto de perfil:', e)
        }

        if (!ppBuffer) {
          try {
            const defaultResponse = await fetch('https://files.catbox.moe/ckanyi.jpg')
            ppBuffer = await defaultResponse.buffer()
          } catch (e) {
            ppBuffer = null
          }
        }

        console.log('📤 Enviando welcome con imagen ampliada y botón de canal...')
        
        const buttons = []
        const urls = [['⚽️ Ver Canal', canalUrl]]
        
        await conn.sendNCarousel(jid, text, '⚽️ Isagi Yoichi Bot', ppBuffer, buttons, null, urls, null, quoted, [user], { width: 1024, height: 1024 })

      } catch (err) {
        console.log('sendSingleWelcome error:', err)
        return await conn.reply(jid, `${text}\n\n⚽️ *Ver Canal:* ${canalUrl}`, quoted, { mentions: [user] })
      }
    }

    if (m.messageStubType === 27) {
      console.log('🎉 Nuevo usuario detectado (tipo 27)')
      
      const users = m.messageStubParameters || []
      if (users.length === 0) {
        console.log('⚠️ No hay usuarios en messageStubParameters')
        return true
      }
      
      for (const user of users) {
        if (!user) continue
        
        const userName = user.split('@')[0]
        const welcomeText = `👋 ¡Hola @${userName}!

🎉Bienvenido a *${groupMetadata?.subject || 'el grupo'}*

🔥Somos *${groupSize}* miembros

⚽️${global.welcom1 || 'El futbol nos une'}

📝Ayuda: *#help*

🏆Únete a nuestro canal oficial`

        await sendSingleWelcome(m.chat, welcomeText, user, m)
        console.log(`✅ Welcome enviado a ${userName}`)
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
      return true
    }

    if (m.messageStubType === 28 || m.messageStubType === 32) {
      console.log(`👋 Usuario salió (tipo ${m.messageStubType})`)
      
      const users = m.messageStubParameters || []
      if (users.length === 0) return true
      
      for (const user of users) {
        if (!user) continue
        
        const userName = user.split('@')[0]
        const byeText = `👋 ¡Hasta luego @${userName}!

😢Te extrañaremos en *${groupMetadata?.subject || 'el grupo'}*

🔥${global.welcom2 || 'Gracias por ser parte de la comunidad'}

⚽️Síguenos en nuestro canal oficial🏆`

        await sendSingleWelcome(m.chat, byeText, user, m)
        console.log(`✅ Goodbye enviado a ${userName}`)
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
      return true
    }

    return true
  } catch (e) {
    console.error('plugins/_welcome error', e)
    return true
  }
}