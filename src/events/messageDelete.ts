import { Event } from "../structures/Event";
import { ExtendedMessage } from "../typings/Command";
import Discord from 'discord.js'
import { roleColor } from "../util/lechsFunctions";

export default new Event("messageDelete", async (message: ExtendedMessage) => {

    let pp = "https://cdn.discordapp.com/attachments/919634721628127232/919635044996382750/lech_messagedelete.png"

    const embed = new Discord.Embed()
        .setColor(Discord.Util.resolveColor('#de5d54'))
        .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
        .setAuthor({ name: "Message Deleted", iconURL: pp })
        .addField({name: `Message Author`, value: `${message.author}`, inline: true})
        .addField({name: `User ID`, value: `${message.author.id}`, inline: true})
        .addField({name: `In Channel`, value: `${message.channel}`, inline: true})
        .setTimestamp()

    if (message.content === "") {
        embed.setDescription(`**No content (may contains an embed or an attachment)**`)
    } else embed.setDescription(message.content.length>2048 ? message.content.substring(0, 2045)+'...' : message.content)

    if (message.attachments.size !== 0) {
        embed.addField({name: `Attachments`, value: `${message.attachments.map(x => `**${x.name}**\n${x.url}`).join('\n')}`})
    }

    const logc: any = message.guild.channels.cache.find(ch => ch.name === 'lechsbott-logs')
    if (!logc) return;
    logc.send({ embeds: [embed] }).catch(err => { console.log(err) })

})