import fetch from "node-fetch";
import yts from 'yt-search';

function extractYouTubeId(url) {
  const patterns = [
    /youtu\.be\/([a-zA-Z0-9\-\_]{11})/,
    /youtube\.com\/watch\?v=([a-zA-Z0-9\-\_]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9\-\_]{11})/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function formatViews(views) {
  if (views === undefined || views === null) {
    return "No disponible";
  }

  try {
    const numViews = parseInt(views);
    if (numViews >= 1_000_000_000) {
      return `${(numViews / 1_000_000_000).toFixed(1)}B`;
    } else if (numViews >= 1_000_000) {
      return `${(numViews / 1_000_000).toFixed(1)}M`;
    } else if (numViews >= 1_000) {
      return `${(numViews / 1_000).toFixed(1)}k`;
    }
    return numViews.toLocaleString();
  } catch (e) {
    return String(views);
  }
}

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text.trim()) {
      return conn.reply(m.chat, `💙 Ingresa el nombre de la música a descargar.\n\nEjemplo: ${usedPrefix}${command} Let you Down Cyberpunk`, m);
    }

    const search = await yts(text);
    if (!search.all || search.all.length === 0) {
      return m.reply('No se encontraron resultados para tu búsqueda.');
    }

    const videoInfo = search.all[0];
    if (!videoInfo) {
      return m.reply('No se pudo obtener información del video.');
    }

    const {
      title = 'Desconocido', 
      thumbnail = '', 
      timestamp = 'Desconocido', 
      views = 0, 
      ago = 'Desconocido', 
      url = '', 
      author = { name: 'Desconocido' } 
    } = videoInfo;

    if (!url) {
      return m.reply('No se pudo obtener la URL del video.');
    }

    const vistas = formatViews(views);
    const canal = author.name || 'Desconocido';
    
    const buttons = [
      ['🎵 Audio', 'ytdl_audio_mp3'],
      ['🎬 Video', 'ytdl_video_mp4'],
      ['📁 MP3 Documento', 'ytdl_audio_doc'],
      ['📁 MP4 Documento', 'ytdl_video_doc']
    ];
    
    const infoText = `*𖹭.╭╭ִ╼࣪━ִﮩ٨ـﮩ💙𝗠𝗶𝗸𝘂𝗺𝗶𝗻🌱ﮩ٨ـﮩ━ִ╾࣪╮╮.𖹭*

> 💙 *Título:* ${title}
*°.⎯⃘̶⎯̸⎯ܴ⎯̶᳞͇ࠝ⎯⃘̶⎯̸⎯ܴ⎯̶᳞͇ࠝ⎯⃘̶⎯̸.°*
> 🌱 *Duración:* ${timestamp}
*°.⎯⃘̶⎯̸⎯ܴ⎯̶᳞͇ࠝ⎯⃘̶⎯̸⎯ܴ⎯̶᳞͇ࠝ⎯⃘̶⎯̸.°*
> 💙 *Vistas:* ${vistas}
*°.⎯⃘̶⎯̸⎯ܴ⎯̶᳞͇ࠝ⎯⃘̶⎯̸⎯ܴ⎯̶᳞͇ࠝ⎯⃘̶⎯̸.°*
> 🌱 *Canal:* ${canal}
*°.⎯⃘̶⎯̸⎯ܴ⎯̶᳞͇ࠝ⎯⃘̶⎯̸⎯ܴ⎯̶᳞͇ࠝ⎯⃘̶⎯̸.°*
> 💙 *Publicado:* ${ago}
*⏝ּׅ︣︢ۛ۫۫۫۫۫۫ۜ⏝ּׅ︣︢ۛ۫۫۫۫۫۫ۜ⏝ּׅ︣︢ۛ۫۫۫۫۫۫ۜ⏝ּׅ︣︢ۛ۫۫۫۫۫۫ۜ⏝ּׅ︣︢ۛ۫۫۫۫۫۫ۜ⏝ּׅ︣︢ۛ۫۫۫۫۫۫ۜ⏝ּׅ︣︢ۛ۫۫۫۫۫۫ۜ⏝ּׅ︣ׄۛ۫۫۫۫۫۫ۜ*

💌 *Selecciona el formato para descargar:*`;

    const footer = '🌱 Hatsune Miku Bot - YouTube';

    try {
      const thumb = thumbnail ? (await conn.getFile(thumbnail))?.data : null;
      await conn.sendNCarousel(m.chat, infoText, footer, thumb, buttons, null, null, null, m);
    } catch (thumbError) {
      await conn.sendNCarousel(m.chat, infoText, footer, null, buttons, null, null, null, m);
      console.error("Error al obtener la miniatura:", thumbError);
    }
      
    if (!global.db.data.users[m.sender]) {
      global.db.data.users[m.sender] = {};
    }
    
    global.db.data.users[m.sender].lastYTSearch = {
      url,
      title,
      messageId: m.key.id,  
      timestamp: Date.now() 
    };

  } catch (error) {
    console.error("Error completo:", error);
    return m.reply(`💙 Ocurrió un error: ${error.message || 'Desconocido'}`);
  }
};

async function processDownload(conn, m, url, title, option) {
  const downloadTypes = {
    1: '🎵 audio MP3',
    2: '🎬 video MP4', 
    3: '📁 audio MP3 doc',
    4: '📁 video MP4 doc'
  };
  
  const downloadType = downloadTypes[option] || 'archivo';
  await conn.reply(m.chat, `💙 Obteniendo ${downloadType}... ⚡`, m);
  
  try {
    const isVideo = option === 2 || option === 4;
    const result = isVideo ? await downloadVideo(url) : await downloadAudio(url);
    
    if (!result?.url) {
      throw new Error('No se pudo obtener el enlace de descarga');
    }
    
    let fileName = `${title.replace(/[^\w\s]/gi, '').substring(0, 50)}`;
    const downloadUrl = result.url;

    if (option === 1 || option === 3) {
      fileName += '.mp3';
      
      if (option === 1) {
        await conn.sendMessage(m.chat, {
          audio: { url: downloadUrl },
          mimetype: 'audio/mpeg',
          fileName: fileName,
          ptt: false
        }, { quoted: m });
      } else {
        await conn.sendMessage(m.chat, {
          document: { url: downloadUrl },
          mimetype: 'audio/mpeg',
          fileName: fileName
        }, { quoted: m });
      }
    } else {
      fileName += '.mp4';
      
      if (option === 2) {
        await conn.sendMessage(m.chat, {
          video: { url: downloadUrl },
          mimetype: 'video/mp4',
          fileName: fileName,
          caption: `🎬 ${title}`
        }, { quoted: m });
      } else {
        await conn.sendMessage(m.chat, {
          document: { url: downloadUrl },
          mimetype: 'video/mp4',
          fileName: fileName,
          caption: `📁 ${title}`
        }, { quoted: m });
      }
    }
    
    const user = global.db.data.users[m.sender];
    if (user && !user.monedaDeducted) {
      user.moneda = (user.moneda || 0) - 2;
      user.monedaDeducted = true;
      conn.reply(m.chat, `💙 Has utilizado 2 *Cebollines 🌱*`, m);
    }
    
    return true;
  } catch (error) {
    console.error("Error al procesar descarga:", error);
    conn.reply(m.chat, `💙 Error: ${error.message}`, m);
    return false;
  }
}

async function downloadVideo(url) {
  const videoId = extractYouTubeId(url);
  if (!videoId) throw new Error('URL inválida');

  const apis = [
    { 
      name: 'Adonix', 
      url: `https://api-adonix.ultraplus.click/download/ytmp4?apikey=${global.apikey}&url=${encodeURIComponent(url)}`,
      extractor: data => data?.data?.url
    },
    { 
      name: 'MayAPI', 
      url: `https://mayapi.ooguy.com/ytdl?url=${encodeURIComponent(url)}&type=mp4&apikey=${global.APIKeys?.['https://mayapi.ooguy.com']}`,
      extractor: data => data?.result?.url
    }
  ];

  for (const api of apis) {
    try {
      console.log(`🔄 ${api.name}...`);
      const res = await fetch(api.url);
      const data = await res.json();
      
      const videoUrl = api.extractor(data);
      if (videoUrl) {
        console.log(`✅ ${api.name} exitoso`);
        return { url: videoUrl };
      }
    } catch (error) {
      console.log(`❌ ${api.name} falló:`, error.message);
    }
  }

  throw new Error('No se pudo descargar el video. Intenta más tarde.');
}

async function downloadAudio(url) {
  const videoId = extractYouTubeId(url);
  if (!videoId) throw new Error('URL inválida');

  const apis = [
    { 
      name: 'Adonix', 
      url: `https://api-adonix.ultraplus.click/download/ytmp3?apikey=${global.apikey}&url=${encodeURIComponent(url)}`,
      extractor: data => data?.data?.url
    },
    { 
      name: 'MayAPI', 
      url: `https://mayapi.ooguy.com/ytdl?url=${encodeURIComponent(url)}&type=mp3&apikey=${global.APIKeys?.['https://mayapi.ooguy.com']}`,
      extractor: data => data?.result?.url
    }
  ];

  for (const api of apis) {
    try {
      console.log(`🔄 ${api.name}...`);
      const res = await fetch(api.url);
      const data = await res.json();
      
      const audioUrl = api.extractor(data);
      if (audioUrl) {
        console.log(`✅ ${api.name} exitoso`);
        return { url: audioUrl };
      }
    } catch (error) {
      console.log(`❌ ${api.name} falló:`, error.message);
    }
  }

  throw new Error('No se pudo descargar. Intenta más tarde.');
}

handler.before = async (m, { conn }) => {
  const buttonPatterns = [
    /ytdl_audio_mp3/,
    /ytdl_video_mp4/,
    /ytdl_audio_doc/,
    /ytdl_video_doc/
  ];
  
  let isButtonResponse = false;
  for (const pattern of buttonPatterns) {
    if (pattern.test(m.text)) {
      isButtonResponse = true;
      break;
    }
  }
  
  if (!isButtonResponse) {
    return false;
  }
  
  const user = global.db.data.users[m.sender];
  if (!user || !user.lastYTSearch) {
    await conn.reply(m.chat, '⏰ No hay búsqueda activa. Realiza una nueva búsqueda.', m);
    return false;
  }
  
  console.log(`🎵 Procesando: ${user.lastYTSearch.title}`);
  
  const currentTime = Date.now();
  const searchTime = user.lastYTSearch.timestamp || 0;
  
  if (currentTime - searchTime > 10 * 60 * 1000) {
    await conn.reply(m.chat, '⏰ La búsqueda ha expirado. Por favor realiza una nueva búsqueda.', m);
    return false; 
  }
  
  let option = null;
  if (m.text.includes('audio_mp3')) {
    option = 1; 
  } else if (m.text.includes('video_mp4')) {
    option = 2; 
  } else if (m.text.includes('audio_doc')) {
    option = 3; 
  } else if (m.text.includes('video_doc')) {
    option = 4; 
  }
  
  if (!option) {
    return false;
  }

  user.monedaDeducted = false;

  try {
    await processDownload(
      conn, 
      m, 
      user.lastYTSearch.url, 
      user.lastYTSearch.title, 
      option
    );
    
    user.lastYTSearch = null;
    
  } catch (error) {
    console.error(`❌ Error en descarga:`, error.message);
    await conn.reply(m.chat, `💙 Error al procesar la descarga: ${error.message}`, m);
  }
  
  return true;
};

handler.command = handler.help = ['play'];
handler.tags = ['downloader'];

export default handler;
