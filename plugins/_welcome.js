import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return true

  let who = m.messageStubParameters[0]
  let taguser = `@${who.split('@')[0]}`
  let chat = global.db.data.chats[m.chat]
  let defaultImage = 'https://qu.ax/OmQYc.png'

  if (chat.welcome) {
    let img
    try {
      let pp = await conn.profilePictureUrl(who, 'image')
      img = await (await fetch(pp)).buffer()
    } catch {
      img = await (await fetch(defaultImage)).buffer()
    }

    let defaultWelcome = `┏━〔 *Bienvenido/a* 〕━┓
┃ Usuario: ${taguser}
┃ Grupo: *${groupMetadata.subject}*
┃
┃ ✨ ¡Pásala genial con todos!
┃ 𝓫𝓸𝓽 𝓻𝓮𝓼𝓮𝓻𝓿𝓮𝓭 𝓯𝓸𝓻 𝓪𝓭𝓶𝓲𝓷𝓲𝓼𝓽𝓻𝓪𝓽𝓸𝓻𝓼 𝓸𝓷𝓵𝔂
┗━━━━━━━━━━━━━━━━━━┛`

    let defaultBye = `┏━〔 *Bye* 〕━┓
┃ Usuario: ${taguser}
┃ Grupo: *${groupMetadata.subject}*
┃
┃  ¡𝑃𝑢𝑟𝑜 𝑔𝑒𝑦 𝑠𝑒 𝑠𝑎𝑙𝑒!
┃ 🛠 𝓫𝓸𝓽 𝓻𝓮𝓼𝓮𝓻𝓿𝓮𝓭 𝓯𝓸𝓻 𝓪𝓭𝓶𝓲𝓷𝓲𝓼𝓽𝓻𝓪𝓽𝓸𝓻𝓼 𝓸𝓷𝓵𝔂
┗━━━━━━━━━━━━━━━━━━┛`

    if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
      let bienvenida = chat.customWelcome || defaultWelcome
      bienvenida = bienvenida
        .replace(/@user/gi, taguser)
        .replace(/{group}/gi, groupMetadata.subject)

      await conn.sendMessage(m.chat, { image: img, caption: bienvenida, mentions: [who] })

    } else if (
      m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE ||
      m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE
    ) {
      let bye = chat.customBye || defaultBye
      bye = bye
        .replace(/@user/gi, taguser)
        .replace(/{group}/gi, groupMetadata.subject)

      await conn.sendMessage(m.chat, { image: img, caption: bye, mentions: [who] })
    }
  }

  return true
}
