//THANKS FOR DOWNLOAD
const { decryptMedia } = require('@open-wa/wa-decrypt')
const fs = require('fs-extra')
const axios = require('axios')
const moment = require('moment-timezone')
const get = require('got')
const fetch = require('node-fetch')
const color = require('./lib/color')
const { spawn, exec } = require('child_process')
const nhentai = require('nhentai-js')
const { API } = require('nhentai-api')
const { liriklagu, quotemaker, randomNimek, fb, sleep, jadwalTv, ss, cerpen, costom } = require('./lib/functions')
const { help, snk, info, donate, readme, listChannel } = require('./lib/help')
const { stdout } = require('process')
const nsfw_ = JSON.parse(fs.readFileSync('./lib/NSFW.json'))
const welkom = JSON.parse(fs.readFileSync('./lib/welcome.json'))
const { RemoveBgResult, removeBackgroundFromImageBase64, removeBackgroundFromImageFile } = require('remove.bg')


const errorurl = 'https://steamuserimages-a.akamaihd.net/ugc/954087817129084207/5B7E46EE484181A676C02DFCAD48ECB1C74BC423/?imw=512&&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false'
const errorurl2 = 'https://steamuserimages-a.akamaihd.net/ugc/954087817129084207/5B7E46EE484181A676C02DFCAD48ECB1C74BC423/?imw=512&&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false'


moment.tz.setDefault('Asia/Jakarta').locale('id')


module.exports = msgHandler = async (client, message) => {
    try {
        const { type, id, from, t, sender, isGroupMsg, chat, caption, isMedia, mimetype, quotedMsg, quotedMsgObj, mentionedJidList } = message
        let { body } = message
        const { name, formattedTitle } = chat
        let { pushname, verifiedName } = sender
        pushname = pushname || verifiedName
        const commands = caption || body || ''
        const command = commands.toLowerCase().split(' ')[0] || ''
        const args =  commands.split(' ')

        const msgs = (message) => {
            if (command.startsWith('!')) {
                if (message.length >= 10){
                    return `${message.substr(0, 15)}`
                }else{
                    return `${message}`
                }
            }
        }

        const mess = {
            wait: '[ WAIT ] Sedang di proses⏳ silahkan tunggu sebentar',
            error: {
                St: '[❗] Kirim gambar dengan caption *!sticker* atau tag gambar yang sudah dikirim',
                Qm: '[❗] Terjadi kesalahan, mungkin themenya tidak tersedia!',
                Yt3: '[❗] Terjadi kesalahan, tidak dapat meng konversi ke mp3!',
                Yt4: '[❗] Terjadi kesalahan, mungkin error di sebabkan oleh sistem.',
                Ig: '[❗] Terjadi kesalahan, mungkin karena akunnya private',
                Ki: '[❗] Bot tidak bisa mengeluarkan admin group!',
                Ad: '[❗] Tidak dapat menambahkan target, mungkin karena di private',
                Iv: '[❗] Link yang anda kirim tidak valid!'
            }
        }
        const apiKey = 'API-KEY'
        const time = moment(t * 1000).format('DD/MM HH:mm:ss')
        const botNumber = await client.getHostNumber()
        const blockNumber = await client.getBlockedIds()
        const groupId = isGroupMsg ? chat.groupMetadata.id : ''
        const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : ''
        const isGroupAdmins = isGroupMsg ? groupAdmins.includes(sender.id) : false
        const isBotGroupAdmins = isGroupMsg ? groupAdmins.includes(botNumber + '@c.us') : false
        const ownerNumber = ["628xxx@c.us","55xxxxx"] // replace with your whatsapp number
        const isOwner = ownerNumber.includes(sender.id)
        const isBlocked = blockNumber.includes(sender.id)
        const isNsfw = isGroupMsg ? nsfw_.includes(chat.id) : false
        const uaOverride = 'WhatsApp/2.2029.4 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36'
        const isUrl = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi)
        if (!isGroupMsg && command.startsWith('!')) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(msgs(command)), 'from', color(pushname))
        if (isGroupMsg && command.startsWith('!')) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(msgs(command)), 'from', color(pushname), 'in', color(formattedTitle))
        if (!isGroupMsg && !command.startsWith('!')) console.log('\x1b[1;33m~\x1b[1;37m>', '[\x1b[1;31mMSG\x1b[1;37m]', time, color(body), 'from', color(pushname))
        //if (isGroupMsg && !command.startsWith('!')) console.log('\x1b[1;33m~\x1b[1;37m>', '[\x1b[1;31mMSG\x1b[1;37m]', time, color(body), 'from', color(pushname), 'in', color(formattedTitle))
        if (isBlocked) return
        //if (!isOwner) return
        switch(command) {
        //Bot Commands
        case '!help':
        case '!menu':
            client.sendText(from, help)
            break
        case '!readme':
            client.reply(from, readme, id)
            break
        case '!about':
            client.sendLinkWithAutoPreview(from, 'Bot_Doujinmoee ', info)
            break
        
        case '!snk':
            client.reply(from, snk, id)
            break
        case '!sticker':
        case '!stiker':
            if (isMedia && type === 'image') {
                const mediaData = await decryptMedia(message, uaOverride)
                const imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                await client.sendImageAsSticker(from, imageBase64)
            } else if (quotedMsg && quotedMsg.type == 'image') {
                const mediaData = await decryptMedia(quotedMsg, uaOverride)
                const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                await client.sendImageAsSticker(from, imageBase64)
            } else if (args.length === 2) {
                const url = args[1]
                if (url.match(isUrl)) {
                    await client.sendStickerfromUrl(from, url, { method: 'get' })
                        .catch(err => console.log('Caught exception: ', err))
                } else {
                    client.reply(from, mess.error.Iv, id)
                }
            } else {
                    client.reply(from, mess.error.St, id)
            }
            break
             case '!ownerbot':
            client.sendContact(from, '6283191735552@c.us')
            break
            case '!botstat': {
            const loadedMsg = await client.getAmountOfLoadedMessages()
            const chatIds = await client.getAllChatIds()
            const groups = await client.getAllGroups()
            client.sendText(from, `Status :\n- *${loadedMsg}* Loaded Messages\n- *${groups.length}* Group Chats\n- *${chatIds.length - groups.length}* Personal Chats\n- *${chatIds.length}* Total Chats`)
            break
        }

       case '!lihatblock':
            let hih = `Oni-chan Silahkan Dilihat\nJumlah : ${blockNumber.length}\n`
            for (let i of blockNumber) {
                hih += `➸ @${i.replace(/@c.us/g,'')}\n`
            }
            client.sendTextWithMentions(from, hih, id)
            break
        case '!donasi':
        case '!donate':
            client.sendLinkWithAutoPreview(from, '*Silahkan Bantu Donasi Bot..Dengan Cara Dibawah Ini*', donate)
            break
             //Bot Commands
             //Groups Commands
        case '!stickergif':
        case '!stikergif':
            if (!isMe) return
            if (isMedia || isQuotedVideo) {
                if (mimetype === 'video/mp4' && message.duration < 10 || mimetype === 'image/gif' && message.duration < 10) {
                    var mediaData = await decryptMedia(message, uaOverride)
                    client.reply(from, '[WAIT] Sedang di proses⏳ silahkan tunggu ± 1 min!', id)
                    var filename = `./media/stickergif.${mimetype.split('/')[1]}`
                    await fs.writeFileSync(filename, mediaData)
                    await exec(`gify ${filename} ./media/stickergf.gif --fps=30 --scale=240:240`, async function (error, stdout, stderr) {
                        var gif = await fs.readFileSync('./media/stickergf.gif', { encoding: "base64" })
                        await client.sendImageAsSticker(from, `data:image/gif;base64,${gif.toString('base64')}`)
                        .catch(() => {
                            client.reply(from, 'Maaf filenya terlalu besar!', id)
                        })
                    })
                  } else {
                    client.reply(from, `[❗] Kirim gif dengan caption *${prefix}stickergif* max 10 sec!`, id)
                   }
                } else {
            client.reply(from, `[❗] Kirim gif dengan caption *${prefix}stickergif*`, id)
            }
            break
        case '!stikergiphy':
        case '!stickergiphy':
            if (!isMe) return
            if (args.length !== 1) return client.reply(from, `Maaf, format pesan salah.\nKetik pesan dengan ${prefix}stickergiphy <link_giphy>`, id)
            const isGiphy = url.match(new RegExp(/https?:\/\/(www\.)?giphy.com/, 'gi'))
            const isMediaGiphy = url.match(new RegExp(/https?:\/\/media.giphy.com\/media/, 'gi'))
            if (isGiphy) {
                const getGiphyCode = url.match(new RegExp(/(\/|\-)(?:.(?!(\/|\-)))+$/, 'gi'))
                if (!getGiphyCode) { return client.reply(from, 'Gagal mengambil kode giphy', id) }
                const giphyCode = getGiphyCode[0].replace(/[-\/]/gi, '')
                const smallGifUrl = 'https://media.giphy.com/media/' + giphyCode + '/giphy-downsized.gif'
                client.sendGiphyAsSticker(from, smallGifUrl).then(() => {
                    client.reply(from, 'Here\'s your sticker')
                    console.log(`Sticker Processed for ${processTime(t, moment())} Second`)
                }).catch((err) => console.log(err))
            } else if (isMediaGiphy) {
                const gifUrl = url.match(new RegExp(/(giphy|source).(gif|mp4)/, 'gi'))
                if (!gifUrl) { return client.reply(from, 'Gagal mengambil kode giphy', id) }
                const smallGifUrl = url.replace(gifUrl[0], 'giphy-downsized.gif')
                client.sendGiphyAsSticker(from, smallGifUrl)
                .then(() => {
                    client.reply(from, 'Here\'s your sticker')
                    console.log(`Sticker Processed for ${processTime(t, moment())} Second`)
                })
                .catch(() => {
                    client.reply(from, `Ada yang error!`, id)
                })
            } else {
                await client.reply(from, 'Maaf, command sticker giphy hanya bisa menggunakan link dari giphy.  [Giphy Only]', id)
            }
            break
                 break   
        case '!linkgroup':
        case '!linkgrup':
            if (!isBotGroupAdmins) return client.reply(from, 'Bot harus jadi admin dulu desu', id)
            if (isGroupMsg) {
                const inviteLink = await client.getGroupInviteLink(groupId);
                client.sendLinkWithAutoPreview(from, inviteLink, `\n *onegaishimasu O ni chan* *${name}*`)
            } else {
                client.reply(from, '*Onichan Gomenasai harus di group desu:(*', id)
            }
            break
            case '!memeindo':
     if (!isGroupMsg) return client.reply(from, 'Onichan Gomenasai harus di group desu!', id)
            const memeindo = fs.readFileSync('./lib/memeindo.json')
            const memeindoJson = JSON.parse(memeindo)
            const memeindoIndex = Math.floor(Math.random() * memeindoJson.length)
            const memeindoKey = memeindoJson[memeindoIndex]
            client.sendFileFromUrl(from, memeindoKey.image, 'memeindo.jpg', memeindoKey.teks)
            break
             case '!meme':
         if (!isGroupMsg) return client.reply(from, 'Onichan Gomenasai harus di group desu!', id)
            if (!isGroupAdmins) return client.reply(from, 'DASAR MEMBER SOK-SOK MAKE FITUR ADMIN!', id)
            const response = await axios.get('https://meme-api.herokuapp.com/gimme/wholesomeanimemes');
            const { postlink, title, subreddit, url, nsfw, spoiler } = response.data
            client.sendFileFromUrl(from, `${url}`, 'meme.jpg', `${title}`)
        break
         case '!kick':
            if (!isGroupMsg) return client.reply(from, '*Onichan Gomenasai harus di group desu:(*', id)
            if (!isGroupAdmins) return client.reply(from, '*DASAR MEMBER SOK-SOK MAKE FITUR ADMIN!!!*', id)
            if (!isBotGroupAdmins) return client.reply(from, 'Bot harus jadi *Admin*', id)
            if (mentionedJidList.length === 0) return client.reply(from, 'cara menggunakan, kirim perintah lalu *!kick* @tagmember', id)
            await client.sendText(from, `Jā matane,Oni-chan:\n${mentionedJidList.join('\n')}`)
            for (let i = 0; i < mentionedJidList.length; i++) {
                if (groupAdmins.includes(mentionedJidList[i])) return client.reply(from, mess.error.Ki, id)
                await client.removeParticipant(groupId, mentionedJidList[i])
            }
            break
        case '!out':
            if(!isGroupMsg) return client.reply(from, '*Onichan Gomenasai harus di group desu:(*', message.id)
            if(!isGroupAdmins) return client.reply(from, '*DASAR MEMBER SOK-SOKAN MAKE FITUR ADMIN!!!*', message.id)
            client.sendText(from,'Mattane Oni-chan')
            client.leaveGroup(groupId)
            break
        case '!promote':
            if (!isGroupMsg) return client.reply(from, '*Onichan Gomenasai harus di group desu:(*', id)
            if (!isGroupAdmins) return client.reply(from, '*DASAR MEMBER SOK-SOK MAKE FITUR ADMIN!!!*', id)
            if (!isBotGroupAdmins) return client.reply(from, 'Onichan Baka Baka Anone aku haru jadi *Admin*', id)
            if (mentionedJidList.length === 0) return client.reply(from, 'Untuk menggunakan fitur ini, kirim perintah *!promote* @tagmember', id)
            if (mentionedJidList.length >= 2) return client.reply(from, 'Gomenasai oni-chan..cuman bisa 1', id)
            if (groupAdmins.includes(mentionedJidList[0])) return client.reply(from, 'Etto..oni-chan dia sudah jadi admin', id)
            await client.promoteParticipant(groupId, mentionedJidList[0])
            await client.sendTextWithMentions(from, `*Wakatta  Oni-chan, menambahkan @${mentionedJidList[0]} sebagai admin.`)
            break
         case '!demote':
            if (!isGroupMsg) return client.reply(from, '*Onichan Gomenasai harus di group desu:(*', id)
            if (!isGroupAdmins) return client.reply(from, '*DASAR MEMBER SOK-SOK MAKE FITUR ADMIN!!!*', id)
            if (!isBotGroupAdmins) return client.reply(from, 'Bot harus jadi *Admin*', id)
            if (mentionedJidList.length === 0) return client.reply(from, 'Oni-chan kirim perintah lalu *!demote* @tagadmin', id)
            if (mentionedJidList.length >= 2) return client.reply(from, 'Gomenasai oni-chan cuman bisa 1 orang.', id)
            if (!groupAdmins.includes(mentionedJidList[0])) return client.reply(from, 'Etto..oni-chan dia bukan admin desu..', id)
            await client.demoteParticipant(groupId, mentionedJidList[0])
            await client.sendTextWithMentions(from, ` *Wakatta Oni Chan* , menurunkan jabawan desu @${mentionedJidList[0]}.`)
            break

       case '!join':
            if (chat.id == invitegrp) {
            if (args.length == 0) return client.reply(from, 'Bakajanaino?IZIN DULU KE > :083191735552', message.id)
            const link = body.slice(6)
            const minMem = 30
            const isLink = link.match(/(https:\/\/chat.whatsapp.com)/gi)
            const check = await client.inviteInfo(link)
            if (!isLink) return client.reply(from, 'Where\'s the link?IZIN DULU KE > :083191735552', message.id)
            if (check.size < minMem) return client.reply(from, 'Gomenasai Oni-chan group kurang 20 IZIN DULU KE > :083191735552', message.id)
            await client.joinGroupViaLink(link).then( async () => {
                await client.reply(from, '*Ikuzo O Ni Chan* ✨️', message.id)
            }).catch(error => {
                client.reply(from, 'Sumimasen 💔️IZIN DULU KE > :083191735552', message.id)
            })
            }
            break
        case '!delete':
            if (!quotedMsg) return client.reply(from, 'Bakaaaa..!!, Oni-chan perintah *!delete [tagpesanbot]*', id)
            if (!quotedMsgObj.fromMe) return client.reply(from, 'Baka baka Baka!!, Anone tidak bisa menghapus', id)
            client.deleteMessage(quotedMsgObj.chatId, quotedMsgObj.id, false)
            break
        
         case '!adminlist':
            if (!isGroupMsg) return client.reply(from, 'Onichan Gomenasai harus di group desu!', id)
            let mimin = ''
            for (let admon of groupAdmins) {
                mimin += `➸ @${admon.replace(/@c.us/g, '')}\n` 
            }
            await client.sendTextWithMentions(from, mimin)
            break
        case '!ownergroup':
            if (!isGroupMsg) return client.reply(from, 'Onichan Gomenasai harus di group desu!', id)
            const Owner_ = chat.groupMetadata.owner
            await client.sendTextWithMentions(from, `Okyakusama :✨️ @${Owner_} ✨️`)
            break
        case '!daftarmember':
            if (!isGroupMsg) return client.reply(from, '*Onichan Gomenasai harus di group desu:(*', id)
            if (!isGroupAdmins) return client.reply(from, '*DASAR MEMBER SOK-SOK MAKE FITUR ADMIN!*', id)
            const groupMem = await client.getGroupMembers(groupId)
            let hehe = '╔══✪〘 *Ini Daftarnya Oni-chan* 〙✪══\n'
            for (let i = 0; i < groupMem.length; i++) {
                hehe += '╠➥'
                hehe += ` @${groupMem[i].id.replace(/@c.us/g, '')}\n`
            }
            hehe += '╚═〘 🎀 𝐻𝑒𝓁𝓁🏵 🎀 Saya Bot_Takagisan 〙'
            await client.sendTextWithMentions(from, hehe)
            break
        case '!kickall':
            if (!isGroupMsg) return client.reply(from, '*Onichan Gomenasai harus di group desu:(*', id)
            const isGroupOwner = sender.id === chat.groupMetadata.owner
            if (!isGroupOwner) return client.reply(from, '*DASAR MEMBER SOK-SOK MAKE FITUR ADMIN!*', id)
            if (!isBotGroupAdmins) return client.reply(from, 'Bot harus jadi *Owner* desu', id)
            const allMem = await client.getGroupMembers(groupId)
            for (let i = 0; i < allMem.length; i++) {
                if (groupAdmins.includes(allMem[i].id)) {
                    console.log('muri muri muri..dia itu admin')
                } else {
                    await client.removeParticipant(groupId, allMem[i].id)
                }
            }
            client.reply(from, ' *Jā matane oni-chan* ', id)
            break
        case '!leaveall':
            if (!isOwner) return client.reply(from, 'Bot harus jadi *Owner*', id)
            const allChats = await client.getAllChatIds()
            const allGroups = await client.getAllGroups()
            for (let gclist of allGroups) {
                await client.sendText(gclist.contact.id, `Bot sedang membersihkan, total chat aktif : ${allChats.length}`)
                await client.leaveGroup(gclist.contact.id)
            }
            client.reply(from, 'Succes leave all group!', id)
            break
        case '!clearall':
            if (!isOwner) return client.reply(from, 'Bot harus jadi *Owner*', id)
            const allChatz = await client.getAllChats()
            for (let dchat of allChatz) {
                await client.deleteChat(dchat.id)
            }
            client.reply(from, 'Berhasil dihapus!', id)
         case '!add':
                if (isGroupMsg && isGroupAdmins) {

                    var invalid = 'number is not valid:\n\n'
                    if (typeof args.join(' ') === 'undefined') { client.reply(from, 'harap masukan nomor.', id) }
                    const datamember = args.join(' ').split(' ').join('@c.us ').split(' ')

                    const loop = async (i) => {
                        if (datamember[i]) {
                            const check = await client.checkNumberStatus(datamember[i])
                            if (check.status != 200) {
                                console.log(check.id.user)
                                //client.sendText(from, `not a whatsapp number: ${check.id.user}`)
                            } else {
                                client.addParticipant(groupId, `${check.id._serialized}`)
                            }
                            setTimeout(() => {
                                loop(i + 1)
                            }, 20000)
                        }
                    }

                    await client.reply(from, `Baka baka baka...!!\n\nTotal number: ${datamember.length}\nDelay: 20s.`, id)

                    loop(0)
                }
                insert(author, type, content, pushname, from, argv)
                break 
                case '!welcome':
            if (!isGroupMsg) return client.reply(from, 'Onichan Gomenasai harus di group desu!', id)
            if (!isGroupAdmins) return client.reply(from, 'DASAR MEMBER SOK-SOK MAKE FITUR ADMIN!', id)
            if (args.length === 1) return client.reply(from, 'Pilih aktifkan atau nonaktifkan!', id)
            if (args[1].toLowerCase() === 'aktifkan') {
                welkom.push(chat.id)
                fs.writeFileSync('./lib/welcome.json', JSON.stringify(welkom))
                client.reply(from, 'Fitur welcome berhasil di aktifkan di group ini!', id)
            } else if (args[1].toLowerCase() === 'nonaktifkan') {
                welkom.splice(chat.id, 1)
                fs.writeFileSync('./lib/welcome.json', JSON.stringify(welkom))
                client.reply(from, 'Fitur welcome berhasil di nonaktifkan di group ini!', id)
            } else {
                client.reply(from, 'Silahkan dipilih [aktifkan] [nonaktifkan]!', id)
            }
            break
            //Group Commands
            //Anime Commands
             case '!wait':
            if (isMedia && type === 'image' || quotedMsg && quotedMsg.type === 'image') {
                if (isMedia) {
                    var mediaData = await decryptMedia(message, uaOverride)
                } else {
                    var mediaData = await decryptMedia(quotedMsg, uaOverride)
                }
                const fetch = require('node-fetch')
                const imgBS4 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                client.reply(from, 'oni-chan tunggu bentar....', id)
                fetch('https://trace.moe/api/search', {
                    method: 'POST',
                    body: JSON.stringify({ image: imgBS4 }),
                    headers: { "Content-Type": "application/json" }
                })
                .then(respon => respon.json())
                .then(resolt => {
                    if (resolt.docs && resolt.docs.length <= 0) {
                        client.reply(from, '*Sumimasen oni-chan*', id)
                    }
                    const { is_adult, title, title_chinese, title_romaji, title_english, episode, similarity, filename, at, tokenthumb, anilist_id } = resolt.docs[0]
                    teks = ''
                    if (similarity < 0.92) {
                        teks = '*Onegaishimasu* :\n\n'
                    }
                    teks += `➸ *Title Japanese* : ${title}\n➸ *Title chinese* : ${title_chinese}\n➸ *Title Romaji* : ${title_romaji}\n➸ *Title English* : ${title_english}\n`
                    teks += `➸ *Ecchi* : ${is_adult}\n`
                    teks += `➸ *Eps* : ${episode.toString()}\n`
                    teks += `➸ *Kesamaan* : ${(similarity * 100).toFixed(1)}%\n`
                    var video = `https://media.trace.moe/video/${anilist_id}/${encodeURIComponent(filename)}?t=${at}&token=${tokenthumb}`;
                    client.sendFileFromUrl(from, video, 'nimek.mp4', teks, id).catch(() => {
                        client.reply(from, teks, id)
                    })
                })
                .catch(() => {
                    client.reply(from, 'Error !', id)
                })
            } else {
                client.sendFile(from, './media/img/tutod.jpg', 'Tutor.jpg', 'Oni-chan lihat contoh', id)
            }
            break

        case '!dog':
            const list = ["https://cdn.shibe.online/shibes/247d0ac978c9de9d9b66d72dbdc65f2dac64781d.jpg","https://cdn.shibe.online/shibes/1cf322acb7d74308995b04ea5eae7b520e0eae76.jpg","https://cdn.shibe.online/shibes/1ce955c3e49ae437dab68c09cf45297d68773adf.jpg","https://cdn.shibe.online/shibes/ec02bee661a797518d37098ab9ad0c02da0b05c3.jpg","https://cdn.shibe.online/shibes/1e6102253b51fbc116b887e3d3cde7b5c5083542.jpg","https://cdn.shibe.online/shibes/f0c07a7205d95577861eee382b4c8899ac620351.jpg","https://cdn.shibe.online/shibes/3eaf3b7427e2d375f09fc883f94fa8a6d4178a0a.jpg","https://cdn.shibe.online/shibes/c8b9fcfde23aee8d179c4c6f34d34fa41dfaffbf.jpg","https://cdn.shibe.online/shibes/55f298bc16017ed0aeae952031f0972b31c959cb.jpg","https://cdn.shibe.online/shibes/2d5dfe2b0170d5de6c8bc8a24b8ad72449fbf6f6.jpg","https://cdn.shibe.online/shibes/e9437de45e7cddd7d6c13299255e06f0f1d40918.jpg","https://cdn.shibe.online/shibes/6c32141a0d5d089971d99e51fd74207ff10751e7.jpg","https://cdn.shibe.online/shibes/028056c9f23ff40bc749a95cc7da7a4bb734e908.jpg","https://cdn.shibe.online/shibes/4fb0c8b74dbc7653e75ec1da597f0e7ac95fe788.jpg","https://cdn.shibe.online/shibes/125563d2ab4e520aaf27214483e765db9147dcb3.jpg","https://cdn.shibe.online/shibes/ea5258fad62cebe1fedcd8ec95776d6a9447698c.jpg","https://cdn.shibe.online/shibes/5ef2c83c2917e2f944910cb4a9a9b441d135f875.jpg","https://cdn.shibe.online/shibes/6d124364f02944300ae4f927b181733390edf64e.jpg","https://cdn.shibe.online/shibes/92213f0c406787acd4be252edb5e27c7e4f7a430.jpg","https://cdn.shibe.online/shibes/40fda0fd3d329be0d92dd7e436faa80db13c5017.jpg","https://cdn.shibe.online/shibes/e5c085fc427528fee7d4c3935ff4cd79af834a82.jpg","https://cdn.shibe.online/shibes/f83fa32c0da893163321b5cccab024172ddbade1.jpg","https://cdn.shibe.online/shibes/4aa2459b7f411919bf8df1991fa114e47b802957.jpg","https://cdn.shibe.online/shibes/2ef54e174f13e6aa21bb8be3c7aec2fdac6a442f.jpg","https://cdn.shibe.online/shibes/fa97547e670f23440608f333f8ec382a75ba5d94.jpg","https://cdn.shibe.online/shibes/fb1b7150ed8eb4ffa3b0e61ba47546dd6ee7d0dc.jpg","https://cdn.shibe.online/shibes/abf9fb41d914140a75d8bf8e05e4049e0a966c68.jpg","https://cdn.shibe.online/shibes/f63e3abe54c71cc0d0c567ebe8bce198589ae145.jpg","https://cdn.shibe.online/shibes/4c27b7b2395a5d051b00691cc4195ef286abf9e1.jpg","https://cdn.shibe.online/shibes/00df02e302eac0676bb03f41f4adf2b32418bac8.jpg","https://cdn.shibe.online/shibes/4deaac9baec39e8a93889a84257338ebb89eca50.jpg","https://cdn.shibe.online/shibes/199f8513d34901b0b20a33758e6ee2d768634ebb.jpg","https://cdn.shibe.online/shibes/f3efbf7a77e5797a72997869e8e2eaa9efcdceb5.jpg","https://cdn.shibe.online/shibes/39a20ccc9cdc17ea27f08643b019734453016e68.jpg","https://cdn.shibe.online/shibes/e67dea458b62cf3daa4b1e2b53a25405760af478.jpg","https://cdn.shibe.online/shibes/0a892f6554c18c8bcdab4ef7adec1387c76c6812.jpg","https://cdn.shibe.online/shibes/1b479987674c9b503f32e96e3a6aeca350a07ade.jpg","https://cdn.shibe.online/shibes/0c80fc00d82e09d593669d7cce9e273024ba7db9.jpg","https://cdn.shibe.online/shibes/bbc066183e87457b3143f71121fc9eebc40bf054.jpg","https://cdn.shibe.online/shibes/0932bf77f115057c7308ef70c3de1de7f8e7c646.jpg","https://cdn.shibe.online/shibes/9c87e6bb0f3dc938ce4c453eee176f24636440e0.jpg","https://cdn.shibe.online/shibes/0af1bcb0b13edf5e9b773e34e54dfceec8fa5849.jpg","https://cdn.shibe.online/shibes/32cf3f6eac4673d2e00f7360753c3f48ed53c650.jpg","https://cdn.shibe.online/shibes/af94d8eeb0f06a0fa06f090f404e3bbe86967949.jpg","https://cdn.shibe.online/shibes/4b55e826553b173c04c6f17aca8b0d2042d309fb.jpg","https://cdn.shibe.online/shibes/a0e53593393b6c724956f9abe0abb112f7506b7b.jpg","https://cdn.shibe.online/shibes/7eba25846f69b01ec04de1cae9fed4b45c203e87.jpg","https://cdn.shibe.online/shibes/fec6620d74bcb17b210e2cedca72547a332030d0.jpg","https://cdn.shibe.online/shibes/26cf6be03456a2609963d8fcf52cc3746fcb222c.jpg","https://cdn.shibe.online/shibes/c41b5da03ad74b08b7919afc6caf2dd345b3e591.jpg","https://cdn.shibe.online/shibes/7a9997f817ccdabac11d1f51fac563242658d654.jpg","https://cdn.shibe.online/shibes/7221241bad7da783c3c4d84cfedbeb21b9e4deea.jpg","https://cdn.shibe.online/shibes/283829584e6425421059c57d001c91b9dc86f33b.jpg","https://cdn.shibe.online/shibes/5145c9d3c3603c9e626585cce8cffdfcac081b31.jpg","https://cdn.shibe.online/shibes/b359c891e39994af83cf45738b28e499cb8ffe74.jpg","https://cdn.shibe.online/shibes/0b77f74a5d9afaa4b5094b28a6f3ee60efcb3874.jpg","https://cdn.shibe.online/shibes/adccfdf7d4d3332186c62ed8eb254a49b889c6f9.jpg","https://cdn.shibe.online/shibes/3aac69180f777512d5dabd33b09f531b7a845331.jpg","https://cdn.shibe.online/shibes/1d25e4f592db83039585fa480676687861498db8.jpg","https://cdn.shibe.online/shibes/d8349a2436420cf5a89a0010e91bf8dfbdd9d1cc.jpg","https://cdn.shibe.online/shibes/eb465ef1906dccd215e7a243b146c19e1af66c67.jpg","https://cdn.shibe.online/shibes/3d14e3c32863195869e7a8ba22229f457780008b.jpg","https://cdn.shibe.online/shibes/79cedc1a08302056f9819f39dcdf8eb4209551a3.jpg","https://cdn.shibe.online/shibes/4440aa827f88c04baa9c946f72fc688a34173581.jpg","https://cdn.shibe.online/shibes/94ea4a2d4b9cb852e9c1ff599f6a4acfa41a0c55.jpg","https://cdn.shibe.online/shibes/f4478196e441aef0ada61bbebe96ac9a573b2e5d.jpg","https://cdn.shibe.online/shibes/96d4db7c073526a35c626fc7518800586fd4ce67.jpg","https://cdn.shibe.online/shibes/196f3ed10ee98557328c7b5db98ac4a539224927.jpg","https://cdn.shibe.online/shibes/d12b07349029ca015d555849bcbd564d8b69fdbf.jpg","https://cdn.shibe.online/shibes/80fba84353000476400a9849da045611a590c79f.jpg","https://cdn.shibe.online/shibes/94cb90933e179375608c5c58b3d8658ef136ad3c.jpg","https://cdn.shibe.online/shibes/8447e67b5d622ef0593485316b0c87940a0ef435.jpg","https://cdn.shibe.online/shibes/c39a1d83ad44d2427fc8090298c1062d1d849f7e.jpg","https://cdn.shibe.online/shibes/6f38b9b5b8dbf187f6e3313d6e7583ec3b942472.jpg","https://cdn.shibe.online/shibes/81a2cbb9a91c6b1d55dcc702cd3f9cfd9a111cae.jpg","https://cdn.shibe.online/shibes/f1f6ed56c814bd939645138b8e195ff392dfd799.jpg","https://cdn.shibe.online/shibes/204a4c43cfad1cdc1b76cccb4b9a6dcb4a5246d8.jpg","https://cdn.shibe.online/shibes/9f34919b6154a88afc7d001c9d5f79b2e465806f.jpg","https://cdn.shibe.online/shibes/6f556a64a4885186331747c432c4ef4820620d14.jpg","https://cdn.shibe.online/shibes/bbd18ae7aaf976f745bc3dff46b49641313c26a9.jpg","https://cdn.shibe.online/shibes/6a2b286a28183267fca2200d7c677eba73b1217d.jpg","https://cdn.shibe.online/shibes/06767701966ed64fa7eff2d8d9e018e9f10487ee.jpg","https://cdn.shibe.online/shibes/7aafa4880b15b8f75d916b31485458b4a8d96815.jpg","https://cdn.shibe.online/shibes/b501169755bcf5c1eca874ab116a2802b6e51a2e.jpg","https://cdn.shibe.online/shibes/a8989bad101f35cf94213f17968c33c3031c16fc.jpg","https://cdn.shibe.online/shibes/f5d78feb3baa0835056f15ff9ced8e3c32bb07e8.jpg","https://cdn.shibe.online/shibes/75db0c76e86fbcf81d3946104c619a7950e62783.jpg","https://cdn.shibe.online/shibes/8ac387d1b252595bbd0723a1995f17405386b794.jpg","https://cdn.shibe.online/shibes/4379491ef4662faa178f791cc592b52653fb24b3.jpg","https://cdn.shibe.online/shibes/4caeee5f80add8c3db9990663a356e4eec12fc0a.jpg","https://cdn.shibe.online/shibes/99ef30ea8bb6064129da36e5673649e957cc76c0.jpg","https://cdn.shibe.online/shibes/aeac6a5b0a07a00fba0ba953af27734d2361fc10.jpg","https://cdn.shibe.online/shibes/9a217cfa377cc50dd8465d251731be05559b2142.jpg","https://cdn.shibe.online/shibes/65f6047d8e1d247af353532db018b08a928fd62a.jpg","https://cdn.shibe.online/shibes/fcead395cbf330b02978f9463ac125074ac87ab4.jpg","https://cdn.shibe.online/shibes/79451dc808a3a73f99c339f485c2bde833380af0.jpg","https://cdn.shibe.online/shibes/bedf90869797983017f764165a5d97a630b7054b.jpg","https://cdn.shibe.online/shibes/dd20e5801badd797513729a3645c502ae4629247.jpg","https://cdn.shibe.online/shibes/88361ee50b544cb1623cb259bcf07b9850183e65.jpg","https://cdn.shibe.online/shibes/0ebcfd98e8aa61c048968cb37f66a2b5d9d54d4b.jpg"]
            let kya = list[Math.floor(Math.random() * list.length)]
            client.sendFileFromUrl(from, kya, 'Dog.jpeg', ' *Kyōdai no inu*')
            break
        case '!cat':
            q2 = Math.floor(Math.random() * 900) + 300;
            q3 = Math.floor(Math.random() * 900) + 300;
            client.sendFileFromUrl(from, 'http://placekitten.com/'+q3+'/'+q2, 'neko.png',' *Kyōdai no neko!* ')
            break
           case '!quotenime':
            fetch('https://raw.githubusercontent.com/HasamiAini/Bot_Takagisan/main/quotenime.txt')
            .then(res => res.text())
            .then(body => {
                let splitmotivasi = body.split('\n')
                let randommotivasi = splitmotivasi[Math.floor(Math.random() * splitmotivasi.length)]
                client.reply(from, randommotivasi, id)
            })
            .catch(() => {
                client.reply(from, '*Gomenasai Onichan Ada yang error!*', id)
            })
            break
      case 'kpop':
        if (!isGroupMsg) return client.reply(from, 'Onichan Gomenasai harus di group desu!', id)
            if (args.length == 0) return client.reply(from, `Untuk menggunakan ${prefix}kpop\nSilahkan ketik: ${prefix}kpop [query]\nContoh: ${prefix}kpop bts\n\nquery yang tersedia:\nblackpink, exo, bts, twice`, id)
            if (args[0] == 'blackpink' || args[0] == 'exo' || args[0] == 'bts' || args[0] == 'twice') {
                fetch('https://raw.githubusercontent.com/HasamiAini/Bot_Takagisan/main/' + args[0] + '.txt')
                .then(res => res.text())
                .then(body => {
                    let randomkpop = body.split('\n')
                    let randomkpopx = randomkpop[Math.floor(Math.random() * randomkpop.length)]
                    client.sendFileFromUrl(from, randomkpopx, '', '*chwihada*\n*BY:Bot_Takagisan Vers.4.2*\nSupport Bot..*Owner Bot:08319173552*\n*!donasi*', id)
                })
                .catch(() => {
                    client.reply(from, '*Gomenasai Onichan Ada yang error!*', id)
                })
            } else {
                client.reply(from, `Gomenasai Onichan Bukan seperti itu ${prefix}kpop untuk melihat list Perintah`)
            }
            break           
     case '!pokemon':
     if (!isGroupMsg) return client.reply(from, 'Onichan Gomenasai harus di group desu!', id)
            q7 = Math.floor(Math.random() * 890) + 1;
            client.sendFileFromUrl(from, 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/'+q7+'.png','Pokemon.png','.', id)
            break
             case '!husbu':
             if (!isGroupMsg) return client.reply(from, 'Onichan Gomenasai harus di group desu!', id)
            const diti = fs.readFileSync('./lib/husbu.json')
            const ditiJsin = JSON.parse(diti)
            const rindIndix = Math.floor(Math.random() * ditiJsin.length)
            const rindKiy = ditiJsin[rindIndix]
            client.sendFileFromUrl(from, rindKiy.image, 'Husbu.jpg', rindKiy.teks, id)
            break
            case '!loli': 
             if (!isGroupMsg) return client.reply(from, 'Onichan Gomenasai harus di group desu!', id)
            const loli = fs.readFileSync('./lib/loli.json')
            const loliJson = JSON.parse(loli)
            const loliIndex = Math.floor(Math.random() * loliJson.length)
            const loliKey = loliJson[loliIndex]
            client.sendFileFromUrl(from, loliKey.image, 'loli.jpg', loliKey.teks)
            break
            case '!waifu': 
            if (!isGroupMsg) return client.reply(from, 'Onichan Gomenasai harus di group desu!', id)
            const waifu = fs.readFileSync('./lib/waifu.json')
            const waifuJson = JSON.parse(waifu)
            const randIndex = Math.floor(Math.random() * waifuJson.length)
            const randKey = waifuJson[randIndex]
            client.sendFileFromUrl(from, randKey.image, 'Waifu.jpg', randKey.teks)
            break
             case '!milf':  
     if (!isGroupMsg) return client.reply(from, 'Onichan Gomenasai harus di group desu!', id)
            const milf = fs.readFileSync('./lib/milf.json')
            const milfJson = JSON.parse(milf)
            const milfIndex = Math.floor(Math.random() * milfJson.length)
            const milfKey = milfJson[milfIndex]
            client.sendFileFromUrl(from, milfKey.image, 'milf.jpg', milfKey.teks)
            break
                //Download Commands
           case '!ytmp3':
            if (args.length === 1) return client.reply(from, 'Kirim perintah *!ytmp3 [linkYt]*, untuk contoh silahkan kirim perintah *!readme*')
            let isLinks = args[1].match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/)
            if (!isLinks) return client.reply(from, mess.error.Iv, id)
            try {
                client.reply(from, mess.wait, id)
                const resp = await get.get(`https://mhankbarbars.herokuapp.com/api/yta?url=${args[1]}&apiKey=${apiKey}`).json()
                if (resp.error) {
                    client.reply(from, resp.error, id)
                } else {
                    const { title, thumb, filesize, result } = await resp
                    if (Number(filesize.split(' MB')[0]) >= 30.00) return client.reply(from, 'Maaf durasi video sudah melebihi batas maksimal!', id)
                    client.sendFileFromUrl(from, thumb, 'thumb.jpg', `➸ *Title* : ${title}\n➸ *Filesize* : ${filesize}\n\nSilahkan tunggu sebentar proses pengiriman file membutuhkan waktu beberapa menit.`, id)
                    await client.sendFileFromUrl(from, result, `${title}.mp3`, '', id).catch(() => client.reply(from, mess.error.Yt3, id))
                    //await client.sendAudio(from, result, id)
                }
            } catch (err) {
                client.sendText(ownerNumber[0], 'Error ytmp3 : '+ err)
                client.reply(from, mess.error.Yt3, id)
            }
            break
        case '!ytmp4':
            if (args.length === 1) return client.reply(from, 'Kirim perintah *!ytmp4 [linkYt]*, untuk contoh silahkan kirim perintah *!readme*')
            let isLin = args[1].match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/)
            if (!isLin) return client.reply(from, mess.error.Iv, id)
            try {
                client.reply(from, mess.wait, id)
                const ytv = await get.get(`https://mhankbarbars.herokuapp.com/api/ytv?url=${args[1]}&apiKey=${apiKey}`).json()
                if (ytv.error) {
                    client.reply(from, ytv.error, id)
                } else {
                    if (Number(ytv.filesize.split(' MB')[0]) > 40.00) return client.reply(from, 'Maaf durasi video sudah melebihi batas maksimal!', id)
                    client.sendFileFromUrl(from, ytv.thumb, 'thumb.jpg', `➸ *Title* : ${ytv.title}\n➸ *Filesize* : ${ytv.filesize}\n\nSilahkan tunggu sebentar proses pengiriman file membutuhkan waktu beberapa menit.`, id)
                    await client.sendFileFromUrl(from, ytv.result, `${ytv.title}.mp4`, '', id).catch(() => client.reply(from, mess.error.Yt4, id))
                }
            } catch (er) {
                client.sendText(ownerNumber[0], 'Error ytmp4 : '+ er)
                client.reply(from, mess.error.Yt4, id)
            }
            break 
                 case '!fb':
            if (args.length === 1) return client.reply(from, 'Kirim perintah *!fb [linkFb]* untuk contoh silahkan kirim perintah *!readme*', id)
            if (!args[1].includes('facebook.com')) return client.reply(from, mess.error.Iv, id)
            client.reply(from, mess.wait, id)
            const epbe = await get.get(`https://mhankbarbars.herokuapp.com/api/epbe?url=${args[1]}&apiKey=${apiKey}`).json()
            if (epbe.error) return client.reply(from, epbe.error, id)
            client.sendFileFromUrl(from, epbe.result, 'epbe.mp4', epbe.title, id)
            break
            //Anime Commands
            //Other Commands
            case '!ss':
            const sesPic = await client.getSnapshot()
            client.sendFile(from, sesPic, 'session.png', 'Oni-chan Ecchi..:(', id)
            break
            case '!#aftarchannel':
            client.reply(from, listChannel, id)
            break
                case '!ig':
            if (args.length === 1) return client.reply(from, 'Kirim perintah *!ig [linkIg]* untuk contoh silahkan kirim perintah *!readme*')
            if (!args[1].match(isUrl) && !args[1].includes('instagram.com')) return client.reply(from, mess.error.Iv, id)
            try {
                client.reply(from, mess.wait, id)
                const resp = await get.get(`https://mhankbarbars.herokuapp.com/api/ig?url=${args[1]}&apiKey=${apiKey}`).json()
                if (resp.result.includes('.mp4')) {
                    var ext = '.mp4'
                } else {
                    var ext = '.jpg'
                }
                await client.sendFileFromUrl(from, resp.result, `igeh${ext}`, '', id)
            } catch {
                client.reply(from, mess.error.Ig, id)
                }
            break
        case '!jadwaltv':
            if (args.length === 1) return client.reply(from, 'Kirim perintah *!jadwalTv [channel]*', id)
            const query = body.slice(10).toLowerCase()
            const jadwal = await jadwalTv(query)
            client.reply(from, jadwal, id)
            break
        case '!jadwaltvnow':
            const jadwalNow = await get.get('https://api.haipbis.xyz/jadwaltvnow').json()
            client.reply(from, `Jam : ${jadwalNow.jam}\n\nJadwalTV : ${jadwalNow.jadwalTV}`, id)
            break
            case '!quotes':
            const quotes = await get.get('https://mhankbarbar.herokuapp.com/api/randomquotes').json()
            client.reply(from, `➸ *Quotes* : ${quotes.quotes}\n➸ *Author* : ${quotes.author}`, id)
            break
             case '!brainly':
            if(args.length >= 1){
                function BrainlySearch(pertanyaan, amount,cb){
                    brainly(pertanyaan.toString(),Number(amount)).then(res => { 
                        let brainlyResult=[];   
                    res.forEach(ask=>{
                        let opt={
                            pertanyaan:ask.pertanyaan,
                            fotoPertanyaan:ask.questionMedia,
                        }
                        ask.jawaban.forEach(answer=>{
                            opt.jawaban={
                                judulJawaban:answer.text,
                                fotoJawaban:answer.media
                            }
                        })
                        brainlyResult.push(opt)
                        })  
                        return brainlyResult    
                    }).then(x=>{
                        cb(x)   
                    }).catch(err=>{
                        console.log(`${err}`.error)
                    })
                    }
                    const brainly = require('brainly-scraper')
                    let tanya = body.slice(9)
                    console.log(tanya.length-1)
                    let jum = Number(tanya.split('.')[1]) || 2
                    if(Number(tanya[tanya.length-1])){
                        tanya
                    }
                    let quest = body.slice(9)
                    client.reply(from, `*Pertanyaan : ${quest.split(' .')[0]}*\n*Jumlah jawaban : ${Number(jum)}*`, message.id)
                    BrainlySearch(quest.split(' .')[0],Number(jum), function(res){
                        console.log(res)
                        res.forEach(x=>{
                            client.reply(from, `*foto pertanyaan*\n${x.fotoPertanyaan.join('\n')}\n*pertanyaan :*\n${x.pertanyaan}\n\n*jawaban :*\n${x.jawaban.judulJawaban}\n\n*foto jawaban*\n${x.jawaban.fotoJawaban.join('\n')}`, message.id)
                        })
                    })
            } else {
                client.reply(from, 'Usage :\n!brainly <pertanyaan> <.jumlah>\n\nEx : \n!brainly NKRI .2', message.id)
            }
            break 
             case '!createmaker':

            arg = body.trim().split('|')
            if (arg.length >= 4) {
                client.reply(from, mess.wait, id)
                const quotes = encodeURIComponent(arg[1])
                const author = encodeURIComponent(arg[2])
                const theme = encodeURIComponent(arg[3])
                await quotemaker(quotes, author, theme).then(amsu => {
                    client.sendFile(from, amsu, 'quotesmaker.jpg','').catch(() => {
                       client.reply(from, mess.error.Qm, id)
                    })
                })
            } else {
                client.reply(from, 'Caranya: \n!createmaker |teks|author|background\n\nContoh :\n!createmaker |ini contoh|oni-chan|random', id)
            } 
            case '!jadwalshalat':
            if (args.length === 1) return client.reply(from, '[❗] Kirim perintah *!jadwalShalat [daerah]*\ncontoh : *!jadwalShalat Tangerang*\nUntuk list daerah kirim perintah *!listDaerah*')
            const daerah = body.slice(14)
            const jadwalShalat = await get.get(`https://mhankbarbar.herokuapp.com/api/jadwalshalat?daerah=${daerah}&apiKey=${apiKey}`).json()
            if (jadwalShalat.error) return client.reply(from, jadwalShalat.error, id)
            const { Imsyak, Subuh, Dhuha, Dzuhur, Ashar, Maghrib, Isya } = await jadwalShalat
            arrbulan = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
            tgl = new Date().getDate()
            bln = new Date().getMonth()
            thn = new Date().getFullYear()
            const resultJadwal = `Jadwal shalat di ${daerah}, ${tgl}-${arrbulan[bln]}-${thn}\n\nImsyak : ${Imsyak}\nSubuh : ${Subuh}\nDhuha : ${Dhuha}\nDzuhur : ${Dzuhur}\nAshar : ${Ashar}\nMaghrib : ${Maghrib}\nIsya : ${Isya}`
            client.reply(from, resultJadwal, id)
            break
            case '!lirik':
            if (args.length == 1) return client.reply(from, 'Kirim perintah *!lirik [optional]*, contoh *!lirik Shiawase*', id)
            const lagu = body.slice(7)
            const lirik = await liriklagu(lagu)
            client.reply(from, lirik, id)
            break
        case '!tts':
            if (args.length === 1) return client.reply(from, 'Gunakan Perintah *!tts [id, en, jp, ar] [teks]*, contoh *!tts id Oni-chan*')
            const ttsId = require('node-gtts')('id')
            const ttsEn = require('node-gtts')('en')
        const ttsJp = require('node-gtts')('ja')
            const ttsAr = require('node-gtts')('ar')
            const dataText = body.slice(8)
            if (dataText === '') return client.reply(from, 'Bakajanaino?', id)
            if (dataText.length > 500) return client.reply(from, 'Gomenne onichan teks terlalu panjang!', id)
            var dataBhs = body.slice(5, 7)
            if (dataBhs == 'id') {
                ttsId.save('./media/tts/resId.mp3', dataText, function () {
                    client.sendPtt(from, './media/tts/resId.mp3', id)
                })
            } else if (dataBhs == 'en') {
                ttsEn.save('./media/tts/resEn.mp3', dataText, function () {
                    client.sendPtt(from, './media/tts/resEn.mp3', id)
                })
            } else if (dataBhs == 'jp') {
                ttsJp.save('./media/tts/resJp.mp3', dataText, function () {
                    client.sendPtt(from, './media/tts/resJp.mp3', id)
                })
        } else if (dataBhs == 'ar') {
                ttsAr.save('./media/tts/resAr.mp3', dataText, function () {
                    client.sendPtt(from, './media/tts/resAr.mp3', id)
                })
            } else {
                client.reply(from, 'Masukkan kode bahasa : *{id}* untuk bahasa indonesia, *{en}* untuk bahasa inggris, *{jp}* untuk bahasa jepang, dan *{ar}* untuk bahasa arab', id)
            }
            break
             case '!takagisan':
            client.reply(from, '*Onegaishimasu*\n1. *!vn1*\n2. *!vn2*\n3. *!vn3*\n4. *!vn4*\n5. *!vn5*\n6. *!vn6*\n', id)
            break

    case '!vn6':
    case '!vn 6':
            client.sendPtt(from, './media/Takagisan6.mp3',)
            break
    case '!vn5':
    case '!vn 5':
            client.sendPtt(from, './media/Takagisan5.mp3',)
            break
    case '!vn4':
    case '!vn 4':
            client.sendPtt(from, './media/Takagisan4.mp3',)
            break
    case '!vn3':
    case '!vn 3':
            client.sendPtt(from, './media/Takagisan3.mp3',)
            break
    case '!vn2':
    case '!vn 2':
            client.sendPtt(from, './media/Takagisan2.mp3',)
            break
           

    case '!vn1':
            client.sendPtt(from, './media/Takagisan.mp3',)
            break
            case '#ringtone':
    if (!isNsfw) return client.reply(from, ' *Anone..Okanenya oni-chan* ', id)   
            const ringtone = fs.readFileSync('./lib/ringtone.json')
            const ringtoneJson = JSON.parse(ringtone)
            const ringtoneIndex = Math.floor(Math.random() * ringtoneJson.length)
            const ringtoneKey = ringtoneJson[ringtoneIndex]
            client.sendFileFromUrl(from, ringtoneKey.mp3, 'ringtoneloli.mp3', ringtoneKey.teks)
            break
             //Other Commands
             //Islam Commands
             
              //Islam Commands
               //Anime Walpaper
    case '!randomwalpaper' :
    case '!walpaperrandom' :
    case '!wallpaperrandom' :
    case '!randomwallpaper' :
            q4 = Math.floor(Math.random() * 800) + 100;
            client.sendFileFromUrl(from, 'https://wallpaperaccess.com/download/beautiful-android-'+q4,'Wallpaper.png','SILAHKAN DIAMBIL')
            break

    case '!walpaper' :
    case '!wallpaper' :
            q4 = Math.floor(Math.random() * 800) + 100;
            client.sendFileFromUrl(from, 'https://wallpaperaccess.com/download/anime-'+q4,'Anime Wallpaper.png','Silahkan Ambil')
            break
    case '!happygirl' :
    case '!HappyGirl' :
            q4 = Math.floor(Math.random() * 800) + 100;
            client.sendFileFromUrl(from, 'https://wallpaperaccess.com/download/happy-anime-girl-'+q4,'Anime Happy Girl.png','Silahkan Ambil')
            break
    case '!happyboy' :
    case '!HappyBoy' :
            q4 = Math.floor(Math.random() * 800) + 100;
            client.sendFileFromUrl(from, 'https://wallpaperaccess.com/download/happy-anime-boy-'+q4,'Anime Happy Boy.png','Silahkan Ambil')
            break
    case '!sadgirl' :
    case '!SadGirl' :
            q4 = Math.floor(Math.random() * 800) + 100;
            client.sendFileFromUrl(from, 'https://wallpaperaccess.com/download/anime-sad-girl-'+q4,'Anime sad girl.png','Silahkan Ambil')
            break
    case '!sadboy' :
    case '!SadBoy' :
            q4 = Math.floor(Math.random() * 800) + 100;
            client.sendFileFromUrl(from, 'https://wallpaperaccess.com/download/anime-sad-boy-'+q4,'Anime sad boy.png','Here is your wallpaper')
            break 

    case '!dh' :
            q4 = Math.floor(Math.random() * 800) + 100;
            client.sendFileFromUrl(from, 'https://wallpaperaccess.com/download/anime-boy-'+q4,'Husbu Wallpaper.png','Here is your wallpaper')
            break
    case '!dw' :
            q4 = Math.floor(Math.random() * 800) + 100;
            client.sendFileFromUrl(from, 'https://wallpaperaccess.com/download/waifu-'+q4,'Waifu Wallpaper.png','Here is your wallpaper')
            break
             //Anime Walpaper
         case '!nulis':
            if (!isMe) return
            if (args.length == 0) return client.reply(from, `Membuat bot menulis teks yang dikirim menjadi gambar\nPemakaian: ${prefix}nulis [teks]\n\ncontoh: ${prefix}nulis i love you 3000`, id)
            const nulisq = body.slice(7)
            const nulisp = await rugaapi.tulis(nulisq)
            await client.sendImage(from, `${nulisp}`, '', 'Nih...', id)
            .catch(() => {
                client.reply(from, 'Ada yang Error!', id)
            })
            break
        case '!mode':
            if (!isGroupMsg) return client.reply(from, '*Onichan Gomenasai harus di group desu:(..*', id)
            if (!isGroupAdmins) return client.reply(from, '*DASAR MEMBER SOK-SOK MAKE FITUR ADMIN!*', id)
            if (args.length === 1) return client.reply(from, 'Pilih *premium* atau *trial!*', id)
            if (args[1].toLowerCase() === 'premium') {
                nsfw_.push(chat.id)
                fs.writeFileSync('./lib/NSFW.json', JSON.stringify(nsfw_))
                client.reply(from, '*oni-chan Sugoi..!!* *premium* perintah berhasil di aktifkan di group ini! kirim perintah *!premium*', id)
            } else if (args[1].toLowerCase() === 'trial') {
                nsfw_.splice(chat.id, 1)
                fs.writeFileSync('./lib/NSFW.json', JSON.stringify(nsfw_))
                client.reply(from, '*Sumimasen* *trial* perintah berhasil di aktifkan di group ini!', id)
            } else {
                client.reply(from, 'Silahkan dipilih [premium] [trial]!', id)
            }
            break
       
        case '!premium':
            if (!isNsfw) return
            client.reply(from, 'Daftar Melalui Nomor Ini Desu >083191735552 atau wa.me/6283191735552', id)
            break
       
        case '!bc':
            if (!isOwner) return client.reply(from, 'Bot harus jadi *Owner* desu', id)
            let msg = body.slice(4)
            const chatz = await client.getAllChatIds()
            for (let ids of chatz) {
                var cvk = await client.getChatById(ids)
                if (!cvk.isReadOnly) await client.sendText(ids, `[ 🎀 𝐻𝑒𝓁𝓁🏵 🎀 Saya Bot_Doujinmoee ]\n\n${msg}`)
            }
            client.reply(from, 'Broadcast Success!', id)
            break
        
        break
        case '!daftardaerah':
            const listDaerah = await get('https://mhankbarbar.herokuapp.com/daerah').json()
            client.reply(from, listDaerah.result, id)
            break 
         
        case '!randomhentai':
            if (isGroupMsg) {
                if (!isNsfw) return client.reply(from, 'Perinta NSFW belum aktif didalam Group ini!', id)
                const hentai = await randomNimek('https://api.computerfreaker.cf/v1/henta')
                if (hentai.endsWith('.png')) {
                    var ext = '.png'
                } else {
                    var ext = '.jpg'
                }
                client.sendFileFromUrl(from, hentai, `Hentai${ext}`, 'Hentai!', id)
                break
            } else {
                const hentai = await randomNimek('hentai')
                if (hentai.endsWith('.png')) {
                    var ext = '.png'
                } else {
                    var ext = '.jpg'
                }
                client.sendFileFromUrl(from, hentai, `Hentai${ext}`, 'Hentai!', id)
            }
        case '!randomnsfwneko':
            if (isGroupMsg) {
                if (!isNsfw) return client.reply(from, 'Perinta NSFW belum aktif didalam Group ini!', id)
                const nsfwneko = await randomNimek('nsfw')
                if (nsfwneko.endsWith('.png')) {
                    var ext = '.png'
                } else {
                    var ext = '.jpg'
                }
                client.sendFileFromUrl(from, nsfwneko, `nsfwNeko${ext}`, 'Nsfwneko!', id)
            } else {
                const nsfwneko = await randomNimek('nsfw')
                if (nsfwneko.endsWith('.png')) {
                    var ext = '.png'
                } else {
                    var ext = '.jpg'
                }
                client.sendFileFromUrl(from, nsfwneko, `nsfwNeko${ext}`, 'Nsfwneko!', id)
            }
            break 
        case '!randomtrapnime':
            const trap = await randomNimek('trap')
            if (trap.endsWith('.png')) {
                var ext = '.png'
            } else {
                var ext = '.jpg'
            }
            client.sendFileFromUrl(from, trap, `trapnime${ext}`, 'Trapnime!', id)
            break

        case '!sendto':
            client.sendFile(from, './msgHndlr.js', 'msgHndlr.js')
            break
        case '!url2img':
            const _query = body.slice(9)
            if (!_query.match(isUrl)) return client.reply(from, mess.error.Iv, id)
            if (args.length === 1) return client.reply(from, 'Kirim perintah *!url2img [web]*\nContoh *!url2img https://google.com*', id)
            const url2img = await get.get(`https://mhankbarbar.herokuapp.com/api/url2image?url=${_query}&apiKey=${apiKey}`).json()
            if (url2img.error) return client.reply(from, url2img.error, id)
            client.sendFileFromUrl(from, url2img.result, 'kyaa.jpg', null, id)
            break
         case '!revLinkGrup':
            if(isGroupMsg && isBotGroupAdmins && isGroupAdmins) {
                await client.revokeGroupInviteLink(groupId)
            } else if(!isGroupMsg) {
                client.reply(from, 'Fitur ini hanya bisa di gunakan dalam group', message.id)
            } else if(!isGroupAdmins) {
                client.reply(from, 'Fitur ini hanya bisa di gunakan oleh admin group', message.id)
            } else if(!isBotGroupAdmins) {
                client.reply(from, 'Fitur ini hanya bisa di gunakan ketika bot menjadi admin', message.id)
            }
            break
          //ERROR
                case '!puisi':
            fetch('https://raw.githubusercontent.com/HasamiAini/Bot_Takagisan/main/puisi.txt')
            .then(res => res.text())
            .then(body => {
                let splitnix = body.split('\n')
                let randomnix = splitnix[Math.floor(Math.random() * splitnix.length)]
                client.reply(from, randomnix, id)
            })
            .catch(() => {
                client.reply(from, '*Gomenasai Onichan Ada yang error!*', id)
            })
            break
         case '!':
         case '! ':
         case ' !':
         case '!anime':
                {
                client.reply(from, '*Halo anda terdeteksi menggunakan fitur yang tidak tersediah.. 1kali lagi anda akan Di BANNED PERMANEN*', message.id)
            }
            break
    //NEWFITUR
                case '!semangat':
            fetch('https://raw.githubusercontent.com/HasamiAini/Bot_Takagisan/main/motivasi.txt')
            .then(res => res.text())
            .then(body => {
                let splitmotivasi = body.split('\n')
                let randommotivasi = splitmotivasi[Math.floor(Math.random() * splitmotivasi.length)]
                client.reply(from, randommotivasi, id)
            })
            .catch(() => {
                client.reply(from, '*Gomenasai Onichan Ada yang error!*', id)
            })
            break
                 case '!fakta':
                case 'faktaunik':
            fetch('https://raw.githubusercontent.com/HasamiAini/Bot_Takagisan/main/faktanya.txt')
            .then(res => res.text())
            .then(body => {
                let splitnix = body.split('\n')
                let randomnix = splitnix[Math.floor(Math.random() * splitnix.length)]
                client.reply(from, randomnix, id)
            })
            .catch(() => {
                client.reply(from, '*Gomenasai Onichan Ada yang error!*', id)
            })
            break
                case '!bijak':
            fetch('https://raw.githubusercontent.com/HasamiAini/Bot_Takagisan/main/katabijak.txt')
            .then(res => res.text())
            .then(body => {
                let splitbijak = body.split('\n')
                let randombijak = splitbijak[Math.floor(Math.random() * splitbijak.length)]
                client.reply(from, randombijak, id)
            })
            .catch(() => {
                client.reply(from, '*Gomenasai Onichan Ada yang error!*', id)
            })
            break
             case '!logoteks':
        if (!isGroupMsg) return client.reply(from, '*Onichan Gomenasai harus di group desu:(..*', id)
            if (!isGroupAdmins) return client.reply(from, '*DASAR MEMBER SOK-SOK MAKE FITUR ADMIN!*', id)
            if (args.length === 1) return client.reply(from, `Kirim perintah *#logoteks [ |kalimat1|kalimat2 ]*,\n\n contoh : *#bot |takagisan| vers.4.5*`, id)
            argz = body.trim().split('|')
            if (argz.length >= 2) {
                client.reply(from, `*Chottomatte Onichan Lagi Dibuat*`, id)
                const lpornhub = argz[1]
                const lpornhub2 = argz[2]   
                if (lpornhub > 10) return client.reply(from, 'Baka..!Kalimat1 Kepanjangan*\n_Maksimal 10 huruf!_', id)
                if (lpornhub2 > 10) return client.reply(from, '*Baka..!Kalimat2 Kepanjangan*\n_Maksimal 10 huruf!_', id)
                client.sendFileFromUrl(from, `https://docs-jojo.herokuapp.com/api/phblogo?text1=${lpornhub}&text2=${lpornhub2}`)
            } else {
                await client.reply(from, `Hadeh Onichan BAKAJANAINO?\n[❗] Kirim perintah *#logoteks [ |Teks1| Teks2 ]*,\n\n contoh : *#bot |takagisan| vers.4.5*`, id)
            }
            break
                case 'games':
                case 'game':
    client.reply(from, 'Sebelum bermain berjanjilah akan melaksanakan apapun perintah yang diberikan.\n\nSilahkan Pilih:\n➥ #kebenaran\n➥ #tantangan', id)
    break
    case 'kebenaran':
    case 'truth':
    if (!isGroupMsg) return client.reply(from, menuId.textPrem())
            fetch('https://raw.githubusercontent.com/HasamiAini/Bot_Takagisan/main/kebenaran.txt')
            .then(res => res.text())
            .then(body => {
                let truthx = body.split('\n')
                let truthz = truthx[Math.floor(Math.random() * truthx.length)]
                client.reply(from, truthz, id)
            })
            .catch(() => {
                client.reply(from, 'Hayolohhh, ada yang error!!', id)
            })
            break
    case 'tantangan':
    case 'dare':
    if (!isGroupMsg) return client.reply(from, menuId.textPrem())
            fetch('https://raw.githubusercontent.com/HasamiAini/Bot_Takagisan/main/tantangan.txt')
            .then(res => res.text())
            .then(body => {
                let darex = body.split('\n')
                let darez = darex[Math.floor(Math.random() * darex.length)]
                client.reply(from, darez, id)
            })
            .catch(() => {
                client.reply(from, 'Oh Tidak Onichan Ada Yang Error!', id)
            })
            break
                case '!nolink':
                  if (!isGroupMsg) return client.reply(from, '*Onichan Gomenasai harus di group desu:(..*', id)
            if (!isGroupAdmins) return client.reply(from, '*DASAR MEMBER SOK-SOK MAKE FITUR ADMIN!*', id)
                    if (args[0] == 'on') {
                        var cek = antilink.includes(chatId);
                        if(cek){
                            return client.reply(from, '*Anti Group Link Detector* sudah aktif di grup ini', id) //if number already exists on database
                        } else {
                            antilink.push(chatId)
                            fs.writeFileSync('./lib/helper/antilink.json', JSON.stringify(antilink))
                            client.reply(from, '*[Anti Group Link]* telah di aktifkan\nSetiap member grup yang mengirim pesan mengandung link grup akan di kick oleh bot!', id)
                        }
                    } else if (args[0] == 'off') {
                        var cek = antilink.includes(chatId);
                        if(!cek){
                            return client.reply(from, '*Anti Group Link Detector* sudah non-aktif di grup ini', id) //if number already exists on database
                        } else {
                            let nixx = antilink.indexOf(chatId)
                            antilink.splice(nixx, 1)
                            fs.writeFileSync('./lib/helper/antilink.json', JSON.stringify(antilink))
                            client.reply(from, '*[Anti Group Link]* telah di nonaktifkan\n', id)
                        }
                    } else {
                        client.reply(from, `pilih on / off\n\n*[Anti Group Link]*\nSetiap member grup yang mengirim pesan mengandung link grup akan di kick oleh bot!`, id)
                    }
                    break
           case '!antispamsticker':
            case '!antisticker':
                if (!isGroupMsg) return client.reply(from, '*Onichan Gomenasai harus di group desu:(..*', id)
            if (!isGroupAdmins) return client.reply(from, '*DASAR MEMBER SOK-SOK MAKE FITUR ADMIN!*', id)
                    if (args[0] == 'aktif') {
                        var cek = antisticker.includes(chatId);
                        if(cek){
                            return client.reply(from, '*Pendeteksi Spam Sticker* sudah Dihidupkan di grup ini', id) //if number already exists on database
                        } else {
                            antisticker.push(chatId)
                            fs.writeFileSync('./lib/helper/antisticker.json', JSON.stringify(antisticker))
                            client.reply(from, '*{Pendeteksi Spam Sticker}* telah aktif\n*Jika Spam Sticker 7kali Member Akan Dikick Bot..!*', id)
                        }
                    } else if (args[0] == 'nonaktifkan') {
                        var cek = antilink.includes(chatId);
                        if(cek){
                            return client.reply(from, '*Pendeteksi Spam Sticker* sudah Dimatikan di grup ini', id) //if number already exists on database
                        } else {
                            let nixx = antisticker.indexOf(chatId)
                            antisticker.splice(nixx, 1)
                            fs.writeFileSync('./lib/helper/antisticker.json', JSON.stringify(antisticker))
                            client.reply(from, '*[Pendeteksi Spam Sticker]* telah di nonaktifkan\n', id)
                        }
                    } else {
                        client.reply(from, `pilih aktif atau nonaktifkan\n\n*[Pendeteksi Spam Sticker]*\nSetiap member grup yang spam sticker akan di kick oleh bot!`, id)
                    }
                    break      
    //Profil Bot 
     case '!bot': 
            const takagi = fs.readFileSync('./lib/takagi.json')
            const takagiJson = JSON.parse(takagi)
            const takagiIndex = Math.floor(Math.random() * takagiJson.length)
            const takagiKey = takagiJson[takagiIndex]
            client.sendFileFromUrl(from, takagiKey.image, 'takagi.jpg', takagiKey.teks)
            break
     case '!vn':
            client.reply(from, '*Onegaishimasu*\n1. *!vn1*\n2. *!vn2*\n3. *!vn3*\n4. *!vn4*\n5. *!vn5*\n6. *!vn6*\n', id)
            break

    case '!vndaisuki':
    case '!vn daisuki':
            client.sendPtt(from, './media/Oniichan Daisuki.mp3',)
            break
    case '!vnbirthday':
    case '!vn birthday':
            client.sendPtt(from, './media/Oniichan happy birthday.mp3',)
            break
    case '!vnloli3':
    case '!vnloli 3':
            client.sendPtt(from, './media/Oniichan1.mp3',)
            break
    case '!vnloli4':
    case '!vnloli 4':
            client.sendPtt(from, './media/Oniichan Notifications V.3.mp3',)
            break
    case '!vnloli5':
    case '!vnloli 5':
            client.sendPtt(from, './media/Oniichan Notifications V.4.mp3',)
            break
            
     case '!mecha':
      if (!isNsfw) return client.reply(from, ' *Anone..Okanenya oni-chan* ', id)
            const mecha = fs.readFileSync('./lib/mecha.json')
            const mechaJson = JSON.parse(mecha)
            const mechaIndex = Math.floor(Math.random() * mechaJson.length)
            const mechaKey = mechaJson[mechaIndex]
            client.sendFileFromUrl(from, mechaKey.image, 'mecha.jpg', mechaKey.teks)
            break
    
     case '!user':
     if (!isNsfw) return client.reply(from, ' *Anone..Okanenya oni-chan* ', id) 
        const username = body.slice(6)
        const result = await axios.get(`https://api.jikan.moe/v3/user/${username}`)
        const jikan =  result.data

var Data = `🔖️ Username: ${jikan.username}

📒️ User ID: ${jikan.user_id}

❤️ Gender: ${jikan.gender}

🌍️ Location: ${jikan.location}

📆️ Joined: ${jikan.joined}

⭐️ Anime Stats ⭐️

Days Watched: ${jikan.anime_stats.days_watched}

Mean Score: ${jikan.anime_stats.mean_score}

Currently Watching: ${jikan.anime_stats.watching}

Completed: ${jikan.anime_stats.completed}

On Hold: ${jikan.anime_stats.on_hold}

Dropped: ${jikan.anime_stats.dropped}

Plan to Watch: ${jikan.anime_stats.plan_to_watch}

🎯️ Manga Stats 🎯️

Days Read: ${jikan.manga_stats.days_read}

Mean Score: ${jikan.manga_stats.mean_score}

Currently Reading: ${jikan.manga_stats.reading}

Completed: ${jikan.manga_stats.completed}

On Hold: ${jikan.manga_stats.on_hold}

Dropped: ${jikan.manga_stats.dropped}

Plan to Read: ${jikan.manga_stats.plan_to_read}`
        await client.sendFileFromUrl(from, `${jikan.image_url}`,`user.png`, Data)
        break
     case '!karakter':
     if (!isNsfw) return client.reply(from, ' *Anone..Okanenya oni-chan* ', id) 
            if (isMedia) {
            const mediaData = await decryptMedia(message)
            const imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
             try {
                const raw = await fetch("https://trace.moe/api/search", {
                method: "POST",
                body: JSON.stringify({ image: imageBase64 }),
                headers: { "Content-Type": "application/json" }
                })
                const parsedResult = await raw.json()
                const { anime, episode, title_english } = parsedResult.docs[0]
                const content = `*Anime Found!* \n⛩️ *Japanese Title:* ${anime} \n✨️ *English Title:* ${title_english} \n💚️ *Source Episode:* ${episode} `
                await client.sendImage(from, imageBase64, 'sauce.png', content, id)
                console.log("Sent!")
             } catch (err) {
                await client.sendFileFromUrl(from, errorurl, 'error.png', '💔️ An Error Occured', id)
             }
            } else if (quotedMsg && quotedMsg.type == 'image') {
                const mediaData = await decryptMedia(quotedMsg)
                const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                try {
                 const raw = await fetch("https://trace.moe/api/search", {
                 method: "POST",
                 body: JSON.stringify({ image: imageBase64 }),
                 headers: { "Content-Type": "application/json" }
                 })
                 const parsedResult = await raw.json()
                 const { anime, episode, title_english } = parsedResult.docs[0]
                 const content = `*Anime Found!* \n⛩️ *Japanese Title:* ${anime} \n✨️ *English Title: ${title_english} \n💚️ *Source Episode:* ${episode} `
                 await client.sendImage(from, imageBase64, 'sauce.png', content, id)
                 console.log("Sent!")
               } catch (err) {
                 throw new Error(err.message)
                 await client.sendFileFromUrl(from, errorurl, 'error.png', '💔️ An Error Occured', id)
               }
            }
            break
    case '!myanime':
            const keyword = message.body.replace('!#anime', '')
            try {
            const data = await fetch(
           `https://api.jikan.moe/v3/search/anime?q=${keyword}`
            )
            const parsed = await data.json()
            if (!parsed) {
              await client.sendFileFromUrl(from, errorurl2, 'error.png', '💔️ Sorry, Couldn\'t find the requested anime', id)
              return null
              }
            const { title, synopsis, episodes, url, rated, score, image_url } = parsed.results[0]
            const content = `*Anime Found!*
✨️ *Title:* ${title}

🎆️ *Episodes:* ${episodes}

💌️ *Rating:* ${rated}

❤️ *Score:* ${score}

💚️ *Synopsis:* ${synopsis}

🌐️ *URL*: ${url}`

            const image = await bent("buffer")(image_url)
            const base64 = `data:image/jpg;base64,${image.toString("base64")}`
            client.sendImage(from, base64, title, content)
           } catch (err) {
             console.error(err.message)
             await client.sendFileFromUrl(from, errorurl2, 'error.png', '💔️ Sorry, Couldn\'t find the requested anime')
           }
          break

     case '!costom':
     if (!isGroupAdmins) return client.reply(from, '*DASAR MEMBER SOK-SOK MAKE FITUR ADMIN!*', id)
     if (!isNsfw) return client.reply(from, ' *Anone..Okanenya oni-chan* ', id) 
                arg = body.trim().split('|')
                if ((isMedia || isQuotedImage) && arg.length >= 2) {
                const top = arg[1]
                const bottom = arg[2]
                const encryptMedia = isQuotedImage ? quotedMsg : message
                const mediaData = await decryptMedia(encryptMedia, uaOverride)
                const getUrl = await uploadImages(mediaData, false)
                const ImageBase64 = await custom(getUrl, top, bottom)
                await client.sendFile(from, ImageBase64, 'image.png', '', '...', true)
                } else {
                await client.reply(from, 'Wrong Format!', id)
                }
                break
    case '!profile':
    if (!isNsfw) return client.reply(from, ' *Anone..Okanenya oni-chan* ', id) 
            var role = 'None'
              if (isGroupMsg) {
              if (!quotedMsg) {
              var block = ban.includes(author)
              var pic = await client.getProfilePicFromServer(author)
              var namae = pushname
              var sts = await client.getStatus(author)
              var adm = isGroupAdmins
              const { status } = sts
               if (pic == undefined) {
               var pfp = errorurl 
               } else {
               var pfp = pic
               } 
             await client.sendFileFromUrl(from, pfp, 'pfp.jpg', `🔖️ *Username: ${namae}*\n\n💌️ *User Info: ${status}*\n\n*💔️ Ban: ${block}*\n\n✨️ *Role: ${role}*\n\n 👑️ *Admin: ${adm}*`)
             } else if (quotedMsg) {
             var qmid = quotedMsgObj.sender.id
             var block = ban.includes(qmid)
             var pic = await client.getProfilePicFromServer(qmid)
             var namae = quotedMsgObj.sender.formattedName
             var sts = await client.getStatus(qmid)
             var admgrp = await client.getGroupAdmins(from)
             var adm = admgrp.includes(qmid)
             const { status } = sts
              if (pic == undefined) {
              var pfp = errorurl 
              } else {
              var pfp = pic
              } 
             await client.sendFileFromUrl(from, pfp, 'pfo.jpg', `🔖️ *Username: ${namae}*\n\n💌️ *User Info: ${status}*\n\n*💔️ Ban: ${block}*\n\n✨️ *Role: ${role}*\n\n 👑️ *Admin: ${adm}*`)
             }
            }
            break
    case '!groupinfo' :
    if (!isNsfw) return client.reply(from, ' *Anone..Okanenya oni-chan* ', id) 
            if (!isGroupMsg) return client.reply(from, '.', message.id) 
            var totalMem = chat.groupMetadata.participants.length
            var desc = chat.groupMetadata.desc
            var groupname = name
            var welgrp = wel.includes(chat.id)
            var ngrp = nsfwgrp.includes(chat.id)
            var grouppic = await client.getProfilePicFromServer(chat.id)
            if (grouppic == undefined) {
                 var pfp = errorurl
            } else {
                 var pfp = grouppic 
            }
            await client.sendFileFromUrl(from, pfp, 'group.png', `*${groupname}* 

🌐️ *Members: ${totalMem}*

💌️ *Welcome: ${welgrp}*

⚜️ *NSFW: ${ngrp}*

📃️ *Group Description* 

${desc}`)
        break
    case '!ban':
            if(!isbotadmin) return client.reply(from, 'Only Bot admins can use this CMD, Baka!', message.id)
            for (let i = 0; i < mentionedJidList.length; i++) {
                ban.push(mentionedJidList[i])
                fs.writeFileSync('./lib/banned.json', JSON.stringify(ban))
                client.reply(from, 'Succes ban target!', message.id)
            }
            break
     case '!covid':
            arg = body.trim().split(' ')
            console.log(...arg[1])
            var slicedArgs = Array.prototype.slice.call(arg, 1);
            console.log(slicedArgs)
            const country = await slicedArgs.join(' ')
            console.log(country)
            const response2 = await axios.get('https://coronavirus-19-api.herokuapp.com/countries/' + country + '/')
            const { cases, todayCases, deaths, todayDeaths, active } = response2.data
                await client.sendText(from, '🌎️Covid Info -' + country + ' 🌍️\n\n✨️Total Cases: ' + `${cases}` + '\n📆️Today\'s Cases: ' + `${todayCases}` + '\n☣️Total Deaths: ' + `${deaths}` + '\n☢️Today\'s Deaths: ' + `${todayDeaths}` + '\n⛩️Active Cases: ' + `${active}` + '.')
            break

    case '!unban':
            if(!isbotadmin) return client.reply(from, 'Only bot admins can use this CMD', message.id)
            let inx = ban.indexOf(mentionedJidList[0])
            ban.splice(inx, 1)
            fs.writeFileSync('./lib/banned.json', JSON.stringify(ban))
            client.reply(from, 'Unbanned selesai!', message.id)
            break

     break
      
    case '!subreddit':
    if (!isNsfw) return client.reply(from, ' *Anone..Okanenya oni-chan* ', id) 
             arg = body.trim().split(' ')
             const sr = arg[1]
             try {
             const response1 = await axios.get('https://meme-api.herokuapp.com/gimme/' + sr + '/');
             const {
                    postLink,
                    title,
                    subreddit,
                    url,
                    nsfw,
                    spoiler
                } = response1.data



                if (nsfw == true) {
                      if ((isGroupMsg) && (isnsfw)) {
                                await client.sendFileFromUrl(from, `${url}`, 'Reddit.jpg', `${title}` + '\n\nPostlink:' + `${postLink}`)
                      } else if ((isGroupMsg) && (!isnsfw)) {
                                await client.reply(from, `NSFW is not registered on *${name}*`, id)
                      }
                } else { 
                      await client.sendFileFromUrl(from, `${url}`, 'Reddit.jpg', `${title}` + '\n\nPostlink:' + `${postLink}`)
                }
                } catch(err) {
                    await client.reply(from, 'Bakajanaino Oni-chan? Subreddit Salah', id) 
                }
                break
    case '!buatgroup':
    if (!isNsfw) return client.reply(from, ' *Anone..Okanenya oni-chan* ', id) 
            arg = body.trim().split(' ')
            const gcname = arg[1]
            client.createGroup(gcname, mentionedJidList)
            client.sendText(from, 'Gomenasai Onichan Ini Fitur Premium ✨️')
            break
    case '!duck':
            const dice = Math.floor(Math.random() * 6) + 1
            await client.sendStickerfromUrl(from, 'https://www.random.org/dice/dice' + dice + '.png')
            break
         break
     case '!gives':
     if (!isNsfw) return client.reply(from, ' *Anone..Okanenya oni-chan* ', id) 
            const side = Math.floor(Math.random() * 2) + 1
            if (side == 1) {
               client.sendStickerfromUrl(from, 'https://i.ibb.co/LJjkVK5/heads.png')
            } else {
               client.sendStickerfromUrl(from, 'https://i.ibb.co/wNnZ4QD/tails.png')
            }
            break

    case '!bganime' :
    if (!isGroupAdmins) return client.reply(from, '*DASAR MEMBER SOK-SOK MAKE FITUR ADMIN!*', id)
    if (!isNsfw) return client.reply(from, ' *Anone..Okanenya oni-chan* ', id) 
            const walnime = ['https://cdn.nekos.life/wallpaper/QwGLg4oFkfY.png','https://cdn.nekos.life/wallpaper/bUzSjcYxZxQ.jpg','https://cdn.nekos.life/wallpaper/j49zxzaUcjQ.jpg','https://cdn.nekos.life/wallpaper/YLTH5KuvGX8.png','https://cdn.nekos.life/wallpaper/Xi6Edg133m8.jpg','https://cdn.nekos.life/wallpaper/qvahUaFIgUY.png','https://cdn.nekos.life/wallpaper/leC8q3u8BSk.jpg','https://cdn.nekos.life/wallpaper/tSUw8s04Zy0.jpg','https://cdn.nekos.life/wallpaper/sqsj3sS6EJE.png','https://cdn.nekos.life/wallpaper/HmjdX_s4PU4.png','https://cdn.nekos.life/wallpaper/Oe2lKgLqEXY.jpg','https://cdn.nekos.life/wallpaper/GTwbUYI-xTc.jpg','https://cdn.nekos.life/wallpaper/nn_nA8wTeP0.png','https://cdn.nekos.life/wallpaper/Q63o6v-UUa8.png','https://cdn.nekos.life/wallpaper/ZXLFm05K16Q.jpg','https://cdn.nekos.life/wallpaper/cwl_1tuUPuQ.png','https://cdn.nekos.life/wallpaper/wWhtfdbfAgM.jpg','https://cdn.nekos.life/wallpaper/3pj0Xy84cPg.jpg','https://cdn.nekos.life/wallpaper/sBoo8_j3fkI.jpg','https://cdn.nekos.life/wallpaper/gCUl_TVizsY.png','https://cdn.nekos.life/wallpaper/LmTi1k9REW8.jpg','https://cdn.nekos.life/wallpaper/sbq_4WW2PUM.jpg','https://cdn.nekos.life/wallpaper/QOSUXEbzDQA.png','https://cdn.nekos.life/wallpaper/khaqGIHsiqk.jpg','https://cdn.nekos.life/wallpaper/iFtEXugqQgA.png','https://cdn.nekos.life/wallpaper/deFKIDdRe1I.jpg','https://cdn.nekos.life/wallpaper/OHZVtvDm0gk.jpg','https://cdn.nekos.life/wallpaper/YZYa00Hp2mk.jpg','https://cdn.nekos.life/wallpaper/R8nPIKQKo9g.png','https://cdn.nekos.life/wallpaper/_brn3qpRBEE.jpg','https://cdn.nekos.life/wallpaper/ADTEQdaHhFI.png','https://cdn.nekos.life/wallpaper/MGvWl6om-Fw.jpg','https://cdn.nekos.life/wallpaper/YGmpjZW3AoQ.jpg','https://cdn.nekos.life/wallpaper/hNCgoY-mQPI.jpg','https://cdn.nekos.life/wallpaper/3db40hylKs8.png','https://cdn.nekos.life/wallpaper/iQ2FSo5nCF8.jpg','https://cdn.nekos.life/wallpaper/meaSEfeq9QM.png','https://cdn.nekos.life/wallpaper/CmEmn79xnZU.jpg','https://cdn.nekos.life/wallpaper/MAL18nB-yBI.jpg','https://cdn.nekos.life/wallpaper/FUuBi2xODuI.jpg','https://cdn.nekos.life/wallpaper/ez-vNNuk6Ck.jpg','https://cdn.nekos.life/wallpaper/K4-z0Bc0Vpc.jpg','https://cdn.nekos.life/wallpaper/Y4JMbswrNg8.jpg','https://cdn.nekos.life/wallpaper/ffbPXIxt4-0.png','https://cdn.nekos.life/wallpaper/x63h_W8KFL8.jpg','https://cdn.nekos.life/wallpaper/lktzjDRhWyg.jpg','https://cdn.nekos.life/wallpaper/j7oQtvRZBOI.jpg','https://cdn.nekos.life/wallpaper/MQQEAD7TUpQ.png','https://cdn.nekos.life/wallpaper/lEG1-Eeva6Y.png','https://cdn.nekos.life/wallpaper/Loh5wf0O5Aw.png','https://cdn.nekos.life/wallpaper/yO6ioREenLA.png','https://cdn.nekos.life/wallpaper/4vKWTVgMNDc.jpg','https://cdn.nekos.life/wallpaper/Yk22OErU8eg.png','https://cdn.nekos.life/wallpaper/Y5uf1hsnufE.png','https://cdn.nekos.life/wallpaper/xAmBpMUd2Zw.jpg','https://cdn.nekos.life/wallpaper/f_RWFoWciRE.jpg','https://cdn.nekos.life/wallpaper/Y9qjP2Y__PA.jpg','https://cdn.nekos.life/wallpaper/eqEzgohpPwc.jpg','https://cdn.nekos.life/wallpaper/s1MBos_ZGWo.jpg','https://cdn.nekos.life/wallpaper/PtW0or_Pa9c.png','https://cdn.nekos.life/wallpaper/32EAswpy3M8.png','https://cdn.nekos.life/wallpaper/Z6eJZf5xhcE.png','https://cdn.nekos.life/wallpaper/xdiSF731IFY.jpg','https://cdn.nekos.life/wallpaper/Y9r9trNYadY.png','https://cdn.nekos.life/wallpaper/8bH8CXn-sOg.jpg','https://cdn.nekos.life/wallpaper/a02DmIFzRBE.png','https://cdn.nekos.life/wallpaper/MnrbXcPa7Oo.png','https://cdn.nekos.life/wallpaper/s1Tc9xnugDk.jpg','https://cdn.nekos.life/wallpaper/zRqEx2gnfmg.jpg','https://cdn.nekos.life/wallpaper/PtW0or_Pa9c.png','https://cdn.nekos.life/wallpaper/0ECCRW9soHM.jpg','https://cdn.nekos.life/wallpaper/kAw8QHl_wbM.jpg','https://cdn.nekos.life/wallpaper/ZXcaFmpOlLk.jpg','https://cdn.nekos.life/wallpaper/WVEdi9Ng8UE.png','https://cdn.nekos.life/wallpaper/IRu29rNgcYU.png','https://cdn.nekos.life/wallpaper/LgIJ_1AL3rM.jpg','https://cdn.nekos.life/wallpaper/DVD5_fLJEZA.jpg','https://cdn.nekos.life/wallpaper/siqOQ7k8qqk.jpg','https://cdn.nekos.life/wallpaper/CXNX_15eGEQ.png','https://cdn.nekos.life/wallpaper/s62tGjOTHnk.jpg','https://cdn.nekos.life/wallpaper/tmQ5ce6EfJE.png','https://cdn.nekos.life/wallpaper/Zju7qlBMcQ4.jpg','https://cdn.nekos.life/wallpaper/CPOc_bMAh2Q.png','https://cdn.nekos.life/wallpaper/Ew57S1KtqsY.jpg','https://cdn.nekos.life/wallpaper/hVpFbYJmZZc.jpg','https://cdn.nekos.life/wallpaper/sb9_J28pftY.jpg','https://cdn.nekos.life/wallpaper/JDoIi_IOB04.jpg','https://cdn.nekos.life/wallpaper/rG76AaUZXzk.jpg','https://cdn.nekos.life/wallpaper/9ru2luBo360.png','https://cdn.nekos.life/wallpaper/ghCgiWFxGwY.png','https://cdn.nekos.life/wallpaper/OSR-i-Rh7ZY.png','https://cdn.nekos.life/wallpaper/65VgtPyweCc.jpg','https://cdn.nekos.life/wallpaper/3vn-0FkNSbM.jpg','https://cdn.nekos.life/wallpaper/u02Y0-AJPL0.jpg','https://cdn.nekos.life/wallpaper/_-Z-0fGflRc.jpg','https://cdn.nekos.life/wallpaper/3VjNKqEPp58.jpg','https://cdn.nekos.life/wallpaper/NoG4lKnk6Sc.jpg','https://cdn.nekos.life/wallpaper/xiTxgRMA_IA.jpg','https://cdn.nekos.life/wallpaper/yq1ZswdOGpg.png','https://cdn.nekos.life/wallpaper/4SUxw4M3UMA.png','https://cdn.nekos.life/wallpaper/cUPnQOHNLg0.jpg','https://cdn.nekos.life/wallpaper/zczjuLWRisA.jpg','https://cdn.nekos.life/wallpaper/TcxvU_diaC0.png','https://cdn.nekos.life/wallpaper/7qqWhEF_uoY.jpg','https://cdn.nekos.life/wallpaper/J4t_7DvoUZw.jpg','https://cdn.nekos.life/wallpaper/xQ1Pg5D6J4U.jpg','https://cdn.nekos.life/wallpaper/aIMK5Ir4xho.jpg','https://cdn.nekos.life/wallpaper/6gneEXrNAWU.jpg','https://cdn.nekos.life/wallpaper/PSvNdoISWF8.jpg','https://cdn.nekos.life/wallpaper/SjgF2-iOmV8.jpg','https://cdn.nekos.life/wallpaper/vU54ikOVY98.jpg','https://cdn.nekos.life/wallpaper/QjnfRwkRU-Q.jpg','https://cdn.nekos.life/wallpaper/uSKqzz6ZdXc.png','https://cdn.nekos.life/wallpaper/AMrcxZOnVBE.jpg','https://cdn.nekos.life/wallpaper/N1l8SCMxamE.jpg','https://cdn.nekos.life/wallpaper/n2cBaTo-J50.png','https://cdn.nekos.life/wallpaper/ZXcaFmpOlLk.jpg','https://cdn.nekos.life/wallpaper/7bwxy3elI7o.png','https://cdn.nekos.life/wallpaper/7VW4HwF6LcM.jpg','https://cdn.nekos.life/wallpaper/YtrPAWul1Ug.png','https://cdn.nekos.life/wallpaper/1p4_Mmq95Ro.jpg','https://cdn.nekos.life/wallpaper/EY5qz5iebJw.png','https://cdn.nekos.life/wallpaper/aVDS6iEAIfw.jpg','https://cdn.nekos.life/wallpaper/veg_xpHQfjE.jpg','https://cdn.nekos.life/wallpaper/meaSEfeq9QM.png','https://cdn.nekos.life/wallpaper/Xa_GtsKsy-s.png','https://cdn.nekos.life/wallpaper/6Bx8R6D75eM.png','https://cdn.nekos.life/wallpaper/zXOGXH_b8VY.png','https://cdn.nekos.life/wallpaper/VQcviMxoQ00.png','https://cdn.nekos.life/wallpaper/CJnRl-PKWe8.png','https://cdn.nekos.life/wallpaper/zEWYfFL_Ero.png','https://cdn.nekos.life/wallpaper/_C9Uc5MPaz4.png','https://cdn.nekos.life/wallpaper/zskxNqNXyG0.jpg','https://cdn.nekos.life/wallpaper/g7w14PjzzcQ.jpg','https://cdn.nekos.life/wallpaper/KavYXR_GRB4.jpg','https://cdn.nekos.life/wallpaper/Z_r9WItzJBc.jpg','https://cdn.nekos.life/wallpaper/Qps-0JD6834.jpg','https://cdn.nekos.life/wallpaper/Ri3CiJIJ6M8.png','https://cdn.nekos.life/wallpaper/ArGYIpJwehY.jpg','https://cdn.nekos.life/wallpaper/uqYKeYM5h8w.jpg','https://cdn.nekos.life/wallpaper/h9cahfuKsRg.jpg','https://cdn.nekos.life/wallpaper/iNPWKO8d2a4.jpg','https://cdn.nekos.life/wallpaper/j2KoFVhsNig.jpg','https://cdn.nekos.life/wallpaper/z5Nc-aS6QJ4.jpg','https://cdn.nekos.life/wallpaper/VUFoK8l1qs0.png','https://cdn.nekos.life/wallpaper/rQ8eYh5mXN8.png','https://cdn.nekos.life/wallpaper/D3NxNISDavQ.png','https://cdn.nekos.life/wallpaper/Z_CiozIenrU.jpg','https://cdn.nekos.life/wallpaper/np8rpfZflWE.jpg','https://cdn.nekos.life/wallpaper/ED-fgS09gik.jpg','https://cdn.nekos.life/wallpaper/AB0Cwfs1X2w.jpg','https://cdn.nekos.life/wallpaper/DZBcYfHouiI.jpg','https://cdn.nekos.life/wallpaper/lC7pB-GRAcQ.png','https://cdn.nekos.life/wallpaper/zrI-sBSt2zE.png','https://cdn.nekos.life/wallpaper/_RJhylwaCLk.jpg','https://cdn.nekos.life/wallpaper/6km5m_GGIuw.png','https://cdn.nekos.life/wallpaper/3db40hylKs8.png','https://cdn.nekos.life/wallpaper/oggceF06ONQ.jpg','https://cdn.nekos.life/wallpaper/ELdH2W5pQGo.jpg','https://cdn.nekos.life/wallpaper/Zun_n5pTMRE.png','https://cdn.nekos.life/wallpaper/VqhFKG5U15c.png','https://cdn.nekos.life/wallpaper/NsMoiW8JZ60.jpg','https://cdn.nekos.life/wallpaper/XE4iXbw__Us.png','https://cdn.nekos.life/wallpaper/a9yXhS2zbhU.jpg','https://cdn.nekos.life/wallpaper/jjnd31_3Ic8.jpg','https://cdn.nekos.life/wallpaper/Nxanxa-xO3s.png','https://cdn.nekos.life/wallpaper/dBHlPcbuDc4.jpg','https://cdn.nekos.life/wallpaper/6wUZIavGVQU.jpg','https://cdn.nekos.life/wallpaper/_-Z-0fGflRc.jpg','https://cdn.nekos.life/wallpaper/H9OUpIrF4gU.jpg','https://cdn.nekos.life/wallpaper/xlRdH3fBMz4.jpg','https://cdn.nekos.life/wallpaper/7IzUIeaae9o.jpg','https://cdn.nekos.life/wallpaper/FZCVL6PyWq0.jpg','https://cdn.nekos.life/wallpaper/5dG-HH6d0yw.png','https://cdn.nekos.life/wallpaper/ddxyA37HiwE.png','https://cdn.nekos.life/wallpaper/I0oj_jdCD4k.jpg','https://cdn.nekos.life/wallpaper/ABchTV97_Ts.png','https://cdn.nekos.life/wallpaper/58C37kkq39Y.png','https://cdn.nekos.life/wallpaper/HMS5mK7WSGA.jpg','https://cdn.nekos.life/wallpaper/1O3Yul9ojS8.jpg','https://cdn.nekos.life/wallpaper/hdZI1XsYWYY.jpg','https://cdn.nekos.life/wallpaper/h8pAJJnBXZo.png','https://cdn.nekos.life/wallpaper/apO9K9JIUp8.jpg','https://cdn.nekos.life/wallpaper/p8f8IY_2mwg.jpg','https://cdn.nekos.life/wallpaper/HY1WIB2r_cE.jpg','https://cdn.nekos.life/wallpaper/u02Y0-AJPL0.jpg','https://cdn.nekos.life/wallpaper/jzN74LcnwE8.png','https://cdn.nekos.life/wallpaper/IeAXo5nJhjw.jpg','https://cdn.nekos.life/wallpaper/7lgPyU5fuLY.jpg','https://cdn.nekos.life/wallpaper/f8SkRWzXVxk.png','https://cdn.nekos.life/wallpaper/ZmDTpGGeMR8.jpg','https://cdn.nekos.life/wallpaper/AMrcxZOnVBE.jpg','https://cdn.nekos.life/wallpaper/ZhP-f8Icmjs.jpg','https://cdn.nekos.life/wallpaper/7FyUHX3fE2o.jpg','https://cdn.nekos.life/wallpaper/CZoSLK-5ng8.png','https://cdn.nekos.life/wallpaper/pSNDyxP8l3c.png','https://cdn.nekos.life/wallpaper/AhYGHF6Fpck.jpg','https://cdn.nekos.life/wallpaper/ic6xRRptRes.jpg','https://cdn.nekos.life/wallpaper/89MQq6KaggI.png','https://cdn.nekos.life/wallpaper/y1DlFeHHTEE.png']
            let walnimek = walnime[Math.floor(Math.random() * walnime.length)]
            client.sendFileFromUrl(from, walnimek, 'Nimek.jpg', '', message.id)
            break
   
    case '!randomanime':
    case '!randomnime':
    case '!randomanimek':
    case '!randomnimek':
     if (!isNsfw) return client.reply(from, ' *Anone..Okanenya oni-chan* ', id) 
            const randomanime = fs.readFileSync('./lib/randomanime.json')
            const randomanimeJson = JSON.parse(randomanime)
            const randomanimeIndex = Math.floor(Math.random() * randomanimeJson.length)
            const randomanimeKey = randomanimeJson[randomanimeIndex]
            client.sendFileFromUrl(from, randomanimeKey.image, 'randomanime.jpg', randomanimeKey.teks)
            break

    case '!infoanime':  
    case '!infonime':
    case '!infoanimek':
    case '!infonimek':
     if (!isNsfw) return client.reply(from, ' *Anone..Okanenya oni-chan* ', id)      
            const infoanime = fs.readFileSync('./lib/infoanime.json')
            const infoanimeJson = JSON.parse(infoanime)
            const infoanimeIndex = Math.floor(Math.random() * infoanimeJson.length)
            const infoanimeKey = infoanimeJson[infoanimeIndex]
            client.sendFileFromUrl(from, infoanimeKey.image, 'infoanime.jpg', `*${infoanimeKey.teks}*`)
            break
   case '!infoseiyu':  
   case '!infoseiyuu':
   case '!infoseyu':
   case '!infoseyuu':
    if (!isNsfw) return client.reply(from, ' *Anone..Okanenya oni-chan* ', id)
            const infoseiyu = fs.readFileSync('./lib/infoseiyu.json')
            const infoseiyuJson = JSON.parse(infoseiyu)
            const infoseiyuIndex = Math.floor(Math.random() * infoseiyuJson.length)
            const infoseiyuKey = infoseiyuJson[infoseiyuIndex]
            client.sendFileFromUrl(from, infoseiyuKey.image, 'infoseiyu.jpg', `*${infoseiyuKey.teks}*`)
            break

   case '!neko':
        if (!isGroupMsg) return client.reply(from, 'Gomenasai（>﹏<）Fitur Ini Harus Digroup..!', id)
            if (args.length == 0) return client.reply(from, `Untuk menggunakan !nekonime\nSilahkan ketik: !nekonime \nContoh: !nekonime `, id)
            if (args[0] == 'nime') {
                fetch('https://raw.githubusercontent.com/HasamiAini/Bot_Takagisan/main/' + args[0] + '.txt')
                .then(res => res.text())
                .then(body => {
                    let randomkpop = body.split('\n')
                    let randomkpopx = randomkpop[Math.floor(Math.random() * randomkpop.length)]
                    client.sendFileFromUrl(from, randomkpopx, '', '*KAWAI DESU..*\n*BY:Bot_Takagisan Vers.4.5*\nSupport Bot..*Owner Bot:08319173552*\n*!donasi*', id)
                })
                .catch(() => {
                    client.reply(from, '*Gomenasai Onichan Ada yang error!*', id)
                })
            } else {
                client.reply(from, `Gomenasai Onichan Bukan seperti itu !nekonime untuk memanggil perintah`)
            }
            break
    case '!ahegao': 
    if (!isNsfw) return client.reply(from, ' *Anone..Okanenya oni-chan* ', id)   
            const ahegao = fs.readFileSync('./lib/ahegao.json')
            const ahegaoJson = JSON.parse(ahegao)
            const ahegaoIndex = Math.floor(Math.random() * ahegaoJson.length)
            const ahegaoKey = ahegaoJson[ahegaoIndex]
            client.sendFileFromUrl(from, ahegaoKey.image, 'ahegao.jpg', ahegaoKey.teks)
            break
    case '!lewd':
    case '/lewd':
    case '#lewd':
     if (!isGroupMsg) return client.reply(from, 'Onichan Gomenasai harus di group desu!', id) 
    if (!isNsfw) return client.reply(from, ' *Anone..Okanenya oni-chan* ', id)   
            const lewd = fs.readFileSync('./lib/lewd.json')
            const lewdJson = JSON.parse(lewd)
            const lewdIndex = Math.floor(Math.random() * lewdJson.length)
            const lewdKey = lewdJson[lewdIndex]
            client.sendFileFromUrl(from, lewdKey.image, 'Lewd.jpg', lewdKey.teks)
            break
    case '!cosplay': 
    case '#cosplay':
    case '/cosplay':
     if (!isGroupMsg) return client.reply(from, 'Onichan Gomenasai harus di group desu!', id)
     if (!isNsfw) return client.reply(from, ' *Anone..Okanenya oni-chan* ', id)   
            const cosplay = fs.readFileSync('./lib/cosplay.json')
            const cosplayJson = JSON.parse(cosplay)
            const cosplayIndex = Math.floor(Math.random() * cosplayJson.length)
            const cosplayKey = cosplayJson[cosplayIndex]
            client.sendFileFromUrl(from, cosplayKey.image, 'cosplay.jpg', cosplayKey.teks)
            break
    case '!menuringtone':
            if (!isNsfw) return
            client.reply(from, '*Onegaishimasu*\n1. ringtone\n2. ringtoneloli', id)
            break
    case '!darkjokes': 
     if (!isGroupAdmins) return client.reply(from, '*DASAR MEMBER SOK-SOK MAKE FITUR ADMIN!*', id) 
     if (!isNsfw) return client.reply(from, ' *Anone..Okanenya oni-chan* ', id) 
            const darkjoke = fs.readFileSync('./lib/darkjoke.json')
            const darkjokeJson = JSON.parse(darkjoke)
            const darkjokeIndex = Math.floor(Math.random() * darkjokeJson.length)
            const darkjokeKey = darkjokeJson[darkjokeIndex]
            client.sendFileFromUrl(from, darkjokeKey.image, 'darkjoke.jpg', darkjokeKey.teks)
            break

    case '!ringtoneloli':
    if (!isNsfw) return client.reply(from, ' *Anone..Okanenya oni-chan* ', id)   
            const ringtonnime = fs.readFileSync('./lib/ringtonnime.json')
            const ringtonnimeJson = JSON.parse(ringtonnime)
            const ringtonnimeIndex = Math.floor(Math.random() * ringtonnimeJson.length)
            const ringtonnimeKey = ringtonnimeJson[ringtonnimeIndex]
            client.sendFileFromUrl(from, ringtonnimeKey.mp3, 'ringtonnimeloli.mp3', ringtonnimeKey.teks)
            break
    
     case '!yaoi':
     if (!isNsfw) return client.reply(from, ' *Anone..Okanenya oni-chan* ', id)
            const yaoi = fs.readFileSync('./lib/yaoi.json')
            const yaoiJson = JSON.parse(yaoi)
            const yaoiIndex = Math.floor(Math.random() * yaoiJson.length)
            const yaoiKey = yaoiJson[yaoiIndex]
            client.sendFileFromUrl(from, yaoiKey.image, 'yaoi.jpg', yaoiKey.teks)
            break

     case '!yuri':
     if (!isNsfw) return client.reply(from, ' *Anone..Okanenya oni-chan* ', id)
            const yurichan = fs.readFileSync('./lib/yurichan.json')
            const yurichanJson = JSON.parse(yurichan)
            const yurichanIndex = Math.floor(Math.random() * yurichanJson.length)
            const yurichanKey = yurichanJson[yurichanIndex]
            client.sendFileFromUrl(from, yurichanKey.image, 'yurichan.jpg', yurichanKey.teks)
            break
     case '!randomsongs': 
     if (!isNsfw) return client.reply(from, ' *Anone..Okanenya oni-chan* ', id) 
            const songsanime = fs.readFileSync('./lib/songsanime.json')
            const songsanimeJson = JSON.parse(songsanime)
            const songsanimeIndex = Math.floor(Math.random() * songsanimeJson.length)
            const songsanimeKey = songsanimeJson[songsanimeIndex]
            client.sendFileFromUrl(from, songsanimeKey.mp3, 'songsanime.mp3', songsanimeKey.teks)
            break

     case '!randomdoujin':
      if (!isNsfw) return client.reply(from, ' *Anone..Okanenya oni-chan* ', id)
        if (!isGroupAdmins) return client.reply(from, '*DASAR MEMBER SOK-SOK MAKE FITUR ADMIN!*', id)
            const doujin = fs.readFileSync('./lib/doujin.json')
            const doujinJson = JSON.parse(doujin)
            const doujinIndex = Math.floor(Math.random() * doujinJson.length)
            const doujinKey = doujinJson[doujinIndex]
            client.sendFileFromUrl(from, doujinKey.pdf, doujinKey.Judul, doujinKey.teks)
            break
      
     case '!milfsan': 
      if (!isNsfw) return client.reply(from, ' *Anone..Okanenya oni-chan* ', id)
        if (!isGroupAdmins) return client.reply(from, '*DASAR MEMBER SOK-SOK MAKE FITUR ADMIN!*', id)
            const milfsan = fs.readFileSync('./lib/milfsan.json')
            const milfsanJson = JSON.parse(milfsan)
            const milfsanIndex = Math.floor(Math.random() * milfsanJson.length)
            const milfsanKey = milfsanJson[milfsanIndex]
            client.sendFileFromUrl(from, milfsanKey.pdf, milfsanKey.Judul, milfsanKey.teks)
            break
  
    //NEWFITUR

    case '!doujinmoee': 
    case '#doujinmoee':
    case '/doujinmoee':  
            const doujinmoee = fs.readFileSync('./lib/doujinmoee.json')
            const doujinmoeeJson = JSON.parse(doujinmoee)
            const doujinmoeeIndex = Math.floor(Math.random() * doujinmoeeJson.length)
            const doujinmoeeKey = doujinmoeeJson[doujinmoeeIndex]
            client.sendFileFromUrl(from, doujinmoeeKey.image, 'doujinmoee.jpg', doujinmoeeKey.teks)
            break
    
        }
    } catch (err) {
        console.log(color('[ERROR]', 'red'), err)
        //client.kill().then(a => console.log(a))
    }
}
