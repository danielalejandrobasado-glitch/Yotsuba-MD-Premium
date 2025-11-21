import { areJidsSameUser } from '@whiskeysockets/baileys'

const handler = async (m, { conn, text, participants, args, usedPrefix, command }) => {
    try {
        await m.react('🔍')

        // Verificar que sea un grupo
        if (!m.isGroup) return m.reply('💙 *Este comando solo funciona en grupos*')

        // Verificar que se haya proporcionado un número
        if (!text || !args[0]) {
            return m.reply(`💙 *Uso correcto:*\n${usedPrefix + command} <numero>\n\n*Ejemplos:*\n• ${usedPrefix + command} 1234567890\n• ${usedPrefix + command} +1234567890\n• ${usedPrefix + command} 521234567890`)
        }

        // Limpiar el número (remover espacios, guiones, paréntesis, etc.)
        let phoneNumber = text.replace(/[^\d]/g, '')
        
        // Si no empieza con código de país, asumir que es local
        if (!phoneNumber.startsWith('52') && !phoneNumber.startsWith('1') && !phoneNumber.startsWith('34') && !phoneNumber.startsWith('54')) {
            // Aquí puedes agregar tu código de país por defecto, por ejemplo México (52)
            phoneNumber = '52' + phoneNumber
        }

        // Crear el JID
        const targetJid = phoneNumber + '@s.whatsapp.net'

        // Buscar el usuario en los participantes del grupo
        const participant = participants.find(p => areJidsSameUser(p.id, targetJid))

        if (!participant) {
            return m.reply(`💙 *El numero ${phoneNumber} no se encuentra en este grupo*\n\n*LID buscado:* ${phoneNumber}`)
        }

        // Obtener información adicional del participante
        const isAdmin = participant.admin === 'admin' || participant.admin === 'superadmin'
        const isSuperAdmin = participant.admin === 'superadmin'
        
        let adminStatus = '👤 Miembro'
        if (isSuperAdmin) adminStatus = '👑 Creador'
        else if (isAdmin) adminStatus = '🛡️ Administrador'

        // Intentar obtener el nombre del usuario
        let userName = 'Sin nombre'
        try {
            const userInfo = await conn.onWhatsApp(targetJid)
            if (userInfo && userInfo[0] && userInfo[0].exists) {
                const contact = await conn.getBusinessProfile(targetJid).catch(() => null)
                userName = contact?.name || participant.notify || userName
            }
        } catch (e) {
            // Si no se puede obtener el nombre, usar el que tiene en el grupo
            userName = participant.notify || userName
        }

        // Extraer solo el número (LID) del JID completo
        const numberOnly = targetJid.split('@')[0]

        const response = `🔍 *INFORMACION DEL USUARIO*

📱 *Numero:* +${phoneNumber}
🆔 *JID completo:* \`${targetJid}\`
🔢 *LID:* \`${numberOnly}\`
👤 *Nombre:* ${userName}
🏷️ *Estado:* ${adminStatus}
📅 *En grupo desde:* ${participant.joined ? new Date(participant.joined * 1000).toLocaleDateString() : 'Fecha desconocida'}

💙 *LID listo para copiar:*
\`${numberOnly}\`

📋 *Formato para listas:*
\`\`\`
// <-- ${userName} @lid -->
  ['${numberOnly}',
\`\`\``

        await conn.reply(m.chat, response, m, { mentions: [targetJid] })
        await m.react('✅')

    } catch (error) {
        console.error('Error en getlid:', error)
        await m.react('❌')
        return m.reply(`💙 *Error al obtener informacion:*\n${error.message}`)
    }
}

handler.help = ['getlid', 'obtenerid']
handler.tags = ['tools']
handler.command = ['getlid', 'obtenerid', 'lid', 'getid']
handler.group = true
handler.register = true

export default handler

