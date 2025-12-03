const handler = async (m, { conn, usedPrefix, command, args }) => {

  if (command && command.includes('menu')) {
    console.log('🔍 DEBUG MENU:', {
      command: command,
      text: m.text,
      message: Object.keys(m.message || {})
    })
  }

  let userId = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
  let user = global.db.data.users[userId]
  let name = conn.getName(userId)
  let _uptime = process.uptime() * 1000
  let uptime = clockString(_uptime)
  let totalreg = Object.keys(global.db.data.users).length
  let totalCommands = Object.values(global.plugins).filter((v) => v.help && v.tags).length

  usedPrefix = '.'

  const menuCommand = command || ''

  const BLUELOCK_VIDEO = "https://files.catbox.moe/svtosy.mp4"

  const frameTop = `╔════════════════════════════════════╗`
  const frameMid = `╠════════════════════════════════════╣`
  const frameBot = `╚════════════════════════════════════╝`

  if (menuCommand === 'menu' || menuCommand === 'menú' || menuCommand === 'help') {

    const buttons = [
      ['🔵 Descargas', 'menu_descargas'],
      ['⚔️ Herramientas', 'menu_herramientas'],
      ['🔍 Buscadores', 'menu_buscadores'],
      ['🎮 Juegos', 'menu_juegos'],
      ['🎌 Anime', 'menu_anime'],
      ['👥 Grupos', 'menu_grupos'],
      ['ℹ️ Info', 'menu_info']
    ]

    const text = `${frameTop}
║ 🔵🔥 *BLUE LOCK – EGO SYSTEM* 🔥🔵      ║
${frameMid}
║ ⚽ *STRIKER:* @${userId.split('@')[0]}        ║
║ 🧠 *EGO:* ACTIVE                      ║
║ ⚡ *ROL:* ${(conn.user.jid == global.conn.user.jid ? 'TITULAR ⚡' : 'SUPLENTE 🔌')}     ║
║ ⏱️ *UPTIME:* ${uptime}                 ║
║ 👥 *REGISTROS:* ${totalreg}            ║
║ 📘 *SKILLS:* ${totalCommands}          ║
${frameBot}

🌀 *ELIGE TU ARMA STRIKER*
Categorías disponibles:`

    const footer = "🔵🔥 EGO: DESPIERTA TU ARMA STRIKER"

    try {
      return await conn.sendNCarousel(m.chat, text, footer, BLUELOCK_VIDEO, buttons, null, null, null, m)
    } catch {
      return await conn.sendMessage(m.chat, {
        text,
        footer,
        video: { url: BLUELOCK_VIDEO },
        gifPlayback: true,
        templateButtons: buttons.map((b, i) => ({
          index: i + 1,
          quickReplyButton: { displayText: b[0], id: b[1] }
        }))
      }, { quoted: m })
    }
  }

  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //              DESCARGAS
  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if (menuCommand === 'menu_descargas') {

    const buttons = [['⬅️ Volver', 'menu']]

    const text = `${frameTop}
║ 🔵 *BLUE LOCK – DESCARGAS*            ║
${frameMid}
📥 *MÚSICA Y VIDEO*
.play  
.spotify  
.mp3  
.mp4  

📱 *REDES SOCIALES*
.tiktok  
.tiktokmp3 
.instagram  
.facebook  
.twitter  
.pinvideo  

📁 *ARCHIVOS*
.mediafire  
.mega  
.apk  
.gitclone  

🔞 *ADULTO*
.xnxxdl  
.xvideosdl  
${frameBot}
`

    try {
      return await conn.sendNCarousel(m.chat, text, "EGO – DESCARGAS", BLUELOCK_VIDEO, buttons, null, null, null, m)
    } catch {
      return await conn.sendMessage(m.chat, { text }, { quoted: m })
    }
  }

  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //             HERRAMIENTAS
  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if (menuCommand === 'menu_herramientas') {

    const buttons = [['⬅️ Volver', 'menu']]

    const text = `${frameTop}
║ 🔵 *BLUE LOCK – HERRAMIENTAS*         ║
${frameMid}
🌐 *WEB*
.clima  
.translate  
.google  
.wikipedia  
.ip  

🎨 *EDICIÓN*
.hd  
.s  
.toimg  
.emojimix  
.ttp  
.qc  

🔧 *CONVERTIDORES*
.tomp3  
.tovideo  
.togif  
.tourl  
.catbox  
.ibb  
.tts  

🕵️ *DETECCIÓN*
.shazam  
.whatmusic  
.detectar  
.letra  
${frameBot}
`

    try {
      return await conn.sendMessage(m.chat, {
        video: { url: BLUELOCK_VIDEO },
        caption: text,
        gifPlayback: true,
        footer: 'EGO – HERRAMIENTAS',
        templateButtons: buttons.map((b, i) => ({
          index: i + 1,
          quickReplyButton: { displayText: b[0], id: b[1] }
        }))
      }, { quoted: m })
    } catch {
      return await conn.sendMessage(m.chat, { text }, { quoted: m })
    }
  }

  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //              BUSCADORES
  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if (menuCommand === 'menu_buscadores') {

    const buttons = [['⬅️ Volver', 'menu']]

    const text = `${frameTop}
║ 🔵 *BLUE LOCK – BUSCADORES*           ║
${frameMid}
🌐 *GENERALES*
.google  
.wikipedia  
.yts  
.npmjs  
.githubsearch  

🎌 *ANIME*
.infoanime  
.cuevanasearch  
.tiktoksearch  

📸 *IMÁGENES*
.imagen  
.pinterest  

🔞 *ADULTO*
.pornhubsearch  
.xnxxsearch  
.xvideos  
.hentaisearch  
${frameBot}
`

    try {
      return await conn.sendNCarousel(m.chat, text, "EGO – BUSCADORES", BLUELOCK_VIDEO, buttons, null, null, null, m)
    } catch {
      return await conn.sendMessage(m.chat, { text }, { quoted: m })
    }
  }

  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //                JUEGOS
  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if (menuCommand === 'menu_juegos') {

    const buttons = [['⬅️ Volver', 'menu']]

    const text = `${frameTop}
║ 🔵 *BLUE LOCK – JUEGOS*               ║
${frameMid}
🎮 *CLÁSICOS*
.ttt  
.ppt  
.ahorcado  
.sopa  
.delttt  

🎰 *APUESTAS*
.casino  
.apostar  

⚔️ *COMPETITIVO*
.pvp  
.math  
.matematicas  
${frameBot}
`

    try {
      return await conn.sendNCarousel(m.chat, text, "EGO – JUEGOS", BLUELOCK_VIDEO, buttons, null, null, null, m)
    } catch {
      return await conn.sendMessage(m.chat, { text }, { quoted: m })
    }
  }

  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //                ANIME
  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if (menuCommand === 'menu_anime') {

    const buttons = [['⬅️ Volver', 'menu']]

    const text = `${frameTop}
║ 🔵 *BLUE LOCK – ANIME*                ║
${frameMid}
😊 *POSITIVAS*
.hug  
.kiss  
.pat  
.happy  
.love  
.coffee  
.hello  
.poke  

💃 *ACCIONES*
.dance  
.eat  
.sleep  
.think  
.run  
.smoke  
.clap  
.drunk  

🤣 *EMOCIONES*
.cry  
.sad  
.angry  
.blush  
.bored  
.scared  
.shy  
.pout  

⚔️ *AGRESIVAS*
.punch  
.slap  
.kill  
.bite  
.lick  
.seduce  

🎨 *PERSONAJES*
.waifu  
.ppcp  
.akira  
.naruto  
.sasuke  
.sakura  
.hinata  
.mikasa  
.hatsunemiku  
.nezuko  
.emilia  
${frameBot}
`

    try {
      return await conn.sendNCarousel(m.chat, text, "EGO – ANIME", BLUELOCK_VIDEO, buttons, null, null, null, m)
    } catch {
      return await conn.sendMessage(m.chat, { text }, { quoted: m })
    }
  }

  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //              GRUPOS
  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if (menuCommand === 'menu_grupos') {

    const text = `${frameTop}
║ 🔵 *BLUE LOCK – GRUPOS*               ║
${frameMid}
👑 *ADMIN*
.kick  
.add  
.promote  
.demote  

📢 *COMUNICACIÓN*
.hidetag  
.admins  
.invocar  

⚙️ *CONFIGURACIÓN*
.group open/close  
.link  
.revoke  
${frameBot}
`

    try {
      return await conn.sendMessage(m.chat, {
        video: { url: BLUELOCK_VIDEO },
        caption: text,
        gifPlayback: true
      }, { quoted: m })
    } catch {
      return await conn.sendMessage(m.chat, { text }, { quoted: m })
    }
  }

  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //                INFO BOT
  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if (menuCommand === 'menu_info') {

    const text = `${frameTop}
║ 🔵 *BLUE LOCK – INFO BOT*             ║
${frameMid}
🤖 *DATOS*
.ping  
.uptime  
.status  
.infobot  

🔗 *ENLACES*
.script  
.links  
.staff  

🤖 *SUBBOTS*
.serbot  
.qr  
.bots  
${frameBot}
`

    try {
      return await conn.sendMessage(m.chat, {
        video: { url: BLUELOCK_VIDEO },
        caption: text,
        gifPlayback: true
      }, { quoted: m })
    } catch {
      return await conn.sendMessage(m.chat, { text }, { quoted: m })
    }
  }
}

function clockString(ms) {
  let seconds = Math.floor((ms / 1000) % 60)
  let minutes = Math.floor((ms / (1000 * 60)) % 60)
  let hours = Math.floor((ms / (1000 * 60 * 60)) % 24)
  return `${hours}h ${minutes}m ${seconds}s`
}

handler.before = async function (m, { conn }) {
  if (!m.message) return false

  let buttonId = null

  if (m.message.templateButtonReplyMessage)
    buttonId = m.message.templateButtonReplyMessage.selectedId

  if (m.message.buttonsResponseMessage)
    buttonId = m.message.buttonsResponseMessage.selectedButtonId

  if (m.message.listResponseMessage)
    buttonId = m.message.listResponseMessage.singleSelectReply?.selectedRowId

  if (m.message.interactiveResponseMessage) {
    try {
      const paramsJson = m.message.interactiveResponseMessage.nativeFlowResponseMessage?.paramsJson
      if (paramsJson) {
        const params = JSON.parse(paramsJson)
        buttonId = params.id
      }
    } catch {}
  }

  if (buttonId && buttonId.startsWith('menu')) {
    try {
      await handler(m, { conn, usedPrefix: '.', command: buttonId, args: [] })
      return true
    } catch {
      return false
    }
  }

  return false
}

handler.help = ['menu', 'menú', 'help']
handler.tags = ['main', 'menu']
handler.command = /^(menu|menú|help|menu_descargas|menu_herramientas|menu_buscadores|menu_juegos|menu_anime|menu_grupos|menu_info)$/i

export default handler