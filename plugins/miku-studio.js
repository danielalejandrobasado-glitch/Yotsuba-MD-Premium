const GENEROS_MUSICALES = {
  jpop: {
    name: "🇯🇵 J-Pop",
    difficulty: 1,
    baseViews: [100, 500],
    basePay: [20, 80],
    mikuBonus: 1.2
  },
  vocaloid: {
    name: "🎵 Vocaloid",
    difficulty: 2,
    baseViews: [300, 800],
    basePay: [50, 150],
    mikuBonus: 1.5
  },
  electronic: {
    name: "🎛️ Electrónica",
    difficulty: 2,
    baseViews: [200, 600],
    basePay: [40, 120],
    mikuBonus: 1.3
  },
  rock: {
    name: "🎸 Rock",
    difficulty: 3,
    baseViews: [400, 1000],
    basePay: [80, 200],
    mikuBonus: 1.4
  },
  ballad: {
    name: "💕 Balada",
    difficulty: 2,
    baseViews: [250, 700],
    basePay: [60, 140],
    mikuBonus: 1.6
  },
  dubstep: {
    name: "🔊 Dubstep",
    difficulty: 4,
    baseViews: [500, 1200],
    basePay: [100, 300],
    mikuBonus: 1.3
  }
}

const TEMAS_CANCIONES = [
  "Amor Virtual", "Mundo Digital", "Coletas Turquesas", "Negi Negi",
  "Concierto Holográfico", "Lágrimas de Algoritmo", "Diva del Futuro",
  "Melodía Cuántica", "Corazón Sintético", "Baile de Bits",
  "Sueños de Silicio", "Armonía Binaria", "Canción del Mañana",
  "Voces del Cyber", "Romance en 3D", "Ecos Virtuales",
  "Sinfonía Digital", "Alma de Código", "Ritmo Pixelado"
]

const CALIDAD_PRODUCCION = {
  basica: {
    name: "📻 Básica",
    cost: 0,
    multiplier: 1.0,
    successRate: 0.6
  },
  profesional: {
    name: "🎚️ Profesional", 
    cost: 100,
    multiplier: 1.5,
    successRate: 0.8
  },
  premium: {
    name: "✨ Premium",
    cost: 300,
    multiplier: 2.0,
    successRate: 0.95
  }
}

const MIKU_MOODS = [
  { mood: "😊 Alegre", bonus: 1.2, description: "Miku está muy animada hoy" },
  { mood: "🎵 Musical", bonus: 1.3, description: "Miku siente la música en su alma" },
  { mood: "💙 Inspirada", bonus: 1.4, description: "Miku está súper inspirada" },
  { mood: "🎤 Perfecta", bonus: 1.6, description: "¡Miku está en su mejor momento!" },
  { mood: "😴 Cansada", bonus: 0.8, description: "Miku necesita descansar un poco" },
  { mood: "🤖 Técnica", bonus: 1.1, description: "Miku está en modo técnico" }
]

let handler = async (m, { conn, usedPrefix, command, text }) => {
  const user = global.db.data.users[m.sender]
  
  
  if (!user.mikuStudio) {
    user.mikuStudio = {
      level: 1,
      songs: [],
      totalViews: 0,
      totalEarnings: 0,
      reputation: 0,
      lastProduction: 0,
      equipment: 'basica'
    }
  }
  
  const studio = user.mikuStudio
  const coins = user.coin || 0
  
  
  if (!text) {
    return mostrarEstudio(m, conn, usedPrefix, studio, coins)
  }
  
  const args = text.toLowerCase().split(' ')
  const action = args[0]
  
  switch (action) {
    case 'crear':
    case 'grabar':
      return crearCancion(m, conn, args, studio, user)
    case 'album':
    case 'canciones':
      return mostrarCanciones(m, conn, studio)
    case 'mejorar':
    case 'upgrade':
      return mejorarEstudio(m, conn, args, studio, user)
    case 'promocionar':
    case 'promo':
      return promocionarCancion(m, conn, args, studio, user)
    default:
      return m.reply(`❌ Acción no válida. Usa \`${usedPrefix}miku\` para ver las opciones.`)
  }
}

async function mostrarEstudio(m, conn, usedPrefix, studio, coins) {
  const mikuMood = MIKU_MOODS[Math.floor(Math.random() * MIKU_MOODS.length)]
  
  
  const now = Date.now()
  const hoursPass = Math.floor((now - studio.lastProduction) / (1000 * 60 * 60))
  let passiveEarnings = 0
  
  if (hoursPass > 0 && studio.songs.length > 0) {
    studio.songs.forEach(song => {
      const hourlyViews = Math.floor(song.views * 0.001) 
      const earnings = hourlyViews * 0.5 * hoursPass
      passiveEarnings += earnings
      song.views += hourlyViews * hoursPass
    })
    
    studio.totalEarnings += passiveEarnings
    studio.lastProduction = now
  }
  
  const studioMessage = `
🎵 *ESTUDIO MIKU VIRTUAL* 🎤

👤 *Productor:* ${m.pushName || m.sender.split('@')[0]}
💙 *Estado de Miku:* ${mikuMood.mood}
💭 _${mikuMood.description}_

📊 *Estadísticas del Estudio:*
🏆 Nivel: ${studio.level}
🎵 Canciones: ${studio.songs.length}
👀 Vistas totales: ${studio.totalViews.toLocaleString()}
💰 Ganancias totales: ${studio.totalEarnings} monedas
⭐ Reputación: ${studio.reputation}
🎚️ Equipo: ${CALIDAD_PRODUCCION[studio.equipment].name}

💳 *Monedas actuales:* ${coins}
${passiveEarnings > 0 ? `💸 *Ingresos pasivos:* +${Math.floor(passiveEarnings)} monedas` : ''}

🎼 *Comandos disponibles:*
• \`${usedPrefix}miku crear [género]\` - Crear nueva canción
• \`${usedPrefix}miku album\` - Ver tus canciones
• \`${usedPrefix}miku mejorar\` - Mejorar equipos
• \`${usedPrefix}miku promocionar [ID]\` - Promocionar canción

🎵 **Géneros disponibles:**
${Object.entries(GENEROS_MUSICALES).map(([key, genre]) => `• \`${key}\` - ${genre.name}`).join('\n')}

💡 *Consejos:*
• Mejores equipos = más éxito
• Promociona tus canciones para más vistas
• El estado de ánimo de Miku afecta la calidad
• Canciones exitosas generan ingresos pasivos
  `.trim()

  await conn.reply(m.chat, studioMessage, m)
}

async function crearCancion(m, conn, args, studio, user) {
  const genero = args[1]
  const now = Date.now()
  
  
  if (now - studio.lastProduction < 1800000) {
    const remaining = Math.ceil((1800000 - (now - studio.lastProduction)) / 60000)
    return m.reply(`⏰ Miku necesita descansar. Próxima grabación en ${remaining} minutos.`)
  }
  
  if (!genero || !GENEROS_MUSICALES[genero]) {
    const genres = Object.keys(GENEROS_MUSICALES).join(', ')
    return m.reply(`❌ Género no válido. Géneros disponibles: ${genres}`)
  }
  
  const genre = GENEROS_MUSICALES[genero]
  const equipment = CALIDAD_PRODUCCION[studio.equipment]
  const mikuMood = MIKU_MOODS[Math.floor(Math.random() * MIKU_MOODS.length)]
  
  
  if (user.coin < equipment.cost) {
    return m.reply(`💸 No tienes suficientes monedas para usar equipo ${equipment.name}. Necesitas ${equipment.cost} monedas.`)
  }
  
 
  user.coin -= equipment.cost
  
 
  const baseSuccess = equipment.successRate
  const moodBonus = mikuMood.bonus
  const levelBonus = 1 + (studio.level * 0.1)
  
  const finalSuccess = Math.min(0.99, baseSuccess * moodBonus * levelBonus)
  const isSuccess = Math.random() < finalSuccess
  
  
  const tema = TEMAS_CANCIONES[Math.floor(Math.random() * TEMAS_CANCIONES.length)]
  
  
  const songId = studio.songs.length + 1
  const song = {
    id: songId,
    title: tema,
    genre: genre.name,
    genreKey: genero,
    quality: equipment.name,
    mood: mikuMood.mood,
    success: isSuccess,
    views: 0,
    earnings: 0,
    createdAt: now
  }
  
  if (isSuccess) {
    
    const baseViews = Math.floor(Math.random() * (genre.baseViews[1] - genre.baseViews[0] + 1)) + genre.baseViews[0]
    const bonusViews = Math.floor(baseViews * equipment.multiplier * moodBonus * genre.mikuBonus)
    
    song.views = bonusViews
    song.earnings = Math.floor(bonusViews * (Math.random() * 0.3 + 0.1)) 
    
    studio.totalViews += song.views
    studio.totalEarnings += song.earnings
    studio.reputation += Math.floor(genre.difficulty * 10)
    user.coin += song.earnings
    
    
    if (studio.reputation >= studio.level * 100) {
      studio.level += 1
      studio.reputation = 0
    }
    
  } else {
    
    song.views = Math.floor(Math.random() * 50) + 10
    song.earnings = Math.floor(song.views * 0.05)
    
    studio.totalViews += song.views
    studio.totalEarnings += song.earnings
    user.coin += song.earnings
  }
  
  studio.songs.push(song)
  studio.lastProduction = now
  
  const resultMessage = `
🎵 *¡NUEVA CANCIÓN CREADA!* 🎤

🎼 *"${song.title}"*
🎵 Género: ${song.genre}
🎚️ Calidad: ${song.quality}
💙 Estado de Miku: ${song.mood}

${isSuccess ? '🎉 *¡ÉXITO TOTAL!* 🎉' : '😔 *No fue muy popular...*'}

📊 *Resultados:*
👀 Vistas: ${song.views.toLocaleString()}
💰 Ganancias: ${song.earnings} monedas
${equipment.cost > 0 ? `💸 Costo de producción: ${equipment.cost} monedas` : ''}
💳 Saldo actual: ${user.coin} monedas

${studio.level > 1 ? `🏆 Reputación: ${studio.reputation}/${studio.level * 100}` : ''}

${isSuccess && song.views > 1000 ? '🌟 ¡Esta canción puede ser promocionada para más vistas!' : ''}
  `.trim()

  await conn.reply(m.chat, resultMessage, m)
}

async function mostrarCanciones(m, conn, studio) {
  if (studio.songs.length === 0) {
    return m.reply('🎵 No tienes canciones aún. ¡Usa el comando crear para hacer tu primera canción!')
  }
  

  const sortedSongs = studio.songs.sort((a, b) => b.views - a.views)
  
  let albumMessage = `🎵 *TU ÁLBUM VIRTUAL* 🎤\n\n`
  
  sortedSongs.slice(0, 10).forEach((song, index) => {
    const rank = index + 1
    const trophy = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '🎵'
    
    albumMessage += `${trophy} **#${song.id} "${song.title}"**\n`
    albumMessage += `🎵 ${song.genre} | 👀 ${song.views.toLocaleString()} vistas\n`
    albumMessage += `💰 ${song.earnings} monedas ganadas\n\n`
  })
  
  if (studio.songs.length > 10) {
    albumMessage += `... y ${studio.songs.length - 10} canciones más\n\n`
  }
  
  albumMessage += `📊 *Resumen:*\n`
  albumMessage += `🎵 Total de canciones: ${studio.songs.length}\n`
  albumMessage += `👀 Vistas totales: ${studio.totalViews.toLocaleString()}\n`
  albumMessage += `💰 Ganancias totales: ${studio.totalEarnings} monedas`
  
  await conn.reply(m.chat, albumMessage, m)
}

async function mejorarEstudio(m, conn, args, studio, user) {
  const equipmentOptions = Object.entries(CALIDAD_PRODUCCION)
  const currentIndex = equipmentOptions.findIndex(([key]) => key === studio.equipment)
  
  if (currentIndex === equipmentOptions.length - 1) {
    return m.reply('✨ Ya tienes el mejor equipo disponible!')
  }
  
  const nextEquipment = equipmentOptions[currentIndex + 1]
  const [key, equipment] = nextEquipment
  const upgradeCost = equipment.cost * 3 
  
  if (user.coin < upgradeCost) {
    return m.reply(`💸 No tienes suficientes monedas para mejorar a ${equipment.name}. Necesitas ${upgradeCost} monedas.`)
  }
  
  user.coin -= upgradeCost
  studio.equipment = key
  
  const upgradeMessage = `
🔧 *¡ESTUDIO MEJORADO!* ✨

📈 *Nuevo equipo:* ${equipment.name}
💰 *Costo:* ${upgradeCost} monedas
💳 *Saldo restante:* ${user.coin} monedas

🎵 *Beneficios:*
• Multiplicador de vistas: x${equipment.multiplier}
• Tasa de éxito: ${Math.round(equipment.successRate * 100)}%
• Costo por canción: ${equipment.cost} monedas

¡Ahora tus canciones serán aún más exitosas! 💙
  `.trim()

  await conn.reply(m.chat, upgradeMessage, m)
}

async function promocionarCancion(m, conn, args, studio, user) {
  const songId = parseInt(args[1])
  const promoCost = 200
  
  if (!songId || isNaN(songId)) {
    return m.reply('❌ Especifica el ID de la canción a promocionar.')
  }
  
  const song = studio.songs.find(s => s.id === songId)
  if (!song) {
    return m.reply('❌ Canción no encontrada.')
  }
  
  if (user.coin < promoCost) {
    return m.reply(`💸 No tienes suficientes monedas para promocionar. Necesitas ${promoCost} monedas.`)
  }
  
  user.coin -= promoCost
  
  
  const bonusViews = Math.floor(song.views * (Math.random() * 0.5 + 0.3)) 
  const bonusEarnings = Math.floor(bonusViews * 0.2)
  
  song.views += bonusViews
  song.earnings += bonusEarnings
  studio.totalViews += bonusViews
  studio.totalEarnings += bonusEarnings
  user.coin += bonusEarnings
  
  const promoMessage = `
📢 *¡CANCIÓN PROMOCIONADA!* 🎵

🎼 *"${song.title}"*
💰 Costo de promoción: ${promoCost} monedas

📈 *Resultados:*
👀 Vistas adicionales: +${bonusViews.toLocaleString()}
💰 Ganancias adicionales: +${bonusEarnings} monedas
💳 Saldo actual: ${user.coin} monedas

🎵 *Nueva popularidad:*
👀 Total de vistas: ${song.views.toLocaleString()}
💰 Ganancias totales: ${song.earnings} monedas

¡Tu canción está ganando más popularidad! 🌟
  `.trim()

  await conn.reply(m.chat, promoMessage, m)
}

handler.help = ['miku']
handler.tags = ['miku', 'music']
handler.command = /^(miku|mikustudio|estudiomiku)$/i
handler.register = true

export default handler

