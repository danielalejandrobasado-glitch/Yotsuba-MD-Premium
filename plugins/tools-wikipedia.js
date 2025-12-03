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

        let reply = `🔰 *Wikipedia* - Resultados para: "${text}"\n\n`

        for (let i = 0; i < data.result.length; i++) {
            const r = data.result[i]
            reply += `*${i + 1}.* Título: ${r.title}\n`
            reply += `Descripción: ${r.description || 'Sin descripción disponible.'}\n`
            reply += `URL: ${r.url}\n\n`
        }

        for (let r of data.result) {
            if (r.thumbnail) {
                try {
                    const imageResponse = await axios.get(r.thumbnail, {
                        responseType: 'arraybuffer',
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Linux; Android 13; SM-A035M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'
                        }
                    })
                    await conn.sendMessage(m.chat, { 
                        image: { 
                            buffer: Buffer.from(imageResponse.data, 'binary') 
                        }, 
                        caption: `🔰 *Wikipedia* - ${r.title}\n${r.description || ''}\n${r.url}`
                    }, { quoted: m })
                } catch (imgErr) {
                    console.error(`Error cargando thumbnail: ${r.thumbnail}`, imgErr)
                }
            }
        }

        m.reply(reply)

    } catch (e) {
        console.error(e)
        m.reply(`${emoji2} Error al buscar en Wikipedia.`)
    }
}

handler.help = ['wikipedia <texto>']
handler.tags = ['tools']
handler.command = ['wiki', 'wikipedia']

export default handler


