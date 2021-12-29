import { Event } from "../structures/Event";
import { ExtendedMessage } from "../typings/Command";
import Discord from 'discord.js'
import { roleColor } from "../util/lechsFunctions";

export default new Event("messageDeleteBulk", async (messages: any) => {
    let deletedmsgs = []

    messages.each(m => {

        let value

        if (m.content === '') {
            return value = `${m.author.username}: **AN EMBED OR ATTACHMENT**`
        }

        value = `${m.author.username}: ${m.content}`

        deletedmsgs.push(value)
    })

    const mes = messages.first()

    const embed = new Discord.MessageEmbed()
        .setColor('#de5d54')
        .setAuthor(mes.author.tag, mes.author.displayAvatarURL({ dynamic: true }))
        .setTitle(`Deleted ${messages.size} Messages`)
        .setDescription(deletedmsgs.join('\n'))
        .addField(`Message Author`, `${mes.author}`, true)
        .addField('User ID', `${mes.author.id}`, true)
        .addField(`In`, `${mes.channel}`, true)
        .setThumbnail(mes.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp()

    if (embed.description.length >= 2048)
        embed.description = `${embed.description.substr(0, 2045)}...`;

    const logc = mes.guild.channels.cache.find(ch => ch.name === 'message-log')
    if (!logc) return;
    logc.send({ embeds: [embed] });
})