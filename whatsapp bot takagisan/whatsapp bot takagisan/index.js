const { create, takagisan } = require('@open-wa/wa-automate')
const welcome = require('./lib/welcome')
const msgHandler = require('./Messenger')
const options = require('./options')

const start = async (takagisan = new takagisan()) => {
        console.log('[SERVER] Bot_Takagisan Ready!')
        // Force it to keep the current session
        takagisan.onStateChanged((state) => {
            console.log('[Client State]', state)
            if (state === 'CONFLICT' || state === 'UNLAUNCHED') takagisan.forceRefocus()
        })
        // listening on message
        takagisan.onMessage((async (message) => {
            takagisan.getAmountOfLoadedMessages()
            .then((msg) => {
                if (msg >= 3000) {
                    takagisan.cutMsgCache()
                }
            })
            msgHandler(takagisan, message)
        }))

        takagisan.onGlobalParicipantsChanged((async (heuh) => {
            await welcome(takagisan, heuh)
            //left(client, heuh)
            }))
        
        client.onAddedToGroup(((chat) => {
            let totalMem = chat.groupMetadata.participants.length
            if (totalMem < 40) { 
            	takagisan.sendText(chat.id, `Maaf Membernya Terlalu Sedikit ${totalMem}, Inivite Lagi Bot Jika Member Mencapai 40`).then(() => client.leaveGroup(chat.id)).then(() => client.deleteChat(chat.id))
            } else {
                takagisan.sendText(chat.groupMetadata.id, `Halo warga grup *${chat.contact.name}* terimakasih sudah menginvite bot ini, untuk melihat menu silahkan kirim *!help*`)
            }
        }))

        /*client.onAck((x => {
            const { from, to, ack } = x
            if (x !== 3) client.sendSeen(to)
        }))*/

        // listening on Incoming Call
        takagisan.onIncomingCall(( async (call) => {
            await takagisan.sendText(call.peerJid, 'Bot Tidak Bisa DiTelpon..Telpon=BLOCKIR..!!!')
            .then(() => takagisan.contactBlock(call.peerJid))
        }))
    }

create(options(true, start))
    .then(client => start(client))
    .catch((error) => console.log(error))
