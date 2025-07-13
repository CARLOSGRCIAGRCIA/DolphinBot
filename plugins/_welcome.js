import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'
import fs from 'fs'

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return true

  let who = m.messageStubParameters[0]
  let taguser = `@${who.split('@')[0]}`
  let chat = global.db.data.chats[m.chat]
  //let defaultImage = 'https://files.catbox.moe/k4cdwk.jpg';
  const defaultImage = fs.readFileSync('./Dolphin.png')

  if (chat.welcome) {
    let img;
    try {
      let pp = await conn.profilePictureUrl(who, 'image');
      img = await (await fetch(pp)).buffer();
    } catch {
      img = defaultImage; 
    }

    if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
      let bienvenida = `┏━〔 *𝘽𝙞𝙚𝙣𝙫𝙚𝙣𝙞𝙙@* 〕━┓
┃ Usuario: ${taguser}
┃ Grupo: *${groupMetadata.subject}*
┃
┃ ✨ ¡𝘽𝙞𝙚𝙣𝙫𝙚𝙣𝙞𝙙@ 𝙖 𝙡𝙖 𝙛𝙖𝙢𝙞𝙡𝙞𝙖  !
┃ 𝒖𝒔𝒐 𝒅𝒆𝒍 𝒃𝒐𝒕 𝒒𝒖𝒆𝒅𝒂 𝒓𝒆𝒔𝒆𝒓𝒗𝒂𝒅𝒐 𝒔𝒐𝒍𝒐 𝒑𝒂𝒓𝒂 𝒂𝒅𝒎𝒊𝒏𝒊𝒔𝒕𝒓𝒂𝒅𝒐𝒓𝒆𝒔
┗━━━━━━━━━━━━━━━━━━┛`
      await conn.sendMessage(m.chat, { image: img, caption: bienvenida, mentions: [who] })
    } else if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE || m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE) {
      let bye = `┏━〔 *𝙅𝙖𝙢𝙖𝙨 𝙧𝙚𝙜𝙧𝙚𝙨𝙚𝙨* 〕━┓
┃ Usuario: ${taguser}
┃ Grupo: *${groupMetadata.subject}*
┃
┃  ¡𝙊𝙟𝙖𝙡𝙖 𝙩𝙚 𝙢𝙪𝙚𝙧𝙙𝙖 𝙪𝙣 𝙥𝙚𝙧𝙧𝙤!
┃ 
┗━━━━━━━━━━━━━━━━━━━━━━━━┛`
      await conn.sendMessage(m.chat, { image: img, caption: bye, mentions: [who] })
    }
  }

  return true
}