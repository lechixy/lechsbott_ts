import { Command } from "../../structures/Command"
import Discord from 'discord.js'
import { roleColor } from "../../util/lechsFunctions"
import { PREFIX } from '../../config.json'
import { ExtendedMessage } from "../../typings/Command"

export default new Command({
    name: 'unban',
    aliases: ['pardon'],
    description: 'Unbans member from the server',
    category: 'Moderation',
    arguments: `<UserID>`,
    userPermissions: ['BanMembers'],
    clientPermissions: ['BanMembers'],
    async execute({ client, message, args, cmd }) {

        const id = args[0]
        if (!id) {

            const embed = new Discord.Embed()
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                .setDescription(`Wrong arguments are given, need an id to unban user!`)
                .addField({ name: `Usage`, value: `${PREFIX}${cmd} **<id: required>** [reason]`})
                .setColor(Discord.Util.resolveColor('Red'))
            return message.channel.send({ embeds: [embed] })
        }

        return unbanUser(message, id, args)
    }
})

function unbanUser(message: ExtendedMessage, member: string, args: string[]) {

    message.guild.members.unban(member).then(user => {
        let succesembed = new Discord.Embed()
            .setColor(Discord.Util.resolveColor(roleColor(message)))
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
            .setDescription(`**${user.tag}** is now unbanned from **${message.guild.name}**`)
        message.channel.send({ embeds: [succesembed] })
    }).catch(err => {

        let notembed = new Discord.Embed()
            .setColor(Discord.Util.resolveColor('Red'))
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
            .setDescription(`${args[0]} is not banned, please sure entered correctly id!`)
        return message.channel.send({ embeds: [notembed] })
    })
}