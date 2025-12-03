import axios from 'axios'

let handler = async (m, { text }) => {
    const emoji = '🔍'
    const emoji2 = '❌'

    if (!text) 
        return conn.reply(m.chat, `${emoji} Ingresa lo que quieres buscar en Wikipedia.`, m, global.rcanal)

    try {
        const { data } = await axios.get('https://api-adonix.ultraplus.click/search/wikipedia', {
            params: {
                apikey: 'DuarteXVKey34',
                q: text,
                limit: 35
            }
        })

        if (!data.result || data.result.length === 0) 
            return m.reply(`${emoji2} No se encontraron resultados.`)

        const result = data.result[0]

        let reply = `🔰 *Wikipedia*\n\n` +
                    `‣ Título: ${result.title}\n` +
                    `‣ Descripción: ${result.description || 'Sin descripción disponible.'}\n` +
                    `‣ URL: ${result.url}`

        if (result.thumbnail) {
            await conn.sendMessage(m.chat, { 
                image: { url: result.thumbnail }, 
                caption: reply 
            }, { quoted: m })
        } else {
            m.reply(reply)
        }

    } catch (e) {
        console.error(e)
        m.reply(`${emoji2} Error al buscar en Wikipedia.`)
    }
}

handler.help = ['wikipedia <texto>']
handler.tags = ['tools']
handler.command = ['wiki', 'wikipedia']

export default handler