import { Event } from "../structures/Event";
import { ExtendedMessage } from "../typings/Command";
import Discord from 'discord.js'
import { roleColor } from "../util/lechsFunctions";

export default new Event("messageUpdate", async (oldMessage: ExtendedMessage, newMessage: ExtendedMessage) => {
    
    let oldcontent = oldMessage.content
    let newcontent = newMessage.content

    if(!oldcontent && !newcontent) return
    if(!oldcontent) oldcontent = "**No content (may contains an embed or an attachment)**"
    if(!newcontent) newcontent = "**No content (may contains an embed or an attachment)**"

    let pp = "https://cdn.discordapp.com/attachments/919634721628127232/919635045260595320/lech_messageupdate.png"
    
    const embed = new Discord.MessageEmbed()
        .setColor('#dcde54')
        .setThumbnail(newMessage.author.displayAvatarURL({dynamic: true}))
        .setAuthor({ name: "Message Edited", iconURL: pp })
        .addField(`Before`, `${oldcontent}`)
        .addField(`After`, `${newcontent}`)
        .addField(`Message Author`, `${newMessage.author}`, true)
        .addField('User ID', `${newMessage.author.id}`, true)
        .addField(`In Channel`, `${newMessage.channel}`, true)
        .setTimestamp()
    const logc: any = newMessage.guild.channels.cache.find(ch => ch.name === 'message-log')
    if (!logc) return;
    logc.send({ embeds: [embed] }).catch(err => { })
})