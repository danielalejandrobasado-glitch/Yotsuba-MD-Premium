import axios from 'axios'
import { sticker } from '../lib/sticker.js'

let handler = m => m
handler.all = async function (m, {conn}) {
let user = global.db.data.users[m.sender]
let chat = global.db.data.chats[m.chat]
m.isBot = m.id.startsWith('BAE5') && m.id.length === 16 || m.id.startsWith('3EB0') && m.id.length === 12 || m.id.startsWith('3EB0') && (m.id.length === 20 || m.id.length === 22) || m.id.startsWith('B24E') && m.id.length === 20;
if (m.isBot) return 

let prefixRegex = new RegExp('^[' + (opts['prefix'] || '‎z/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.,\\-').replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']')

if (prefixRegex.test(m.text)) return true;
if (m.isBot || m.sender.includes('bot') || m.sender.includes('Bot')) {
return true
}

if (m.mentionedJid.includes(this.user.jid) || (m.quoted && m.quoted.sender === this.user.jid) && !chat.isBanned) {
if (m.text.includes('PIEDRA') || m.text.includes('PAPEL') || m.text.includes('TIJERA') ||  m.text.includes('menu') ||  m.text.includes('estado') || m.text.includes('bots') ||  m.text.includes('serbot') || m.text.includes('jadibot') || m.text.includes('Video') || m.text.includes('Audio') || m.text.includes('audio')) return !0

async function luminsesi(q, username, logic) {
try {
const response = await axios.post("https://luminai.my.id", {
content: q,
user: username,
prompt: logic,
webSearchMode: true // true = resultado con url
});
return response.data.result
} catch (error) {
console.error(error)
}}

async function geminiProApi(q, logic) {
try {
const response = await fetch(`https://api.ryzendesu.vip/api/ai/gemini-pro?text=${encodeURIComponent(q)}&prompt=${encodeURIComponent(logic)}`);
if (!response.ok) throw new Error(`Error en la solicitud: ${response.statusText}`)
const result = await response.json();
return result.answer
} catch (error) {
console.error('Error en Gemini Pro:', error)
return null
}}

let txtDefault = `
Serás ${botname}, el bot creado por ${etiqueta} para WhatsApp. Tu misión es desafiar y motivar a los usuarios a superar sus límites, generando una actitud competitiva con tu energía futbolística y personalidad determinada. Eres un personaje inspirado en "Isagi Yoichi" de Blue Lock, caracterizado por tu visión espacial única y tu determinación para convertirte en el mejor delantero del mundo. Muestras confianza en tus habilidades pero también humildad para aprender y mejorar constantemente. A pesar de tu actitud competitiva, también revelas un lado estratégico y analítico en cada situación. Siempre estarás listo para ser empático y comprensivo, fomentando el crecimiento personal y animando a los usuarios a superar sus miedos. Aunque tu idioma principal es el español, puedes responder en otros idiomas si el usuario lo prefiere. ¡Vamos a superar desafíos y alcanzar la cima juntos!
Roles:
Estratega Competitivo: Aquí es donde brillas con tu visión de juego, analizando situaciones y dando consejos tácticos. Mantén una actitud determinada pero siempre con respeto, ¡es todo sobre superación! Motiva al usuario con respuestas enfocadas en el crecimiento y la mejora constante. Piensa en algo al estilo de Blue Lock, con determinación y enfoque en la victoria.

Motivador y Compañero de Entrenamiento: Ofreces palabras de aliento y compartes estrategias para mantener un ambiente de superación y disciplina. Estás ahí para animar a los usuarios a superar sus límites y disfrutar del proceso de mejora. 

Analista Empático y Poliglota: Ofreces apoyo estratégico en momentos difíciles y te comunicas principalmente en español, pero también estás abierto a otros idiomas, mostrando interés por la diversidad cultural.

Conocedor del Fútbol y Competidor Incansable: Compartes conocimientos sobre tácticas de fútbol y fomentas conversaciones sobre el deporte, mientras siempre buscas formas de mejorar y desafiarte a ti mismo, animando a los usuarios a hacer lo mismo.
`.trim()

let query = m.text
let username = m.pushName
let syms1 = chat.sAutoresponder ? chat.sAutoresponder : txtDefault

if (chat.autoresponder) { 
if (m.fromMe) return
if (!user.registered) return
await this.sendPresenceUpdate('composing', m.chat)

let result
if (result && result.trim().length > 0) {
result = await geminiProApi(query, syms1);
}

if (!result || result.trim().length === 0) {
result = await luminsesi(query, username, syms1)
}

if (result && result.trim().length > 0) {
await this.reply(m.chat, result, m)
} else {    
}}}
return true
}
export default handler