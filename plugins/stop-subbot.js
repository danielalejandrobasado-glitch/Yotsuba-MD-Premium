async function stopSubBot(userId) {
    if (!global.conns || global.conns.length === 0) {
        return false
    }
    
    
    const connIndex = global.conns.findIndex(c => c && c.user && c.user.jid && c.user.jid.split('@')[0] === userId)
    if (connIndex === -1) {
        return false
    }
    
    const conn = global.conns[connIndex]
    
    try {
        console.log(`🎵 Deteniendo SubBot ${userId} manualmente...`)
        
        
        if (conn.ws && conn.ws.socket) {
            conn.ws.close()
        }
        
        
        try {
            conn.ev.removeAllListeners()
        } catch (e) {}
        
        
        ['_keepAliveInterval', '_saveCredsInterval', '_inactivityMonitor', 'heartbeatInterval', '_presenceInterval'].forEach(interval => {
            if (conn[interval]) {
                clearInterval(conn[interval])
                conn[interval] = null
            }
        })
        
       
        global.conns.splice(connIndex, 1)
        
        console.log(`🎵 SubBot ${userId} detenido exitosamente`)
        return true
        
    } catch (error) {
        console.error(`🎵 Error deteniendo SubBot ${userId}:`, error)
        return false
    }
}

let handler = async (m, { conn, usedPrefix, command }) => {
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
    let id = `${who.split`@`[0]}`
    
    if (!global.conns || global.conns.length === 0) {
        return m.reply('🎵 No tienes ningún SubBot activo para desconectar.')
    }
    
    
    const userSubBot = global.conns.find(c => c && c.user && c.user.jid && c.user.jid.split('@')[0] === id)
    
    if (!userSubBot) {
        return m.reply('🎵 No tienes ningún SubBot activo para desconectar.')
    }
    
    const isConnected = userSubBot.ws && userSubBot.ws.socket && userSubBot.ws.socket.readyState === 1
    
    if (!isConnected) {
        
        const connIndex = global.conns.findIndex(c => c && c.user && c.user.jid && c.user.jid.split('@')[0] === id)
        if (connIndex !== -1) {
            global.conns.splice(connIndex, 1)
        }
        return m.reply('🎵 Tu SubBot ya estaba desconectado. Se limpió la sesión.')
    }
    
    try {
        const success = await stopSubBot(id)
        if (success) {
            m.reply('🎤 Tu SubBot se ha desconectado exitosamente del concierto de Miku.\n\n💫 Usa `' + usedPrefix + 'qr` o `' + usedPrefix + 'code` para reconectar.')
        } else {
            m.reply('⚠️ Hubo un problema al desconectar tu Sub-Bot.')
        }
    } catch (error) {
        console.error('Error deteniendo subbot:', error)
        m.reply('⚠️ Hubo un error al desconectar tu Sub-Bot. Intenta nuevamente.')
    }
}

handler.help = ['stop', 'detener']
handler.tags = ['serbot']
handler.command = /^(stop|detener)$/i

export default handler

