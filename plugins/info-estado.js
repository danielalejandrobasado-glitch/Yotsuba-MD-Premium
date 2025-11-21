import ws from 'ws'
let handler = async (m, { conn, usedPrefix, isRowner}) => {
let _uptime = process.uptime() * 1000;
let totalreg = Object.keys(global.db.data.users).length
let totalchats = Object.keys(global.db.data.chats).length

let uptime = clockString(_uptime);
const getConnsArray = () => {
    if (!global.conns) return []
    if (global.conns instanceof Map) return Array.from(global.conns.values())
    if (Array.isArray(global.conns)) return global.conns
    return Object.values(global.conns || {})
}
let users = [...new Set(getConnsArray().filter((conn) => conn.user && conn.ws?.socket && conn.ws.socket.readyState !== ws.CLOSED).map((conn) => conn))];
const chats = Object.entries(conn.chats).filter(([id, data]) => id && data.isChats)
const groupsIn = chats.filter(([id]) => id.endsWith('@g.us')) 
const totalUsers = users.length;
let old = performance.now()
let neww = performance.now()
let speed = neww - old
const used = process.memoryUsage()
let info = `🌱💙 *HATSUNE MIKU BOT - ESTADO GENERAL* 💙🌱\n\n`
info += `┌─ 🎵 *Información Principal*\n`
info += `├ 🤖 *Bot:* ${botname}\n`
info += `├ 👑 *Owner:* ${etiqueta}\n`
info += `├ 📋 *Prefijo:* [ ${usedPrefix} ]\n`
info += `├ 🌟 *Versión:* ${vs}\n`
info += `└────\n\n`
info += `┌─ 📊 *Estadísticas de Conexiones*\n`
info += `├ 🤖 *SubBots Total:* ${users.length}\n`
info += `├ ✅ *SubBots Activos:* ${users.filter(conn => conn.user && conn.ws?.socket?.readyState !== ws.CLOSED).length}\n`
info += `├ 💬 *Chats Privados:* ${chats.length - groupsIn.length}\n`
info += `├ 👥 *Grupos:* ${groupsIn.length}\n`
info += `├ 📞 *Total Chats:* ${chats.length}\n`
info += `├ 💙 *Usuarios Registrados:* ${totalreg}\n`
info += `└────\n\n`
info += `┌─ ⚡ *Rendimiento del Sistema*\n`
info += `├ ⏰ *Tiempo Activo:* ${uptime}\n`
info += `├ 🚀 *Velocidad:* ${(speed * 1000).toFixed(0) / 1000}ms\n`
info += `├ 💾 *RAM Usada:* ${(used.rss / 1024 / 1024).toFixed(2)} MB\n`
info += `├ 🔋 *Heap:* ${(used.heapUsed / 1024 / 1024).toFixed(2)} MB\n`
info += `└────\n\n`

if (users.length > 0) {
info += `┌─ 🤖 *SubBots Conectados*\n`
users.slice(0, 5).forEach((bot, index) => {
  const botName = bot.user?.name || 'Sin nombre'
  const botNumber = bot.user?.jid?.replace(/[^0-9]/g, '') || 'Desconocido'
  const status = bot.ws?.socket?.readyState === ws.OPEN ? '🟢' : '🟡'
  info += `├ ${status} *${index + 1}.* ${botName} (${botNumber.slice(-4)})\n`
})
if (users.length > 5) {
  info += `├ 📝 *Y ${users.length - 5} SubBot(s) más...*\n`
}
info += `└────\n\n`
}

info += `💡 *Comandos para Owner:*\n`
info += `• \`${usedPrefix}listbots\` - Ver todos los SubBots\n`
info += `• \`${usedPrefix}reconectar\` - Reconectar SubBots\n\n`
info += `🌱💙 *Bot funcionando correctamente* 💙🌱`
await conn.sendFile(m.chat, banner, 'estado.jpg', info, m)
}
handler.help = ['estado']
handler.tags = ['info']
handler.command = ['estado', 'status', 'estate', 'state', 'stado', 'stats']
handler.register = true

export default handler

function clockString(ms) {
    let seconds = Math.floor((ms / 1000) % 60);
    let minutes = Math.floor((ms / (1000 * 60)) % 60);
    let hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    return `${hours}h ${minutes}m ${seconds}s`;
}

