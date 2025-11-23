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

    const canalUrl = 'https://whatsapp.com/channel/0029VajYamSIHphMAl3ABi1o'
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
            const defaultResponse = await fetch('https://files.catbox.moe/l8qiik.jpeg')
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
        const welcomeText = `👋 *@${userName} HA INGRESADO AL CAMPO*

╭─⊷ *BLUE LOCK PROTOCOL*
│• 🎯 *OBJETIVO:* Ser el mejor
│• 🔥 *EGO:* ${groupSize} contendientes
│• ⚽ *META:* Evolucionar o ser eliminado
╰─

¿Qué debes hacer para dominar este espacio?

*OBSERVA. ANALIZA. DEVORA.* 

Aquí no hay lugar para mediocres. Solo aquellos con hambre de superación sobreviven.

╭─⊷ *DIRECTRICES*
│• 🧠 Usa *#help* para conocer las herramientas
│• 🔥 Tu ego es tu arma más poderosa
│• ⚡ Visualiza tu jugada perfecta
╰─

*EL PARTIDO HA COMENZADO. DEMUESTRA QUE TU "YO" FUTURO ES MÁS FUERTE.*` @${userName}!

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
        const byeText = `👋 *@${userName} HA SIDO ELIMINADO*

╭─⊷ *BLUE LOCK ASSESSMENT*
│• ❌ *STATUS:* No superó el corte
│• 🔄 *MOTIVO:* Falta de evolución
│• 📉 *RESULTADO:* Abandona el proyecto
╰─

No pudiste adaptarte. No supiste devorar a tus rivales.

En Blue Lock, solo los más fuertes sobreviven. Quizás en otro campo encuentres tu respuesta.

*HAS FALLADO EN CONVERTIRTE EN LA PIEZA DEFINITIVA.*

⚽️ *Recuerda:* El fútbol es egoísmo. Quien no marca goles, no gana.`

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
