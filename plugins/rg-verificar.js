import db from '../lib/database.js'
import fs from 'fs'
import PhoneNumber from 'awesome-phonenumber'
import { createHash } from 'crypto'  
import fetch from 'node-fetch'

let Reg = /^(.+)[.|]\s*([0-9]+)$/i

let handler = async function (m, { conn, text, usedPrefix, command }) {
  let user = global.db.data.users[m.sender]
  let name2 = (await conn.getName(m.sender)) || 'MikuFan'
  let channel = 'https://whatsapp.com/channel/0029VajYamSIHphMAl3ABi1o'
  let mikuImg = 'https://i.postimg.cc/QCzMhBR1/1757986334220.png'

  if (user.registered === true) return m.reply(
    `🌟 *¡Ya estás registrado en el mundo de Hatsune Miku!* 🌟\n\n💙 Si quieres eliminar tu registro, usa:\n*${usedPrefix}unreg*`
  )

  if (!Reg.test(text)) return m.reply(
    `🌸 *Registro Miku* 🌸\n\n*Formato correcto:*\n${usedPrefix + command} nombre.edad\n\n*Ejemplo:*\n${usedPrefix + command} ${name2}.18\n\n¡Haz tu registro para recibir tu tarjeta Miku!`
  )

  let [_, name, age] = text.match(Reg)
  if (!name) return m.reply('🌸 El nombre no puede estar vacío. Intenta de nuevo.')
  if (!age) return m.reply('🌸 La edad no puede estar vacía. Intenta de nuevo.')
  if (name.length >= 30) return m.reply('🌸 El nombre es muy largo. Usa menos de 30 caracteres.')
  age = parseInt(age)
  if (age > 100) return m.reply('🌸 ¡Esa edad es demasiado alta! Usa una edad real.')
  if (age < 10) return m.reply('🌸 ¡Eres muy peque para usar el bot!')

  user.name = name.trim() + ' ✨'
  user.age = age
  user.regTime = +new Date
  user.registered = true
  user.coin = (user.coin || 0) + 39
  user.exp = (user.exp || 0) + 300
  user.joincount = (user.joincount || 0) + 20

  let sn = createHash('md5').update(m.sender).digest('hex').slice(0, 20)

  let regbot = `\n🌟 *¡REGISTRO MIKU EXITOSO!* 🌟\n\n👤 *Nombre:* ${name}\n🎂 *Edad:* ${age} años\n🆔 *ID:* ${sn}\n\n💙 *¡Bienvenido/a al universo de Hatsune Miku!* 💙\n\n🎁 *Recompensas iniciales:*\n💰 +39 monedas\n✨ +300 XP\n🎟️ +20 tickets\n`

  await m.react('💙')

  
  let thumbBuffer = null
  try {
    const res = await fetch(mikuImg)
    thumbBuffer = Buffer.from(await res.arrayBuffer())
  } catch {}

  await conn.sendMessage(m.chat, {
    text: regbot,
    contextInfo: {
      externalAdReply: {
        title: '🌸 Registro en Hatsune Miku Bot 🌸',
        body: '¡Tu tarjeta Miku está lista! 🎤',
        thumbnail: thumbBuffer,
        sourceUrl: channel,
        mediaType: 1,
        showAdAttribution: true,
        renderLargerThumbnail: true
      }
    }
  }, { quoted: m })
}

handler.help = ['reg']
handler.tags = ['rg']
handler.command = ['verify', 'verificar', 'reg', 'register', 'registrar']

export default handler


