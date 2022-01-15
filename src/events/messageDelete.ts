import { Event } from "../structures/Event";
import { ExtendedMessage } from "../typings/Command";
import Discord from 'discord.js'
import { roleColor } from "../util/lechsFunctions";

export default new Event("messageDelete", async (message: ExtendedMessage) => {

    let pp = "https://cdn.discordapp.com/attachments/919634721628127232/919635044996382750/lech_messagedelete.png"

    const embed = new Discord.MessageEmbed()
        .setColor('#de5d54')
        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
        .setAuthor({ name: "Message Deleted", iconURL: pp })
        .addField(`Message Author`, `${message.author}`, true)
        .addField('User ID', `${message.author.id}`, true)
        .addField(`In Channel`, `${message.channel}`, true)
        .setTimestamp()

    if(message.content === ""){
        embed.setDescription(`**No content (may contains an embed or an attachment)**`)
    } else embed.setDescription(message.content)

    if (message.attachments.size !== 0) {
        embed.addField(`Attachments`, `${message.attachments.map(x => `**${x.name}**\n${x.url}`).join('\n\n')}`)
    }

    const logc: any = message.guild.channels.cache.find(ch => ch.name === 'lechsbott-log')
    if (!logc) return;
    logc.send({ embeds: [embed] }).catch(err => { console.log(err) })

})