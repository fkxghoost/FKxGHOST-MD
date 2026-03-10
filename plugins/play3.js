const { cmd } = require('../command')
const axios = require('axios')
const yts = require('yt-search')
const fs = require('fs')
const ffmpeg = require('fluent-ffmpeg')
const path = require('path')

function faizanStyle(title, quality, status){
return `
*╭ׂ┄─̇─̣┄─̇─̣┄─̇─̣┄─̇─̣┄─̇─̣─̇─̣─᛭*
*│ ╌─̇─̣⊰ 𝐅𝐀𝐈𝐙𝐀𝐍-𝐌𝐃 _⁸⁷³_ ⊱┈─̇─̣╌*
*│─̇─̣┄┄┄┄┄┄┄┄┄┄┄┄┄─̇─̣*
*│❀ 🎵 𝐓𝐢𝐭𝐥𝐞:* ${title}
*│❀ 📀 𝐐𝐮𝐚𝐥𝐢𝐭𝐲:* MP3
*│❀ ⚙️ 𝐒𝐭𝐚𝐭𝐮𝐬:* ${status}
*╰┄─̣┄─̇─̣┄─̇─̣┄─̇─̣┄─̇─̣─̇─̣─᛭*

> ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝐅𝐀𝐈𝐙𝐀𝐍-𝐌𝐃 🤍
`
}

cmd({
pattern:"song3",
alias:["play3"],
desc:"Fast Song Download",
category:"download",
react:"🎵",
filename:__filename
},
async(conn,mek,m,{from,args,reply})=>{

try{

if(!args.length)
return reply(faizanStyle("Not Provided","—","Give song name"))

const query=args.join(" ")

await conn.sendMessage(from,{react:{text:"🔍",key:m.key}})

const search=await yts(query)

if(!search.videos.length)
return reply(faizanStyle("Not Found","—","Song not found"))

const vid=search.videos[0]

const url=vid.url
const title=vid.title
const thumb=vid.thumbnail

await conn.sendMessage(from,{
image:{url:thumb},
caption:faizanStyle(title,"MP3","Processing...")
},{quoted:mek})

// API
const {data}=await axios.get(`https://eliteprotech-apis.zone.id/ytdown?url=${encodeURIComponent(url)}&format=mp3`)

const audio=data?.downloadURL
if(!audio) throw new Error("API failed")

const tempIn=`./temp_${Date.now()}.mp3`
const tempOut=`./out_${Date.now()}.mp3`

// download raw audio
const response=await axios({
url:audio,
method:"GET",
responseType:"stream"
})

const writer=fs.createWriteStream(tempIn)
response.data.pipe(writer)

await new Promise((resolve,reject)=>{
writer.on("finish",resolve)
writer.on("error",reject)
})

// convert with ffmpeg
await new Promise((resolve,reject)=>{
ffmpeg(tempIn)
.audioCodec("libmp3lame")
.save(tempOut)
.on("end",resolve)
.on("error",reject)
})

// send
await conn.sendMessage(from,{
audio:fs.readFileSync(tempOut),
mimetype:"audio/mpeg",
fileName:`${title}.mp3`
},{quoted:mek})

fs.unlinkSync(tempIn)
fs.unlinkSync(tempOut)

await conn.sendMessage(from,{react:{text:"✅",key:m.key}})

}catch(e){

console.log("SONG3 ERROR:",e.message)

await conn.sendMessage(from,{
text:faizanStyle("Error","—","Download Failed")
},{quoted:mek})

await conn.sendMessage(from,{react:{text:"❌",key:m.key}})

}

})
