import { generateWAMessageFromContent } from '@whiskeysockets/baileys'
import * as fs from 'fs'

var handler = async (m, { conn, text, participants, isOwner, isAdmin }) => {

if (!m.quoted && !text) return conn.reply(m.chat, `🎤💙 Debes enviar un mensaje musical para notificar a todos los fanáticos del concierto ✨`, m)

try { 
  let users = participants.map(u => conn.decodeJid(u.id))
  let q = m.quoted ? m.quoted : m
  let c = m.quoted ? await m.getQuotedObj() : m.msg || m.text || m.sender
  
  
  let messageType = m.quoted ? q.mtype : 'extendedTextMessage'
  let content = m.quoted ? c.message[q.mtype] : { text: text || '' }
  
  let msg = conn.cMod(m.chat, generateWAMessageFromContent(m.chat, { 
    [messageType]: content 
  }, { 
    quoted: null, 
    userJid: conn.user.id 
  }), text || q.text, conn.user.jid, { mentions: users })
  
  await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })

} catch (error) {  
  console.log('Error en método principal, usando método alternativo:', error)

  let users = participants.map(u => conn.decodeJid(u.id))
  let quoted = m.quoted ? m.quoted : m
  let mime = (quoted.msg || quoted).mimetype || ''
  let isMedia = /image|video|sticker|audio/.test(mime)
  let more = String.fromCharCode(8206)
  let masss = more.repeat(850)
  let htextos = `${text ? text : "💙 *¡¡¡Konnichiwa fanáticos!!!* 💙\n\n✨ Hay un anuncio especial en nuestro concierto virtual ✨"}`
  
  if ((isMedia && quoted.mtype === 'imageMessage') && htextos) {
    var mediax = await quoted.download?.()
    conn.sendMessage(m.chat, { image: mediax, mentions: users, caption: htextos }, { quoted: null })
  } else if ((isMedia && quoted.mtype === 'videoMessage') && htextos) {
    var mediax = await quoted.download?.()
    conn.sendMessage(m.chat, { video: mediax, mentions: users, mimetype: 'video/mp4', caption: htextos }, { quoted: null })
  } else if ((isMedia && quoted.mtype === 'audioMessage') && htextos) {
    var mediax = await quoted.download?.()
    conn.sendMessage(m.chat, { audio: mediax, mentions: users, mimetype: 'audio/mp4', fileName: `Hidetag.mp3` }, { quoted: null })
  } else if ((isMedia && quoted.mtype === 'stickerMessage') && htextos) {
    var mediax = await quoted.download?.()
    conn.sendMessage(m.chat, {sticker: mediax, mentions: users}, { quoted: null })
  } else {
    await conn.sendMessage(m.chat, {
      text: `${masss}\n${htextos}\n`, 
      mentions: users
    }, { quoted: null })
  }
}
}
handler.help = ['hidetag']
handler.tags = ['grupo']
handler.command = ['hidetag', 'notificar', 'notify', 'tag']
handler.group = true
handler.admin = true

export default handler

