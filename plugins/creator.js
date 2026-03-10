const { cmd } = require('../command');
const config = require('../config');

cmd({
    pattern: "creator",
    alias: ["coder", "dev", "owner"],
    desc: "Show bot creator information",
    category: "info",
    react: "👑",
    filename: __filename
}, async (conn, mek, m, { from, sender, reply }) => {
    try {

        const ownerInfo = {
            name: "𝐅𝐊𝐱𝐆𝐇𝐎𝐒𝐓-𝐌𝐃_⁸⁷³",
            number: "+923443679346",
            photo: "https://files.catbox.moe/8c4lpm.jpg",
            bio: "Founder & Developer of FK HACKER"
        };

        const caption = `
*╭ׂ┄─̇─̣┄─̇─̣┄─̇─̣┄─̇─̣┄─̇─̣─̇─̣─᛭*
*│ ╌─̇─̣⊰ 𝐅𝐊𝐱𝐆𝐇𝐎𝐒𝐓-𝐌𝐃 _⁸⁷³ ⊱┈─̇─̣╌*
*│─̇─̣┄┄┄┄┄┄┄┄┄┄┄┄┄─̇─̣*
*│❀ 👑 𝐂𝐫𝐞𝐚𝐭𝐨𝐫:* ${ownerInfo.name}
*│❀ 📞 𝐍𝐮𝐦𝐛𝐞𝐫:* ${ownerInfo.number}
*│❀ 📝 𝐁𝐢𝐨:* ${ownerInfo.bio}
*│*
*│❀ 🤖 𝐁𝐨𝐭:* ${config.BOT_NAME}
*│❀ ⚡ 𝐕𝐞𝐫𝐬𝐢𝐨𝐧:* ${config.VERSION || "5.0.0"}
*╰┄─̣┄─̇─̣┄─̇─̣┄─̇─̣┄─̇─̣─̇─̣─᛭*

> ᴘᴏᴡᴇʀᴇᴅ ʙʏ FK HACKER _⁸⁷³
`;

        await conn.sendMessage(from, {
            image: { url: ownerInfo.photo },
            caption,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '0029VbBOcrNBadmXo2Nqfg2Y@newsletter',
                    newsletterName: '𝐅𝐊𝐱𝐆𝐇𝐎𝐒𝐓-𝐌𝐃',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (err) {
        console.error("CREATOR ERROR:", err);
        reply(
`*╭ׂ┄─̇─̣┄─̇─̣┄─̇─̣┄─̇─̣┄─̇─̣─̇─̣─᛭*
*│ ╌─̇─̣⊰ 𝐅𝐊𝐱𝐆𝐇𝐎𝐒𝐓-𝐌𝐃 _⁸⁷³ ⊱┈─̇─̣╌*
*│❌ 𝐂𝐫𝐞𝐚𝐭𝐨𝐫 𝐂𝐨𝐦𝐦𝐚𝐧𝐝 𝐄𝐫𝐫𝐨𝐫*
*│⏳ Please try again later*
*╰┄─̣┄─̇─̣┄─̇─̣┄─̇─̣┄─̇─̣─̇─̣─᛭*

> ᴘᴏᴡᴇʀᴇᴅ ʙʏ FK HACKER _⁸⁷³`
        );
    }
});
