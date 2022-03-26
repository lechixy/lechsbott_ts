import { Event } from "../structures/Event";
import { ExtendedMessage } from "../typings/Command";
import Discord from 'discord.js'
import { roleColor } from "../util/lechsFunctions";

export default new Event("messageUpdate", async (oldMessage: ExtendedMessage, newMessage: ExtendedMessage) => {
    
    let oldcontent = oldMessage.content.substring(0, 1045)+'...'
    let newcontent = newMessage.content.substring(0, 1045)+'...'

    if(!oldcontent && !newcontent) return
    if(!oldcontent) oldcontent = "**No content (may contains an embed or an attachment)**"
    if(!newcontent) newcontent = "**No content (may contains an embed or an attachment)**"

    let pp = "https://cdn.discordapp.com/attachments/919634721628127232/919635045260595320/lech_messageupdate.png"
    
    const embed = new Discord.Embed()
        .setColor(Discord.Util.resolveColor('#dcde54'))
        .setThumbnail(newMessage.author.displayAvatarURL())
        .setAuthor({ name: "Message Edited", iconURL: pp })
        .addField({name: `Before`, value: `${oldcontent}`})
        .addField({name: `After`, value: `${newcontent}`})
        .addField({name: `Message Author`, value: `${newMessage.author}`, inline: true})
        .addField({name: `User ID`, value: `${newMessage.author.id}`, inline: true})
        .addField({name: `In Channel`, value: `${newMessage.channel}`, inline: true})
        .setTimestamp()
        const logc: any = newMessage.guild.channels.cache.find(ch => ch.name === 'lechsbott-logs')
    if (!logc) return;
    logc.send({ embeds: [embed] }).catch(err => {})
})