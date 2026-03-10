const { isJidGroup } = require('@whiskeysockets/baileys');
const config = require('../config');

/**
 * Handle deleted TEXT messages
 */
const DeletedText = async (conn, mek, jid, deleteInfo, isGroup, update) => {
    try {
        // Get message content
        const messageContent = 
            mek.message?.conversation ||
            mek.message?.extendedTextMessage?.text ||
            '*Content not available*';

        const finalMessage = deleteInfo + `\n\n📝 *Content:* ${messageContent}`;

        await conn.sendMessage(jid, {
            text: finalMessage,
            contextInfo: {
                mentionedJid: isGroup
                    ? [update.key.participant, mek.key.participant].filter(Boolean)
                    : [update.key.remoteJid],
                forwardingScore: 999,
                isForwarded: true
            }
        }, { quoted: mek });

        console.log(`✅ Anti-Delete: Text message sent`);
        return true;
    } catch (err) {
        console.error('❌ DeletedText error:', err.message);
        return false;
    }
};

/**
 * Handle deleted MEDIA messages (Image, Video, Audio, Document)
 */
const DeletedMedia = async (conn, mek, jid, deleteInfo) => {
    try {
        const mediaMsg = JSON.parse(JSON.stringify(mek.message));
        const msgType = Object.keys(mediaMsg)[0];

        if (!msgType) return false;

        // Add context info
        if (mediaMsg[msgType]) {
            mediaMsg[msgType].contextInfo = {
                stanzaId: mek.key.id,
                participant: mek.key.participant || mek.key.remoteJid,
                quotedMessage: mek.message,
                forwardingScore: 999,
                isForwarded: true
            };
        }

        // Handle IMAGE
        if (msgType === 'imageMessage') {
            mediaMsg[msgType].caption = deleteInfo;
            await conn.relayMessage(jid, mediaMsg, {});
            console.log(`✅ Anti-Delete: 🖼️ Image sent`);
        }
        // Handle VIDEO
        else if (msgType === 'videoMessage') {
            mediaMsg[msgType].caption = deleteInfo;
            await conn.relayMessage(jid, mediaMsg, {});
            console.log(`✅ Anti-Delete: 🎥 Video sent`);
        }
        // Handle AUDIO
        else if (msgType === 'audioMessage') {
            await conn.sendMessage(jid, { text: deleteInfo + '\n\n🔊 *Deleted Audio*' }, { quoted: mek });
            await conn.relayMessage(jid, mediaMsg, {});
            console.log(`✅ Anti-Delete: 🔊 Audio sent`);
        }
        // Handle DOCUMENT
        else if (msgType === 'documentMessage') {
            await conn.sendMessage(jid, { text: deleteInfo + '\n\n📄 *Deleted Document*' }, { quoted: mek });
            await conn.relayMessage(jid, mediaMsg, {});
            console.log(`✅ Anti-Delete: 📄 Document sent`);
        }
        // Handle STICKER
        else if (msgType === 'stickerMessage') {
            await conn.sendMessage(jid, { text: deleteInfo + '\n\n🏷️ *Deleted Sticker*' }, { quoted: mek });
            await conn.relayMessage(jid, mediaMsg, {});
            console.log(`✅ Anti-Delete: 🏷️ Sticker sent`);
        }
        // Handle VIEW ONCE
        else if (msgType === 'viewOnceMessage' || msgType === 'viewOnceMessageV2') {
            const viewOnceContent = mek.message?.viewOnceMessageV2?.message || mek.message?.viewOnceMessage?.message;
            if (viewOnceContent) {
                const viewOnceMsg = { message: viewOnceContent };
                await DeletedMedia(conn, viewOnceMsg, jid, deleteInfo + '\n🔓 *ViewOnce Message*');
            }
        }
        // Other media types
        else {
            await conn.sendMessage(jid, { text: deleteInfo + '\n\n📦 *Deleted Media*' }, { quoted: mek });
        }

        return true;
    } catch (err) {
        console.error('❌ DeletedMedia error:', err.message);
        return false;
    }
};

/**
 * Main Anti-Delete function
 */
const AntiDelete = async (conn, updates) => {
    try {
        for (const update of updates) {
            // Check if message was deleted (message becomes null)
            if (update.update && update.update.message === null) {
                
                // Get stored message (passed from index.js)
                const storedMsg = update.storedMessage;
                
                if (!storedMsg || !storedMsg.message) {
                    console.log('❌ No stored message found for ID:', update.key.id);
                    continue;
                }

                const mek = storedMsg.message;
                const chatId = update.key.remoteJid;
                const isGroup = isJidGroup(chatId);
                
                // Get current time
                const now = new Date();
                const deleteTime = now.toLocaleString('en-PK', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                });

                // Get sender and deleter info
                const sender = storedMsg.sender;
                const senderNumber = sender.split('@')[0];
                const deleter = update.key.participant || chatId;
                const deleterNumber = deleter.split('@')[0];

                // Get message type for display
                let msgType = 'TEXT';
                if (mek.message?.imageMessage) msgType = 'IMAGE';
                else if (mek.message?.videoMessage) msgType = 'VIDEO';
                else if (mek.message?.audioMessage) msgType = 'AUDIO';
                else if (mek.message?.documentMessage) msgType = 'DOCUMENT';
                else if (mek.message?.stickerMessage) msgType = 'STICKER';
                else if (mek.message?.viewOnceMessage || mek.message?.viewOnceMessageV2) msgType = 'VIEWONCE';

                // Create delete info
                let deleteInfo = '';
                let destinationJid = '';

                if (isGroup) {
                    let groupName = 'Unknown Group';
                    try {
                        const groupMetadata = await conn.groupMetadata(chatId);
                        groupName = groupMetadata.subject;
                    } catch (e) {
                        console.log('Could not fetch group metadata:', e.message);
                    }

                    deleteInfo = `╭────⬡ 𝐅𝐊𝐱𝐆𝐇𝐎𝐒𝐓-𝐌𝐃 _⁸⁷³_ ⬡────
├👤 *SENDER:* @${senderNumber}
├👥 *GROUP:* ${groupName}
├⏰ *TIME:* ${deleteTime}
├🗑️ *DELETED BY:* @${deleterNumber}
├⚠️ *TYPE:* ${msgType}
╰💬 *MESSAGE:* Content Below 🔽`;

                    destinationJid = config.ANTI_DEL_PATH === 'inbox' ? conn.user.id : chatId;
                } else {
                    deleteInfo = `╭────⬡𝐅𝐊𝐱𝐆𝐇𝐎𝐒𝐓-𝐌𝐃 _⁸⁷³_ ⬡────
├👤 *SENDER:* @${senderNumber}
├⏰ *TIME:* ${deleteTime}
├🗑️ *DELETED BY:* @${deleterNumber}
├⚠️ *TYPE:* ${msgType}
╰💬 *MESSAGE:* Content Below 🔽`;

                    destinationJid = config.ANTI_DEL_PATH === 'inbox' ? conn.user.id : chatId;
                }

                // Handle based on message type
                if (mek.message?.conversation || mek.message?.extendedTextMessage) {
                    // Text message
                    await DeletedText(conn, mek, destinationJid, deleteInfo, isGroup, update);
                } else {
                    // Media message
                    await DeletedMedia(conn, mek, destinationJid, deleteInfo);
                }
                
                console.log(`✅ Anti-delete: ${msgType} message from ${senderNumber} processed`);
            }
        }
        return true;
    } catch (err) {
        console.error('❌ AntiDelete main error:', err.message);
        return false;
    }
};

module.exports = {
    DeletedText,
    DeletedMedia,
    AntiDelete
};
