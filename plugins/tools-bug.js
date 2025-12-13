import { generateWAMessageFromContent, prepareWAMessageMedia } from '@whiskeysockets/baileys'

let handler = async (m, { conn }) => {
  const bannerUrl = 'https://files.catbox.moe/xr2m6u.jpg'      // imagen grande arriba
  const miniaturaUrl = 'https://files.catbox.moe/56ok7q.jpg'   // imagen roja como documento

  // Banner principal
  const media = await prepareWAMessageMedia({ image: { url: bannerUrl } }, { upload: conn.waUploadToServer })
  // Miniatura roja en buffer
  const { data: thumb } = await conn.getFile(miniaturaUrl)

  const cargaTexto = "⚡⃝".repeat(5000) // texto decorativo cargado

  // 1) Panel interactivo
  const content = {
    viewOnceMessage: {
      message: {
        interactiveMessage: {
          header: { hasMediaAttachment: true, imageMessage: media.imageMessage },
          body: { text: cargaTexto },
          footer: { text: "⚔️ Shadow-BOT-MD • Panel navideño 🎄" },
          nativeFlowMessage: {
            buttons: [
              {
                name: "cta_url",
                buttonParamsJson: JSON.stringify({
                  display_text: "Canal Oficial 💚",
                  url: "https://www.whatsapp.com/android",
                }),
              },
              {
                name: "cta_copy",
                buttonParamsJson: JSON.stringify({
                  display_text: "📋 Copiar carga interactiva",
                  id: "shadow-copy",
                  copy_code: cargaTexto
                }),
              },
              {
                name: "single_select",
                buttonParamsJson: JSON.stringify({
                  title: "📜 Frases Shadow",
                  sections: [{
                    title: "Frases disponibles",
                    rows: [
                      { title: "🎄 La sombra observa en silencio", description: "Frase misteriosa", id: "frase1" },
                      { title: "✨ Entre luces festivas, la sombra sonríe", description: "Frase navideña", id: "frase2" },
                      { title: "⚔️ La eminencia dicta el destino", description: "Frase épica", id: "frase3" },
                      { title: "❄️ El frío guarda secretos ocultos", description: "Frase invernal", id: "frase4" }
                    ]
                  }]
                })
              }
            ],
          },
        },
      },
    },
  }

  const msg = generateWAMessageFromContent(m.chat, content, { userJid: m.sender })
  await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })

  // 2) Documento pequeño rojo como imagen enviada tipo documento
  await conn.sendMessage(m.chat, {
    document: { url: miniaturaUrl },
    fileName: 'Choso-MD🔥.jpg',
    mimetype: 'image/jpeg',
    caption: "Selecciona el servicio al que deseas subir tu archivo.\nPOWERED BY XZZSY26",
    jpegThumbnail: thumb
  }, { quoted: m })
}

handler.help = ['shadowpanel']
handler.tags = ['fun']
handler.command = ['shadowpanel']
handler.register = true

export default handler