const { cmd } = require('../command');
const { faizanStyle } = require('../lib/style');

cmd({
    pattern: "ping2",
    desc: "Check bot speed",
    category: "general",
    react: "🏓",
    filename: __filename
},
async (conn, mek, m, { from }) => {

    const start = Date.now();

    const sent = await conn.sendMessage(from, {
        text: faizanStyle({
            status: "Pinging...",
            type: "🏓"
        })
    }, { quoted: mek });

    const speed = Date.now() - start;

    await conn.sendMessage(from, {
        edit: sent.key,
        text: faizanStyle({
            title: "Bot Status",
            speed: `${speed} ms`,
            status: "Online & Active",
            type: "⚡"
                // 🔊 Audio
        const audioPath = path.join(__dirname, '../assets/menu.m4a');
        if (fs.existsSync(audioPath)) {
            await conn.sendMessage(from, {
                audio: fs.readFileSync(audioPath),
                mimetype: 'audio/mp4',
                ptt: true
            }, { quoted: mek });

            })
    });

});
