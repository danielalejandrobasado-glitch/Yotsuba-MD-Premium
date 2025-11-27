let handler = async (m, { conn }) => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:DuarteXV 
ORG:DuarteXV 
TITLE:Epictetus, Enchiridion — Chapter 1 (verse 1)
EMAIL;type=INTERNET:duartexv.ofc@gmail.com;
TEL;type=CELL;waid=573244642273:+573244642273
ADR;type=WORK:;;2-chōme-7-5 Fuchūchō;Izumi;Osaka;594-0071;Japan
URL;type=WORK:https://www.instagram.com/duarte.mc?igsh=MW5nb2I0YjM2Ym81Mg==
X-WA-BIZ-NAME:Isagi Yoichi Bot 
X-WA-BIZ-DESCRIPTION:Isagi Yoichi Bot el mejor bot de WhatsApp ♡
X-WA-BIZ-HOURS:Mo-Su 00:00-23:59
END:VCARD`;

    const q = {
        key: {
            fromMe: false,
            participant: "0@s.whatsapp.net",
            remoteJid: "status@broadcast",
        },
        message: {
            contactMessage: {
                displayName: "Duartexv",
                vcard,
            },
        },
    };

    await conn.sendMessage(
        m.chat,
        {
            contacts: {
                displayName: "Duartexv",
                contacts: [{ vcard }],
            },
            contextInfo: {
                externalAdReply: {
                    title: "© 2024–2025 Isagi Project",
                    body: "Contacta con el CEO del bot.",
                    thumbnailUrl: "https://files.catbox.moe/2xlrwj.jpg",
                    mediaType: 1,
                    renderLargerThumbnail: true,
                },
            },
        },
        { quoted: q }
    );
};

handler.help = ["owner"];
handler.tags = ["info"];
handler.command = ['owner', 'creador']

export default handler;