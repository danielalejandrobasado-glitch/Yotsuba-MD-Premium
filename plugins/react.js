import axios from 'axios';
// -_
const msgglobal = '❌ Ha ocurrido un error inesperado al intentar enviar las reacciones.';

const handler = async (m, { conn, args }) => {
  const fullArgs = args.join(' ').trim();

  if (!fullArgs) {
    return m.reply(`📝 Ingresa la url del canal y los emojis!\n\n> » Ejemplo: url_canal, emoji1, emoji2`);
  }

  const parts = fullArgs.split(/,(.*)/s).map(part => part.trim()).filter(Boolean);
  const postLink = parts[0];
  const reactsString = parts[1] || '';

  if (!postLink || !reactsString) {
    return m.reply(`❌ Uso incorrecto, el uso correcto es:\n\n> » *url_del_post*, *emoji1*, *emoji2*, ...`);
  }

  if (!postLink.includes('whatsapp.com/channel/')) {
    return m.reply(`❌ El link debe ser de una publicación de **canal de WhatsApp**.`);
  }

  const emojiArray = reactsString.split(',').map(e => e.trim()).filter(Boolean);

  if (emojiArray.length > 4) {
    return m.reply(`❌ Máximo **4 emojis** permitidos.`);
  }

  const apiKey = 'f6be3a763a23ef4a3fa3fb0268694ee6246016d5ce1d6801e7fc354ce803b5ed';

  const requestData = {
    post_link: postLink,
    reacts: emojiArray.join(',')
  };

  try {
    const response = await axios.post(
      'https://foreign-marna-sithaunarathnapromax-9a005c2e.koyeb.app/api/channel/react-to-post',
      requestData,
      {
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'User-Agent': 'Mozilla/5.0 (Android 13; Mobile; rv:146.0) Gecko/146.0 Firefox/146.0',
          'Referer': 'https://asitha.top/channel-manager'
        }
      }
    );

    if (response.data && response.data.message) {
      await m.reply(`✅ *Reacciones enviadas con éxito* a ${postLink}\n\nMensaje de la API: ${response.data.message}`);
    } else {
      await m.reply(msgglobal);
    }

  } catch (error) {
    console.error(error.response?.data || error.message || error);
    if (error.response && error.response.data && error.response.data.message) {
      await m.reply(`⚠️ Error de la API: ${error.response.data.message}`);
    } else {
      await m.reply(msgglobal);
    }
  }
}

handler.command = ['react'];
handler.help = ['react'];
handler.tags = ['rowner'];
handler.rowner = false;

export default handler;
