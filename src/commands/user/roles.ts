import { Command } from '../../structures/Command'
import { PREFIX } from '../../config.json'
import Discord from 'discord.js'
import { roleColor } from '../../util/lechsFunctions'

export default new Command({
    name: 'roles',
    aliases: ['user-roles',],
    description: 'Sends an embed with roles of member!',
    category: 'User',
    arguments: `<@User | UserID | none>`,
    async execute({client, message, args, cmd}) {

        let member: Discord.GuildMember
        if (message.mentions.members.first()) {
            member = message.mentions.members.first()
        } else if (args[0]) {
            member = message.guild.members.cache.get(args[0])
        } else {
            member = message.member
        }

        if (!member) {
            const embed = new Discord.Embed()
                .setColor(Discord.Util.resolveColor('Red'))
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                .setDescription(`Please mention a member or give an user id for check roles!`)
                .addField({name: `Usage`, value: `${cmd} **<@User | Id>**`})
            return message.channel.send({ embeds: [embed] });
        }

        let memroles = []

        member.roles.cache
            .filter((roles) => roles.id !== message.guild.id)
            .map((role) => {
                memroles.push(role)
            });

        memroles.sort((a, b) => b.position - a.position);

        const embed = new Discord.Embed()
            .setAuthor({name: `${member.user.username}'s Roles`, iconURL: member.user.displayAvatarURL()})
            .setDescription(`${memroles.join(' ')}`)
            .setColor(Discord.Util.resolveColor(member.roles.highest.hexColor))
        message.channel.send({ embeds: [embed] });
    }
})