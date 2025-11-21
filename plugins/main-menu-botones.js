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
  
  
  if (menuCommand && menuCommand.includes('menu')) {
    console.log('🎯 PROCESSING MENU:', menuCommand)
  }
  
  if (menuCommand === 'menu' || menuCommand === 'menú' || menuCommand === 'help') {
    const buttons = [
      ['📥 Descargas', 'menu_descargas'],
      ['🛠️ Herramientas', 'menu_herramientas'],
      ['🔍 Buscadores', 'menu_buscadores'],
      ['🎮 Juegos', 'menu_juegos'],
      ['🎌 Anime', 'menu_anime'],
      ['👥 admin Grupos', 'menu_grupos'],
      ['ℹ️ Info Bot', 'menu_info']
    ]

    const text = `╭━━━━━━━━━━━━━━━━━━━╮
┃ 🎤 *HATSUNE MIKU BOT* 🎤 ┃
╰━━━━━━━━━━━━━━━━━━━╯

🌸 ¡Konnichiwa, @${userId.split('@')[0]}! 🌸

┏━━━━━━━━━━━━━━━━┓
┃ 💙 *Estado:* ${(conn.user.jid == global.conn.user.jid ? 'Principal ⚡️' : 'Sub-Bot 🔌')}
┃ ⏰ *Activo:* ${uptime}
┃ 👥 *Usuarios:* ${totalreg}
┃ 📊 *Comandos:* ${totalCommands}
┗━━━━━━━━━━━━━━━━┛

🎵 *Selecciona una categoría:*
Usa los botones de abajo o escribe el comando directamente.
📣 También puedes usar \`.menucompleto\` para ver todos los comandos

💙 ¡Disfruta de la experiencia Miku! ✨`
    
    const footer = '🌱 Powered by (ㅎㅊDEPOOLㅊㅎ)'
    const menuGif = 'https://media.tenor.com/aGsOxo7R4l0AAAPo/miku-channelcastation.mp4'

    try {
      return await conn.sendNCarousel(m.chat, text, footer, menuGif, buttons, null, null, null, m)
    } catch (error) {
      
      
      const buttonMessage = {
        text: text,
        footer: footer,
        templateButtons: buttons.map((btn, index) => ({
          index: index + 1,
          quickReplyButton: {
            displayText: btn[0],
            id: btn[1]
          }
        })),
        image: { url: menuGif }
      }
      return await conn.sendMessage(m.chat, buttonMessage, { quoted: m })
    }
  }

  if (menuCommand === 'menu_descargas') {
    const buttons = [
      ['⬅️ Volver al Menú', 'menu']
    ]

    const text = `📥 *MENÚ DE DESCARGAS*

🎵 ═══ *MÚSICA Y VIDEOS* ═══ 🎵
🎼 \`.play [nombre]\` - YouTube Music/Video
🛒 \`.spotify [nombre]\` - Spotify Music
🔗 \`.mp3 [url]\` - URL a MP3
🎞 \`.mp4 [url]\` - URL a MP4

📱 ═══ *REDES SOCIALES* ═══ 📱
🎬 \`.tiktok [url]\` - Videos TikTok
🎵 \`.tiktokmp3 [url]\` - TikTok Audio
📸 \`.tiktokimg [url]\` - TikTok Imágenes
🔄 \`.ttrandom\` - TikTok Random
📸 \`.instagram [url]\` - Posts/Reels IG
💙 \`.facebook [url]\` - Videos Facebook
🐦 \`.twitter [url]\` - Videos Twitter/X
📌 \`.pinvideo [url]\` - Videos Pinterest

📁 ═══ *ARCHIVOS Y REPOS* ═══ 📁
💾 \`.mediafire [url]\` - MediaFire
☁️ \`.mega [url]\` - MEGA
📱 \`.apk [nombre]\` - APKs y ModAPKs
🛠️ \`.npmjs [package]\` - NPM Packages
🗂️ \`.gitclone [repo]\` - Clonar Repositorios

🔞 ═══ *CONTENIDO ADULTO* ═══ 🔞
🔞 \`.xnxxdl [url]\` - XNXX Videos
🔞 \`.xvideosdl [url]\` - XVideos

💙 *Escribe cualquier comando para usarlo*
⬅️ *O toca el botón para volver al menú principal*`
    
    const footer = '🎵 Módulo de Descargas - Hatsune Miku Bot'
    const descargasGif = 'https://media.tenor.com/aGsOxo7R4l0AAAPo/miku-channelcastation.mp4'

    try {
      return await conn.sendNCarousel(m.chat, text, footer, descargasGif, buttons, null, null, null, m)
    } catch (error) {
      return await conn.sendMessage(m.chat, { text: text }, { quoted: m })
    }
  }

  if (menuCommand === 'menu_herramientas') {
    const buttons = [
      ['⬅️ Volver al Menú', 'menu']
    ]

    const text = `🛠️ *HERRAMIENTAS ÚTILES*

🔒 ═══ *UTILIDADES WEB* ═══ 🧷
🌤️ \`.clima [ciudad]\` - Ver clima
🈵 \`.translate [texto]\` - Traductor
📷 \`.ss [url]\` - Screenshot web
🔍 \`.google [búsqueda]\` - Buscar en Google
💮 \`.wikipedia [tema]\` - Wikipedia
🔍 \`.ip [dirección]\` - Info de IP

🎨 ═══ *EDICIÓN Y STICKERS* ═══ 🎨
✨ \`.hd\` - Mejorar calidad imagen
🌟 \`.s\` - Crear sticker
🖼️ \`.toimg\` - Sticker a imagen
🎭 \`.emojimix\` - Mezclar emojis
📝 \`.ttp [texto]\` - Texto a sticker
💬 \`.qc [texto]\` - Quote creator
⏲ \`.brat [texto]\` - Brat video
🏷️ \`.wm [pack|autor]\` - Marca de agua

🔧 ═══ *CONVERSORES* ═══ 🔧
🎵 \`.tomp3\` - Video a MP3
🎬 \`.tovideo\` - Audio a video
🎞️ \`.togif\` - Video a GIF
🔗 \`.tourl\` - Subir archivos
☁️ \`.catbox\` - Subir a Catbox
📷 \`.ibb\` - Subir a ImgBB
🗣️ \`.tts [texto]\` - Texto a voz

🔍 ═══ *DETECCIÓN Y ANÁLISIS* ═══ 🔍
🎵 \`.shazam\` - Reconocer música
🎶 \`.whatmusic\` - Identificar canción
🕵️ \`.detectar\` - Detectar persona
📋 \`.todoc\` - Convertir a documento
📏 \`.tamaño\` - Tamaño de archivo
🔤 \`.letra [canción]\` - Letras de música

💙 *Escribe cualquier comando para usarlo*
⬅️ *O toca el botón para volver al menú principal*`
    
    const herramientasGif = 'https://media.tenor.com/aGsOxo7R4l0AAAPo/miku-channelcastation.mp4'

    try {
      return await conn.sendMessage(m.chat, {
        video: { url: herramientasGif },
        caption: text,
        footer: '🔧 Módulo de Herramientas - Hatsune Miku Bot',
        gifPlayback: true,
        templateButtons: buttons.map((btn, index) => ({
          index: index + 1,
          quickReplyButton: {
            displayText: btn[0],
            id: btn[1]
          }
        }))
      }, { quoted: m })
    } catch (error) {
      
      return await conn.sendMessage(m.chat, {
        text: text
      }, { quoted: m })
    }
  }

  if (menuCommand === 'menu_buscadores') {
    const buttons = [
      ['⬅️ Volver al Menú', 'menu']
    ]

    const text = `🔍 *BUSCADORES Y CONSULTAS*

🌐 ═══ *BUSCADORES GENERALES* ═══ 🌐
🔍 \`.google [búsqueda]\` - Buscar en Google
📊 \`.wikipedia [tema]\` - Consultar Wikipedia
🎵 \`.yts [música]\` - Buscar en YouTube
📱 \`.npmjs [package]\` - Buscar NPM packages
📚 \`.githubsearch [repo]\` - Buscar repositorios

🎌 ═══ *ANIME Y ENTRETENIMIENTO* ═══ 🎌
🎭 \`.infoanime [nombre]\` - Info de anime
🎬 \`.cuevanasearch [película]\` - Buscar películas
🔍 \`.tiktoksearch [término]\` - Buscar TikToks
🐦 \`.tweetposts [usuario]\` - Posts de Twitter

📸 ═══ *IMÁGENES* ═══ 📸
🖼️ \`.imagen [búsqueda]\` - Buscar imágenes
📸 \`.pinterest [término]\` - Buscar en Pinterest

🔞 ═══ *CONTENIDO ADULTO* ═══ 🔞
🔞 \`.pornhubsearch [término]\` - Buscar PornHub
🔞 \`.xnxxsearch [término]\` - Buscar XNXX
🔞 \`.xvideos [término]\` - Buscar XVideos
🔞 \`.hentaisearch [término]\` - Buscar Hentai

💙 *Escribe cualquier comando para usarlo*
⬅️ *O toca el botón para volver al menú principal*`
    
    const buscadoresGif = 'https://media.tenor.com/aGsOxo7R4l0AAAPo/miku-channelcastation.mp4'

    try {
      return await conn.sendNCarousel(m.chat, text, '🔍 Módulo de Buscadores - Hatsune Miku Bot', buscadoresGif, buttons, null, null, null, m)
    } catch (error) {
      
      return await conn.sendMessage(m.chat, { text: text }, { quoted: m })
    }
  }

  if (menuCommand === 'menu_juegos') {
    const buttons = [
      ['⬅️ Volver al Menú', 'menu']
    ]

    const text = `🎮 *CENTRO DE JUEGOS*

🕹️ ═══ *JUEGOS CLÁSICOS* ═══ 🕹️
⭕ \`.ttt\` - Tres en raya (TicTacToe)
✂️ \`.ppt\` - Piedra/Papel/Tijera
🎪 \`.ahorcado\` - Juego del ahorcado
🔤 \`.sopa\` - Sopa de letras
🗑️ \`.delttt\` - Eliminar juego TTT

🎰 ═══ *CASINO & APUESTAS* ═══ 🎰
🎲 \`.casino [cantidad]\` - Apostar dinero
💰 \`.apostar [cantidad]\` - Apostar

⚔️ ═══ *COMPETITIVO* ═══ ⚔️
🥊 \`.pvp [@usuario]\` - PvP contra usuario
🧠 \`.math\` - Quiz matemático
📊 \`.matematicas\` - Desafío matemático

💙 *Escribe cualquier comando para usarlo*
⬅️ *O toca el botón para volver al menú principal*`
    
    const juegosGif = 'https://media.tenor.com/aGsOxo7R4l0AAAPo/miku-channelcastation.mp4'

    try {
      return await conn.sendNCarousel(m.chat, text, '🎮 Módulo de Juegos - Hatsune Miku Bot', juegosGif, buttons, null, null, null, m)
    } catch (error) {
      
      return await conn.sendMessage(m.chat, {
        text: text
      }, { quoted: m })
    }
  }

  if (menuCommand === 'menu_anime') {
    const buttons = [
      ['⬅️ Volver al Menú', 'menu']
    ]

    const text = `🎌 *ANIME & REACCIONES*

😊 ═══ *REACCIONES POSITIVAS* ═══ 😊
🤗 \`.hug [@usuario]\` - Dar abrazo
😘 \`.kiss [@usuario]\` - Dar beso  
🤲 \`.pat [@usuario]\` - Acariciar
😊 \`.happy [@usuario]\` - Estar feliz
😍 \`.love [@usuario]\` - Demostrar amor
☕ \`.coffee [@usuario]\` - Tomar café
👋 \`.hello [@usuario]\` - Saludar
🫵 \`.poke [@usuario]\` - Picar

💃 ═══ *ACCIONES* ═══ 💃
💃 \`.dance\` - Bailar
🍽️ \`.eat\` - Comer
😴 \`.sleep\` - Dormir
🤔 \`.think\` - Pensar
🏃 \`.run\` - Correr
🚬 \`.smoke\` - Fumar
👏 \`.clap\` - Aplaudir
🤮 \`.drunk\` - Estar borracho

🤣 ═══ *EMOCIONES* ═══ 😢
😢 \`.cry\` - Llorar
😞 \`.sad\` - Estar triste
😠 \`.angry\` - Estar enojado
😳 \`.blush\` - Sonrojarse
😎 \`.bored\` - Estar aburrido
😨 \`.scared\` - Estar asustado
😊 \`.shy\` - Estar tímido
😤 \`.pout\` - Hacer pucheros

⚔️ ═══ *ACCIONES AGRESIVAS* ═══ ⚔️
👊 \`.punch [@usuario]\` - Golpear
👋 \`.slap [@usuario]\` - Abofetear
🗡️ \`.kill [@usuario]\` - Eliminar
🦷 \`.bite [@usuario]\` - Morder
👅 \`.lick [@usuario]\` - Lamer
🤤 \`.seduce [@usuario]\` - Seducir

🎨 ═══ *PERSONAJES ANIME* ═══ 🎨
🎎 \`.waifu\` - Imagen waifu random
👫 \`.ppcp\` - Fotos de perfil parejas
🎭 \`.akira\` | \`.naruto\` | \`.sasuke\`
🌸 \`.sakura\` | \`.hinata\` | \`.mikasa\`
🎵 \`.hatsunemiku\` | \`.nezuko\` | \`.emilia\`

💙 *Escribe cualquier comando para usarlo*
⬅️ *O toca el botón para volver al menú principal*`

    const animeGif = 'https://media.tenor.com/aGsOxo7R4l0AAAPo/miku-channelcastation.mp4'

    try {
      return await conn.sendNCarousel(m.chat, text, '🎌 Módulo de Anime - Hatsune Miku Bot', animeGif, buttons, null, null, null, m)
    } catch (error) {
      
      return await conn.sendMessage(m.chat, {
        text: text
      }, { quoted: m })
    }
  }

  if (menuCommand === 'menu_grupos') {
    const text = `👥 *GESTIÓN DE GRUPOS*
_(Solo para administradores)_

👑 ═══ *ADMINISTRACIÓN* ═══ 👑
🦵 \`.kick [@usuario]\` - Eliminar
➕ \`.add [número]\` - Invitar
👑 \`.promote [@usuario]\` - Dar admin
👤 \`.demote [@usuario]\` - Quitar admin

📢 ═══ *COMUNICACIÓN* ═══ 📢
👻 \`.hidetag [texto]\` - Mencionar todos
📣 \`.admins\` - Llamar admins
📢 \`.invocar\` - Mencionar todos

⚙️ ═══ *CONFIGURACIÓN* ═══ ⚙️
🔓 \`.group open/close\` - Abrir/cerrar
🔗 \`.link\` - Ver enlace
🔄 \`.revoke\` - Cambiar enlace

💙 *Escribe cualquier comando para usarlo*
⬅️ *Escribe* \`menu\` *para volver al menú principal*`

    const gruposGif = 'https://media.tenor.com/aGsOxo7R4l0AAAPo/miku-channelcastation.mp4'

    try {
      return await conn.sendMessage(m.chat, {
        video: { url: gruposGif },
        caption: text,
        gifPlayback: true
      }, { quoted: m })
    } catch (error) {
      console.log('Error enviando video-gif, enviando solo texto:', error)
      return await conn.sendMessage(m.chat, {
        text: text
      }, { quoted: m })
    }
  }

  if (menuCommand === 'menu_info') {
    const text = `ℹ️ *INFORMACIÓN DEL BOT*

🤖 ═══ *DATOS DEL BOT* ═══ 🤖
📡 \`.ping\` - Velocidad de respuesta
⏱️ \`.uptime\` - Tiempo activo
📊 \`.status\` - Estado completo
ℹ️ \`.infobot\` - Info detallada

🔗 ═══ *ENLACES & COMUNIDAD* ═══ 🔗
💻 \`.script\` - Código fuente
🔗 \`.links\` - Enlaces oficiales
👥 \`.staff\` - Desarrolladores

🤖 ═══ *SUBBOTS* ═══ 🤖
🤖 \`.serbot\` - Crear SubBot
📱 \`.qr\` - Código QR
🤖 \`.bots\` - Lista SubBots

💙 *Escribe cualquier comando para usarlo*
⬅️ *Escribe* \`menu\` *para volver al menú principal*`

    const infoGif = 'https://media.tenor.com/aGsOxo7R4l0AAAPo/miku-channelcastation.mp4'

    try {
      return await conn.sendMessage(m.chat, {
        video: { url: infoGif },
        caption: text,
        gifPlayback: true
      }, { quoted: m })
    } catch (error) {
      console.log('Error enviando video-gif, enviando solo texto:', error)
      return await conn.sendMessage(m.chat, {
        text: text
      }, { quoted: m })
    }
  }
}

function clockString(ms) {
  let seconds = Math.floor((ms / 1000) % 60)
  let minutes = Math.floor((ms / (1000 * 60)) % 60)
  let hours = Math.floor((ms / (1000 * 60 * 60)) % 24)
  return `${hours}h ${minutes}m ${seconds}s`
}


handler.before = async function (m, { conn, usedPrefix }) {
  if (!m.message) return false
  
  let buttonId = null
  
  if (m.message.templateButtonReplyMessage) {
    buttonId = m.message.templateButtonReplyMessage.selectedId
  }
  if (m.message.buttonsResponseMessage) {
    buttonId = m.message.buttonsResponseMessage.selectedButtonId
  }
  if (m.message.listResponseMessage) {
    buttonId = m.message.listResponseMessage.singleSelectReply?.selectedRowId
  }
  if (m.message.interactiveResponseMessage) {
    try {
      const paramsJson = m.message.interactiveResponseMessage.nativeFlowResponseMessage?.paramsJson
      if (paramsJson) {
        const params = JSON.parse(paramsJson)
        buttonId = params.id
      }
    } catch (e) {
      
    }
  }
  
  
  if (buttonId && buttonId.startsWith('menu')) {
    console.log('🎯 BUTTON DETECTED:', buttonId)
    
    
    try {
      await handler(m, { conn, usedPrefix: '.', command: buttonId, args: [] })
      return true 
    } catch (error) {
      console.log('❌ Error processing button:', error)
      return false
    }
  }
  
  return false
}

handler.help = ['menu', 'menú', 'help']
handler.tags = ['main', 'menu']
handler.command = /^(menu|menú|help|menu_descargas|menu_herramientas|menu_buscadores|menu_juegos|menu_anime|menu_grupos|menu_info)$/i

export default handler