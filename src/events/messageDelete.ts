import { Event } from "../structures/Event";
import { ExtendedMessage } from "../typings/Command";
import Discord from 'discord.js'
import { roleColor } from "../util/lechsFunctions";

export default new Event("messageDelete", async (message: ExtendedMessage) => {

    let pp = "https://cdn.discordapp.com/attachments/919634721628127232/919635044996382750/lech_messagedelete.png"

    if (message.content === '') {

        const embed = new Discord.MessageEmbed()
            .setColor('#de5d54')
            .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
            .setAuthor(`Message Deleted`, pp)
            .setDescription(`**Probably message content includes an attachment or embed**`)
            .addField(`Message Author`, `${message.author}`, true)
            .addField('User ID', `${message.author.id}`, true)
            .addField(`In Channel`, `${message.channel}`, true)
            .setTimestamp()
        const logc: any = message.guild.channels.cache.find(ch => ch.name === 'message-log')
        if (!logc) return;
        logc.send({ embeds: [embed] }).catch(err => { })

    } else {
        const embed = new Discord.MessageEmbed()
            .setColor('#de5d54')
            .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
            .setAuthor(`Message Deleted`, pp)
            .setDescription(message.content)
            .addField(`Message Author`, `${message.author}`, true)
            .addField('User ID', `${message.author.id}`, true)
            .addField(`In Channel`, `${message.channel}`, true)
            .setTimestamp()
        const logc: any = message.guild.channels.cache.find(ch => ch.name === 'message-log')
        if (!logc) return;
        logc.send({ embeds: [embed] }).catch(err => { })
    }
})