import { Command } from "../../structures/Command";
import Discord from 'discord.js'
import { getVoiceConnection } from '@discordjs/voice'
import { roleColor } from '../../util/lechsFunctions'

export default new Command({
    name: "ping",
    description: "Returns with client latency to requests!",
    aliases: ["latency", "ms"],
    cooldown: 2,
    category: 'Information',
    arguments: `<none>`,
    async execute({ client, message, args, cmd }) {
        const log = getVoiceConnection(message.guild.id)

        if (!log) {
            let pingEmbed = new Discord.MessageEmbed()
                .setColor(roleColor(message))
                .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
                .addField(`Latency/Respond`, `\`${Date.now() - message.createdTimestamp}ms\``)
                .addField(`Discord API`, `\`${Math.round(client.ws.ping)}ms\``)
            message.channel.send({ embeds: [pingEmbed] });
        } else {
            let ms = log.ping.ws
            let resms: string = ''
            if (!ms) {
                resms = `Connecting`
            } else {
                resms = log.ping.ws + 'ms'
            }

            let pingEmbed = new Discord.MessageEmbed()
                .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
                .addField(`Latency/Respond`, `\`${Date.now() - message.createdTimestamp}ms\``)
                .setColor(roleColor(message))
                .addField(`Discord API`, `\`${Math.round(client.ws.ping)}ms\``)
                .addField(`Voice Connection`, `\`${resms} | ${log.ping.udp}udp\``)
            message.channel.send({ embeds: [pingEmbed] });
        }
    }
})