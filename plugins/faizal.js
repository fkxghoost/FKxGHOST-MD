const { cmd } = require("../command");
const os = require("os");

cmd({
    pattern: "faizal",
    alias: ["fk"],
    desc: "Faizal full introduction",
    category: "info",
    react: "👑",
    filename: __filename
}, async (conn, mek, m, { from }) => {
    try {

        const uptime = process.uptime();
        const h = Math.floor(uptime / 3600);
        const min = Math.floor((uptime % 3600) / 60);
        const sec = Math.floor(uptime % 60);

        const text = `
╭ׂ┄─̇─̣┄─̇─̣┄─̇─̣┄─̇─̣┄─̇─̣─̇─̣─᛭
│ ╌─̇─̣⊰ 𝐅𝐊𝐱𝐆𝐇𝐎𝐒𝐓-𝐌𝐃 _⁸⁷³_ ⊱┈─̇─̣╌
│─̇─̣┄┄┄┄┄┄┄┄┄┄┄┄┄─̇─̣
│❀ 👤 *Name:* FAIZAL🪽
│❀ 🧑‍💼 *Nick:* FK🪽
│❀ 🎂 *Age:* 19+🪽
│❀ 🧬 *Caste:* SINDHI🪽
│❀ 🌍 *Country:* 𝙿𝚊𝚔𝚒𝚜𝚝𝚊𝚗🪽
│❀ 🏙️ *City:* (KARACHI🪽)
│
│❀ 🤖 *Bot Name:* 𝐅𝐊𝐱𝐆𝐇𝐎𝐒𝐓-𝐌𝐃🎀
│❀ 👑 *Owner:* FK HACKER🫀
│❀ 📞 *Owner No:* 923443679346🫰
│❀ 🔣 *Prefix:* .
│❀ ⚙️ *Mode:* 𝙿𝚞𝚋𝚕𝚒𝚌🪄
│❀ 🔌 *Baileys:* 𝙼𝚞𝚕𝚝𝚒 𝙳𝚎𝚟𝚒𝚌𝚎🌙
│
│❀ ⏳ *Uptime:* ${h}h ${min}m ${sec}s
│❀ 💻 *Platform:* ${os.platform()}
╰┄─̣┄─̇─̣┄─̇─̣┄─̇─̣┄─̇─̣─̇─̣─᛭

> ᴘᴏᴡᴇʀᴇᴅ ʙʏ *𝐅𝐊𝐱𝐆𝐇𝐎𝐒𝐓-𝐌𝐃🤍*
`;

        await conn.sendMessage(from, {
            text,
            contextInfo: {
                mentionedJid: [m.sender]
            }
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
    }
});
