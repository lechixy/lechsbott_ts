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

        let member
        if (message.mentions.members.first()) {
            member = message.mentions.members.first()
        } else if (args[0]) {
            member = await message.guild.members.cache.get(args[0])
        } else {
            member = message.member
        }

        if (!member) {
            const embed = new Discord.MessageEmbed()
                .setColor(roleColor(member))
                .setAuthor(`Please specify a member to see roles!`, member.user.displayAvatarURL({ dynamic: true }))
                .addField('Usage', `${PREFIX}${cmd} <tag member/user id>`)
            return message.channel.send({ embeds: [embed] });
        }

        let memroles = []

        member.roles.cache
            .filter((roles) => roles.id !== message.guild.id)
            .map((role) => {
                memroles.push(role)
            });

        memroles.sort((a, b) => b.position - a.position);

        const embed = new Discord.MessageEmbed()
            .setAuthor(`${member.user.username}'s Roles`, member.user.displayAvatarURL({ dynamic: true }))
            .setDescription(`${memroles.join(' ')}`)
            .setColor(highestroleColor(member))
        message.channel.send({ embeds: [embed] });


    }
})

function highestroleColor(member) {
    return member.roles.highest.hexColor
}