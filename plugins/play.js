const { cmd } = require('../command');
const axios = require('axios');
const yts = require('yt-search');
const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

const AXIOS = axios.create({
    timeout: 20000,
    headers: { 'User-Agent': 'Mozilla/5.0' }
});

function faizanStyle(title, quality, status) {
    return `
*╭ׂ┄─̇─̣┄─̇─̣┄─̇─̣┄─̇─̣┄─̇─̣─̇─̣─᛭*
*│ ╌─̇─̣⊰ 𝐅𝐊𝐱𝐆𝐇𝐎𝐒𝐓-𝐌𝐃 _⁸⁷³_ ⊱┈─̇─̣╌*
*│─̇─̣┄┄┄┄┄┄┄┄┄┄┄┄┄─̇─̣*
*│❀ 🎵 𝐓𝐢𝐭𝐥𝐞:* ${title}
*│❀ 📀 𝐐𝐮𝐚𝐥𝐢𝐭𝐲:* ${quality}
*│❀ ⚙️ 𝐒𝐭𝐚𝐭𝐮𝐬:* ${status}
*╰┄─̣┄─̇─̣┄─̇─̣┄─̇─̣┄─̇─̣─̇─̣─᛭*

> ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝐅𝐊𝐱𝐆𝐇𝐎𝐒𝐓-𝐌𝐃🤍
`;
}

async function getMP3(url) {

    // 1️⃣ Yupra
    try {
        const { data } = await AXIOS.get(
            `https://api.yupra.my.id/api/downloader/ytmp3`,
            { params: { url } }
        );
        if (data?.success && data?.data?.download_url)
            return data.data.download_url;
    } catch {}

    // 2️⃣ Okatsu
    try {
        const { data } = await AXIOS.get(
            `https://okatsu-rolezapiiz.vercel.app/downloader/ytmp3`,
            { params: { url } }
        );
        if (data?.dl)
            return data.dl;
    } catch {}

    // 3️⃣ Elite
    try {
        const { data } = await AXIOS.get(
            `https://eliteprotech-apis.zone.id/ytdown`,
            { params: { url, format: "mp3" } }
        );
        if (data?.success && data?.downloadURL)
            return data.downloadURL;
    } catch {}

    throw new Error("All APIs failed");
}

cmd({
    pattern: "song",
    alias: ["play", "ytmp3"],
    desc: "FK-MD Stable Song",
    category: "download",
    react: "🎵",
    filename: __filename
},
async (conn, mek, m, { from, args, reply }) => {

    try {

        if (!args.length)
            return reply(faizanStyle("Not Provided", "MP3", "Give song name"));

        const query = args.join(" ").trim();

        const search = await yts(query);
        if (!search.videos.length)
            return reply(faizanStyle("Not Found", "MP3", "Song not found"));

        const first = search.videos[0];

        // 🖼 Thumbnail
        await conn.sendMessage(from, {
            image: { url: first.thumbnail },
            caption: faizanStyle(first.title, "MP3", "Processing...")
        }, { quoted: mek });

        const audioUrl = await getMP3(first.url);

        const tempInput = path.join(__dirname, `temp_${Date.now()}.mp3`);
        const tempOutput = path.join(__dirname, `final_${Date.now()}.mp3`);

        // Download stream
        const response = await axios({
            url: audioUrl,
            method: "GET",
            responseType: "stream"
        });

        const writer = fs.createWriteStream(tempInput);
        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on("finish", resolve);
            writer.on("error", reject);
        });

        // FFmpeg convert
        await new Promise((resolve, reject) => {
            ffmpeg(tempInput)
                .audioCodec("libmp3lame")
                .audioBitrate(128)
                .save(tempOutput)
                .on("end", resolve)
                .on("error", reject);
        });

        const buffer = fs.readFileSync(tempOutput);

        await conn.sendMessage(from, {
            audio: buffer,
            mimetype: "audio/mpeg",
            fileName: `${first.title.replace(/[^\w\s-]/g, '')}.mp3`,
            caption: faizanStyle(first.title, "MP3", "Ready")
        }, { quoted: mek });

        // Cleanup
        fs.unlinkSync(tempInput);
        fs.unlinkSync(tempOutput);

    } catch (err) {

        console.log("SONG ERROR:", err.message);

        await conn.sendMessage(from, {
            text: faizanStyle("Error", "MP3", "Download Failed")
        }, { quoted: mek });
    }
});
