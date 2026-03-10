const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "fb",
    alias: ["fbdl", "facebook"],
    desc: "Download Facebook videos",
    category: "download",
    react: "📥",
    filename: __filename
}, async (conn, mek, m, { reply, q }) => {

    if (!q || !/(facebook\.com|fb\.watch)/i.test(q)) {
        return reply(`
╭ׂ┄•─̇─̣┄•─̇─̣┄•─̇─̣┄•─̇─̣╮
│ ╌─̇─̣⊰ 𝐅𝐊𝐱𝐆𝐇𝐎𝐒𝐓-𝐌𝐃 _⁸⁷³ ⊱┈─̇─̣╌
│─̇─̣┄┄┄┄┄┄┄┄┄┄┄┄┄─̇─̣
│❌ Invalid Facebook Link
│
│📌 Example:
│ .fb https://facebook.com/xxxxx
╰┄•─̇─̣┄•─̇─̣┄•─̇─̣┄•─̇─̣╯

> ᴘᴏᴡᴇʀᴇᴅ ʙʏ FK HACKER _⁸⁷³
`);
    }

    try {

        await reply(`
╭ׂ┄•─̇─̣┄•─̇─̣┄•─̇─̣┄•─̇─̣╮
│ ╌─̇─̣⊰ 𝐅𝐊𝐱𝐆𝐇𝐎𝐒𝐓-𝐌𝐃 _⁸⁷³ ⊱┈─̇─̣╌
│─̇─̣┄┄┄┄┄┄┄┄┄┄┄┄┄─̇─̣
│📥 Fetching Facebook Video...
╰┄•─̇─̣┄•─̇─̣┄•─̇─̣┄•─̇─̣╯
`);

        // Public working API
        const api = `https://api.darksadas.xyz/api/facebook?url=${encodeURIComponent(q)}`;
        const res = await axios.get(api);

        if (!res.data || !res.data.result || !res.data.result.video) {
            throw new Error("No downloadable video found.");
        }

        await conn.sendMessage(m.chat, {
            video: { url: res.data.result.video },
            caption: `
╭ׂ┄•─̇─̣┄•─̇─̣┄•─̇─̣┄•─̇─̣╮
│ ╌─̇─̣⊰ 𝐅𝐊𝐱𝐆𝐇𝐎𝐒𝐓-𝐌𝐃 _⁸⁷³ ⊱┈─̇─̣╌
│─̇─̣┄┄┄┄┄┄┄┄┄┄┄┄┄─̇─̣
│🎥 𝐅𝐀𝐂𝐄𝐁𝐎𝐎𝐊 𝐕𝐈𝐃𝐄𝐎
│
│✅ Download Complete
╰┄•─̇─̣┄•─̇─̣┄•─̇─̣┄•─̇─̣╯

> ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝐅𝐊𝐱𝐆𝐇𝐎𝐒𝐓-𝐌𝐃 _⁸⁷³
`
        }, { quoted: mek });

    } catch (err) {

        reply(`
╭ׂ┄•─̇─̣┄•─̇─̣┄•─̇─̣┄•─̇─̣╮
│ ╌─̇─̣⊰  𝐅𝐊𝐱𝐆𝐇𝐎𝐒𝐓-𝐌𝐃_⁸⁷³ ⊱┈─̇─̣╌
│─̇─̣┄┄┄┄┄┄┄┄┄┄┄┄┄─̇─̣
│❌ Facebook Download Failed
│
│⚠️ Try again later
╰┄•─̇─̣┄•─̇─̣┄•─̇─̣┄•─̇─̣╯

> ᴘᴏᴡᴇʀᴇᴅ ʙʏ FK HACKER _⁸⁷³
`);
    }

});
