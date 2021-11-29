import { Command } from "../../structures/Command";
import { roleColor } from "../../util/lechsFunctions"
import Discord from 'discord.js'
import {PREFIX} from '../../config.json'

export default new Command({
    name: 'nsfwmode',
    aliases: ['setnsfw', 'nsfwis', 'nsfw'],
    description: 'Set nsfw mode for a text channel',
    category: 'Moderation',
    arguments: `<true/on | false/off>`,
    userPermissions: ['MANAGE_CHANNELS'],
    clientPermissions: ['MANAGE_CHANNELS'],
    async execute({client, message, args, cmd}) {

        const channel = message.channel

        if(channel.type !== "GUILD_TEXT") return

        if (channel.nsfw === true) {
            channel.setNSFW(false)
            let settedembed = new Discord.MessageEmbed()
                .setDescription(`**NSFW mode is enabled for** <#${channel.id}>\nThis channel may not safe for work for some members!`)
            return message.channel.send({ embeds: [settedembed] })
        } else {
            channel.setNSFW(true)
            let settedembed = new Discord.MessageEmbed()
                .setDescription(`**NSFW mode is now disabled for** <#${channel.id}>`)
            return message.channel.send({ embeds: [settedembed] })
        }
    }
})