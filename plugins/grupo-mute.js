import fetch from 'node-fetch';

const handler = async (m, { conn, command, text, isAdmin, isOwner }) => {
  const userId = m.mentionedJid?.[0] || m.quoted?.sender || text;

  // Validación: solo admins o owner
  if (!isAdmin && !isOwner) {
    throw '🌌 *Solo los guardianes del Reino (admins) o el maestro de las sombras (owner) pueden invocar este poder festivo.*';
  }

  if (!userId) {
    throw '👻 *Debes mencionar al alma que será silenciada o liberada por las sombras navideñas.*';
  }

  const user = global.db.data.users[userId] || {};
  user.mute = user.mute || false;

  if (command === 'mute') {
    if (user.mute) throw '⚠️ *Ese espíritu ya ha sido silenciado por la oscuridad festiva.*';
    user.mute = true;
    await conn.reply(
      m.chat,
      `🔇 *El usuario ha sido silenciado.*\n🎄 Sus palabras se desvanecen como nieve en la noche sombría.`,
      m
    );
  }

  if (command === 'unmute') {
    if (!user.mute) throw '⚠️ *Ese espíritu ya está libre de la maldición.*';
    user.mute = false;
    await conn.reply(
      m.chat,
      `🔊 *El usuario ha sido liberado.*\n✨ Puede hablar nuevamente bajo la vigilancia de Shadow, entre luces y sombras navideñas.`,
      m
    );
  }

  global.db.data.users[userId] = user;
};

// 🧹 Elimina los mensajes de los usuarios silenciados
handler.before = async (m, { conn }) => {
  const sender = m.sender;
  const isMuted = global.db.data.users[sender]?.mute;

  if (isMuted && !m.key.fromMe) {
    try {
      await conn.sendMessage(m.chat, { delete: m.key });
    } catch (e) {
      console.error('❌ Error al eliminar mensaje:', e);
    }
  }
};

handler.command = ['mute', 'unmute'];
handler.group = true; // Solo en grupos
handler.admin = true; // Requiere admin
handler.botAdmin = true; // El bot debe ser admin

export default handler;