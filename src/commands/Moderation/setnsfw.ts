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
    userPermissions: ['ManageChannels'],
    clientPermissions: ['ManageChannels'],
    async execute({client, message, args, cmd}) {

        const channel = message.channel

        if(channel.type !== 0) return

        if (channel.nsfw === true) {
            channel.setNSFW(false)

            const embed = new Discord.Embed()
                .setAuthor({name: message.author.tag, iconURL: message.author.displayAvatarURL()})
                .setTitle(`NSFW mode is enabled for ${channel.name}`)
                .setDescription(`Channel may not safe for work for some members!`)
                .setColor(Discord.Util.resolveColor('Green'))
            return message.channel.send({ embeds: [embed] });

        } else {
            channel.setNSFW(true)
            
            const embed = new Discord.Embed()
                .setAuthor({name: message.author.tag, iconURL: message.author.displayAvatarURL()})
                .setTitle(`NSFW mode is disabled for ${channel.name}`)
                .setColor(Discord.Util.resolveColor('Red'))
            return message.channel.send({ embeds: [embed] });
        }
    }
})