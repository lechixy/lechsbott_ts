import { Event } from "../structures/Event";
import { ExtendedMessage } from "../typings/Command";
import Discord from 'discord.js'
import { roleColor } from "../util/lechsFunctions";

export default new Event("messageDeleteBulk", async (messages) => {
    let deletedmsgs = []

    messages.each(m => {

        let value: string

        if (m.content === '') {
            return value = `${m.author.username}: **AN EMBED OR ATTACHMENT**`
        }

        value = `${m.author.username}: ${m.content}`

        deletedmsgs.push(value)
    })

    const mes = messages.first()
    const desc = deletedmsgs.join('\n')

    const embed = new Discord.Embed()
        .setColor(Discord.Util.resolveColor('#de5d54'))
        .setAuthor({name: mes.author.tag, iconURL: mes.author.displayAvatarURL()})
        .setTitle(`Deleted ${messages.size} Messages`)
        .setDescription(`${desc.length >= 2048 ? desc.substring(0, 2045)+'...' : desc}`)
        .addField({name: `Message Author`, value: `${mes.author}`, inline: true})
        .addField({name: `User ID`, value: `${mes.author.id}`, inline: true})
        .addField({name: `In Channel`, value: `${mes.channel}`, inline: true})
        .setThumbnail(mes.author.displayAvatarURL())
        .setTimestamp()

    const logc: any = mes.guild.channels.cache.find(ch => ch.name === 'lechsbott-logs')
    if (!logc) return;
    logc.send({ embeds: [embed] });
})