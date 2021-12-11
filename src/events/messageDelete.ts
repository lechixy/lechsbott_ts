import { Event } from "../structures/Event";
import { ExtendedMessage } from "../typings/Command";
import Discord from 'discord.js'
import { roleColor } from "../util/lechsFunctions";

export default new Event("messageDelete", async (message: ExtendedMessage) => {
    if (message.content === '') {

        const embed = new Discord.MessageEmbed()
            .setColor(roleColor(message))
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setTitle('Deleted An Embed Or An Attachment')
            .setDescription(`**Probably message content includes an attachment or embed**`)
            .addField(`Message Author`, `${message.author}`, true)
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
            .addField('User ID', `${message.author.id}`, true)
            .addField(`In Channel`, `${message.channel}`, true)
            .setTimestamp()
        const logc: any = message.guild.channels.cache.find(ch => ch.name === 'message-log')
        if (!logc) return;
        logc.send({ embeds: [embed] }).catch(err => { })

    } else {
        const embed = new Discord.MessageEmbed()
            .setColor(roleColor(message))
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setTitle('Deleted Message')
            .setDescription(message.content)
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
            .addField(`Message Author`, `${message.author}`, true)
            .addField('User ID', `${message.author.id}`, true)
            .addField(`In Channel`, `${message.channel}`, true)
            .setTimestamp()
        const logc: any = message.guild.channels.cache.find(ch => ch.name === 'message-log')
        if (!logc) return;
        logc.send({ embeds: [embed] }).catch(err => { })
    }
})