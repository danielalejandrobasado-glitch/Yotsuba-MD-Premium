import fetch from 'node-fetch'

export default {
  command: ['react'],
  category: 'utils',
  run: async (client, m, args, from) => {

    if (!args || !args.length) {
        return m.reply(`✎ Ingresa la url y los emogis!`)
    }

    try {
        const parts = args.join(' ').split(' ')
        const postLink = parts[0]
        const reacts = parts.slice(1).join(' ')

        if (!postLink || !reacts) {
            return m.reply(`✐ Uso incorrecto, el uso correcto es.\n> » url + <emogi1, emogi2, emogi3>`)
        }

        if (!postLink.includes('whatsapp.com/channel/')) {
            return m.reply(`✐ El link debe ser de una publicación de canal de WhatsApp.`)
        }

        const emojiArray = reacts.split(',').map(e => e.trim()).filter(e => e)
        if (emojiArray.length > 4) {
            return m.reply(`✎ Máximo 4 emojis permitidos.`)
        }

        const apiKey = '3881f5719c4a5e6d7835f1484726b101564a144a5cc8849dd1c8cc7926008ce6'

        const requestData = {
            post_link: postLink,
            reacts: emojiArray.join(',')
        }

        const response = await fetch('https://foreign-marna-sithaunarathnapromax-9a005c2e.koyeb.app/api/channel/react-to-post', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'User-Agent': 'Mozilla/5.0 (Android 13; Mobile; rv:146.0) Gecko/146.0 Firefox/146.0',
                'Referer': 'https://asitha.top/channel-manager'
            },
            body: JSON.stringify(requestData)
        })

        const result = await response.json()

        if (response.ok && result.message) {
            await m.reply(`✐ *Reacciones enviadas con éxito*`)
        } else {
            await m.reply(msgglobal)
        }

    } catch (error) {
        await m.reply(msgglobal)
    }}
}