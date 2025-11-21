import fetch from "node-fetch";
import crypto from "crypto";
import { FormData, Blob } from "formdata-node";
import { fileTypeFromBuffer } from "file-type";

let handler = async (m, { conn }) => {
  try {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';
    if (!mime) {
      return conn.reply(m.chat, `💙 Por favor, responde a un archivo válido (imagen, video, etc.).`, m, global.rcanal);
    }
    await m.react(rwait);

    let media = await q.download();
    if (!media) throw "No se pudo descargar el archivo.";

    const { ext, mime: detectedMime } = (await fileTypeFromBuffer(media)) || {};
    if (!ext || !detectedMime) throw "No se pudo determinar el tipo de archivo.";

    let isTele = /image\/(png|jpe?g|gif)|video\/mp4/.test(mime);
    let link = await catbox(media);

    if (!/^https?:\/\/catbox\.moe\//.test(link)) throw "Fallo al subir a Catbox: " + link;

    let txt = `*💙 C A T B O X - U P L O A D E R 💙*\n\n`;
    txt += `*» Enlace* : ${link}\n`;
    txt += `*» Tamaño* : ${formatBytes(media.length)}\n`;
    txt += `*» Expiración* : ${isTele ? 'No expira' : 'Desconocido'}\n\n`;
    txt += `> *${typeof dev !== "undefined" ? dev : "Bot"}*`;

    await conn.sendFile(m.chat, media, 'thumbnail.jpg', txt, m, fkontak);
    await m.react(done);

  } catch (err) {
    console.error(err);
    await m.react(error);
    await m.reply(`❌ Error al convertir o subir el archivo a Catbox.\n${err && err.toString ? err.toString() : err}`, m);
  }
};

handler.help = ['tourl2'];
handler.tags = ['transformador'];
handler.command = ['catbox', 'tourl2'];
export default handler;

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]}`;
}

async function catbox(content) {
  const { ext, mime } = (await fileTypeFromBuffer(content)) || {};
  if (!ext || !mime) throw "Tipo de archivo no soportado o no detectado.";

  const blob = new Blob([content.toArrayBuffer()], { type: mime });
  const formData = new FormData();
  const randomBytes = crypto.randomBytes(5).toString("hex");
  formData.append("reqtype", "fileupload");
  formData.append("fileToUpload", blob, randomBytes + "." + ext);

  const response = await fetch("https://catbox.moe/user/api.php", {
    method: "POST",
    body: formData,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36",
    },
  });

  if (!response.ok) {
    throw `Catbox respondió con código ${response.status}`;
  }

  const text = await response.text();
 
  if (text.startsWith("https://")) return text;
  throw text;
}

