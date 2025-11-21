import { igdl } from 'ruhend-scraper';

const handler = async (m, { args, conn }) => {
  if (!args[0]) {
    return conn.reply(m.chat, `💙 Por favor, ingresa un enlace de Instagram para descargarlo en el mundo virtual 🎵`, m, rcanal);
  }

  try {
    await m.react('🎤');
    const res = await igdl(args[0]);
    const data = res.data;

    for (let media of data) {
      await conn.sendFile(m.chat, media.url, 'instagram.mp4', `💙 ¡Aquí tienes tu descarga del concierto virtual! 🎵`, m,rcanal);
    }
    await m.react('✨');
  } catch (e) {
    await m.react('💙');
    return conn.reply(m.chat, `💙 ¡Gomen! Ocurrió un error en el mundo virtual. ¡Inténtalo de nuevo! 💫`, m, rcanal);
  }
};

handler.command = ['instagram', 'ig'];
handler.tags = ['descargas'];
handler.help = ['instagram', 'ig'];
handler.group = true;
handler.register = true;
handler.coin = 2;

export default handler;
